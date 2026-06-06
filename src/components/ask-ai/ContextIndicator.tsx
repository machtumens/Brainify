'use client';

import type { ContextCounts } from '@/hooks/useChat';

interface Props {
  counts: ContextCounts | null;
}

export default function ContextIndicator({ counts }: Props) {
  if (!counts) return null;

  const parts = [
    `${counts.goals} goal${counts.goals !== 1 ? 's' : ''}`,
    `${counts.errors} error${counts.errors !== 1 ? 's' : ''}`,
    `${counts.captures} capture${counts.captures !== 1 ? 's' : ''}`,
    `${counts.textbooks} textbook${counts.textbooks !== 1 ? 's' : ''}`,
    `${counts.sessions} session${counts.sessions !== 1 ? 's' : ''}`,
  ];

  return (
    <p
      role="status"
      aria-label="Context loaded"
      style={{
        fontSize: '10px',
        fontStyle: 'italic',
        color: 'var(--ink4)',
        marginBottom: '12px',
        lineHeight: 1.4,
      }}
    >
      Context: {parts.join(' · ')}
    </p>
  );
}
