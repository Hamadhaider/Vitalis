'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PulseDivider from '@/components/PulseDivider';
import Disclaimer from '@/components/Disclaimer';

const RISK_STYLES = {
  low: 'bg-pine-50 text-pine-dark border-pine/30',
  moderate: 'bg-amber-light/50 text-ink border-amber/40',
  high: 'bg-brick-light text-brick border-brick/40',
  unknown: 'bg-line/40 text-ink/60 border-line',
};

export default function MedicationsPage() {
  const [meds, setMeds] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  function updateMed(i, value) {
    setMeds((prev) => prev.map((m, idx) => (idx === i ? value : m)));
  }

  function addField() {
    setMeds((prev) => [...prev, '']);
  }

  function removeField(i) {
    setMeds((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: meds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setResult(data);
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
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine mb-3">02 · Medication Checker</p>
          <h1 className="font-display text-4xl mb-3">Is this combination safe?</h1>
          <p className="text-ink/65">
            List everything you&rsquo;re taking — prescriptions, over-the-counter, supplements.
            Vitalis explains known interaction categories in plain language.
          </p>
        </section>

        <Disclaimer>
          Vitalis explains general interaction categories, not a full clinical review. Always
          confirm with a pharmacist before starting or combining medications.
        </Disclaimer>

        <form onSubmit={handleSubmit} className="mt-8 bg-white border border-line rounded-2xl p-6 sm:p-8 space-y-4">
          {meds.map((med, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={med}
                onChange={(e) => updateMed(i, e.target.value)}
                placeholder={i === 0 ? 'e.g. Warfarin' : i === 1 ? 'e.g. Ibuprofen' : 'Add another'}
                className="focus-ring flex-1 rounded-xl border border-line bg-paper px-4 py-3 text-sm"
              />
              {meds.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  aria-label="Remove medication"
                  className="focus-ring px-3 rounded-xl border border-line text-ink/40 hover:text-brick hover:border-brick/40 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addField}
            className="focus-ring text-sm text-pine font-medium flex items-center gap-1"
          >
            + Add another medication
          </button>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full sm:w-auto px-6 py-3 rounded-full bg-pine text-paper text-sm font-medium hover:bg-pine-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Checking…' : 'Check interactions'}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-6 text-sm text-brick bg-brick-light border border-brick/30 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {result && (
          <section className="mt-8 animate-fade_up">
            <PulseDivider label="Result" />
            <div className="bg-white border border-line rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs font-mono uppercase tracking-wide px-3 py-1 rounded-full border ${
                    RISK_STYLES[result.overallRisk] || RISK_STYLES.unknown
                  }`}
                >
                  {result.overallRisk} overall risk
                </span>
              </div>
              <p className="text-ink/75 leading-relaxed mb-6">{result.summary}</p>

              {result.interactions && result.interactions.length > 0 && (
                <div className="space-y-4 mb-6">
                  {result.interactions.map((it, i) => (
                    <div key={i} className="border border-line rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="font-medium">{it.pair}</p>
                        <span
                          className={`text-xs font-mono uppercase px-2 py-0.5 rounded-full border ${
                            RISK_STYLES[it.risk] || RISK_STYLES.unknown
                          }`}
                        >
                          {it.risk}
                        </span>
                      </div>
                      <p className="text-sm text-ink/70 mb-2">{it.explanation}</p>
                      <p className="text-sm text-ink/50 italic">{it.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-ink/45 border-t border-line pt-4">{result.disclaimer}</p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
