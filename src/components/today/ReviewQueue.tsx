'use client';

// ReviewQueue — spaced-repetition block on Today view (v1.1 Phase 3)
// Daytime: items due per the 1/3/7/21 ladder.
// After 20:00 local: pre-sleep mode — 5 hardest items of the day.
// Self-assessed active recall: read prompt, recall, then pass/fail.

import { useCallback, useEffect, useState } from 'react';
import { isPreSleepWindow } from '@/lib/sr/scheduler';

interface ReviewItem {
  id: string;
  topic: string;
  prompt_text: string;
  interval_idx: number;
  due_at: string;
  last_result: string | null;
}

export default function ReviewQueue() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [revealed, setRevealed] = useState(false);
  const presleep = isPreSleepWindow();

  useEffect(() => {
    fetch(`/api/review${presleep ? '?window=presleep' : ''}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error();
        setItems(json.data ?? []);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [presleep]);

  const record = useCallback(async (id: string, result: 'pass' | 'fail') => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRevealed(false);
    fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, result }),
    }).catch(() => { /* optimistic — next GET reconciles */ });
  }, []);

  if (status !== 'loaded' || items.length === 0) return null;

  const current = items[0];

  return (
    <section
      style={{
        border: '1px solid var(--line)',
        borderRadius: 11,
        padding: '14px 16px',
        background: 'var(--cream2)',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, margin: 0, letterSpacing: '0.02em' }}>
          {presleep ? 'Pre-sleep review' : 'Review due'}
        </h2>
        <span style={{ fontSize: 11, color: 'var(--ink4)' }}>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </header>

      <p style={{ fontSize: 11, color: 'var(--ink4)', margin: '0 0 6px' }}>
        {current.topic}
      </p>
      <p style={{ fontSize: 13, color: 'var(--ink)', margin: '0 0 12px', lineHeight: 1.5 }}>
        {current.prompt_text}
      </p>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          style={{
            fontFamily: 'inherit',
            fontSize: 12,
            color: 'var(--ink2)',
            background: 'transparent',
            border: '1px solid var(--line2)',
            borderRadius: 99,
            padding: '5px 14px',
            cursor: 'pointer',
            transition: 'border-color var(--t-fast)',
          }}
        >
          Recall first, then check yourself
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => record(current.id, 'pass')}
            style={{
              fontFamily: 'inherit',
              fontSize: 12,
              color: 'var(--cream)',
              background: 'var(--ink)',
              border: 'none',
              borderRadius: 99,
              padding: '5px 14px',
              cursor: 'pointer',
            }}
          >
            Got it
          </button>
          <button
            onClick={() => record(current.id, 'fail')}
            style={{
              fontFamily: 'inherit',
              fontSize: 12,
              color: 'var(--red)',
              background: 'transparent',
              border: '1px solid var(--line2)',
              borderRadius: 99,
              padding: '5px 14px',
              cursor: 'pointer',
            }}
          >
            Still shaky
          </button>
        </div>
      )}
    </section>
  );
}
