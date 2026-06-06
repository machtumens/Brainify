export type TimerPhase = 'focus' | 'break';
export type TimerMode = 'standard' | 'struggle' | 'flow';

export interface PomodoroState {
  phase: TimerPhase;
  timeRemaining: number; // seconds
  totalTime: number;     // seconds
  isRunning: boolean;
  sessionCount: number;  // completed focus sessions
  mode: TimerMode;
}
