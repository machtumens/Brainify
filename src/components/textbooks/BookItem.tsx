'use client';

// BookItem — US-017 | Sprint 5 | WBS 6.1 | P21
// Single textbook row: 2px spine accent, 1px progress bar, inline page edit.
// ui-ux-principles.md §4.4 (progress bars) §8.2 (page update: 300ms transition)

import { useState } from 'react';
import { SUBJECT_COLORS, DEFAULT_ACCENT } from '@/utils/subjectColors';
import type { TextbookRow } from '@/types/database';

interface Props {
  book: TextbookRow;
  onPageUpdate: (id: string, page: number) => void;
}

export default function BookItem({ book, onPageUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const { title, author, subject, current_page, total_pages } = book;
  const pages = total_pages ?? 0;
  const pct = pages > 0 ? Math.round((current_page / pages) * 100) : 0;
  const accent = SUBJECT_COLORS[(subject ?? '').toLowerCase()] ?? DEFAULT_ACCENT;

  function startEdit() {
    setInputVal(String(current_page));
    setEditing(true);
  }

  function commitEdit() {
    const val = parseInt(inputVal, 10);
    if (!isNaN(val) && val >= 0) {
      onPageUpdate(book.id, val);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(false);
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'stretch', gap: 10, padding: '10px 0' }}
      data-testid="book-item"
    >
      {/* 2px spine accent — the only per-subject color in the UI */}
      <div
        style={{ width: 2, borderRadius: 1, background: accent, flexShrink: 0 }}
        aria-hidden="true"
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--ink)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: 2,
          }}
        >
          {title}
        </div>

        {/* Author */}
        {author && (
          <div
            style={{
              fontSize: 12,
              fontStyle: 'italic',
              color: 'var(--ink3)',
              marginBottom: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {author}
          </div>
        )}

        {/* Percentage label — above bar, right-aligned */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontStyle: 'italic', color: 'var(--ink4)' }}>
            {pct}%
          </span>
        </div>

        {/* 1px progress bar — §4.4 */}
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} progress`}
          style={{ height: 1, background: 'var(--line2)', borderRadius: 1 }}
        >
          <div
            style={{
              height: 1,
              width: `${pct}%`,
              background: 'var(--ink)',
              borderRadius: 1,
              transition: 'width 300ms ease',
            }}
          />
        </div>

        {/* Page count — tap to edit inline */}
        <div style={{ marginTop: 4 }}>
          {editing ? (
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              min={0}
              max={pages || undefined}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              style={{
                fontSize: 10,
                fontFamily: "'Newsreader', serif",
                color: 'var(--ink)',
                background: 'transparent',
                border: '1px solid var(--line2)',
                borderRadius: 4,
                padding: '1px 4px',
                width: 60,
                outline: 'none',
              }}
              aria-label={`Set current page for ${title}`}
            />
          ) : (
            <button
              onClick={startEdit}
              style={{
                fontSize: 10,
                fontStyle: 'italic',
                color: 'var(--ink4)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: "'Newsreader', serif",
                minHeight: 20,
              }}
              aria-label={`Update page for ${title}, currently page ${current_page} of ${pages}`}
            >
              p.{current_page} / {pages}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
