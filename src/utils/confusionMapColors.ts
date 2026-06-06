// Confusion map quadrant colors — from ui-ux-principles.md §4.8 and ROADMAP US-009.
// Hex literals allowed here (single source of truth). No other file may hardcode these.
// Pattern: same as subjectColors.ts (allowed exception per §4.4).

export const QUADRANT_BG: Record<string, string> = {
  safe:     'var(--cream2)',
  danger:   '#FDF0EF',
  watch:    '#FDF8EF',
  upcoming: 'var(--cream2)',
};

export const PILL_BG: Record<string, string> = {
  safe:     'var(--cream3)',
  danger:   '#F5D9D7',
  watch:    '#F5E8D0',
  upcoming: 'var(--cream3)',
};
