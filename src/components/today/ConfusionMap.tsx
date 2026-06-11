'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { computeConfusionMap, type ConfusionMapData } from '@/utils/computeConfusionMap';
import { QUADRANT_BG } from '@/utils/confusionMapColors';
import TopicPill from './TopicPill';

interface QuadrantConfig {
  key: keyof ConfusionMapData;
  label: string;
  background: string;
  labelColor: string;
}

const QUADRANTS: QuadrantConfig[] = [
  { key: 'safe',     label: 'SAFE',     background: QUADRANT_BG.safe,     labelColor: 'var(--ink4)' },
  { key: 'danger',   label: 'DANGER',   background: QUADRANT_BG.danger,   labelColor: 'var(--red)'  },
  { key: 'watch',    label: 'WATCH',    background: QUADRANT_BG.watch,    labelColor: 'var(--amber)'},
  { key: 'upcoming', label: 'UPCOMING', background: QUADRANT_BG.upcoming, labelColor: 'var(--ink4)' },
];

export default function ConfusionMap() {
  const [mapData, setMapData] = useState<ConfusionMapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAndCompute() {
      const db = createClient();

      const [sessionsRes, errorsRes, textbooksRes] = await Promise.all([
        db.from('sessions').select('subject').order('started_at', { ascending: false }).limit(30),
        db.from('errors').select('topic'),
        db.from('textbooks').select('subject'),
      ]);

      if (cancelled) return;

      const sessions: Array<{ subject?: string | null }> = sessionsRes.data ?? [];
      const errors: Array<{ topic?: string | null }> = errorsRes.data ?? [];
      const textbookSubjects: string[] = (textbooksRes.data ?? [])
        .map((t: { subject?: string | null }) => t.subject)
        .filter((s: unknown): s is string => typeof s === 'string' && s.length > 0);

      const computed = computeConfusionMap(sessions, errors, textbookSubjects as string[]);
      setMapData(computed);
      setLoading(false);
    }

    fetchAndCompute().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  // Memoise so quadrant content only re-renders when mapData reference changes
  const quadrantData = useMemo(() => mapData ?? { safe: [], danger: [], watch: [], upcoming: [] }, [mapData]);

  return (
    <section
      role="region"
      aria-label="Confusion Map"
      style={{
        border: '1px solid var(--line)',
        borderRadius: 11,
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <div style={{
        padding: '8px 12px 6px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--cream)',
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: 'var(--ink4)',
          fontFamily: 'Newsreader, serif',
        }}>
          confusion map
        </span>
      </div>

      {/* 2×2 grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
      }}>
        {QUADRANTS.map((q, idx) => {
          const topics = quadrantData[q.key];
          const isUpcoming = q.key === 'upcoming';
          return (
            <div
              key={q.key}
              style={{
                background: q.background,
                opacity: isUpcoming ? 0.6 : 1,
                padding: '8px 10px',
                minHeight: 72,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                borderRight: idx % 2 === 0 ? '1px solid var(--line)' : undefined,
                borderBottom: idx < 2 ? '1px solid var(--line)' : undefined,
              }}
            >
              <span style={{
                fontSize: 10,
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: q.labelColor,
                fontFamily: 'Newsreader, serif',
              }}>
                {q.label}
              </span>

              {!loading && topics.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {topics.map((topic) => (
                    <TopicPill key={topic} topic={topic} quadrant={q.key} />
                  ))}
                </div>
              )}

              {loading && (
                <div style={{ display: 'flex', gap: 4 }}>
                  <div className="skeleton" style={{ width: 48, height: 18, borderRadius: 99 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
