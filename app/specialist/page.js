'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import PulseDivider from '@/components/PulseDivider';
import Disclaimer from '@/components/Disclaimer';
import MicButton from '@/components/MicButton';
import { getStoredLanguage } from '@/components/LanguageToggle';

const HISTORY_KEY = 'vitalis_specialist_history_v1';

export default function SpecialistPage() {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(HISTORY_KEY)) || [];
      setHistory(saved);
    } catch {
      setHistory([]);
    }
  }, []);

  function saveToHistory(symptomsText, data) {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      symptoms: symptomsText,
      specialist: data.specialist,
      confidence: data.confidence,
      emergency: data.emergency,
      full: data,
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  }

  function clearHistory() {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_KEY);
  }

  function viewPast(entry) {
    setResult(entry.full);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/specialist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, duration, severity, language: getStoredLanguage() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setResult(data);
      saveToHistory(symptoms, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <section className="pt-12 pb-6 animate-fade_up">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine mb-3">01 · Symptom Router</p>
          <h1 className="font-display text-4xl mb-3">Who should I actually see?</h1>
          <p className="text-ink/65">
            Describe what you&rsquo;re experiencing in your own words. Vitalis will suggest the
            type of specialist that best fits — not a diagnosis, a starting point.
          </p>
        </section>

        <Disclaimer />

        <form onSubmit={handleSubmit} className="mt-8 bg-surface border border-line rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="symptoms" className="block text-sm font-medium">
                What are you feeling? Be specific.
              </label>
              <MicButton
                onResult={(text) =>
                  setSymptoms((prev) => (prev ? `${prev} ${text}` : text))
                }
              />
            </div>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
              minLength={3}
              rows={4}
              placeholder="e.g. Itchy, red patches on my elbows that flare up after certain foods, been happening for 3 weeks"
              className="focus-ring w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-2">
                How long has this been going on?
              </label>
              <input
                id="duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2 weeks"
                className="focus-ring w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="severity" className="block text-sm font-medium mb-2">
                Severity right now: <span className="font-mono text-pine">{severity}/10</span>
              </label>
              <input
                id="severity"
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full mt-4 focus-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full sm:w-auto px-6 py-3 rounded-full bg-pine text-paper text-sm font-medium hover:bg-pine-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Thinking it through…' : 'Route my symptoms'}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-sm text-brick bg-brick-light border border-brick/30 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {result && (
          <section className="mt-8 animate-fade_up">
            <PulseDivider label="Result" />
            {result.emergency && (
              <div className="bg-brick text-paper rounded-2xl px-5 py-4 mb-5 font-medium">
                This sounds urgent. Please seek emergency or urgent care now rather than
                waiting for a specialist appointment.
              </div>
            )}
            <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-pine mb-2">
                Suggested specialist · confidence: {result.confidence}
              </p>
              <h2 className="font-display text-3xl mb-4">{result.specialist}</h2>
              <p className="text-ink/75 leading-relaxed mb-5">{result.reasoning}</p>

              {result.alternativeSpecialist && (
                <p className="text-sm text-ink/60 mb-5">
                  Also reasonable: <span className="font-medium text-ink">{result.alternativeSpecialist}</span>
                </p>
              )}

              {result.questionsToAsk && result.questionsToAsk.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm font-medium mb-2">Questions to bring with you</p>
                  <ul className="space-y-1.5">
                    {result.questionsToAsk.map((q, i) => (
                      <li key={i} className="text-sm text-ink/70 flex gap-2">
                        <span className="text-pine">—</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-ink/45 border-t border-line pt-4">{result.disclaimer}</p>
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink/50">
                Past results
              </p>
              <button
                onClick={clearHistory}
                className="focus-ring text-xs text-ink/40 hover:text-brick"
              >
                Clear history
              </button>
            </div>
            <div className="space-y-2">
              {history.map((h) => (
                <button
                  key={h.id}
                  onClick={() => viewPast(h)}
                  className="focus-ring w-full text-left bg-surface border border-line rounded-xl px-4 py-3 hover:border-pine transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      {h.emergency ? '⚠ Emergency flagged' : h.specialist}
                    </p>
                    <p className="font-mono text-xs text-ink/40">{h.date}</p>
                  </div>
                  <p className="text-xs text-ink/50 truncate mt-0.5">{h.symptoms}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

