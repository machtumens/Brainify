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
