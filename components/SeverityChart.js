'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

// Shows severity over time so patterns are visible at a glance, not just as
// a list of numbers. Expects entries newest-first (as the logger stores them).
export default function SeverityChart({ entries }) {
  if (!entries || entries.length < 2) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-6 text-sm text-ink/50 text-center">
        Log at least 2 entries to see your severity trend here.
      </div>
    );
  }

  const data = [...entries]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((e) => ({
      date: e.date.slice(5), // MM-DD, compact for the axis
      severity: e.severity,
    }));

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 mb-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-pine mb-4">
        Severity trend
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#E4DFD3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#1B2B29', opacity: 0.5 }}
            axisLine={{ stroke: '#E4DFD3' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: '#1B2B29', opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            contentStyle={{
              background: '#FAF8F3',
              border: '1px solid #E4DFD3',
              borderRadius: '10px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#1B2B29', fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="severity"
            stroke="#2F6F5E"
            strokeWidth={2.5}
            dot={{ fill: '#2F6F5E', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
