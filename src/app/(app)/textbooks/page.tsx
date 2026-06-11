'use client';

// Textbooks View — US-017 | Sprint 5 | WBS 6.1–6.4 | P21
//
// Sections:
//   1. Book list — registered books with spine marker + 1px bar + inline page edit
//   2. Register form — title*, author, subject, total_pages, active_from
//   3. Source web — topic → book coverage (strong/partial/missing)
//
// Data flow: GET /api/textbooks on mount → local state
//   Register: POST /api/textbooks { action: 'register' } → optimistic prepend
//   Page update: POST /api/textbooks { action: 'update_page' } → replace row in state

import { useEffect, useState } from 'react';
import BookList from '@/components/textbooks/BookList';
import RegisterForm from '@/components/textbooks/RegisterForm';
import SourceWeb from '@/components/textbooks/SourceWeb';
import type { TextbookRow, SourceRow } from '@/types/database';

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--ink4)',
  margin: '0 0 12px 0',
};

const CARD: React.CSSProperties = {
  background: 'var(--cream)',
  border: '1px solid var(--line)',
  borderRadius: 11,
  boxShadow: 'var(--shadow-1)',
  padding: '14px 16px',
  marginBottom: 32,
};

export default function TextbooksPage() {
  const [books, setBooks]     = useState<TextbookRow[]>([]);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [status, setStatus]   = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/textbooks')
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) { setStatus('error'); return; }
        setBooks(json.data.books);
        setSources(json.data.sources);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, []);

  async function handlePageUpdate(id: string, page: number) {
    const res = await fetch('/api/textbooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_page', id, current_page: page }),
    });
    const json = await res.json();
    if (json.success) {
      // Update local book row — progress bar animates 300ms (§8.2)
      setBooks((prev) => prev.map((b) => (b.id === id ? (json.data as TextbookRow) : b)));
    }
  }

  function handleRegistered(book: TextbookRow) {
    // Prepend new book to list
    setBooks((prev) => [book, ...prev]);
  }

  return (
    <div style={{ padding: '20px 24px', maxWidth: 720 }}>

      {/* ── Textbooks list ── */}
      <p style={SECTION_LABEL}>textbooks</p>

      {status === 'loading' && (
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink4)', marginBottom: 32 }}>
          Loading…
        </p>
      )}
      {status === 'error' && (
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--red)', marginBottom: 32 }}>
          Could not load textbooks.
        </p>
      )}
      {status === 'loaded' && (
        <div style={{ marginBottom: 32 }}>
          <BookList books={books} onPageUpdate={handlePageUpdate} />
        </div>
      )}

      {/* ── Register form ── */}
      <p style={SECTION_LABEL}>register a book</p>
      <div style={CARD}>
        <RegisterForm onRegistered={handleRegistered} />
      </div>

      {/* ── Source web ── */}
      {status === 'loaded' && (
        <>
          <p style={SECTION_LABEL}>source web</p>
          <div style={CARD}>
            <SourceWeb sources={sources} books={books} />
          </div>
        </>
      )}
    </div>
  );
}
