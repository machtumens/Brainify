'use client';
// TestRunner — active test state machine: active | submitting
// Sprint 5 | US-015 | P20
// Timer: same 1s linear pattern as Pomodoro ring (§5.1)
// Countdown: 22px weight 300 letter-spacing -1px (§2.2 Pomodoro timer spec)
// aria-live="assertive" when < 60s (accessibility §11)

import { useState, useEffect, useCallback } from 'react';
import type { Question, TestResultSummary } from '@/types/test';
import { useTestTimer } from '@/hooks/useTestTimer';
import QuestionCard from './QuestionCard';

interface Props {
  questions: Question[];
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  durationSeconds?: number; // default 20min
  onComplete: (result: TestResultSummary) => void;
  onReset: () => void;
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function TestRunner({
  questions, topics, difficulty, durationSeconds = 1200, onComplete, onReset,
}: Props) {
  const [selections, setSelections]     = useState<Record<string, number>>({});
  // Calibration (v1.1): sure/unsure per answered question — confidently-wrong weighs 2x
  const [confidence, setConfidence]     = useState<Record<string, 'sure' | 'unsure'>>({});
  const [phase, setPhase]               = useState<'active' | 'submitting'>('active');
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const timer = useTestTimer(durationSeconds);

  // Auto-start timer on mount
  useEffect(() => { timer.start(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = useCallback(async () => {
    if (phase !== 'active') return;
    setPhase('submitting');
    setSubmitError(null);
    try {
      const res = await fetch('/api/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          selections,
          confidence,
          topics,
          difficulty,
          duration: timer.elapsed(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Submit failed');
      onComplete(json.data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submit failed — try again');
      setPhase('active'); // allow retry, preserve answers
    }
  }, [phase, questions, selections, confidence, topics, difficulty, timer, onComplete]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (timer.isExpired && phase === 'active') handleSubmit();
  }, [timer.isExpired]); // eslint-disable-line react-hooks/exhaustive-deps

  const isWarning = timer.timeRemaining > 0 && timer.timeRemaining < 60;
  const progress  = 1 - timer.timeRemaining / timer.totalTime;
  const answered  = Object.keys(selections).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} aria-label="Active test">
      {/* Timer bar */}
      <div style={{
        border: '1px solid var(--border-default)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-1)', background: 'var(--surface-page)',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <span
          role="timer"
          aria-live={isWarning ? 'assertive' : 'off'}
          aria-label={`Time remaining: ${fmtTime(timer.timeRemaining)}`}
          style={{
            fontFamily: 'Newsreader, serif', fontSize: 22, fontWeight: 300,
            letterSpacing: '-1px', color: isWarning ? 'var(--red)' : 'var(--ink)',
            fontVariantNumeric: 'tabular-nums', minWidth: 56,
          }}
        >
          {fmtTime(timer.timeRemaining)}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--line2)', borderRadius: 1 }}>
          <div style={{
            height: 1, width: `${progress * 100}%`,
            background: isWarning ? 'var(--red)' : 'var(--ink)',
            borderRadius: 1, transition: 'width 1s linear',
          }} />
        </div>
        <span style={{
          fontSize: 12, fontStyle: 'italic', color: 'var(--ink3)',
          fontFamily: 'Newsreader, serif',
        }}>
          {answered}/{questions.length} answered
        </span>
      </div>

      {/* Question cards */}
      <div aria-label="Test questions" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {questions.map((q, i) => (
          <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <QuestionCard
              question={q}
              index={i}
              selectedOption={selections[q.id] ?? null}
              onSelect={(qId, optIdx) => setSelections((prev) => ({ ...prev, [qId]: optIdx }))}
              revealed={false}
            />
            {selections[q.id] !== undefined && (
              <div
                aria-label="Confidence rating"
                style={{ display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 16 }}
              >
                <span style={{
                  fontSize: 11, fontStyle: 'italic', color: 'var(--ink4)',
                  fontFamily: 'Newsreader, serif',
                }}>
                  confidence:
                </span>
                {(['sure', 'unsure'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfidence((prev) => ({ ...prev, [q.id]: level }))}
                    style={{
                      fontFamily: 'Newsreader, serif', fontSize: 11, fontStyle: 'italic',
                      padding: '2px 10px', borderRadius: 99, cursor: 'pointer',
                      border: '1px solid var(--line2)',
                      background: confidence[q.id] === level ? 'var(--cream3)' : 'transparent',
                      color: confidence[q.id] === level ? 'var(--ink)' : 'var(--ink3)',
                      transition: 'background var(--t-fast)',
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
        <button
          onClick={handleSubmit}
          disabled={phase === 'submitting' || answered === 0}
          style={{
            padding: '10px 24px', borderRadius: 99, border: 'none',
            background: answered === 0 ? 'var(--cream3)' : 'var(--ink)',
            color: answered === 0 ? 'var(--ink4)' : 'var(--text-inverse)',
            fontFamily: 'Newsreader, serif', fontSize: 13, fontStyle: 'italic',
            cursor: phase === 'submitting' || answered === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {phase === 'submitting' ? 'Submitting…' : 'Submit test'}
        </button>
        <button
          onClick={onReset}
          disabled={phase === 'submitting'}
          style={{
            padding: '10px 24px', borderRadius: 99,
            border: '1px solid var(--line)', background: 'transparent',
            color: 'var(--ink3)', fontFamily: 'Newsreader, serif',
            fontSize: 13, fontStyle: 'italic', cursor: 'pointer',
          }}
        >
          New test
        </button>
        {submitError && (
          <span style={{
            fontSize: 12, fontStyle: 'italic', color: 'var(--red)',
            fontFamily: 'Newsreader, serif',
          }}>
            {submitError}
          </span>
        )}
      </div>
    </div>
  );
}
