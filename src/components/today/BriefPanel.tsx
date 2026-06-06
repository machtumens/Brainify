'use client';

import { useEffect, useState } from 'react';

const CACHE_KEY = 'sb_brief';

type State = 'loading' | 'loaded' | 'error';

export default function BriefPanel() {
  const [state, setState] = useState<State>('loading');
  const [brief, setBrief] = useState('');

  useEffect(() => {
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem(CACHE_KEY) : null;
    if (cached) {
      setBrief(cached);
      setState('loaded');
      return;
    }

    fetch('/api/brief', { method: 'POST' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.brief) {
          sessionStorage.setItem(CACHE_KEY, json.data.brief);
          setBrief(json.data.brief);
          setState('loaded');
        } else {
          setState('error');
        }
      })
      .catch(() => setState('error'));
  }, []);

  if (state === 'loaded') {
    return (
      <p style={{
        fontSize: 14,
        fontWeight: 300,
        fontStyle: 'italic',
        color: 'var(--ink)',
        lineHeight: 1.5,
        margin: 0,
      }}>
        {brief}
      </p>
    );
  }

  if (state === 'error') {
    return (
      <p style={{
        fontSize: 14,
        fontStyle: 'italic',
        color: 'var(--ink3)',
        margin: 0,
      }}>
        Unable to load your brief.
      </p>
    );
  }

  // loading — skeleton
  return (
    <div aria-label="Loading brief" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <style>{`
        @keyframes skeleton-sweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .brief-skeleton {
          background: linear-gradient(90deg, var(--cream2) 25%, var(--cream3) 50%, var(--cream2) 75%);
          background-size: 200% 100%;
          animation: skeleton-sweep 1.5s ease-in-out infinite;
          border-radius: 4px;
          height: 14px;
        }
      `}</style>
      <div className="brief-skeleton" style={{ width: '100%' }} />
      <div className="brief-skeleton" style={{ width: '70%' }} />
    </div>
  );
}
