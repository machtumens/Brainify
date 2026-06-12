// Pill primitive — ADR-015 §6. Semantic-tinted badge (confusion map topics,
// behind-pace badge, lock indicator). Tints from the semantic alias layer.

import type { CSSProperties, ReactNode } from 'react';

interface PillProps {
  tone?: 'neutral' | 'warn' | 'danger';
  style?: CSSProperties;
  'data-testid'?: string;
  title?: string;
  children: ReactNode;
}

const TONE_BG: Record<NonNullable<PillProps['tone']>, string> = {
  neutral: 'var(--surface-pressed)',
  warn: 'var(--state-warn-surface)',
  danger: 'var(--state-danger-surface)',
};

const TONE_FG: Record<NonNullable<PillProps['tone']>, string> = {
  neutral: 'var(--text-secondary)',
  warn: 'var(--state-warn)',
  danger: 'var(--state-danger)',
};

export default function Pill({
  tone = 'neutral',
  style,
  'data-testid': testId,
  title,
  children,
}: PillProps) {
  return (
    <span
      data-testid={testId}
      title={title}
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 'var(--r-pill)',
        background: TONE_BG[tone],
        color: TONE_FG[tone],
        fontSize: 'var(--fs-caption)',
        fontStyle: 'italic',
        fontFamily: 'Newsreader, serif',
        lineHeight: 'var(--lh-body)',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
