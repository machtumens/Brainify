// Velocity computation — P13 Exam Countdown
// Sprint 3 | WBS 2.8 | US-010
//
// Velocity = total pages logged in the last 7 days ÷ 7.
// Returns whole number rounded to nearest integer.

export function computeVelocity(sessions: { pages_done: number }[]): number {
  if (sessions.length === 0) return 0;
  const totalPages = sessions.reduce((sum, s) => sum + (s.pages_done ?? 0), 0);
  return Math.round(totalPages / 7);
}
