// ================================================================
// Shared motion presets — v1.1 Phase 5 (ADR-014)
// Two springs only (Apple discipline): gentle for surfaces/pages,
// snappy for controls. Stagger for list/grid entrances.
// All consumers must respect prefers-reduced-motion (globals.css
// collapses CSS transitions; framer-motion honors it via
// useReducedMotion where wired).
// ================================================================

import type { Transition, Variants } from 'framer-motion';

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 34,
  mass: 0.7,
};

/** Page-level entrance: rise 8px + fade, gentle spring. */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: springGentle },
};

/** Parent container that staggers card children 40ms apart. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

/** Card entrance inside a stagger container. */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: springGentle },
};

/** Hover/press for interactive cards & buttons. */
export const liftHover = { y: -2, boxShadow: 'var(--shadow-2)' };
export const pressScale = { scale: 0.97 }; // ADR-015 motion policy

/** Expand/collapse for accordion content (replaces max-height hacks). */
export const expandVariants: Variants = {
  collapsed: { height: 0, opacity: 0, transition: springGentle },
  expanded: { height: 'auto', opacity: 1, transition: springGentle },
};

/** One-shot pop when a checkbox is ticked (task done, goal item). */
export const checkPop = {
  scale: [1, 1.18, 1],
  transition: { duration: 0.25, ease: 'easeOut' as const },
};
