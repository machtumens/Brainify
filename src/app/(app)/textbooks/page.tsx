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
import PageShell from '@/components/shared/primitives/PageShell';
import Card from '@/components/shared/primitives/Card';
import SectionLabel from '@/components/shared/primitives/SectionLabel';
import InlineMessage from '@/components/shared/primitives/InlineMessage';
import type { TextbookRow, SourceRow } from '@/types/database';

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
    <PageShell title="Textbooks" width="content" style={{ maxWidth: 720 }}>

      {/* ── Textbooks list ── */}
      <SectionLabel as="h2">textbooks</SectionLabel>

      {status === 'loading' && (
        <InlineMessage tone="muted" style={{ marginBottom: 32 }}>
          Loading…
        </InlineMessage>
      )}
      {status === 'error' && (
        <InlineMessage tone="error" style={{ marginBottom: 32 }}>
          Could not load textbooks.
        </InlineMessage>
      )}
      {status === 'loaded' && (
        <div style={{ marginBottom: 32 }}>
          <BookList books={books} onPageUpdate={handlePageUpdate} />
        </div>
      )}

      {/* ── Register form ── */}
      <SectionLabel as="h2">register a book</SectionLabel>
      <Card style={{ marginBottom: 32 }}>
        <RegisterForm onRegistered={handleRegistered} />
      </Card>

      {/* ── Source web ── */}
      {status === 'loaded' && (
        <>
          <SectionLabel as="h2">source web</SectionLabel>
          <Card style={{ marginBottom: 32 }}>
            <SourceWeb sources={sources} books={books} />
          </Card>
        </>
      )}
    </PageShell>
  );
}
