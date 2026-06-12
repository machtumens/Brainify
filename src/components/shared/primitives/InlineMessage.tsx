// InlineMessage primitive — ADR-015 §6. The italic status/error line
// repeated in every data component. Contrast policy (ADR-015 §4):
// muted = --text-secondary (load-bearing copy never drops below ink2);
// error = --state-danger.

import type { CSSProperties, ReactNode } from 'react';

interface InlineMessageProps {
  tone?: 'muted' | 'error';
  role?: 'alert' | 'status';
  style?: CSSProperties;
  children: ReactNode;
}

export default function InlineMessage({ tone = 'muted', role, style, children }: InlineMessageProps) {
  return (
    <p
      role={role}
      style={{
        margin: 0,
        fontSize: 'var(--fs-body-s)',
        fontStyle: 'italic',
        fontFamily: 'Newsreader, serif',
        color: tone === 'error' ? 'var(--state-danger)' : 'var(--text-secondary)',
        ...style,
      }}
    >
      {children}
    </p>
  );
}
