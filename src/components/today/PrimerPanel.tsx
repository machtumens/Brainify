'use client';
import { useState, useEffect, useRef } from 'react';
import type { PrimerData } from '@/app/api/primer/route';

// First-time key — stored in localStorage. Cleared when user hasn't seen primer yet.
const FIRST_SEEN_KEY = 'sb_primer_first_seen';

// Mandatory view time (seconds) before dismiss allowed on first occurrence.
const MANDATORY_SECONDS = 10;

interface PrimerPanelProps {
  data: PrimerData | null;
  loading: boolean;
  onDismiss: () => void;
}

export default function PrimerPanel({ data, loading, onDismiss }: PrimerPanelProps) {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [countdown, setCountdown] = useState(MANDATORY_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect first-time on mount
  useEffect(() => {
    const seen = localStorage.getItem(FIRST_SEEN_KEY);
    if (!seen) {
      setIsFirstTime(true);
    }
  }, []);

  // Countdown for first-time mandatory delay
  useEffect(() => {
    if (!isFirstTime) return;
    setCountdown(MANDATORY_SECONDS);
    intervalRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isFirstTime]);

  function handleDismiss() {
    if (isFirstTime && countdown > 0) return;
    // Mark as seen so future sessions can dismiss early
    localStorage.setItem(FIRST_SEEN_KEY, '1');
    onDismiss();
  }

  const canDismiss = !isFirstTime || countdown === 0;

  return (
    <section
      role="region"
      aria-label="Session Primer"
      style={{
        border: '1px solid var(--line)',
        borderRadius: 11,
        padding: '14px 16px',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: 'var(--ink4)',
          fontFamily: 'Newsreader, serif',
        }}>
          preparing session
        </span>
        <button
          onClick={handleDismiss}
          aria-label={isFirstTime && countdown > 0 ? `Dismiss in ${countdown}s` : 'Dismiss primer'}
          disabled={!canDismiss}
          style={{
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: 'transparent',
            border: 'none',
            cursor: canDismiss ? 'pointer' : 'not-allowed',
            padding: '0 0 0 8px',
            fontSize: 10,
            fontStyle: 'italic',
            fontFamily: 'Newsreader, serif',
            color: canDismiss ? 'var(--ink3)' : 'var(--ink4)',
          }}
        >
          {isFirstTime && countdown > 0 ? `${countdown}s` : 'dismiss'}
        </button>
      </div>

      {loading ? (
        /* Skeleton — same pattern as BriefPanel */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ width: '100%', height: 14, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: '70%', height: 14, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: '90%', height: 14, borderRadius: 4 }} />
        </div>
      ) : data ? (
        <>
          {/* Element 1: Key formula — monospace, --cream3 background */}
          <div
            aria-label="Key formula"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 13,
              fontWeight: 400,
              color: 'var(--ink)',
              background: 'var(--cream3)',
              borderRadius: 7,
              padding: '8px 10px',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {data.formula}
          </div>

          {/* Element 2: Last error — --red italic weight 300 */}
          <p
            aria-label="Last error"
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 300,
              fontStyle: 'italic',
              fontFamily: 'Newsreader, serif',
              color: data.lastError === 'No errors logged yet.'
                ? 'var(--ink4)'
                : 'var(--red)',
              lineHeight: 1.5,
            }}
          >
            {data.lastError === 'No errors logged yet.'
              ? 'No errors logged yet.'
              : <>Last error: &ldquo;{data.lastError}&rdquo;</>
            }
          </p>

          {/* Element 3: Own note — --ink3 italic */}
          <p
            aria-label="Your note"
            style={{
              margin: 0,
              fontSize: 13,
              fontStyle: 'italic',
              fontFamily: 'Newsreader, serif',
              color: data.ownNote === 'No notes for this topic yet.'
                ? 'var(--ink4)'
                : 'var(--ink3)',
              lineHeight: 1.5,
            }}
          >
            {data.ownNote === 'No notes for this topic yet.'
              ? 'No notes for this topic yet.'
              : <>Your note: &ldquo;{data.ownNote}&rdquo;</>
            }
          </p>
        </>
      ) : (
        /* Error / fallback state */
        <p style={{
          margin: 0,
          fontSize: 13,
          fontStyle: 'italic',
          fontFamily: 'Newsreader, serif',
          color: 'var(--ink3)',
        }}>
          Check your notes for this topic.
        </p>
      )}
    </section>
  );
}
