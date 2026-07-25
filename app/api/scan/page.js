'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PulseDivider from '@/components/PulseDivider';
import Disclaimer from '@/components/Disclaimer';
import { getStoredLanguage } from '@/components/LanguageToggle';

const AREAS = ['Skin', 'Eyes', 'Tongue', 'Nails', 'Lab report / blood test', 'Other'];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ScanPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [areaHint, setAreaHint] = useState('Skin');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setPreviewUrl(f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Please choose a photo or document first.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const imageBase64 = await fileToBase64(file);
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: file.type,
          areaHint,
          notes,
          language: getStoredLanguage(),
        }),
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
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine mb-3">04 · Health Scan</p>
          <h1 className="font-display text-4xl mb-3">What does this look like?</h1>
          <p className="text-ink/65">
            Upload a photo of a visible symptom (skin, eyes, tongue, nails) or a lab report
            page. Vitalis describes what it observes — it never confirms a diagnosis.
          </p>
        </section>

        <Disclaimer>
          Health Scan gives general observations from a single image, not a diagnosis. Image
          quality and lighting affect accuracy — always have anything concerning evaluated
          in person by a clinician.
        </Disclaimer>

        <form onSubmit={handleSubmit} className="mt-8 bg-surface border border-line rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">What are you uploading?</label>
            <select
              value={areaHint}
              onChange={(e) => setAreaHint(e.target.value)}
              className="focus-ring w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photo or document</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFile}
              className="focus-ring w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pine file:text-paper file:text-sm file:font-medium hover:file:bg-pine-dark file:cursor-pointer cursor-pointer"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected preview"
                className="mt-4 max-h-64 rounded-xl border border-line object-contain"
              />
            )}
          </div>

          <div>
            <label htmlFor="scanNotes" className="block text-sm font-medium mb-2">
              Any context worth adding? (optional)
            </label>
            <textarea
              id="scanNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Appeared 3 days ago, mildly itchy"
              className="focus-ring w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full sm:w-auto px-6 py-3 rounded-full bg-pine text-paper text-sm font-medium hover:bg-pine-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyzing…' : 'Analyze'}
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
            {result.urgent && (
              <div className="bg-brick text-paper rounded-2xl px-5 py-4 mb-5 font-medium">
                This may need prompt attention. Please seek in-person medical care soon.
              </div>
            )}
            <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8">
              {result.unclear ? (
                <p className="text-ink/75 leading-relaxed">
                  Vitalis couldn&rsquo;t confidently analyze this image — try a clearer,
                  well-lit photo, or double check you uploaded the right file.
                </p>
              ) : (
                <>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-pine mb-4">
                    {result.imageType?.replace('_', ' ')}
                  </p>

                  {result.observations && result.observations.length > 0 && (
                    <div className="mb-5">
                      <p className="text-sm font-medium mb-2">What Vitalis observes</p>
                      <ul className="space-y-1.5">
                        {result.observations.map((o, i) => (
                          <li key={i} className="text-sm text-ink/70 flex gap-2">
                            <span className="text-pine">—</span> {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.patternsToDiscuss && result.patternsToDiscuss.length > 0 && (
                    <div className="mb-5">
                      <p className="text-sm font-medium mb-2">Worth asking your doctor about</p>
                      <ul className="space-y-1.5">
                        {result.patternsToDiscuss.map((p, i) => (
                          <li key={i} className="text-sm text-ink/70 flex gap-2">
                            <span className="text-pine">—</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendedNextStep && (
                    <p className="text-sm bg-pine-50 text-pine-dark rounded-xl px-4 py-3 mb-4">
                      {result.recommendedNextStep}
                    </p>
                  )}
                </>
              )}
              <p className="text-xs text-ink/45 border-t border-line pt-4 mt-4">{result.disclaimer}</p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

