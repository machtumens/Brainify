'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { computeConfusionMap } from '@/utils/computeConfusionMap';
import { PILL_BG } from '@/utils/confusionMapColors';

type QuadrantType = 'danger' | 'watch' | 'safe' | 'other';

interface TopicEntry {
  name: string;
  quadrant: QuadrantType;
}

interface Props {
  selectedTopics: string[];
  onToggle: (topic: string) => void;
}

// Unselected pill colors by quadrant — hex values from confusionMapColors.ts (single source of truth)
const UNSELECTED_STYLES: Record<QuadrantType, { background: string; color: string }> = {
  danger: { background: PILL_BG.danger, color: 'var(--red)' },
  watch:  { background: PILL_BG.watch,  color: 'var(--amber)' },
  safe:   { background: PILL_BG.safe,   color: 'var(--ink2)' },
  other:  { background: PILL_BG.safe,   color: 'var(--ink2)' },
};

const QUADRANT_ORDER: Record<QuadrantType, number> = {
  danger: 0,
  watch:  1,
  safe:   2,
  other:  3,
};

function normTopic(t: string): string {
  return t.toLowerCase().trim();
}

export default function TopicGrid({ selectedTopics, onToggle }: Props) {
  const [topics, setTopics] = useState<TopicEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedSet = new Set(selectedTopics);

  useEffect(() => {
    let cancelled = false;

    async function fetchTopics() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createClient() as any;

      const [textbooksRes, errorsRes, sessionsRes] = await Promise.all([
        db.from('textbooks').select('subject, topic_map'),
        db.from('errors').select('topic'),
        db.from('sessions')
          .select('subject')
          .order('started_at', { ascending: false })
          .limit(30),
      ]);

      if (cancelled) return;

      const textbooks: Array<{ subject?: string | null; topic_map?: Record<string, string[]> | null }>
        = textbooksRes.data ?? [];
      const errors: Array<{ topic?: string | null }> = errorsRes.data ?? [];
      const sessions: Array<{ subject?: string | null }> = sessionsRes.data ?? [];

      // Gather unique topic names
      const topicSet = new Set<string>();

      for (const t of textbooks) {
        if (t.subject) topicSet.add(t.subject);
        if (t.topic_map) {
          for (const chapterTopics of Object.values(t.topic_map)) {
            for (const topic of chapterTopics) {
              if (topic && typeof topic === 'string') topicSet.add(topic);
            }
          }
        }
      }

      for (const e of errors) {
        if (e.topic) topicSet.add(e.topic);
      }

      if (topicSet.size === 0) {
        setTopics([]);
        setLoading(false);
        return;
      }

      // Compute confusion map to classify quadrants
      const mapData = computeConfusionMap(
        sessions,
        errors,
        textbooks.map((t) => t.subject).filter((s): s is string => typeof s === 'string' && s.length > 0),
      );

      const dangerSet = new Set(mapData.danger);
      const watchSet  = new Set(mapData.watch);
      const safeSet   = new Set(mapData.safe);

      const entries: TopicEntry[] = Array.from(topicSet).map((name) => {
        const norm = normTopic(name);
        let quadrant: QuadrantType = 'other';
        if (dangerSet.has(norm)) quadrant = 'danger';
        else if (watchSet.has(norm)) quadrant = 'watch';
        else if (safeSet.has(norm)) quadrant = 'safe';
        return { name, quadrant };
      });

      // Sort: danger → watch → safe → other (within each group: alphabetical)
      entries.sort((a, b) => {
        const orderDiff = QUADRANT_ORDER[a.quadrant] - QUADRANT_ORDER[b.quadrant];
        return orderDiff !== 0 ? orderDiff : a.name.localeCompare(b.name);
      });

      setTopics(entries);
      setLoading(false);
    }

    fetchTopics().catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{
        fontSize: 10,
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: 'var(--ink4)',
        fontFamily: 'Newsreader, serif',
      }}>
        topics
      </span>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 34, borderRadius: 99 }}
            />
          ))}
        </div>
      )}

      {!loading && topics.length === 0 && (
        <p style={{
          fontSize: 13,
          fontStyle: 'italic',
          color: 'var(--ink3)',
          margin: 0,
          padding: '8px 0',
        }}>
          Register a textbook to unlock topics.
        </p>
      )}

      {!loading && topics.length > 0 && (
        <div
          role="group"
          aria-label="Select topics"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
          }}
        >
          {topics.map(({ name, quadrant }) => {
            const selected = selectedSet.has(name);
            const unselectedStyle = UNSELECTED_STYLES[quadrant];
            return (
              <button
                key={name}
                role="checkbox"
                aria-checked={selected}
                onClick={() => onToggle(name)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 99,
                  border: selected ? 'none' : '1px solid transparent',
                  background: selected ? 'var(--ink)' : unselectedStyle.background,
                  color: selected ? 'var(--cream)' : unselectedStyle.color,
                  fontFamily: 'Newsreader, serif',
                  fontSize: 11,
                  fontStyle: 'italic',
                  cursor: 'pointer',
                  transition: 'background 80ms ease, color 80ms ease',
                  textAlign: 'left',
                  lineHeight: 1.3,
                  // 44px min touch target (§11.2)
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={`${name}${quadrant === 'danger' ? ' — danger zone' : quadrant === 'watch' ? ' — watch zone' : ''}`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
