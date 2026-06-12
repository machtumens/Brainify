'use client';

// ExamDatesCard — register/remove exam dates (v1.1, suggestion #15).
// ExamCountdown on Today reads the soonest entry.

import { useCallback, useEffect, useState } from 'react';

interface ExamRow {
  id: string;
  title: string;
  subject: string | null;
  exam_on: string;
}

export default function ExamDatesCard() {
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch('/api/exams')
      .then((r) => r.json())
      .then((json) => { if (json.success) setExams(json.data ?? []); })
      .catch(() => { /* card stays empty */ });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add() {
    if (!title.trim() || !date) return;
    setBusy(true);
    try {
      await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), exam_on: date }),
      });
      setTitle('');
      setDate('');
      load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setExams((prev) => prev.filter((e) => e.id !== id));
    fetch(`/api/exams?id=${id}`, { method: 'DELETE' }).catch(() => load());
  }

  return (
    <section style={{
      border: '1px solid var(--border-default)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-1)',
      background: 'var(--surface-page)', padding: '14px 16px', marginTop: 24,
    }}>
      <p style={{
        margin: '0 0 10px', fontSize: 10, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--ink4)',
      }}>
        Exam dates
      </p>

      {exams.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px' }}>
          {exams.map((e) => (
            <li key={e.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0', borderBottom: '1px solid var(--line)',
            }}>
              <span style={{ fontSize: 13, color: 'var(--ink2)' }}>
                {e.title}
                <span style={{ color: 'var(--ink4)', marginLeft: 8, fontSize: 12 }}>
                  {new Date(`${e.exam_on}T00:00:00`).toLocaleDateString(undefined, {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </span>
              <button
                onClick={() => remove(e.id)}
                aria-label={`Remove ${e.title}`}
                style={{
                  fontSize: 11, fontStyle: 'italic', color: 'var(--ink4)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Exam title (e.g. Pure M1 mock)"
          maxLength={200}
          style={{
            flex: 1, fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
            background: 'var(--cream2)', border: '1px solid var(--line)',
            borderRadius: 99, padding: '6px 14px',
          }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Exam date"
          style={{
            fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
            background: 'var(--cream2)', border: '1px solid var(--line)',
            borderRadius: 99, padding: '6px 14px',
          }}
        />
        <button
          onClick={add}
          disabled={busy || !title.trim() || !date}
          style={{
            fontFamily: 'inherit', fontSize: 12, fontStyle: 'italic',
            color: title.trim() && date ? 'var(--cream)' : 'var(--ink4)',
            background: title.trim() && date ? 'var(--ink)' : 'var(--cream3)',
            border: 'none', borderRadius: 99, padding: '6px 16px',
            cursor: busy || !title.trim() || !date ? 'not-allowed' : 'pointer',
          }}
        >
          Add
        </button>
      </div>
    </section>
  );
}
