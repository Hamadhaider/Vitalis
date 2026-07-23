import Navbar from '@/components/Navbar';
import PulseDivider from '@/components/PulseDivider';
import FeatureCard from '@/components/FeatureCard';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-16 pb-10 max-w-2xl animate-fade_up">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pine mb-4">
            A calmer way to navigate your health
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] mb-6">
            Know what&rsquo;s wrong.
            <br />
            Know who to see.
            <br />
            <span className="italic text-pine">Know what&rsquo;s safe.</span>
          </h1>
          <p className="text-ink/70 text-lg leading-relaxed">
            Vitalis is three tools in one: an AI symptom router that points you to the
            right specialist, a medication interaction checker, and a daily condition
            log that turns messy notes into patterns you can bring to your doctor.
          </p>
        </section>

        <PulseDivider label="Three tools, one companion" />

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 py-10">
          <FeatureCard
            href="/specialist"
            eyebrow="01 · Symptom Router"
            title="Who should I see?"
            description="Describe what you're feeling. Vitalis reasons through likely specialists — dermatologist, allergist, rheumatologist, and more — so you skip the wrong waiting room."
            cta="Route my symptoms"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
          />
          <FeatureCard
            href="/medications"
            eyebrow="02 · Medication Checker"
            title="Is this combination safe?"
            description="List what you're taking. Vitalis flags known interaction categories in plain language, without the dense literature or the paywalled lookup."
            cta="Check my medications"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="8" width="14" height="8" rx="4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 10.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
          />
          <FeatureCard
            href="/logger"
            eyebrow="03 · Daily Logger"
            title="What's actually going on?"
            description="Pick your condition and log symptoms, triggers, and severity each day. Ask Vitalis for AI pattern insights, then export a clean report for your next appointment."
            cta="Open my log"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h9l3 3v11H4V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M7 9h6M7 12h6M7 15h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
          />
        </section>

        <footer className="py-12 text-center text-xs text-ink/40 font-mono">
          Built for the AI App final project · Vitalis is educational and not a medical device
        </footer>
      </main>
    </>
  );
}
