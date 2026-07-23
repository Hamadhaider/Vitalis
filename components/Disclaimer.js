export default function Disclaimer({ children }) {
  return (
    <div className="flex gap-3 items-start bg-amber-light/40 border border-amber/60 rounded-xl px-4 py-3 text-sm text-ink/80">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className="shrink-0 mt-0.5 text-brick"
        aria-hidden="true"
      >
        <path
          d="M9 1.5 16.5 15h-15L9 1.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M9 6.5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="9" cy="12.6" r="0.9" fill="currentColor" />
      </svg>
      <p>
        {children ||
          'Vitalis gives general, educational guidance — it does not diagnose and is not a substitute for a licensed clinician or pharmacist. If a symptom is severe or sudden, seek emergency care.'}
      </p>
    </div>
  );
}
