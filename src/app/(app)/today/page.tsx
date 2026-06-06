'use client';
// Today View — two-column grid shell (P05).
// Left: fluid (1fr, min 320px). Right: 272px fixed.
// Content components added in P06–P11.
import { useState, useCallback } from 'react';
import BriefPanel from '@/components/today/BriefPanel';
import TaskList from '@/components/today/TaskList';
import TextbookList from '@/components/today/TextbookList';
import PomodoroRing from '@/components/today/PomodoroRing';
import PrimerPanel from '@/components/today/PrimerPanel';
import ConfusionMap from '@/components/today/ConfusionMap';
import CalendarStrip from '@/components/today/CalendarStrip';
import ExamCountdown from '@/components/today/ExamCountdown';
import type { PrimerData } from '@/app/api/primer/route';

export default function TodayPage() {
  const [showPrimer, setShowPrimer] = useState(false);
  const [primerLoading, setPrimerLoading] = useState(false);
  const [primerData, setPrimerData] = useState<PrimerData | null>(null);

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
    } catch (err) {
      console.error('[TodayPage] primer fetch failed:', err);
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
      </div>
    </div>
  );
}
