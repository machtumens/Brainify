'use client';

// SourceWeb — US-017 | Sprint 5 | WBS 6.4 | P21
// Source web by topic: topic → list of textbooks that cover it.
// Quality: strong (--ink2) | partial (--amber) | missing (--red)
// v1: flat list, no visual graph — ROADMAP §15 v2.1 defers drag-drop UI.

import type { SourceRow, TextbookRow } from '@/types/database';

interface Props {
  sources: SourceRow[];
  books: TextbookRow[];
}

function qualityColor(quality: string): string {
  if (quality === 'strong') return 'var(--ink2)';
  if (quality === 'partial') return 'var(--amber)';
  return 'var(--red)';
}

export default function SourceWeb({ sources, books }: Props) {
  const bookById = Object.fromEntries(books.map((b) => [b.id, b]));

  // Group textbook sources by topic
  const byTopic: Record<string, Array<{ book: TextbookRow; quality: string }>> = {};

  for (const src of sources) {
    if (src.resource_type !== 'textbook') continue;
    const book = bookById[src.resource_id];
    if (!book || !src.topic) continue;
    if (!byTopic[src.topic]) byTopic[src.topic] = [];
    byTopic[src.topic].push({ book, quality: src.quality ?? 'missing' });
  }

  const topics = Object.keys(byTopic).sort();

  if (topics.length === 0) {
    return (
      <p
        style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink3)', margin: 0 }}
        data-testid="source-web-empty"
      >
        Source web builds automatically after registering a book.
      </p>
    );
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      aria-label="Source web by topic"
    >
      {topics.map((topic) => (
        <div key={topic}>
          {/* Topic header — 10px uppercase --ink4, §2.2 section headers */}
          <p
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--ink4)',
              margin: '0 0 6px 0',
            }}
          >
            {topic}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {byTopic[topic].map(({ book, quality }) => (
              <div
                key={book.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: 'var(--ink2)',
                }}
              >
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {book.title}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontStyle: 'italic',
                    color: qualityColor(quality),
                    marginLeft: 8,
                    flexShrink: 0,
                  }}
                  aria-label={`${quality} coverage`}
                >
                  {quality}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
