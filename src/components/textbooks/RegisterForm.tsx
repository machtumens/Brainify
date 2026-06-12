'use client';

// RegisterForm — US-017 | Sprint 5 | WBS 6.2 | P21
// Register a new textbook. Fields: title*, author, subject, total_pages, active_from.
// Duplicate title → inline error "Book already registered" (no modal).
// ui-ux-principles.md §4.2 (buttons), §8.4 (error states: --red italic inline)

import { useState } from 'react';
import type { TextbookRow } from '@/types/database';

interface Props {
  onRegistered: (book: TextbookRow) => void;
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--line2)',
  borderRadius: 7,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: "'Newsreader', serif",
  background: 'var(--cream)',
  color: 'var(--ink)',
  outline: 'none',
  minHeight: 44,
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  fontStyle: 'italic',
  color: 'var(--ink3)',
  display: 'block',
  marginBottom: 4,
};

export default function RegisterForm({ onRegistered }: Props) {
  const [title, setTitle]         = useState('');
  const [author, setAuthor]       = useState('');
  const [subject, setSubject]     = useState('');
  const [totalPages, setTotal]    = useState('');
  const [activeFrom, setFrom]     = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmit]   = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmit(true);
    setError('');

    try {
      const res = await fetch('/api/textbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          title: title.trim(),
          author: author.trim() || undefined,
          subject: subject.trim() || undefined,
          total_pages: totalPages ? parseInt(totalPages, 10) : undefined,
          active_from: activeFrom,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? 'Registration failed');
        return;
      }

      onRegistered(json.data as TextbookRow);
      // Reset form
      setTitle('');
      setAuthor('');
      setSubject('');
      setTotal('');
      setFrom(new Date().toISOString().slice(0, 10));
    } catch {
      setError('Registration failed');
    } finally {
      setSubmit(false);
    }
  }

  const disabled = !title.trim() || submitting;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      aria-label="Register a textbook"
    >
      {/* Title */}
      <div>
        <label htmlFor="tb-title" style={LABEL_STYLE}>title *</label>
        <input
          id="tb-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Spivak Calculus"
          required
          maxLength={500}
          style={INPUT_STYLE}
          aria-required="true"
        />
      </div>

      {/* Author + Subject row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="tb-author" style={LABEL_STYLE}>author</label>
          <input
            id="tb-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Michael Spivak"
            maxLength={300}
            style={INPUT_STYLE}
          />
        </div>
        <div>
          <label htmlFor="tb-subject" style={LABEL_STYLE}>subject</label>
          <input
            id="tb-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. mathematics"
            maxLength={100}
            style={INPUT_STYLE}
          />
        </div>
      </div>

      {/* Pages + Active from row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="tb-pages" style={LABEL_STYLE}>total pages</label>
          <input
            id="tb-pages"
            type="number"
            value={totalPages}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="e.g. 512"
            min={1}
            max={9999}
            style={INPUT_STYLE}
          />
        </div>
        <div>
          <label htmlFor="tb-from" style={LABEL_STYLE}>active from</label>
          <input
            id="tb-from"
            type="date"
            value={activeFrom}
            onChange={(e) => setFrom(e.target.value)}
            style={INPUT_STYLE}
          />
        </div>
      </div>

      {/* Inline error — §8.4: --red italic, no box, no icon */}
      {error && (
        <p
          style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--red)', margin: 0 }}
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Submit — primary button (§4.2), disabled state changes properties not opacity */}
      <button
        type="submit"
        disabled={disabled}
        style={{
          background: disabled ? 'transparent' : 'var(--ink)',
          color: disabled ? 'var(--ink4)' : 'var(--text-inverse)',
          border: disabled ? '1px solid var(--line)' : 'none',
          borderRadius: 99,
          padding: '8px 20px',
          fontSize: 13,
          fontStyle: 'italic',
          fontFamily: "'Newsreader', serif",
          cursor: disabled ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
          minHeight: 44,
        }}
        aria-label="Register textbook"
      >
        {submitting ? 'registering…' : 'register book'}
      </button>
    </form>
  );
}
