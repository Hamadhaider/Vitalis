import Link from 'next/link';

export default function FeatureCard({ href, eyebrow, title, description, cta, icon }) {
  return (
    <Link
      href={href}
      className="focus-ring group relative flex flex-col gap-4 bg-white border border-line rounded-2xl p-7 hover:border-pine hover:shadow-[0_8px_30px_-12px_rgba(47,111,94,0.35)] transition-all"
    >
      <div className="w-11 h-11 rounded-xl bg-pine-50 text-pine flex items-center justify-center group-hover:bg-pine group-hover:text-paper transition-colors">
        {icon}
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-pine mb-2">
          {eyebrow}
        </p>
        <h3 className="font-display text-2xl mb-2">{title}</h3>
        <p className="text-ink/65 text-sm leading-relaxed">{description}</p>
      </div>
      <span className="mt-auto text-sm font-medium text-pine flex items-center gap-1">
        {cta}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
