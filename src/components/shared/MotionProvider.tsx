'use client';
// MotionProvider — ADR-015 §3. App-wide reduced-motion handling for all
// framer-motion consumers ((app)/layout.tsx is a server component, so the
// MotionConfig lives in this thin client wrapper). CSS animations are
// covered separately by the prefers-reduced-motion block in globals.css.

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
