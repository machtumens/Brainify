'use client';

// Goals view — P14 US-012
// Fetches all goals from /api/goals, renders 4-level expandable hierarchy.

import { useEffect, useState } from 'react';
import type { GoalRow } from '@/types/database';
import MacroGoalCard from '@/components/goals/MacroGoalCard';
import VelocityChart from '@/components/goals/VelocityChart';
import ReplanBanner from '@/components/goals/ReplanBanner';
import ExamDatesCard from '@/components/goals/ExamDatesCard';
import RetroHistoryList from '@/components/shared/RetroHistoryList';

function GoalSkeleton() {
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 11,
        padding: '14px 16px',
        background: 'var(--cream)',
      }}
    >
      {[100, 60, 80].map((w, i) => (
        <div
          key={i}
          style={{
            height: 12,
            width: `${w}%`,
            borderRadius: 4,
            marginBottom: i < 2 ? 10 : 0,
            background: 'linear-gradient(90deg, var(--cream2) 25%, var(--cream3) 50%, var(--cream2) 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-sweep 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/goals')
      .then((r) => r.json())
      .then((json: { success: boolean; data: GoalRow[]; error: string }) => {
        if (json.success) setGoals(json.data);
        else setError(json.error);
      })
      .catch(() => setError('Failed to load goals'));
  }, []);

  async function handleItemCheck() {
    try {
      const res = await fetch('/api/goals', { method: 'POST' });
      const json = await res.json() as { success: boolean; data: GoalRow[]; error: string };
      if (json.success) setGoals(json.data);
    } catch {
      // silent — local check state already updated optimistically
    }
  }

  return (
    <div style={{ padding: '20px 24px', maxWidth: 800 }}>
      <h1
        style={{
          fontSize: 10,
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: 'var(--ink4)',
          marginBottom: 20,
        }}
      >
        Goals
      </h1>

      {error && (
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink3)' }}>
          {error}
        </p>
      )}

      {!goals && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4].map((i) => <GoalSkeleton key={i} />)}
        </div>
      )}

      {/* ── Amber re-plan banners (v1.1) ── */}
      {goals && goals.filter((g) => Boolean(g.roadmap?.amber_trigger)).map((g) => (
        <div key={`replan-${g.id}`} style={{ marginBottom: 12 }}>
          <ReplanBanner goal={g} onApplied={handleItemCheck} />
        </div>
      ))}

      {goals && (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          data-testid="goal-list"
        >
          {goals.map((goal) => (
            <MacroGoalCard key={goal.id} goal={goal} onItemCheck={handleItemCheck} />
          ))}
        </div>
      )}

      {/* ── Velocity trendline (v1.1) ── */}
      <div style={{ marginTop: 24 }}>
        <VelocityChart />
      </div>

      {/* ── Exam dates registry (v1.1) ── */}
      <ExamDatesCard />

      {/* ── Weekly retrospectives ── */}
      <h2
        style={{
          fontSize: 10,
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: 'var(--ink4)',
          marginTop: 40,
          marginBottom: 12,
        }}
        data-testid="retro-section-label"
      >
        Weekly retrospectives
      </h2>
      <RetroHistoryList />
    </div>
  );
}
