'use client';

// MacroGoalCard — P14 US-012 Level 1
// Expandable macro goal card. Shows title, category, stat header, status chip, AI insight blurb.
// Locked goals: opacity 0.5, pointer-events none on expand chevron.
// Expand state session-only per ui-ux-principles §6.4.

import { useState, useEffect, useMemo } from 'react';
import type { GoalRow, MonthEntry } from '@/types/database';
import MonthRow from './MonthRow';

interface Props {
  goal: GoalRow;
  onItemCheck?: () => void;
}

function computeStats(months: MonthEntry[]): {
  sessionsCompleted: number;
  topicsCovered: number;
  pctToMilestone: number;
} {
  let totalWeeks = 0;
  let doneWeeks = 0;
  const coveredTopics = new Set<string>();

  for (const m of months) {
    for (const w of m.weeks ?? []) {
      totalWeeks++;
      if (w.status === 'done') {
        doneWeeks++;
        for (const t of w.topics ?? []) coveredTopics.add(t);
      }
    }
  }

  return {
    sessionsCompleted: doneWeeks,
    topicsCovered: coveredTopics.size,
    pctToMilestone: totalWeeks > 0 ? Math.round((doneWeeks / totalWeeks) * 100) : 0,
  };
}

const CATEGORY_LABEL: Record<string, string> = {
  curriculum: 'curriculum',
  personal: 'personal',
};

const STATUS_COLOR: Record<string, string> = {
  active: 'var(--ink2)',
  done: 'var(--ink4)',
  locked: 'var(--ink4)',
};

function SkeletonLine({ width }: { width: number | string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width,
        height: 12,
        borderRadius: 4,
        background: 'linear-gradient(90deg, var(--cream2) 25%, var(--cream3) 50%, var(--cream2) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-sweep 1.5s ease-in-out infinite',
        verticalAlign: 'middle',
      }}
    />
  );
}

export default function MacroGoalCard({ goal, onItemCheck }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(true);

  const months = useMemo(() => goal.roadmap?.months ?? [], [goal.roadmap?.months]);
  const stats = useMemo(() => computeStats(months), [months]);
  const isLocked = goal.status === 'locked';

  // Fetch AI insight blurb — 1 sentence, goal-specific, lightweight
  useEffect(() => {
    let cancelled = false;

    async function fetchInsight() {
      try {
        const res = await fetch('/api/goals/insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goalId: goal.id,
            title: goal.title,
            status: goal.status,
            pctToMilestone: stats.pctToMilestone,
            amberTrigger: goal.roadmap?.amber_trigger ?? null,
            unlockCondition: goal.roadmap?.unlock_condition ?? null,
          }),
        });
        if (!res.ok) throw new Error('insight failed');
        const json = await res.json() as { success: boolean; data: { insight: string } };
        if (!cancelled && json.success) setInsight(json.data.insight);
      } catch {
        if (!cancelled) setInsight(null);
      } finally {
        if (!cancelled) setInsightLoading(false);
      }
    }

    fetchInsight();
    return () => { cancelled = true; };
  }, [goal.id, goal.title, goal.status, stats.pctToMilestone, goal.roadmap?.amber_trigger, goal.roadmap?.unlock_condition]);

  const isAmber = Boolean(goal.roadmap?.amber_trigger);

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 11,
        padding: '14px 16px',
        background: 'var(--cream)',
        opacity: isLocked ? 0.5 : 1,
        transition: 'background 80ms ease',
      }}
      data-testid={`goal-card-${goal.id}`}
    >
      {/* Card header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
        {/* Title + category */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--ink)',
                margin: 0,
              }}
            >
              {goal.title}
            </h3>
            {isLocked && (
              <span
                style={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  color: 'var(--ink4)',
                  background: 'var(--cream3)',
                  borderRadius: 99,
                  padding: '2px 8px',
                }}
                data-testid="lock-indicator"
              >
                locked
              </span>
            )}
            {isAmber && !isLocked && (
              <span
                data-testid="amber-badge"
                style={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  color: 'var(--amber)',
                  background: 'var(--amber-pill)',
                  borderRadius: 99,
                  padding: '2px 8px',
                }}
              >
                attention needed
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {goal.category && (
              <span
                style={{
                  fontSize: 10,
                  fontStyle: 'italic',
                  color: 'var(--ink4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}
              >
                {CATEGORY_LABEL[goal.category] ?? goal.category}
              </span>
            )}
            <span
              style={{
                fontSize: 10,
                fontStyle: 'italic',
                color: STATUS_COLOR[goal.status] ?? 'var(--ink4)',
              }}
            >
              {goal.status}
            </span>
          </div>
        </div>

        {/* Expand chevron — disabled for locked goals */}
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`goal-content-${goal.id}`}
          onClick={() => { if (!isLocked) setExpanded((e) => !e); }}
          disabled={isLocked}
          style={{
            background: 'none',
            border: 'none',
            cursor: isLocked ? 'not-allowed' : 'pointer',
            padding: 4,
            fontSize: 12,
            color: 'var(--ink3)',
            display: 'inline-block',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease-in-out',
            lineHeight: 1,
            minWidth: 24,
            minHeight: 24,
          }}
          aria-label={expanded ? 'Collapse goal' : 'Expand goal'}
        >
          ↓
        </button>
      </div>

      {/* Stat row — sessions / topics / % */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 12,
          paddingBottom: 12,
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: 'var(--ink)',
              letterSpacing: '-0.5px',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {stats.sessionsCompleted}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink4)', marginTop: 2 }}>weeks done</div>
        </div>
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: 'var(--ink)',
              letterSpacing: '-0.5px',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {stats.topicsCovered}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink4)', marginTop: 2 }}>topics covered</div>
        </div>
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: isAmber ? 'var(--amber)' : 'var(--ink)',
              letterSpacing: '-0.5px',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {stats.pctToMilestone}%
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink4)', marginTop: 2 }}>to milestone</div>
        </div>
        {goal.roadmap?.total_hours && (
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 300,
                color: 'var(--ink)',
                letterSpacing: '-0.5px',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {goal.roadmap.total_hours}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink4)', marginTop: 2 }}>total hrs</div>
          </div>
        )}
      </div>

      {/* AI insight blurb */}
      <div style={{ marginBottom: 12 }}>
        {insightLoading ? (
          <SkeletonLine width="80%" />
        ) : insight ? (
          <p
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              color: 'var(--ink3)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {insight}
          </p>
        ) : null}
      </div>

      {/* Expandable month rows */}
      <div
        id={`goal-content-${goal.id}`}
        style={{
          overflow: 'hidden',
          maxHeight: expanded ? 8000 : 0,
          transition: 'max-height 200ms ease-in-out',
        }}
      >
        {months.map((month, mi) => (
          <MonthRow key={month.month} month={month} monthIndex={mi} onItemCheck={onItemCheck} />
        ))}
      </div>
    </div>
  );
}
