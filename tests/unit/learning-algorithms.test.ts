/**
 * Unit tests for the learning-engine algorithms:
 *   computeConfusionMap — quadrant classification
 *   computeVelocity     — pages/day over trailing 7 days
 *   goalTracker         — amber flag, Spivak unlock, goal updates
 * Run: npm run test:unit
 */

import { computeConfusionMap } from '@/utils/computeConfusionMap';
import { computeVelocity } from '@/utils/computeVelocity';
import {
  isMLSubject,
  daysSinceLastMLSession,
  checkAmber,
  isPureMathsM3Complete,
  findSpivakGoal,
  buildGoalUpdates,
  AMBER_THRESHOLD_DAYS,
} from '@/lib/goalTracker';
import type { GoalRow } from '@/types/database';

// ── helpers ──────────────────────────────────────────────────────

function makeGoal(overrides: Partial<GoalRow>): GoalRow {
  return {
    id: 'g1',
    user_id: 'u1',
    title: 'Goal',
    category: null,
    status: 'active',
    total_months: 6,
    current_month: 1,
    started_at: '2026-01-01',
    roadmap: null,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  } as GoalRow;
}

function daysAgoISO(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

// ── computeConfusionMap ──────────────────────────────────────────

describe('computeConfusionMap', () => {
  it('classifies covered topic with zero errors as safe', () => {
    const map = computeConfusionMap([{ subject: 'Vectors' }], []);
    expect(map.safe).toEqual(['vectors']);
    expect(map.danger).toEqual([]);
  });

  it('classifies any topic with 2+ errors as danger, covered or not', () => {
    const map = computeConfusionMap(
      [{ subject: 'Integration' }],
      [{ topic: 'Integration', count: 2 }, { topic: 'Series', count: 3 }],
    );
    expect(map.danger.sort()).toEqual(['integration', 'series']);
  });

  it('classifies covered topic with exactly 1 error as watch', () => {
    const map = computeConfusionMap([{ subject: 'Limits' }], [{ topic: 'Limits' }]);
    expect(map.watch).toEqual(['limits']);
  });

  it('classifies uncovered topic with 1 error as watch', () => {
    const map = computeConfusionMap([], [{ topic: 'Trig' }]);
    expect(map.watch).toEqual(['trig']);
  });

  it('puts textbook subjects never seen in sessions or errors into upcoming', () => {
    const map = computeConfusionMap([{ subject: 'Vectors' }], [], ['Vectors', 'Mechanics']);
    expect(map.upcoming).toEqual(['mechanics']);
  });

  it('normalises case and whitespace so duplicates merge', () => {
    const map = computeConfusionMap(
      [{ subject: '  Vectors ' }, { subject: 'vectors' }],
      [{ topic: 'VECTORS' }],
    );
    expect(map.watch).toEqual(['vectors']);
    expect(map.safe).toEqual([]);
  });

  it('error counts accumulate across records for the same topic', () => {
    const map = computeConfusionMap([], [{ topic: 'Series' }, { topic: 'series' }]);
    expect(map.danger).toEqual(['series']); // 1 + 1 = 2 → danger
  });

  it('handles empty inputs', () => {
    const map = computeConfusionMap([], []);
    expect(map).toEqual({ safe: [], danger: [], watch: [], upcoming: [] });
  });

  it('ignores null subjects and topics', () => {
    const map = computeConfusionMap([{ subject: null }], [{ topic: null }]);
    expect(map).toEqual({ safe: [], danger: [], watch: [], upcoming: [] });
  });
});

// ── computeVelocity ──────────────────────────────────────────────

describe('computeVelocity', () => {
  it('returns 0 for no sessions', () => {
    expect(computeVelocity([])).toBe(0);
  });

  it('divides total pages by 7 and rounds', () => {
    expect(computeVelocity([{ pages_done: 14 }, { pages_done: 7 }])).toBe(3);
  });

  it('treats null pages_done as 0', () => {
    expect(computeVelocity([{ pages_done: null }, { pages_done: 7 }])).toBe(1);
  });

  it('rounds to nearest integer', () => {
    expect(computeVelocity([{ pages_done: 10 }])).toBe(1); // 10/7 = 1.43
    expect(computeVelocity([{ pages_done: 12 }])).toBe(2); // 12/7 = 1.71
  });
});

// ── goalTracker ──────────────────────────────────────────────────

describe('isMLSubject', () => {
  it('matches ML subject variants case-insensitively', () => {
    expect(isMLSubject('Machine Learning')).toBe(true);
    expect(isMLSubject('ML — decision trees')).toBe(true);
    expect(isMLSubject('Mitchell ch.3')).toBe(true);
    expect(isMLSubject('Pure Maths')).toBe(false);
    expect(isMLSubject(null)).toBe(false);
  });
});

describe('daysSinceLastMLSession / checkAmber', () => {
  it('returns Infinity (amber) when no ML session ever logged', () => {
    expect(daysSinceLastMLSession([])).toBe(Infinity);
    expect(checkAmber([])).toBe(true);
  });

  it('is amber at exactly the threshold', () => {
    const sessions = [{ subject: 'ML', started_at: daysAgoISO(AMBER_THRESHOLD_DAYS) }];
    expect(checkAmber(sessions)).toBe(true);
  });

  it('is not amber when an ML session is recent', () => {
    const sessions = [
      { subject: 'ML', started_at: daysAgoISO(1) },
      { subject: 'ML', started_at: daysAgoISO(10) },
    ];
    expect(checkAmber(sessions)).toBe(false);
  });

  it('non-ML sessions do not reset the amber clock', () => {
    const sessions = [{ subject: 'Physics', started_at: daysAgoISO(0) }];
    expect(checkAmber(sessions)).toBe(true);
  });
});

describe('isPureMathsM3Complete', () => {
  const doneWeeks = [{ week: 1, status: 'done' }, { week: 2, status: 'done' }];
  const mixedWeeks = [{ week: 1, status: 'done' }, { week: 2, status: 'active' }];

  it('true when all weeks of the unlock month are done', () => {
    const goals = [makeGoal({
      title: 'A Level Pure Mathematics',
      roadmap: { months: [{ month: 3, weeks: doneWeeks }] } as GoalRow['roadmap'],
    })];
    expect(isPureMathsM3Complete(goals)).toBe(true);
  });

  it('false when any week is not done', () => {
    const goals = [makeGoal({
      title: 'Pure Maths',
      roadmap: { months: [{ month: 3, weeks: mixedWeeks }] } as GoalRow['roadmap'],
    })];
    expect(isPureMathsM3Complete(goals)).toBe(false);
  });

  it('false when month missing or no pure maths goal', () => {
    expect(isPureMathsM3Complete([makeGoal({ title: 'Pure Maths', roadmap: { months: [] } as unknown as GoalRow['roadmap'] })])).toBe(false);
    expect(isPureMathsM3Complete([makeGoal({ title: 'Physics' })])).toBe(false);
  });

  it('respects a custom unlock month', () => {
    const goals = [makeGoal({
      title: 'Pure Maths',
      roadmap: { months: [{ month: 4, weeks: doneWeeks }] } as GoalRow['roadmap'],
    })];
    expect(isPureMathsM3Complete(goals, 4)).toBe(true);
    expect(isPureMathsM3Complete(goals, 3)).toBe(false);
  });
});

describe('buildGoalUpdates', () => {
  it('flags ML goal amber when 5+ days missed', () => {
    const ml = makeGoal({ id: 'ml', title: 'Machine Learning — Mitchell' });
    const updates = buildGoalUpdates([ml], []);
    expect(updates).toHaveLength(1);
    expect(updates[0].id).toBe('ml');
    expect((updates[0].roadmap as { amber_trigger?: string })?.amber_trigger).toBe('5 days missed');
  });

  it('clears amber when ML session is recent and flag was set', () => {
    const ml = makeGoal({
      id: 'ml',
      title: 'Machine Learning — Mitchell',
      roadmap: { amber_trigger: '5 days missed' } as GoalRow['roadmap'],
    });
    const updates = buildGoalUpdates([ml], [{ subject: 'ML', started_at: daysAgoISO(1) }]);
    expect(updates).toHaveLength(1);
    expect((updates[0].roadmap as { amber_trigger?: string })?.amber_trigger).toBeUndefined();
  });

  it('emits no update when amber state unchanged', () => {
    const ml = makeGoal({ id: 'ml', title: 'Machine Learning — Mitchell' });
    const updates = buildGoalUpdates([ml], [{ subject: 'ML', started_at: daysAgoISO(1) }]);
    expect(updates).toHaveLength(0);
  });

  it('unlocks Spivak when Pure Maths M3 complete', () => {
    const pure = makeGoal({
      id: 'pure',
      title: 'Pure Maths',
      roadmap: {
        months: [{ month: 3, weeks: [{ week: 1, status: 'done' }] }],
      } as GoalRow['roadmap'],
    });
    const spivak = makeGoal({ id: 'spivak', title: 'Calculus — Spivak', status: 'locked' });
    const updates = buildGoalUpdates([pure, spivak], [{ subject: 'ML', started_at: daysAgoISO(1) }]);
    expect(updates).toContainEqual({ id: 'spivak', status: 'active' });
  });

  it('keeps Spivak locked while M3 incomplete', () => {
    const pure = makeGoal({
      id: 'pure',
      title: 'Pure Maths',
      roadmap: {
        months: [{ month: 3, weeks: [{ week: 1, status: 'active' }] }],
      } as GoalRow['roadmap'],
    });
    const spivak = makeGoal({ id: 'spivak', title: 'Calculus — Spivak', status: 'locked' });
    const updates = buildGoalUpdates([pure, spivak], [{ subject: 'ML', started_at: daysAgoISO(1) }]);
    expect(updates.find((u) => u.id === 'spivak')).toBeUndefined();
  });
});

describe('findSpivakGoal', () => {
  it('finds locked goal by title or unlock_condition', () => {
    const byTitle = makeGoal({ id: 's1', title: 'Calculus — Spivak', status: 'locked' });
    const byCondition = makeGoal({
      id: 's2', title: 'Advanced Calculus', status: 'locked',
      roadmap: { unlock_condition: 'Pure Maths M3 complete' } as GoalRow['roadmap'],
    });
    expect(findSpivakGoal([byTitle])?.id).toBe('s1');
    expect(findSpivakGoal([byCondition])?.id).toBe('s2');
  });

  it('ignores active goals', () => {
    expect(findSpivakGoal([makeGoal({ title: 'Spivak', status: 'active' })])).toBeNull();
  });
});
