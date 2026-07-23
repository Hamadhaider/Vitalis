export default function PulseDivider({ label }) {
  return (
    <div className="flex items-center gap-4 my-2" aria-hidden="true">
      <div className="flex-1 h-px bg-line" />
      <svg
        width="120"
        height="28"
        viewBox="0 0 120 28"
        className="text-pine shrink-0"
        fill="none"
      >
        <path
          d="M0 14 H32 L40 4 L48 24 L56 14 L64 20 L70 14 H120"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
          className="animate-pulse_travel"
        />
      </svg>
      {label ? (
        <span className="text-xs uppercase tracking-[0.2em] text-ink/50 font-mono">
          {label}
        </span>
      ) : null}
      <div className="flex-1 h-px bg-line" />
    </div>
  );
}
