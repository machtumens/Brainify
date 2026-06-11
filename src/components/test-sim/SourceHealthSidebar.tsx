'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

type SourceQuality = 'strong' | 'partial' | 'missing';

interface TopicHealth {
  topic: string;
  quality: SourceQuality;
}

interface Props {
  selectedTopics: string[];
}

// Colors per quality state (ui-ux-principles §1.4)
const QUALITY_COLOR: Record<SourceQuality, string> = {
  strong:  'var(--ink)',
  partial: 'var(--amber)',
  missing: 'var(--red)',
};

const QUALITY_LABEL: Record<SourceQuality, string> = {
  strong:  'strong',
  partial: 'partial',
  missing: 'missing',
};

export default function SourceHealthSidebar({ selectedTopics }: Props) {
  const [health, setHealth] = useState<TopicHealth[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTopics.length === 0) {
      setHealth([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetchHealth() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createClient();

      const { data } = await db
        .from('sources')
        .select('topic, quality')
        .in('topic', selectedTopics);

      if (cancelled) return;

      const sourceMap = new Map<string, SourceQuality>();
      for (const row of (data ?? [])) {
        if (row.topic && row.quality) {
          sourceMap.set(row.topic as string, row.quality as SourceQuality);
        }
      }

      // Every selected topic gets a health entry — missing if not in sources
      const entries: TopicHealth[] = selectedTopics.map((topic) => ({
        topic,
        quality: sourceMap.get(topic) ?? 'missing',
      }));

      setHealth(entries);
      setLoading(false);
    }

    fetchHealth().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [selectedTopics]);

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 11,
        boxShadow: 'var(--shadow-1)',
        background: 'var(--cream)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
      aria-label="Source health"
    >
      <span style={{
        fontSize: 10,
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: 'var(--ink4)',
        fontFamily: 'Newsreader, serif',
      }}>
        source health
      </span>

      {selectedTopics.length === 0 && (
        <p style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: 'var(--ink3)',
          margin: 0,
          lineHeight: 1.4,
        }}>
          Select topics to see source quality.
        </p>
      )}

      {selectedTopics.length > 0 && loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedTopics.map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 14, borderRadius: 4, width: '80%' }}
            />
          ))}
        </div>
      )}

      {selectedTopics.length > 0 && !loading && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {health.map(({ topic, quality }) => (
            <li
              key={topic}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              {/* 6px colored dot indicator */}
              <span
                aria-hidden="true"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: QUALITY_COLOR[quality],
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--ink)',
                  fontFamily: 'Newsreader, serif',
                  lineHeight: 1.3,
                }}>
                  {topic}
                </span>
                <span style={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  color: QUALITY_COLOR[quality],
                  fontFamily: 'Newsreader, serif',
                }}
                  aria-label={`Source quality: ${QUALITY_LABEL[quality]}`}
                >
                  {QUALITY_LABEL[quality]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
