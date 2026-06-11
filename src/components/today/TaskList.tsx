'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase-browser';
import TaskRow from './TaskRow';
import type { Task } from '@/types/tasks';
import type { GoalRow, DailyChecklistItem } from '@/types/database';

const DONE_KEY = 'sb_tasks_done';

// sessionStorage persists across page refreshes within the same tab.
function loadDoneIds(): Set<string> {
  try {
    const raw = typeof window !== 'undefined' ? sessionStorage.getItem(DONE_KEY) : null;
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveDoneIds(ids: Set<string>): void {
  try {
    sessionStorage.setItem(DONE_KEY, JSON.stringify(Array.from(ids)));
  } catch { /* ignore quota errors */ }
}

// 1=Mon ... 7=Sun (matches DailyChecklistItem.day convention)
function todayDayNumber(): number {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 7 : d;
}

function goalSubject(goal: GoalRow): string {
  // Use text before first dash/colon/em-dash as a short subject label
  const t = goal.title.split(/[—\-:]/, 1)[0].trim();
  return t.length > 20 ? t.slice(0, 20) : t;
}

function buildTasks(goals: GoalRow[], doneIds: Set<string>): Task[] {
  const today = todayDayNumber();
  const tasks: Task[] = [];

  for (const goal of goals) {
    if (goal.status !== 'active') continue;
    const months = goal.roadmap?.months;
    if (!months?.length) continue;

    const monthIdx = Math.max(0, (goal.current_month ?? 1) - 1);
    const month = months[monthIdx];
    if (!month?.weeks?.length) continue;

    const week = month.weeks.find((w) => w.status === 'active') ?? month.weeks[0];
    if (!week?.daily_checklist?.length) continue;

    // Prefer today's tasks; fall back to all week tasks if none scheduled today
    const todayItems = week.daily_checklist.filter(
      (item: DailyChecklistItem) => item.day === today
    );
    const items = todayItems.length > 0 ? todayItems : week.daily_checklist;
    const subject = goalSubject(goal);

    items.forEach((item: DailyChecklistItem, idx: number) => {
      const id = `${goal.id}-${week.week}-${item.day}-${idx}`;
      tasks.push({
        id,
        title: item.task,
        subject,
        done: doneIds.has(id),
        goalId: goal.id,
        day: item.day,
      });
    });
  }

  return tasks;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase
      .from('goals')
      .select('*')
      .eq('status', 'active')
      .then(({ data, error }) => {
        if (error || !data) {
          setStatus('error');
          return;
        }
        const doneIds = loadDoneIds();
        // jsonb roadmap is Json — narrow at the query boundary
        setTasks(buildTasks(data as unknown as GoalRow[], doneIds));
        setStatus('loaded');
      });
  }, []);

  const handleToggle = useCallback(async (id: string) => {
    // Optimistic update
    const prev = [...tasks];
    const toggled = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(toggled);

    // Persist done state in sessionStorage
    const doneIds = loadDoneIds();
    const task = toggled.find((t) => t.id === id);
    if (!task) return;

    if (task.done) {
      doneIds.add(id);
    } else {
      doneIds.delete(id);
    }
    saveDoneIds(doneIds);

    // Only log session when checking (not unchecking)
    if (!task.done) return;

    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_title: task.title,
          subject: task.subject,
        }),
      });
      const json = await res.json() as { success: boolean; error: string | null };
      if (!json.success) throw new Error(json.error ?? 'Session log failed');
    } catch {
      // Revert optimistic update on API failure
      setTasks(prev);
      const revertDoneIds = loadDoneIds();
      revertDoneIds.delete(id);
      saveDoneIds(revertDoneIds);
      setErrorMsg('Could not save. Try again.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  }, [tasks]);

  return (
    <div>
      <style>{`
        .task-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px;
          min-height: 44px;
          cursor: pointer;
          border-radius: 6px;
          transition: background 80ms ease;
        }
        .task-row:hover { background: var(--cream2); }
        .task-checkbox {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid var(--line2);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 150ms ease;
          outline: none;
        }
        .task-checkbox:focus-visible {
          outline: 2px solid var(--ink2);
          outline-offset: 2px;
        }
        .task-checkbox.done {
          background: var(--ink);
          border-color: var(--ink);
        }
        .task-label {
          flex: 1;
          font-size: 14px;
          font-weight: 300;
          color: var(--ink);
          transition: color 150ms ease, text-decoration 150ms ease;
        }
        .task-label.done {
          color: var(--ink4);
          text-decoration: line-through;
          text-decoration-color: var(--line2);
        }
        .task-subject {
          font-size: 10px;
          font-style: italic;
          color: var(--ink4);
          white-space: nowrap;
          text-align: right;
        }
      `}</style>

      {status === 'loading' && (
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink4)', margin: 0 }}>
          Loading tasks…
        </p>
      )}

      {status === 'error' && (
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--red)', margin: 0 }}>
          Could not load tasks.
        </p>
      )}

      {status === 'loaded' && tasks.length === 0 && (
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--ink3)', margin: 0 }}>
          Nothing scheduled. Check goals.
        </p>
      )}

      {status === 'loaded' && tasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={handleToggle} />
          ))}
        </div>
      )}

      {errorMsg && (
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--red)', margin: '4px 8px 0' }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
