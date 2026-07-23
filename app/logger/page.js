'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import PulseDivider from '@/components/PulseDivider';
import Disclaimer from '@/components/Disclaimer';

const CONDITIONS = ['IBS', 'Migraine', 'Eczema', 'Endometriosis', 'Asthma', 'Other'];
const TRIGGERS = ['Poor sleep', 'Stress', 'Specific food', 'Weather change', 'Skipped meds', 'Exercise', 'Alcohol'];
const STORAGE_KEY = 'vitalis_log_entries_v1';
const CONDITION_KEY = 'vitalis_condition_v1';

function loadEntries() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function LoggerPage() {
  const [condition, setCondition] = useState('IBS');
  const [entries, setEntries] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [triggers, setTriggers] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    const savedCondition = window.localStorage.getItem(CONDITION_KEY);
    if (savedCondition) setCondition(savedCondition);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CONDITION_KEY, condition);
  }, [condition, hydrated]);

  function toggleTrigger(t) {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function addEntry(e) {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      severity: Number(severity),
      triggers,
      notes: notes.trim(),
    };
    setEntries((prev) => [entry, ...prev]);
    setSeverity(5);
    setTriggers([]);
    setNotes('');
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  async function getInsights() {
    setError('');
    setInsight(null);
    setLoading(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition, entries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setInsight(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function exportReport() {
    const lines = [
      `Vitalis condition report — ${condition}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      ...entries.map(
        (e) =>
          `${e.date}  |  Severity ${e.severity}/10  |  Triggers: ${
            e.triggers.join(', ') || 'none noted'
          }  |  Notes: ${e.notes || '-'}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitalis-${condition.toLowerCase()}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <section className="pt-12 pb-6 animate-fade_up">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine mb-3">03 · Daily Logger</p>
          <h1 className="font-display text-4xl mb-3">What&rsquo;s actually going on?</h1>
          <p className="text-ink/65">
            Track one condition day by day. Entries are saved privately in this browser —
            nothing leaves your device except when you ask for AI insights below.
          </p>
        </section>

        <Disclaimer>
          Pattern insights are observations from your own log, not a diagnosis or treatment
          plan. Share your exported report with your clinician for medical interpretation.
        </Disclaimer>

        <div className="mt-8 flex items-center gap-3 flex-wrap">
          <label htmlFor="condition" className="text-sm font-medium">
            Tracking:
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="focus-ring rounded-full border border-line bg-white px-4 py-2 text-sm"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={addEntry} className="mt-4 bg-white border border-line rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <label htmlFor="severity" className="block text-sm font-medium mb-2">
              Today&rsquo;s severity: <span className="font-mono text-pine">{severity}/10</span>
            </label>
            <input
              id="severity"
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full focus-ring"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Possible triggers today</p>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTrigger(t)}
                  className={`focus-ring text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    triggers.includes(t)
                      ? 'bg-pine text-paper border-pine'
                      : 'border-line text-ink/60 hover:border-pine/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything else worth remembering about today"
              className="focus-ring w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            className="focus-ring w-full sm:w-auto px-6 py-3 rounded-full bg-pine text-paper text-sm font-medium hover:bg-pine-dark transition-colors"
          >
            Save today&rsquo;s entry
          </button>
        </form>

        <PulseDivider label={`${entries.length} entries logged`} />

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={getInsights}
            disabled={loading || entries.length === 0}
            className="focus-ring px-5 py-2.5 rounded-full border border-pine text-pine text-sm font-medium hover:bg-pine-50 transition-colors disabled:opacity-40"
          >
            {loading ? 'Looking for patterns…' : 'Get AI pattern insights'}
          </button>
          <button
            onClick={exportReport}
            disabled={entries.length === 0}
            className="focus-ring px-5 py-2.5 rounded-full border border-line text-sm font-medium hover:border-ink/40 transition-colors disabled:opacity-40"
          >
            Export doctor-shareable report
          </button>
        </div>

        {error && (
          <p className="mb-6 text-sm text-brick bg-brick-light border border-brick/30 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {insight && (
          <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 mb-8 animate-fade_up">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-pine mb-3">Pattern insight</p>
            <p className="text-ink/75 leading-relaxed mb-4">{insight.summary}</p>
            {insight.possibleTriggers && insight.possibleTriggers.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Patterns worth watching</p>
                <ul className="space-y-1.5">
                  {insight.possibleTriggers.map((p, i) => (
                    <li key={i} className="text-sm text-ink/70 flex gap-2">
                      <span className="text-pine">—</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {insight.suggestion && (
              <p className="text-sm bg-pine-50 text-pine-dark rounded-xl px-4 py-3 mb-4">{insight.suggestion}</p>
            )}
            <p className="text-xs text-ink/45 border-t border-line pt-4">{insight.disclaimer}</p>
          </div>
        )}

        <div className="space-y-3">
          {entries.length === 0 && (
            <p className="text-sm text-ink/45 text-center py-10">
              No entries yet — log today to start building your history.
            </p>
          )}
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex items-start justify-between gap-4 bg-white border border-line rounded-xl px-5 py-4"
            >
              <div>
                <p className="font-mono text-xs text-ink/50 mb-1">{e.date}</p>
                <p className="text-sm mb-1">
                  Severity <span className="font-medium">{e.severity}/10</span>
                  {e.triggers.length > 0 && (
                    <span className="text-ink/50"> · {e.triggers.join(', ')}</span>
                  )}
                </p>
                {e.notes && <p className="text-sm text-ink/60">{e.notes}</p>}
              </div>
              <button
                onClick={() => deleteEntry(e.id)}
                aria-label="Delete entry"
                className="focus-ring text-ink/30 hover:text-brick shrink-0"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
