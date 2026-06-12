// StatNumber primitive — ADR-015 §6. 22px light tabular numeral + 10px label.
// Used for goal stats, exam countdown, test scores.

import type { CSSProperties } from 'react';

interface StatNumberProps {
  value: string | number;
  label: string;
  tone?: 'default' | 'warn';
  style?: CSSProperties;
}

export default function StatNumber({ value, label, tone = 'default', style }: StatNumberProps) {
  return (
    <div style={style}>
      <p
        style={{
          margin: 0,
          fontSize: 'var(--fs-stat)',
          fontWeight: 300,
          letterSpacing: 'var(--ls-stat)',
          fontVariantNumeric: 'tabular-nums',
          color: tone === 'warn' ? 'var(--state-warn)' : 'var(--text-primary)',
          fontFamily: 'Newsreader, serif',
          lineHeight: 'var(--lh-tight)',
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: '4px 0 0',
          fontSize: 'var(--fs-micro)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--ls-label)',
          color: 'var(--text-faint)',
          fontFamily: 'Newsreader, serif',
        }}
      >
        {label}
      </p>
    </div>
  );
}
