'use client';
// PillButton primitive — ADR-015 §6. The italic pill button used for
// "New test", Generate CTA, Pomodoro note, ReplanBanner actions.
// Press feedback: scale 0.97 (ADR-015 motion policy), spring snappy.

import { motion, type HTMLMotionProps } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { pressScale, springSnappy } from '@/lib/motion';

interface PillButtonProps extends Omit<HTMLMotionProps<'button'>, 'style' | 'children'> {
  variant?: 'ghost' | 'primary';
  style?: CSSProperties;
  children: ReactNode;
}

export default function PillButton({
  variant = 'ghost',
  style,
  disabled,
  children,
  ...rest
}: PillButtonProps) {
  const variantStyle: CSSProperties =
    variant === 'primary'
      ? {
          border: 'none',
          background: disabled ? 'var(--surface-pressed)' : 'var(--ink)',
          color: disabled ? 'var(--text-faint)' : 'var(--text-inverse)',
        }
      : {
          border: '1px solid var(--border-strong)',
          background: 'transparent',
          color: disabled ? 'var(--text-faint)' : 'var(--text-primary)',
        };

  return (
    <motion.button
      whileTap={disabled ? undefined : pressScale}
      transition={springSnappy}
      disabled={disabled}
      style={{
        padding: '10px 24px',
        borderRadius: 'var(--r-pill)',
        fontFamily: 'Newsreader, serif',
        fontSize: 'var(--fs-body-s)',
        fontStyle: 'italic',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--t-fast), color var(--t-fast)',
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
