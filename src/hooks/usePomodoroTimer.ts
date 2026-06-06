'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerPhase, TimerMode } from '@/types/timer';

const FOCUS = 25 * 60; // 1500s
const BREAK = 5 * 60;  // 300s

async function postSession(
  taskTitle: string | null,
  subject: string | null,
  mode: TimerMode,
): Promise<void> {
  try {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_title: taskTitle,
        subject,
        pomodoros: 1,
        difficulty: 1,
        mode,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch {
    // Retry once silently, then log
    try {
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_title: taskTitle, subject, pomodoros: 1, difficulty: 1, mode }),
      });
    } catch {
      // session POST failure is non-blocking — timer continues
    }
  }
}

export interface UsePomodoroTimerReturn {
  phase: TimerPhase;
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  sessionCount: number;
  mode: TimerMode;
  setMode: (m: TimerMode) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function usePomodoroTimer(
  taskTitle?: string,
  subject?: string,
): UsePomodoroTimerReturn {
  const [phase, setPhase] = useState<TimerPhase>('focus');
  const [timeRemaining, setTimeRemaining] = useState(FOCUS);
  const [totalTime, setTotalTime] = useState(FOCUS);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [mode, setMode] = useState<TimerMode>('standard');

  // Refs for stale-closure-free access in completion handler
  const phaseRef = useRef(phase);
  const sessionCountRef = useRef(sessionCount);
  const modeRef = useRef(mode);
  const taskTitleRef = useRef(taskTitle ?? null);
  const subjectRef = useRef(subject ?? null);
  // Guard against double-fire (React Strict Mode / rapid state updates)
  const completedRef = useRef(false);

  phaseRef.current = phase;
  sessionCountRef.current = sessionCount;
  modeRef.current = mode;
  taskTitleRef.current = taskTitle ?? null;
  subjectRef.current = subject ?? null;

  // Timer tick — 1s interval while running
  useEffect(() => {
    if (!isRunning) {
      completedRef.current = false;
      return;
    }
    const id = setInterval(() => {
      setTimeRemaining(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Phase completion — fires when timeRemaining hits 0 while running
  useEffect(() => {
    if (timeRemaining > 0 || !isRunning || completedRef.current) return;
    completedRef.current = true;

    if (phaseRef.current === 'focus') {
      const newCount = sessionCountRef.current + 1;
      setSessionCount(newCount);
      postSession(taskTitleRef.current, subjectRef.current, modeRef.current);
      setPhase('break');
      setTimeRemaining(BREAK);
      setTotalTime(BREAK);
    } else {
      // Break ends — return to focus, pause for user to restart
      setPhase('focus');
      setTimeRemaining(FOCUS);
      setTotalTime(FOCUS);
      setIsRunning(false);
    }
  }, [timeRemaining, isRunning]);

  const start = useCallback(() => {
    completedRef.current = false;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhase('focus');
    setTimeRemaining(FOCUS);
    setTotalTime(FOCUS);
    completedRef.current = false;
  }, []);

  return {
    phase,
    timeRemaining,
    totalTime,
    isRunning,
    sessionCount,
    mode,
    setMode,
    start,
    pause,
    reset,
  };
}
