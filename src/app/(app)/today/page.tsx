'use client';
// Today View — responsive sidebar layout (ADR-015 §5).
// Desktop/iPad landscape: fluid main + 272px aside.
// ≤1024px (iPad portrait): single column, aside reflows to a 2-up band.
// P23: sync_last_run display added (bottom of right column).
import { useState, useCallback, useEffect } from 'react';
import PageShell from '@/components/shared/primitives/PageShell';
import BriefPanel from '@/components/today/BriefPanel';
import TaskList from '@/components/today/TaskList';
import TextbookList from '@/components/today/TextbookList';
import PomodoroRing from '@/components/today/PomodoroRing';
import PrimerPanel from '@/components/today/PrimerPanel';
import ConfusionMap from '@/components/today/ConfusionMap';
import CalendarStrip from '@/components/today/CalendarStrip';
import ExamCountdown from '@/components/today/ExamCountdown';
import ReviewQueue from '@/components/today/ReviewQueue';
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
    <PageShell
      title="Today"
      width="sidebar"
      aside={
        <>
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
              fontSize: 'var(--fs-caption)',
              fontStyle: 'italic',
              color: 'var(--text-faint)',
              textAlign: 'right',
              margin: 0,
            }}>
              <a
                href="/memory"
                style={{ color: 'var(--text-faint)', textDecoration: 'underline', marginRight: 8 }}
              >
                memory
              </a>
              {jobFailed && (
                <span
                  title="A background job failed — check /api/health"
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--text-secondary)',
                    marginRight: 6,
                  }}
                >
                  job failed ·
                </span>
              )}
              {syncLabel}
            </p>
          )}
        </>
      }
    >
      {/* Main column — AI brief, review queue, task checklist, textbook bars, calendar */}
      <BriefPanel />
      <ReviewQueue />
      <TaskList />
      <TextbookList />
      <CalendarStrip />
    </PageShell>
  );
}
