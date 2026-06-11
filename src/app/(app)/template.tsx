'use client';

// Page transition shell — v1.1 Phase 5 (ADR-014).
// template.tsx remounts on every route change, so a single entrance
// animation gives app-wide page transitions without AnimatePresence.

import { motion, useReducedMotion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {children}
    </motion.div>
  );
}
