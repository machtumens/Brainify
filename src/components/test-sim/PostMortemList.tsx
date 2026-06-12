'use client';

// PostMortemList — after a test, one line per mistake: "why did I get
// this wrong?" (self-explanation effect, v1.1 Phase 3). Saves to the
// error row created at submit time via PATCH /api/error.

import { useState } from 'react';
import type { Question } from '@/types/test';

interface Props {
  questions: Question[];
  wrongMap: Record<string, string>; // question id -> error id
}

export default function PostMortemList({ questions, wrongMap }: Props) {
  const wrongQuestions = questions.filter((q) => wrongMap[q.id]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  if (wrongQuestions.length === 0) return null;

  async function save(qid: string) {
    const text = (drafts[qid] ?? '').trim();
    if (!text) return;
    try {
      const res = await fetch('/api/error', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wrongMap[qid], post_mortem: text }),
      });
      const json = await res.json();
      if (json.success) setSaved((prev) => ({ ...prev, [qid]: true }));
    } catch { /* leave unsaved — user can retry */ }
  }

  return (
    <div style={{
      border: '1px solid var(--border-default)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-1)',
      background: 'var(--surface-page)', padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <p style={{
        margin: 0, fontSize: 10, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--ink4)',
        fontFamily: 'Newsreader, serif',
      }}>
        Post-mortem — one line per mistake
      </p>
      {wrongQuestions.map((q) => (
        <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{
            margin: 0, fontSize: 13, color: 'var(--ink2)',
            fontFamily: 'Newsreader, serif', lineHeight: 1.5,
          }}>
            {q.text}
          </p>
          {saved[q.id] ? (
            <p style={{
              margin: 0, fontSize: 12, fontStyle: 'italic',
              color: 'var(--ink3)', fontFamily: 'Newsreader, serif',
            }}>
              Saved: &ldquo;{drafts[q.id]}&rdquo;
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={drafts[q.id] ?? ''}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') save(q.id); }}
                placeholder="Why did I get this wrong?"
                maxLength={500}
                style={{
                  flex: 1, fontFamily: 'Newsreader, serif', fontSize: 13,
                  color: 'var(--ink)', background: 'var(--cream2)',
                  border: '1px solid var(--line)', borderRadius: 99,
                  padding: '6px 14px',
                }}
              />
              <button
                onClick={() => save(q.id)}
                disabled={!(drafts[q.id] ?? '').trim()}
                style={{
                  fontFamily: 'Newsreader, serif', fontSize: 12, fontStyle: 'italic',
                  padding: '6px 16px', borderRadius: 99, border: 'none',
                  background: (drafts[q.id] ?? '').trim() ? 'var(--ink)' : 'var(--cream3)',
                  color: (drafts[q.id] ?? '').trim() ? 'var(--cream)' : 'var(--ink4)',
                  cursor: (drafts[q.id] ?? '').trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
