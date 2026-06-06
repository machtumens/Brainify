// goalTracker.ts — P15 US-013
// Business logic: amber flag, Spivak unlock, progress recalculation.
// Pure functions — no DB access. All DB queries happen in /api/goals.

import type { GoalRow, SessionRow, MonthEntry } from '@/types/database';

// Subjects that trigger the ML amber check (case-insensitive match)
const ML_SUBJECTS = ['machine learning', 'ml', 'mitchell'];

export function isMLSubject(subject: string | null): boolean {
  if (!subject) return false;
  const lower = subject.toLowerCase();
  return ML_SUBJECTS.some((s) => lower.includes(s));
}

// Returns days since last ML session, or Infinity if none ever logged
export function daysSinceLastMLSession(sessions: Pick<SessionRow, 'subject' | 'started_at'>[]): number {
  const mlSessions = sessions.filter((s) => isMLSubject(s.subject));
  if (mlSessions.length === 0) return Infinity;

  const latest = mlSessions.reduce((best, s) =>
    new Date(s.started_at) > new Date(best.started_at) ? s : best
  );

  const ms = Date.now() - new Date(latest.started_at).getTime();
  return ms / (1000 * 60 * 60 * 24);
}

// Amber threshold: 5+ days missed
export const AMBER_THRESHOLD_DAYS = 5;

export function checkAmber(
  sessions: Pick<SessionRow, 'subject' | 'started_at'>[]
): boolean {
  return daysSinceLastMLSession(sessions) >= AMBER_THRESHOLD_DAYS;
}

// Pure Maths M3 complete: find goal titled Pure Maths, check month 3 all weeks done
// Uses roadmap.unlock_month if set on Spivak, otherwise defaults to month 3.
export function isPureMathsM3Complete(goals: GoalRow[], unlockMonth: number = 3): boolean {
  const pureGoal = goals.find((g) =>
    g.title.toLowerCase().includes('pure') ||
    g.title.toLowerCase().includes('mathematics') ||
    g.title.toLowerCase().includes('maths')
  );
  if (!pureGoal) return false;

  const months: MonthEntry[] = pureGoal.roadmap?.months ?? [];
  const targetMonth = months.find((m) => m.month === unlockMonth);
  if (!targetMonth) return false;

  const weeks = targetMonth.weeks ?? [];
  return weeks.length > 0 && weeks.every((w) => w.status === 'done');
}

// Find the Spivak goal (locked, unlock_condition set)
export function findSpivakGoal(goals: GoalRow[]): GoalRow | null {
  return goals.find(
    (g) =>
      g.status === 'locked' &&
      (g.title.toLowerCase().includes('spivak') ||
        (g.roadmap?.unlock_condition?.toLowerCase().includes('pure') ?? false))
  ) ?? null;
}

// Compute what updates are needed for all goals:
// Returns array of { id, updates } objects to apply to DB
export interface GoalUpdate {
  id: string;
  status?: 'active' | 'done' | 'locked';
  roadmap?: GoalRow['roadmap'];
}

export function buildGoalUpdates(
  goals: GoalRow[],
  sessions: Pick<SessionRow, 'subject' | 'started_at'>[]
): GoalUpdate[] {
  const updates: GoalUpdate[] = [];
  const amber = checkAmber(sessions);

  for (const goal of goals) {
    const isML =
      goal.title.toLowerCase().includes('mitchell') ||
      goal.title.toLowerCase().includes('machine learning');

    if (isML && goal.status !== 'locked') {
      const currentAmber = Boolean(goal.roadmap?.amber_trigger);
      if (amber !== currentAmber) {
        updates.push({
          id: goal.id,
          roadmap: {
            ...goal.roadmap,
            amber_trigger: amber ? '5 days missed' : undefined,
          },
        });
      }
    }
  }

  // Check Spivak unlock
  const spivak = findSpivakGoal(goals);
  if (spivak) {
    const unlockMonth = spivak.roadmap?.unlock_month ?? 3;
    if (isPureMathsM3Complete(goals, unlockMonth)) {
      updates.push({ id: spivak.id, status: 'active' });
    }
  }

  return updates;
}
