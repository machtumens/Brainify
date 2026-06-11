/**
 * Unit tests: SR scheduler ladder + difficulty dial
 * Run: npm run test:unit
 */

import {
  SR_INTERVALS_DAYS,
  nextInterval,
  dueDate,
  initialDue,
  isPreSleepWindow,
} from '@/lib/sr/scheduler';
import { suggestDifficulty } from '@/utils/difficultyDefaults';

describe('SR scheduler', () => {
  it('ladder is 1/3/7/21', () => {
    expect([...SR_INTERVALS_DAYS]).toEqual([1, 3, 7, 21]);
  });

  it('pass advances one rung, capped at the top', () => {
    expect(nextInterval(0, 'pass')).toBe(1);
    expect(nextInterval(2, 'pass')).toBe(3);
    expect(nextInterval(3, 'pass')).toBe(3); // stays at 21d
  });

  it('fail resets to rung 0', () => {
    expect(nextInterval(3, 'fail')).toBe(0);
    expect(nextInterval(0, 'fail')).toBe(0);
  });

  it('dueDate adds the ladder interval', () => {
    const from = new Date('2026-06-11T00:00:00Z');
    expect(dueDate(0, from).getTime() - from.getTime()).toBe(1 * 86400000);
    expect(dueDate(3, from).getTime() - from.getTime()).toBe(21 * 86400000);
  });

  it('dueDate clamps out-of-range indices', () => {
    const from = new Date('2026-06-11T00:00:00Z');
    expect(dueDate(99, from).getTime() - from.getTime()).toBe(21 * 86400000);
    expect(dueDate(-5, from).getTime() - from.getTime()).toBe(1 * 86400000);
  });

  it('initialDue is tomorrow', () => {
    const from = new Date('2026-06-11T00:00:00Z');
    expect(initialDue(from).getTime() - from.getTime()).toBe(86400000);
  });

  it('pre-sleep window is 20:00–04:00', () => {
    expect(isPreSleepWindow(new Date('2026-06-11T21:30:00'))).toBe(true);
    expect(isPreSleepWindow(new Date('2026-06-11T03:00:00'))).toBe(true);
    expect(isPreSleepWindow(new Date('2026-06-11T12:00:00'))).toBe(false);
    expect(isPreSleepWindow(new Date('2026-06-11T19:59:00'))).toBe(false);
  });
});

describe('suggestDifficulty (difficulty dial)', () => {
  it('keeps base with insufficient history', () => {
    expect(suggestDifficulty([])).toBe('medium');
    expect(suggestDifficulty([{ score: 5, total: 5 }])).toBe('medium');
  });

  it('bumps up one level above 85% accuracy', () => {
    const aced = [{ score: 5, total: 5 }, { score: 9, total: 10 }];
    expect(suggestDifficulty(aced)).toBe('hard');
    expect(suggestDifficulty(aced, 'easy')).toBe('medium');
    expect(suggestDifficulty(aced, 'hard')).toBe('hard'); // already at top
  });

  it('drops one level below 50% accuracy', () => {
    const rough = [{ score: 1, total: 5 }, { score: 2, total: 5 }];
    expect(suggestDifficulty(rough)).toBe('easy');
    expect(suggestDifficulty(rough, 'easy')).toBe('easy'); // already at bottom
  });

  it('holds steady in the middle band', () => {
    const mid = [{ score: 3, total: 5 }, { score: 4, total: 5 }];
    expect(suggestDifficulty(mid)).toBe('medium');
  });
});
