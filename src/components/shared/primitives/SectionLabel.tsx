// SectionLabel primitive — ADR-015 §6. Replaces the 10px uppercase
// micro-label duplicated across 16 files. Polymorphic `as` restores
// heading hierarchy without changing the visual (a11y fix, ADR-015 §4:
// --text-faint allowed for section labels ≥10px uppercase tracked).

import type { CSSProperties, ReactNode } from 'react';

interface SectionLabelProps {
  as?: 'h1' | 'h2' | 'h3' | 'p';
  style?: CSSProperties;
  'data-testid'?: string;
  children: ReactNode;
}

export default function SectionLabel({
  as: Tag = 'p',
  style,
  'data-testid': testId,
  children,
}: SectionLabelProps) {
  return (
    <Tag
      data-testid={testId}
      style={{
        margin: '0 0 12px',
        fontSize: 'var(--fs-micro)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-label)',
        color: 'var(--text-faint)',
        fontFamily: 'Newsreader, serif',
        fontWeight: 400,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
