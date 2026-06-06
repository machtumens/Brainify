'use client';
// Countdown timer hook for Test Simulator — Sprint 5 | US-015 | P20
// Reuses usePomodoroTimer pattern. Single countdown, configurable duration.

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseTestTimerReturn {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  isExpired: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  elapsed: () => number;
}

export function useTestTimer(durationSeconds = 20 * 60): UseTestTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [isRunning, setIsRunning]         = useState(false);
  const [isExpired, setIsExpired]         = useState(false);

  // Guard against double-fire (React Strict Mode)
  const expiredRef = useRef(false);

  // Timer tick — 1s interval, same as usePomodoroTimer
  useEffect(() => {
    if (!isRunning) {
      expiredRef.current = false;
      return;
    }
    const id = setInterval(() => {
      setTimeRemaining((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Expire when timeRemaining hits 0 while running
  useEffect(() => {
    if (timeRemaining > 0 || !isRunning || expiredRef.current) return;
    expiredRef.current = true;
    setIsRunning(false);
    setIsExpired(true);
  }, [timeRemaining, isRunning]);

  const start = useCallback(() => {
    expiredRef.current = false;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsExpired(false);
    setTimeRemaining(durationSeconds);
    expiredRef.current = false;
  }, [durationSeconds]);

  // Returns seconds elapsed since start (not including paused time exactly,
  // but close enough for test duration tracking)
  const elapsed = useCallback(
    () => durationSeconds - timeRemaining,
    [durationSeconds, timeRemaining]
  );

  return { timeRemaining, totalTime: durationSeconds, isRunning, isExpired, start, pause, reset, elapsed };
}
