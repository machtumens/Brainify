'use client';

// DailyCheckItem — P14 US-012 Level 4
// Inline checkable daily task item. Same circle checkbox pattern as TaskRow.
// Expand state + check state are session-only (not persisted to DB from this component).

import { useState } from 'react';
import type { DailyChecklistItem } from '@/types/database';

interface Props {
  item: DailyChecklistItem;
  onCheck?: () => void;
}

export default function DailyCheckItem({ item, onCheck }: Props) {
  const [done, setDone] = useState(item.done);

  function handleToggle() {
    const next = !done;
    setDone(next);
    if (next) onCheck?.();
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 0',
        minHeight: 44,
        cursor: 'pointer',
      }}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={done}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {/* Circle checkbox */}
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: `1px solid ${done ? 'var(--ink)' : 'var(--line2)'}`,
          background: done ? 'var(--ink)' : 'transparent',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 150ms ease',
        }}
      >
        {done && (
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--cream)',
            }}
          />
        )}
      </div>

      {/* Task text */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 300,
          color: done ? 'var(--ink4)' : 'var(--ink)',
          textDecoration: done ? 'line-through' : 'none',
          textDecorationColor: 'var(--line2)',
          transition: 'color 150ms ease',
          flex: 1,
        }}
      >
        Day {item.day}: {item.task}
      </span>
    </div>
  );
}
