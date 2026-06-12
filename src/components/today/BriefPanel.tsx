'use client';

import { useEffect, useRef, useState } from 'react';
import Skeleton from '@/components/shared/primitives/Skeleton';
import InlineMessage from '@/components/shared/primitives/InlineMessage';

const CACHE_KEY = 'sb_brief';

type State = 'loading' | 'loaded' | 'error';

export default function BriefPanel() {
  const [state, setState] = useState<State>('loading');
  const [brief, setBrief] = useState('');
  // React StrictMode re-runs effects in dev — without this guard the brief
  // is fetched twice on first mount (both runs see an empty cache).
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
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
      <InlineMessage tone="muted" style={{ fontSize: 'var(--fs-body)' }}>
        Unable to load your brief.
      </InlineMessage>
    );
  }

  // loading — skeleton (shared primitive; sweep keyframes live in globals.css)
  return (
    <div aria-label="Loading brief" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton width="100%" />
      <Skeleton width="70%" />
    </div>
  );
}
