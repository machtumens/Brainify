'use client';

// TextbookList — US-006 · Sprint 2
// Fetches active textbooks (active_from <= today), renders one TextbookBar each.
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import TextbookBar from './TextbookBar';
import type { TextbookRow } from '@/types/database';

export default function TextbookList() {
  const [books, setBooks] = useState<TextbookRow[]>([]);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('textbooks')
      .select('*')
      .lte('active_from', today)
      .then(({ data, error }: { data: TextbookRow[] | null; error: { message: string } | null }) => {
        if (error || !data) { setStatus('error'); return; }
        setBooks(data);
        setStatus('loaded');
      });
  }, []);

  if (status === 'loading') {
    return <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink4)', margin: 0 }}>Loading books…</p>;
  }
  if (status === 'error') {
    return <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--red)', margin: 0 }}>Could not load textbooks.</p>;
  }
  if (books.length === 0) {
    return <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink3)', margin: 0 }}>No active textbooks.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {books.map((book) => <TextbookBar key={book.id} textbook={book} />)}
    </div>
  );
}
