'use client';
// Today View — two-column grid shell (P05).
// Left: fluid (1fr, min 320px). Right: 272px fixed.
// Content components added in P06–P11.
// P23: sync_last_run display added (--ink4 italic, bottom of right column).
import { useState, useCallback, useEffect } from 'react';
import BriefPanel from '@/components/today/BriefPanel';
import TaskList from '@/components/today/TaskList';
import TextbookList from '@/components/today/TextbookList';
import PomodoroRing from '@/components/today/PomodoroRing';
import PrimerPanel from '@/components/today/PrimerPanel';
import ConfusionMap from '@/components/today/ConfusionMap';
import CalendarStrip from '@/components/today/CalendarStrip';
import ExamCountdown from '@/components/today/ExamCountdown';
import type { PrimerData } from '@/app/api/primer/route';

function useSyncLastRun(): { label: string; jobFailed: boolean } {
  const [label, setLabel] = useState('');
  const [jobFailed, setJobFailed] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((json) => {
        const jobs = json?.data?.jobs;
        setJobFailed(
          jobs?.sync?.status === 'error' || jobs?.retrospective?.status === 'error'
        );
        const raw: string = json?.data?.sync_last_run ?? '';
        if (!raw || raw === 'never') {
          setLabel('never synced');
          return;
        }
        const diff = Date.now() - new Date(raw).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) setLabel('synced just now');
        else if (mins < 60) setLabel(`synced ${mins}m ago`);
        else setLabel(`synced ${Math.floor(mins / 60)}h ago`);
      })
      .catch(() => { /* silent — sync status is non-critical */ });
  }, []);

  return { label, jobFailed };
}

export default function TodayPage() {
  const [showPrimer, setShowPrimer] = useState(false);
  const [primerLoading, setPrimerLoading] = useState(false);
  const [primerData, setPrimerData] = useState<PrimerData | null>(null);
  const { label: syncLabel, jobFailed } = useSyncLastRun();

  const handlePomodoroStart = useCallback(async () => {
    // Show primer immediately with loading state — non-blocking
    setShowPrimer(true);
    setPrimerLoading(true);
    setPrimerData(null);
    try {
      const res = await fetch('/api/primer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // subject/topic could be wired to active task in a future sprint
        body: JSON.stringify({ subject: 'mathematics', topic: null }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPrimerData(json.data as PrimerData);
      }
    } catch {
      // Panel shows fallback text via null data
    } finally {
      setPrimerLoading(false);
    }
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 272px',
      gap: 24,
      padding: '20px 24px',
      minHeight: '100%',
    }}>
      {/* Left column — AI brief, task checklist, textbook bars, calendar */}
      <div style={{ minWidth: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <BriefPanel />
        <TaskList />
        <TextbookList />
        <CalendarStrip />
      </div>

      {/* Right panel — 272px fixed: Pomodoro, Primer, Confusion map, Countdown */}
      <div style={{ width: 272, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PomodoroRing onStart={handlePomodoroStart} />
        {showPrimer && (
          <PrimerPanel
            data={primerData}
            loading={primerLoading}
            onDismiss={() => setShowPrimer(false)}
          />
        )}
        <ConfusionMap />
        <ExamCountdown />
        {syncLabel && (
          <p style={{
            fontSize: 12,
            fontStyle: 'italic',
            color: 'var(--ink4)',
            textAlign: 'right',
            margin: 0,
          }}>
            {jobFailed && (
              <span
                title="A background job failed — check /api/health"
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--red)',
                  marginRight: 6,
                  verticalAlign: 'middle',
                }}
              />
            )}
            {syncLabel}
          </p>
        )}
      </div>
    </div>
  );
}
