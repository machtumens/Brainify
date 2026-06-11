'use client';

// /review — dead-time mobile review mode (v1.1 Phase 4, PWA start_url)
// Single-screen card-at-a-time spaced-repetition pass. Big touch
// targets, no chrome beyond Nav. Works as the installed-PWA entry.

import { useCallback, useEffect, useState } from 'react';
import { isPreSleepWindow } from '@/lib/sr/scheduler';

interface ReviewItem {
  id: string;
  topic: string;
  prompt_text: string;
  interval_idx: number;
}

export default function ReviewPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [done, setDone] = useState(0);
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
    setDone((d) => d + 1);
    setRevealed(false);
    fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, result }),
    }).catch(() => { /* optimistic */ });
  }, []);

  const current = items[0];

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      padding: '24px 20px 80px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      minHeight: '70vh',
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{ fontSize: 16, fontWeight: 400, fontStyle: 'italic', margin: 0 }}>
          {presleep ? 'Pre-sleep review' : 'Review'}
        </h1>
        <span style={{ fontSize: 12, color: 'var(--ink4)' }}>
          {done} done · {items.length} left
        </span>
      </header>

      {status === 'loading' && (
        <div className="skeleton" style={{ height: 180, borderRadius: 11 }} />
      )}

      {status === 'error' && (
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--red)' }}>
          Could not load the review queue.
        </p>
      )}

      {status === 'loaded' && !current && (
        <div style={{
          border: '1px solid var(--line)', borderRadius: 11,
          background: 'var(--cream2)', padding: '40px 24px', textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 15, fontStyle: 'italic', color: 'var(--ink2)' }}>
            {done > 0 ? 'Queue clear. Nicely done.' : 'Nothing due right now.'}
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--ink4)' }}>
            New mistakes appear here a day after they happen, then at 3, 7 and 21 days.
          </p>
        </div>
      )}

      {current && (
        <div style={{
          border: '1px solid var(--line)', borderRadius: 11,
          background: 'var(--cream)', padding: '24px 20px',
          display: 'flex', flexDirection: 'column', gap: 16, flex: 1,
        }}>
          <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink4)' }}>
            {current.topic}
          </p>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--ink)', flex: 1 }}>
            {current.prompt_text}
          </p>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              style={{
                fontFamily: 'inherit', fontSize: 14, fontStyle: 'italic',
                color: 'var(--ink2)', background: 'var(--cream2)',
                border: '1px solid var(--line2)', borderRadius: 11,
                padding: '16px', cursor: 'pointer', width: '100%',
                minHeight: 52,
              }}
            >
              I&rsquo;ve recalled it — check myself
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => record(current.id, 'pass')}
                style={{
                  flex: 1, minHeight: 52, fontFamily: 'inherit', fontSize: 14,
                  color: 'var(--cream)', background: 'var(--ink)',
                  border: 'none', borderRadius: 11, cursor: 'pointer',
                }}
              >
                Got it
              </button>
              <button
                onClick={() => record(current.id, 'fail')}
                style={{
                  flex: 1, minHeight: 52, fontFamily: 'inherit', fontSize: 14,
                  color: 'var(--red)', background: 'transparent',
                  border: '1px solid var(--line2)', borderRadius: 11, cursor: 'pointer',
                }}
              >
                Still shaky
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
