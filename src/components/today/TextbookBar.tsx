'use client';

// TextbookBar — US-006 · ui-ux-principles.md §4.4
// 1px progress bar (deliberate precision), 2px subject accent (only per-subject color).
import Link from 'next/link';
import type { TextbookRow } from '@/types/database';
import { SUBJECT_COLORS, DEFAULT_ACCENT } from '@/utils/subjectColors';

interface Props {
  textbook: TextbookRow;
}

export default function TextbookBar({ textbook }: Props) {
  const { title, subject, current_page, total_pages } = textbook;
  const pages = total_pages ?? 0;
  const pct = pages > 0 ? Math.round((current_page / pages) * 100) : 0;
  const accent = SUBJECT_COLORS[(subject ?? '').toLowerCase()] ?? DEFAULT_ACCENT;

  return (
    <Link
      href="/textbooks"
      style={{ display: 'flex', alignItems: 'stretch', gap: 10, textDecoration: 'none', padding: '8px 0', minHeight: 44 }}
      aria-label={`${title} — ${pct}% complete, page ${current_page} of ${pages}`}
    >
      {/* 2px subject accent — only per-subject color in the UI */}
      <div style={{ width: 2, borderRadius: 1, background: accent, flexShrink: 0 }} aria-hidden="true" />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title + percentage (above bar) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
          <span style={{ fontSize: 10, fontStyle: 'italic', color: 'var(--ink4)', flexShrink: 0, marginLeft: 8 }}>
            {pct}%
          </span>
        </div>

        {/* 1px progress bar — height 1px, track --line2, fill --ink */}
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ height: 1, background: 'var(--line2)', borderRadius: 1 }}
        >
          <div style={{ height: 1, width: `${pct}%`, background: 'var(--ink)', borderRadius: 1, transition: 'width var(--t-progress)' }} />
        </div>

        {/* Page count */}
        <div style={{ fontSize: 10, fontStyle: 'italic', color: 'var(--ink4)', marginTop: 3 }}>
          p.{current_page} / {pages}
        </div>
      </div>
    </Link>
  );
}
