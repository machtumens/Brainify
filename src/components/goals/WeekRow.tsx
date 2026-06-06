'use client';

// WeekRow — P14 US-012 Level 3
// Expandable week row: topic pills, daily focus, status. ↓/↑ chevron pattern.
// Expand state session-only per ui-ux-principles §6.4.

import { useState, useRef } from 'react';
import type { WeekEntry } from '@/types/database';
import DailyCheckItem from './DailyCheckItem';

interface Props {
  week: WeekEntry;
  monthIndex: number;
  weekIndex: number;
  onItemCheck?: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'pending',
  active: 'active',
  done: 'done',
};

export default function WeekRow({ week, onItemCheck }: Props) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        borderTop: '1px solid var(--line)',
        paddingTop: 0,
      }}
    >
      {/* Row header — click to expand */}
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`week-content-${week.week}`}
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          minHeight: 44,
          textAlign: 'left',
        }}
      >
        {/* Week label */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--ink2)',
            flex: 1,
          }}
        >
          Week {week.week}
        </span>

        {/* Topic pills */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', flex: 2 }}>
          {week.topics.map((topic) => (
            <span
              key={topic}
              style={{
                fontSize: 11,
                fontStyle: 'italic',
                color: 'var(--ink3)',
                background: 'var(--cream3)',
                borderRadius: 99,
                padding: '2px 8px',
              }}
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Status */}
        <span
          style={{
            fontSize: 10,
            fontStyle: 'italic',
            color: 'var(--ink4)',
            marginRight: 8,
          }}
        >
          {STATUS_LABEL[week.status] ?? week.status}
        </span>

        {/* Chevron ↓/↑ */}
        <span
          style={{
            fontSize: 12,
            color: 'var(--ink3)',
            display: 'inline-block',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease-in-out',
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ↓
        </span>
      </button>

      {/* Expandable content */}
      <div
        id={`week-content-${week.week}`}
        ref={contentRef}
        style={{
          overflow: 'hidden',
          maxHeight: expanded ? 2000 : 0,
          transition: 'max-height 200ms ease-in-out',
        }}
      >
        <div style={{ paddingBottom: 8, paddingLeft: 8 }}>
          {week.daily_checklist.length > 0 ? (
            week.daily_checklist.map((item, idx) => (
              <DailyCheckItem key={idx} item={item} onCheck={onItemCheck} />
            ))
          ) : (
            <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--ink4)', padding: '6px 0' }}>
              No daily items for this week.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
