'use client';

// MonthRow — P14 US-012 Level 2
// Expandable month row: title, topic summary, progress bar (1px), week count. ↓/↑ chevron.
// Expand state session-only per ui-ux-principles §6.4.

import { useState, useMemo } from 'react';
import type { MonthEntry } from '@/types/database';
import WeekRow from './WeekRow';

interface Props {
  month: MonthEntry;
  monthIndex: number;
  onItemCheck?: () => void;
}

function computeMonthProgress(month: MonthEntry): number {
  const weeks = month.weeks ?? [];
  if (weeks.length === 0) return 0;
  const done = weeks.filter((w) => w.status === 'done').length;
  return Math.round((done / weeks.length) * 100);
}

function getTopicSummary(month: MonthEntry): string {
  const all: string[] = [];
  for (const week of month.weeks ?? []) {
    for (const t of week.topics ?? []) {
      if (!all.includes(t)) all.push(t);
    }
  }
  if (all.length === 0) return '';
  if (all.length <= 3) return all.join(', ');
  return `${all.slice(0, 3).join(', ')} +${all.length - 3}`;
}

export default function MonthRow({ month, monthIndex, onItemCheck }: Props) {
  const [expanded, setExpanded] = useState(false);
  const progress = useMemo(() => computeMonthProgress(month), [month]);
  const topicSummary = useMemo(() => getTopicSummary(month), [month]);

  return (
    <div
      style={{
        borderTop: '1px solid var(--line)',
      }}
    >
      {/* Row header */}
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`month-content-${monthIndex}`}
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          minHeight: 44,
          textAlign: 'left',
        }}
      >
        {/* Month title */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--ink)',
            minWidth: 72,
          }}
        >
          {month.title ?? `Month ${month.month}`}
        </span>

        {/* Topic summary */}
        <span
          style={{
            fontSize: 12,
            fontStyle: 'italic',
            color: 'var(--ink3)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {topicSummary}
        </span>

        {/* Progress % */}
        <span
          style={{
            fontSize: 10,
            fontStyle: 'italic',
            color: 'var(--ink4)',
            marginRight: 4,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {progress}%
        </span>

        {/* Week count */}
        <span
          style={{
            fontSize: 10,
            color: 'var(--ink4)',
            marginRight: 8,
          }}
        >
          {month.weeks?.length ?? 0}w
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

      {/* 1px progress bar below header */}
      <div
        style={{
          height: 1,
          background: 'var(--line2)',
          borderRadius: 1,
          marginBottom: 0,
        }}
      >
        <div
          style={{
            height: 1,
            width: `${progress}%`,
            background: 'var(--ink)',
            borderRadius: 1,
            transition: 'width 300ms ease',
          }}
        />
      </div>

      {/* Expandable content — week rows */}
      <div
        id={`month-content-${monthIndex}`}
        style={{
          overflow: 'hidden',
          maxHeight: expanded ? 4000 : 0,
          transition: 'max-height 200ms ease-in-out',
        }}
      >
        <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
          {(month.weeks ?? []).map((week, wi) => (
            <WeekRow key={week.week} week={week} monthIndex={monthIndex} weekIndex={wi} onItemCheck={onItemCheck} />
          ))}
        </div>
      </div>
    </div>
  );
}
