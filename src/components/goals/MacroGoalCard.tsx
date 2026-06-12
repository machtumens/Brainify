'use client';

// MacroGoalCard — P14 US-012 Level 1
// Expandable macro goal card. Shows title, category, stat header, status chip, AI insight blurb.
// Locked goals: opacity 0.5, pointer-events none on expand chevron.
// Expand state session-only per ui-ux-principles §6.4.

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconChevronDown } from '@tabler/icons-react';
import type { GoalRow, MonthEntry } from '@/types/database';
import { expandVariants, springSnappy } from '@/lib/motion';
import Skeleton from '@/components/shared/primitives/Skeleton';
import StatNumber from '@/components/shared/primitives/StatNumber';
import Pill from '@/components/shared/primitives/Pill';
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
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--r-card)',
        boxShadow: 'var(--shadow-1)',
        padding: '14px 16px',
        background: 'var(--surface-page)',
        opacity: isLocked ? 0.5 : 1,
        transition: 'background var(--t-fast)',
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
              <Pill
                tone="neutral"
                data-testid="lock-indicator"
                style={{ fontSize: 'var(--fs-micro)', padding: '2px 8px', color: 'var(--text-faint)' }}
              >
                locked
              </Pill>
            )}
            {isAmber && !isLocked && (
              <Pill
                tone="warn"
                data-testid="amber-badge"
                style={{ fontSize: 'var(--fs-micro)', padding: '2px 8px' }}
              >
                attention needed
              </Pill>
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
        <motion.button
          type="button"
          aria-expanded={expanded}
          aria-controls={`goal-content-${goal.id}`}
          onClick={() => { if (!isLocked) setExpanded((e) => !e); }}
          disabled={isLocked}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={springSnappy}
          style={{
            background: 'none',
            border: 'none',
            cursor: isLocked ? 'not-allowed' : 'pointer',
            padding: 4,
            color: 'var(--text-tertiary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            minWidth: 24,
            minHeight: 24,
          }}
          aria-label={expanded ? 'Collapse goal' : 'Expand goal'}
        >
          <IconChevronDown size={14} stroke={1.5} aria-hidden="true" />
        </motion.button>
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
        <StatNumber value={stats.sessionsCompleted} label="weeks done" />
        <StatNumber value={stats.topicsCovered} label="topics covered" />
        <StatNumber
          value={`${stats.pctToMilestone}%`}
          label="to milestone"
          tone={isAmber ? 'warn' : 'default'}
        />
        {goal.roadmap?.total_hours && (
          <StatNumber value={goal.roadmap.total_hours} label="total hrs" />
        )}
      </div>

      {/* AI insight blurb — height reserved so resolve doesn't shift layout */}
      <div style={{ marginBottom: 12, minHeight: 18 }}>
        {insightLoading ? (
          <Skeleton width="80%" height={12} />
        ) : insight ? (
          <p
            style={{
              fontSize: 'var(--fs-body-s)',
              fontStyle: 'italic',
              color: 'var(--text-tertiary)',
              margin: 0,
              lineHeight: 'var(--lh-body)',
            }}
          >
            {insight}
          </p>
        ) : null}
      </div>

      {/* Expandable month rows — spring height (ADR-015; replaces maxHeight hack) */}
      <div id={`goal-content-${goal.id}`}>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              variants={expandVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              style={{ overflow: 'hidden' }}
            >
              {months.map((month, mi) => (
                <MonthRow key={month.month} month={month} monthIndex={mi} onItemCheck={onItemCheck} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
