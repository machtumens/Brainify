// Date utilities — P13 Calendar Strip + Exam Countdown
// Sprint 3 | WBS 2.8 | US-010

export type DotState = 'done' | 'planned' | 'rest';

export interface CalendarDay {
  dateStr: string;
  label: string;
  state: DotState;
  isToday: boolean;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Returns Monday–Sunday of the week containing `today` (local dates).
export function getWeekDays(today: Date): Date[] {
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon … 6=Sat
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offsetToMonday);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Returns day label for index 0–6 (Monday=0 … Sunday=6).
export function getDayLabel(index: number): string {
  return DAY_LABELS[index];
}

// Produces a local YYYY-MM-DD string without timezone conversion.
export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Extracts the date portion of a timestamptz string from Supabase.
// Handles both "2026-06-05T..." (ISO) and "2026-06-05 ..." (PG format).
export function sessionDateStr(startedAt: string): string {
  return startedAt.slice(0, 10);
}

export function getDotState(
  dateStr: string,
  sessionDates: Set<string>,
  todayStr: string
): DotState {
  if (sessionDates.has(dateStr)) return 'done';
  if (dateStr > todayStr) return 'planned';
  return 'rest';
}

// Days from `fromDate` to `targetDate`, always rounded up.
// Negative result means target is in the past.
export function daysUntil(targetDate: Date, fromDate: Date): number {
  const t = new Date(targetDate);
  t.setHours(0, 0, 0, 0);
  const f = new Date(fromDate);
  f.setHours(0, 0, 0, 0);
  return Math.ceil((t.getTime() - f.getTime()) / (1000 * 60 * 60 * 24));
}

// Adds `months` calendar months to `date`.
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}
