// Subject accent colors — the ONLY non-token colors in the UI.
// Used exclusively for the 2px left accent strip in TextbookBar.
// Source: ui-ux-principles.md §4.4 — "only per-subject color in the entire UI"
// DO NOT use these colors anywhere else in the codebase.

export const SUBJECT_COLORS: Record<string, string> = {
  mathematics:          '#6B7FD4',  // soft indigo
  maths:                '#6B7FD4',
  physics:              '#4EA5D9',  // sky blue
  'machine learning':   '#7DAF7D',  // sage green (not --green; that is test-sim only)
  'machine-learning':   '#7DAF7D',
  ml:                   '#7DAF7D',
  calculus:             '#C49A6C',  // warm ochre
};

// Fallback: matches --ink4 (#B8B5B0) so unknown subjects recede visually.
export const DEFAULT_ACCENT = '#B8B5B0';
