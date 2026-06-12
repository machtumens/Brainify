'use client';
// Card primitive — ADR-015 §6. Replaces the inline card spec duplicated
// across 19 files. Spec unchanged: 1px var(--border-default), 11px radius,
// var(--shadow-1), 14px 16px padding, var(--surface-page) bg.
// `interactive` cards lift to shadow-2 on hover (ADR-015 elevation policy).

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { liftHover } from '@/lib/motion';

interface CardProps {
  elevation?: 1 | 2 | 3;
  interactive?: boolean;
  padding?: 'default' | 'none';
  style?: CSSProperties;
  className?: string;
  'data-testid'?: string;
  children: ReactNode;
}

export default function Card({
  elevation = 1,
  interactive = false,
  padding = 'default',
  style,
  className,
  'data-testid': testId,
  children,
}: CardProps) {
  const base: CSSProperties = {
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--r-card)',
    boxShadow: `var(--shadow-${elevation})`,
    background: 'var(--surface-page)',
    padding: padding === 'default' ? '14px 16px' : 0,
    ...style,
  };

  if (interactive) {
    return (
      <motion.div
        whileHover={liftHover}
        data-testid={testId}
        className={className}
        style={base}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div data-testid={testId} className={className} style={base}>
      {children}
    </div>
  );
}
