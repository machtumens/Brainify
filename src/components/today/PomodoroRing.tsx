'use client';
import { useState } from 'react';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import type { TimerMode } from '@/types/timer';

// 2π × 54 = 339.292
const CIRCUMFERENCE = 339.292;
const MODES: TimerMode[] = ['standard', 'struggle', 'flow'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

interface PomodoroRingProps {
  onStart?: () => void;
}

export default function PomodoroRing({ onStart }: PomodoroRingProps) {
  const {
    phase,
    timeRemaining,
    totalTime,
    isRunning,
    sessionCount,
    mode,
    setMode,
    start,
    pause,
  } = usePomodoroTimer();

  // Offset = 0 → full ring (start of session). Offset = CIRCUMFERENCE → empty (session done).
  const offset = CIRCUMFERENCE * (1 - timeRemaining / totalTime);

  // Struggle note (v1.1): after a focus block completes (break phase),
  // prompt once per session for a 10-second "what was hard" note.
  const [note, setNote] = useState('');
  const [notedSession, setNotedSession] = useState(-1);
  const showNote = phase === 'break' && sessionCount > 0 && notedSession < sessionCount;

  async function submitNote() {
    const text = note.trim();
    setNotedSession(sessionCount);
    setNote('');
    if (!text) return;
    fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `Struggled with: ${text}`, source_type: 'quick_type' }),
    }).catch(() => { /* non-blocking */ });
  }

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 11,
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      background: 'var(--cream)',
    }}>
      {/* SVG Ring */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
          {/* Track */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="var(--line)"
            strokeWidth="2"
          />
          {/* Progress — clockwise from 12 o'clock */}
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* Timer text + phase label — absolutely centred over SVG */}
        <div
          role="timer"
          aria-label={`${phase}: ${formatTime(timeRemaining)} remaining`}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <span style={{
            fontSize: 22,
            fontWeight: 300,
            letterSpacing: '-1px',
            color: 'var(--ink)',
            fontVariantNumeric: 'tabular-nums',
            fontFamily: 'Newsreader, serif',
            lineHeight: 1,
          }}>
            {formatTime(timeRemaining)}
          </span>
          <span style={{
            fontSize: 10,
            fontStyle: 'italic',
            color: 'var(--ink4)',
            fontFamily: 'Newsreader, serif',
            lineHeight: 1,
          }}>
            {phase}
          </span>
        </div>
      </div>

      {/* Session dots — 4 max, 3 states: empty / done / current */}
      <div
        role="group"
        aria-label="Session progress"
        style={{ display: 'flex', gap: 6, alignItems: 'center' }}
      >
        {Array.from({ length: 4 }, (_, i) => {
          const isDone = i < sessionCount;
          const isCurrent = i === sessionCount && isRunning && phase === 'focus';
          return (
            <div
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: isDone
                  ? 'var(--ink2)'
                  : isCurrent
                    ? 'var(--ink)'
                    : 'var(--line2)',
              }}
            />
          );
        })}
      </div>

      {/* Struggle note — appears once after each completed focus block */}
      {showNote && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submitNote(); }}
            placeholder="What did you struggle with?"
            maxLength={300}
            aria-label="Session struggle note"
            style={{
              width: '100%',
              fontFamily: 'Newsreader, serif',
              fontSize: 12,
              color: 'var(--ink)',
              background: 'var(--cream2)',
              border: '1px solid var(--line)',
              borderRadius: 99,
              padding: '6px 12px',
            }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={submitNote}
              style={{
                fontSize: 10, fontStyle: 'italic', fontFamily: 'Newsreader, serif',
                color: 'var(--ink2)', background: 'transparent',
                border: '1px solid var(--line2)', borderRadius: 99,
                padding: '3px 12px', cursor: 'pointer',
              }}
            >
              {note.trim() ? 'save note' : 'skip'}
            </button>
          </div>
        </div>
      )}

      {/* Mode toggle — visible only when paused/stopped */}
      {!isRunning && (
        <div style={{ display: 'flex', gap: 2 }}>
          {MODES.map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              style={{
                fontSize: 10,
                fontStyle: 'italic',
                fontFamily: 'Newsreader, serif',
                color: mode === m ? 'var(--ink)' : 'var(--ink4)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 8px',
                borderRadius: 99,
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Start / Pause — 44×44px touch target */}
      <button
        onClick={isRunning ? pause : () => { start(); onStart?.(); }}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1px solid var(--line2)',
          background: 'transparent',
          color: 'var(--ink2)',
          fontSize: 13,
          fontStyle: 'italic',
          fontFamily: 'Newsreader, serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isRunning ? 'pause' : 'start'}
      </button>
    </div>
  );
}
