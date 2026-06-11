'use client';

// /memory — view + edit the permanent AI memory (v1.1 Phase 1)
// Reached from the Today view footer link. Not in main Nav (5 items frozen).

import { useEffect, useState, useCallback } from 'react';

interface MemoryRow {
  scope: string;
  content: string;
  version: number;
  updated_at: string;
}

interface LogRow {
  scope: string;
  trigger_type: string;
  summary: string | null;
  version: number;
  created_at: string;
}

export default function MemoryPage() {
  const [memories, setMemories] = useState<MemoryRow[]>([]);
  const [log, setLog] = useState<LogRow[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [saveMsg, setSaveMsg] = useState('');

  const load = useCallback(() => {
    fetch('/api/memory')
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error();
        const rows: MemoryRow[] = json.data.memories ?? [];
        setMemories(rows);
        setLog(json.data.log ?? []);
        setDraft(rows.find((m) => m.scope === 'main')?.content ?? '');
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async () => {
    setSaveMsg('');
    try {
      const res = await fetch('/api/memory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'main', content: draft }),
      });
      const json = await res.json();
      if (!json.success) throw new Error();
      setSaveMsg('Saved');
      load();
      setTimeout(() => setSaveMsg(''), 1500);
    } catch {
      setSaveMsg('Save failed');
    }
  }, [draft, load]);

  const main = memories.find((m) => m.scope === 'main');

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 24px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px' }}>Memory</h1>
      <p style={{ fontSize: 13, color: 'var(--ink3)', margin: '0 0 20px' }}>
        The permanent memory every AI feature reads first. Rewritten automatically
        after each session, test, chat, and capture — or edit it directly here.
        {main && (
          <span style={{ color: 'var(--ink4)' }}>
            {' '}v{main.version} · updated {new Date(main.updated_at).toLocaleString()}
          </span>
        )}
      </p>

      {status === 'loading' && <p className="skeleton" style={{ width: '60%' }} />}
      {status === 'error' && (
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--red)' }}>
          Could not load memory.
        </p>
      )}

      {status === 'loaded' && (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={18}
            style={{
              width: '100%',
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--ink)',
              background: 'var(--cream2)',
              border: '1px solid var(--line)',
              borderRadius: 11,
              padding: '14px 16px',
              resize: 'vertical',
            }}
            placeholder="(no memory yet — use the platform and it will populate)"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <button
              onClick={save}
              style={{
                fontFamily: 'inherit',
                fontSize: 13,
                color: 'var(--cream)',
                background: 'var(--ink)',
                border: 'none',
                borderRadius: 99,
                padding: '7px 18px',
                cursor: 'pointer',
                transition: 'opacity var(--t-fast)',
              }}
            >
              Save memory
            </button>
            {saveMsg && (
              <span style={{ fontSize: 12, fontStyle: 'italic', color: saveMsg === 'Saved' ? 'var(--ink3)' : 'var(--red)' }}>
                {saveMsg}
              </span>
            )}
          </div>

          <h2 style={{ fontSize: 14, fontWeight: 500, margin: '28px 0 8px' }}>Rewrite history</h2>
          {log.length === 0 ? (
            <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--ink4)' }}>No rewrites yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {log.map((l, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 12,
                    color: 'var(--ink3)',
                    padding: '6px 0',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  <span style={{ color: 'var(--ink4)' }}>
                    {new Date(l.created_at).toLocaleString()} · v{l.version} · {l.trigger_type}
                  </span>
                  {l.summary && <span> — {l.summary}</span>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
