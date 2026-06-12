'use client';

// VelocityChart — weekly study velocity trendline (v1.1, suggestion #10)
// SVG line of pages/week over the last 8 weeks + current pages/day.
// Drift visible = drift fixed.

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { computeVelocity } from '@/utils/computeVelocity';

interface WeekPoint {
  label: string; // e.g. "May 4"
  pages: number;
}

const WEEKS = 8;
const W = 560;
const H = 120;
const PAD = 24;

export default function VelocityChart() {
  const [points, setPoints] = useState<WeekPoint[]>([]);
  const [velocity, setVelocity] = useState(0);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    const db = createClient();
    const since = new Date();
    since.setDate(since.getDate() - WEEKS * 7);

    db.from('sessions')
      .select('pages_done, started_at')
      .gte('started_at', since.toISOString())
      .order('started_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) { setStatus('error'); return; }

        // Bucket into calendar weeks (oldest first)
        const buckets: WeekPoint[] = [];
        for (let i = WEEKS - 1; i >= 0; i--) {
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          start.setDate(start.getDate() - start.getDay() - i * 7); // week start (Sun)
          const end = new Date(start);
          end.setDate(end.getDate() + 7);

          const pages = data
            .filter((s) => {
              const t = new Date(s.started_at).getTime();
              return t >= start.getTime() && t < end.getTime();
            })
            .reduce((sum, s) => sum + (s.pages_done ?? 0), 0);

          buckets.push({
            label: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            pages,
          });
        }

        const lastWeek = data.filter(
          (s) => Date.now() - new Date(s.started_at).getTime() < 7 * 86400000
        );
        setVelocity(computeVelocity(lastWeek));
        setPoints(buckets);
        setStatus('loaded');
      });
  }, []);

  if (status === 'loading') {
    return <div className="skeleton" style={{ height: H, borderRadius: 'var(--r-card)' }} />;
  }
  if (status === 'error' || points.length === 0) return null;

  const max = Math.max(1, ...points.map((p) => p.pages));
  const x = (i: number) => PAD + (i * (W - PAD * 2)) / (points.length - 1);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.pages)}`).join(' ');

  return (
    <section
      aria-label="Weekly velocity"
      style={{
        border: '1px solid var(--border-default)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-1)',
        background: 'var(--surface-page)', padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <p style={{
          margin: 0, fontSize: 10, textTransform: 'uppercase',
          letterSpacing: '0.07em', color: 'var(--ink4)',
          fontFamily: 'Newsreader, serif',
        }}>
          Velocity — pages per week
        </p>
        <span style={{
          fontSize: 12, fontStyle: 'italic', color: 'var(--ink3)',
          fontFamily: 'Newsreader, serif',
        }}>
          now: {velocity} pages/day
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', marginTop: 8 }}
        role="img"
        aria-label={`Pages per week over the last ${WEEKS} weeks`}
      >
        <path d={path} fill="none" stroke="var(--ink)" strokeWidth="1" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.pages)} r="2" fill="var(--ink)" />
            <text
              x={x(i)} y={H - 6} textAnchor="middle"
              style={{ fontSize: 8, fill: 'var(--ink4)', fontFamily: 'Newsreader, serif' }}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
