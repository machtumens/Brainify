// ================================================================
// Spaced-repetition scheduler — v1.1 Phase 3 (suggestion #1)
//
// Ladder: 1 → 3 → 7 → 21 days. Pass advances one rung (caps at 21d,
// which then repeats). Fail resets to rung 0 (review again tomorrow).
// Pure functions — DB wiring lives in /api/review.
// ================================================================

export const SR_INTERVALS_DAYS = [1, 3, 7, 21] as const;

export type ReviewResult = 'pass' | 'fail';

export function nextInterval(currentIdx: number, result: ReviewResult): number {
  if (result === 'fail') return 0;
  return Math.min(currentIdx + 1, SR_INTERVALS_DAYS.length - 1);
}

export function dueDate(intervalIdx: number, from: Date = new Date()): Date {
  const clamped = Math.max(0, Math.min(intervalIdx, SR_INTERVALS_DAYS.length - 1));
  const d = new Date(from);
  d.setDate(d.getDate() + SR_INTERVALS_DAYS[clamped]);
  return d;
}

/** First review of a new item is due tomorrow (rung 0). */
export function initialDue(from: Date = new Date()): Date {
  return dueDate(0, from);
}

/** Evening pre-sleep window: 20:00–04:00 local (suggestion #8). */
export function isPreSleepWindow(now: Date = new Date()): boolean {
  const h = now.getHours();
  return h >= 20 || h < 4;
}
