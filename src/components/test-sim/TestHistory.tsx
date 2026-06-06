'use client';
// TestHistory — past test results list
// Sprint 5 | US-015 | P20
// Shows: score, date, topics, duration. Empty state per §10.2.

import { useState, useEffect } from 'react';
import type { TestHistoryItem } from '@/types/test';

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

export default function TestHistory() {
  const [items, setItems] = useState<TestHistoryItem[]>([]);

  useEffect(() => {
    fetch('/api/test-results')
      .then((r) => r.json())
      .then((j) => { if (j.success && Array.isArray(j.data)) setItems(j.data); })
      .catch(() => {}); // silent — history is non-critical
  }, []);

  if (items.length === 0) {
    return (
      <p style={{
        margin: 0, fontSize: 12, fontStyle: 'italic',
        color: 'var(--ink3)', fontFamily: 'Newsreader, serif',
      }}>
        Run a test to see your history here.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.slice(0, 10).map((item, i) => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 0',
          borderTop: i > 0 ? '1px solid var(--line)' : 'none',
        }}>
          <span style={{
            fontFamily: 'Newsreader, serif', fontSize: 13,
            color: 'var(--ink)', minWidth: 40,
          }}>
            {item.score}/{item.total}
          </span>
          <span style={{
            flex: 1, fontSize: 12, fontStyle: 'italic',
            color: 'var(--ink3)', fontFamily: 'Newsreader, serif',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {(item.topics ?? []).slice(0, 3).join(', ')}
          </span>
          <span style={{
            fontSize: 11, color: 'var(--ink4)', fontFamily: 'Newsreader, serif',
          }}>
            {fmtDuration(item.duration ?? 0)}
          </span>
          <span style={{
            fontSize: 11, color: 'var(--ink4)', fontFamily: 'Newsreader, serif',
          }}>
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
