'use client';

export default function HealthScoreCard({ score }) {
  if (!score) return null;

  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score.overall / 100) * circumference;

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 mb-6 flex items-center gap-6">
      <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0 -rotate-90">
        <circle cx="42" cy="42" r="34" stroke="var(--color-line)" strokeWidth="7" fill="none" />
        <circle
          cx="42"
          cy="42"
          r="34"
          stroke="#2F6F5E"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text
          x="42"
          y="42"
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90"
          style={{ transform: 'rotate(90deg)', transformOrigin: '42px 42px' }}
          fontSize="20"
          fontWeight="600"
          fill="var(--color-ink)"
        >
          {score.overall}
        </text>
      </svg>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-pine mb-1">
          Health score
        </p>
        <p className="font-display text-xl mb-1">{score.label}</p>
        <p className="text-sm text-ink/60">
          Logged {score.daysLogged}/14 of the last 14 days
        </p>
      </div>
    </div>
  );
}
