// Skeleton primitive — ADR-015 §6. Unifies the three skeleton dialects
// (.skeleton class, GoalSkeleton inline, SkeletonLine). Sweep animation
// comes from the global .skeleton class (var(--t-skeleton), no spinner).

import type { CSSProperties } from 'react';

interface SkeletonProps {
  /** Single block height (ignored when `lines` > 1). */
  height?: number | string;
  width?: number | string;
  /** Render N stacked lines with varied widths (100/60/80% cycle). */
  lines?: number;
  style?: CSSProperties;
}

const LINE_WIDTHS = ['100%', '60%', '80%'];

export default function Skeleton({ height = 14, width = '100%', lines = 1, style }: SkeletonProps) {
  if (lines <= 1) {
    return <div className="skeleton" style={{ height, width, ...style }} aria-hidden="true" />;
  }
  return (
    <div aria-hidden="true" style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: 12,
            width: LINE_WIDTHS[i % LINE_WIDTHS.length],
            marginBottom: i < lines - 1 ? 10 : 0,
          }}
        />
      ))}
    </div>
  );
}
