'use client';

// ExamCountdown — P13 US-010
// Card in right panel showing days to exam + velocity estimate.
// Exam date derived from goals.started_at + goals.total_months (no schema change needed).
// Format: "X days to mock. At current pace, Y topics unfinished. Daily load: Z pages."

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { daysUntil, addMonths } from '@/utils/dates';
import { computeVelocity } from '@/utils/computeVelocity';
import type { GoalRoadmap } from '@/types/database';

interface CountdownData {
  daysRemaining: number;
  topicsUnfinished: number;
  pagesPerDay: number;
}

function countUnfinishedTopics(roadmap: GoalRoadmap | null): number {
  if (!roadmap?.months) return 0;
  let count = 0;
  for (const month of roadmap.months) {
    for (const week of month.weeks ?? []) {
      if (week.status !== 'done') {
        count += week.topics?.length ?? 0;
      }
    }
  }
  return count;
}

export default function ExamCountdown() {
  const [data, setData] = useState<CountdownData | null>(null);
  const [noExamDate, setNoExamDate] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createClient();
      const today = new Date();

      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const [goalsRes, sessionsRes] = await Promise.all([
        db
          .from('goals')
          .select('started_at, total_months, roadmap')
          .eq('category', 'curriculum')
          .eq('status', 'active')
          .not('started_at', 'is', null)
          .not('total_months', 'is', null)
          .order('started_at', { ascending: true })
          .limit(1),
        db
          .from('sessions')
          .select('pages_done')
          .gte('started_at', sevenDaysAgo.toISOString()),
      ]);

      const goal = goalsRes.data?.[0];

      // v1.1: explicit exam registry is the source of truth; goals jsonb
      // derivation remains the fallback.
      let examDate: Date | null = null;
      try {
        const examsRes = await fetch('/api/exams').then((r) => r.json());
        const next = examsRes?.data?.[0];
        if (next?.exam_on) examDate = new Date(`${next.exam_on}T00:00:00`);
      } catch { /* fall back to goal-derived */ }

      if (!examDate) {
        if (!goal?.started_at || !goal?.total_months) {
          setNoExamDate(true);
          return;
        }
        examDate = addMonths(new Date(goal.started_at), goal.total_months as number);
      }

      const days = Math.max(0, daysUntil(examDate, today));
      const topics = goal ? countUnfinishedTopics(goal.roadmap as unknown as GoalRoadmap) : 0;
      const velocity = computeVelocity(sessionsRes.data ?? []);

      setData({ daysRemaining: days, topicsUnfinished: topics, pagesPerDay: velocity });
    }

    fetchData();
  }, []);

  const cardStyle: React.CSSProperties = {
    border: '1px solid var(--line)',
    borderRadius: 11,
    padding: '14px 16px',
    background: 'var(--cream)',
  };

  if (noExamDate) {
    return (
      <div style={cardStyle}>
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--ink4)' }}>
          No exam date set
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div style={cardStyle} aria-label="Exam countdown">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 32,
            fontWeight: 300,
            color: 'var(--ink)',
            letterSpacing: '-1px',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {data.daysRemaining}
        </span>
        <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--ink4)' }}>
          days to mock
        </span>
      </div>
      <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--ink3)', lineHeight: 1.4 }}>
        At current pace, {data.topicsUnfinished} topics unfinished. Daily load: {data.pagesPerDay} pages.
      </p>
    </div>
  );
}
