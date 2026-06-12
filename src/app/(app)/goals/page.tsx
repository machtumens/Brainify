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
import PageShell from '@/components/shared/primitives/PageShell';
import Card from '@/components/shared/primitives/Card';
import SectionLabel from '@/components/shared/primitives/SectionLabel';
import Skeleton from '@/components/shared/primitives/Skeleton';
import InlineMessage from '@/components/shared/primitives/InlineMessage';

function GoalSkeleton() {
  return (
    <Card>
      <Skeleton lines={3} />
    </Card>
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
    <PageShell title="Goals" width="content">
      {error && <InlineMessage tone="muted">{error}</InlineMessage>}

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
      <SectionLabel
        as="h2"
        data-testid="retro-section-label"
        style={{ marginTop: 'var(--sp-10)' }}
      >
        Weekly retrospectives
      </SectionLabel>
      <RetroHistoryList />
    </PageShell>
  );
}
