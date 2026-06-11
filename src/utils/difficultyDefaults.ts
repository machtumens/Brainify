// Difficulty configuration for Test Simulator (US-014)
// Default distribution: Easy 30% / Medium 50% / Hard 20% → 'medium' preset

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  easy: number;   // percentage of easy questions
  medium: number; // percentage of medium questions
  hard: number;   // percentage of hard questions
}

export const DIFFICULTY_PRESETS: Record<DifficultyLevel, DifficultyConfig> = {
  easy:   { easy: 60, medium: 30, hard: 10 },
  medium: { easy: 30, medium: 50, hard: 20 }, // default — ROADMAP AC: 30/50/20
  hard:   { easy: 10, medium: 40, hard: 50 },
};

export const DEFAULT_DIFFICULTY: DifficultyLevel = 'medium';

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy:   'Easy',
  medium: 'Medium',
  hard:   'Hard',
};

// ── Difficulty dial (v1.1, suggestion #7) ────────────────────────
// Recent accuracy > 85% means the comfort zone is too comfortable —
// bump the default one level. Below 50%, ease off.

export const DIFFICULTY_BUMP_THRESHOLD = 0.85;
export const DIFFICULTY_DROP_THRESHOLD = 0.5;

export function suggestDifficulty(
  history: { score: number; total: number }[],
  base: DifficultyLevel = DEFAULT_DIFFICULTY
): DifficultyLevel {
  const recent = history.slice(0, 5).filter((h) => h.total > 0);
  if (recent.length < 2) return base; // not enough signal

  const accuracy =
    recent.reduce((s, h) => s + h.score, 0) / recent.reduce((s, h) => s + h.total, 0);

  const ladder: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  const idx = ladder.indexOf(base);
  if (accuracy > DIFFICULTY_BUMP_THRESHOLD) return ladder[Math.min(idx + 1, 2)];
  if (accuracy < DIFFICULTY_DROP_THRESHOLD) return ladder[Math.max(idx - 1, 0)];
  return base;
}
