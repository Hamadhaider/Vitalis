// Calculates a simple 0-100 health score from the user's own log entries.
// This is arithmetic on data already in the browser — not an AI claim about
// health status, just a motivational summary of logging consistency and trend.
export function calculateHealthScore(entries) {
  if (!entries || entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Consistency: how many of the last 14 days have an entry.
  const today = new Date();
  const uniqueDates = new Set(sorted.map((e) => e.date));
  let daysLogged = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (uniqueDates.has(d.toISOString().slice(0, 10))) daysLogged++;
  }
  const consistencyScore = Math.round((daysLogged / 14) * 100);

  // Trend: compare average severity of the most recent third vs the earliest third.
  const third = Math.max(1, Math.floor(sorted.length / 3));
  const early = sorted.slice(0, third);
  const recent = sorted.slice(-third);
  const avg = (arr) => arr.reduce((sum, e) => sum + e.severity, 0) / arr.length;
  const earlyAvg = avg(early);
  const recentAvg = avg(recent);
  const improvement = earlyAvg - recentAvg; // positive = getting better
  // Map improvement (-9..9) to a 0-100 trend score, centered at 50.
  const trendScore = Math.max(0, Math.min(100, Math.round(50 + improvement * 8)));

  const overall = Math.round(consistencyScore * 0.4 + trendScore * 0.6);

  let label = 'Building your picture';
  if (entries.length >= 4) {
    if (overall >= 70) label = 'Trending well';
    else if (overall >= 40) label = 'Holding steady';
    else label = 'Worth extra attention';
  }

  return { overall, consistencyScore, trendScore, label, daysLogged };
}

