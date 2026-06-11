'use client';

// ReplanBanner — appears when a goal carries the amber flag (v1.1).
// One click: AI proposes a recoverable week plan; user reviews the
// rationale + diff summary and applies or dismisses. AI never writes
// the roadmap without approval.

import { useState } from 'react';
import type { GoalRow, WeekEntry } from '@/types/database';

interface Props {
  goal: GoalRow;
  onApplied: () => void;
}

interface Proposal {
  rationale: string;
  weeks: WeekEntry[];
  current_weeks: WeekEntry[];
}

export default function ReplanBanner({ goal, onApplied }: Props) {
  const [state, setState] = useState<'idle' | 'proposing' | 'review' | 'applying'>('idle');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function propose() {
    setState('proposing');
    setErrorMsg('');
    try {
      const res = await fetch('/api/goals/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'propose', goal_id: goal.id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setProposal(json.data);
      setState('review');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Replan failed');
      setState('idle');
    }
  }

  async function apply() {
    if (!proposal) return;
    setState('applying');
    try {
      const res = await fetch('/api/goals/replan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply', goal_id: goal.id, weeks: proposal.weeks }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      onApplied();
      setState('idle');
      setProposal(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Apply failed');
      setState('review');
    }
  }

  return (
    <div style={{
      border: '1px solid var(--line)',
      borderRadius: 11,
      boxShadow: 'var(--shadow-1)',
      background: 'var(--amber-pill)',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--amber)' }}>
        <strong style={{ fontWeight: 500 }}>{goal.title}</strong> is behind — the week may no longer be realistic.
      </p>

      {state === 'review' && proposal ? (
        <>
          <p style={{ margin: 0, fontSize: 12, fontStyle: 'italic', color: 'var(--ink2)' }}>
            {proposal.rationale}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--ink3)' }}>
            {proposal.current_weeks.length} week{proposal.current_weeks.length !== 1 ? 's' : ''} →{' '}
            {proposal.weeks.length} revised ({proposal.weeks.filter((w) => w.status === 'done').length} kept done)
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={apply}
              disabled={state !== 'review'}
              style={{
                fontFamily: 'inherit', fontSize: 12, fontStyle: 'italic',
                color: 'var(--cream)', background: 'var(--ink)',
                border: 'none', borderRadius: 99, padding: '5px 14px', cursor: 'pointer',
              }}
            >
              Apply new plan
            </button>
            <button
              onClick={() => { setState('idle'); setProposal(null); }}
              style={{
                fontFamily: 'inherit', fontSize: 12, fontStyle: 'italic',
                color: 'var(--ink3)', background: 'transparent',
                border: '1px solid var(--line2)', borderRadius: 99,
                padding: '5px 14px', cursor: 'pointer',
              }}
            >
              Keep current plan
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={propose}
            disabled={state === 'proposing' || state === 'applying'}
            style={{
              fontFamily: 'inherit', fontSize: 12, fontStyle: 'italic',
              color: 'var(--ink)', background: 'transparent',
              border: '1px solid var(--line2)', borderRadius: 99,
              padding: '5px 14px',
              cursor: state === 'proposing' ? 'wait' : 'pointer',
            }}
          >
            {state === 'proposing' ? 'Re-planning…' : 'Let AI re-plan this week'}
          </button>
          {errorMsg && (
            <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--red)' }}>{errorMsg}</span>
          )}
        </div>
      )}
    </div>
  );
}
