'use client';

// CalendarStrip — P13 US-010
// 7-day week view (Mon–Sun). One 3px dot per day.
// Dot states: done (session logged) / planned (future) / rest (past, no session).

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import {
  getWeekDays,
  getDayLabel,
  toDateStr,
  sessionDateStr,
  getDotState,
  type DotState,
  type CalendarDay,
} from '@/utils/dates';

function dotStyle(state: DotState): React.CSSProperties {
  switch (state) {
    case 'done':
      return { background: 'var(--ink)' };
    case 'planned':
      return { background: 'var(--line2)' };
    case 'rest':
      // outline draws outside the element without adding depth effects
      return { background: 'transparent', outline: '1px solid var(--line2)' };
  }
}

export default function CalendarStrip() {
  const [days, setDays] = useState<CalendarDay[]>([]);

  useEffect(() => {
    const today = new Date();
    const todayStr = toDateStr(today);
    const weekDays = getWeekDays(today);

    const monday = weekDays[0];
    const sunday = weekDays[6];
    const dayAfterSunday = new Date(sunday);
    dayAfterSunday.setDate(sunday.getDate() + 1);

    async function loadDots() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createClient() as any;
      const { data } = await db
        .from('sessions')
        .select('started_at')
        .gte('started_at', toDateStr(monday))
        .lt('started_at', toDateStr(dayAfterSunday));

      const sessionDates = new Set<string>(
        (data ?? []).map((s: { started_at: string }) => sessionDateStr(s.started_at))
      );

      setDays(
        weekDays.map((date, i) => {
          const dateStr = toDateStr(date);
          return {
            dateStr,
            label: getDayLabel(i),
            state: getDotState(dateStr, sessionDates, todayStr),
            isToday: dateStr === todayStr,
          };
        })
      );
    }

    loadDots();
  }, []);

  if (days.length === 0) return null;

  return (
    <div
      role="list"
      aria-label="Calendar strip — current week"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
      }}
    >
      {days.map((day) => (
        <div
          key={day.dateStr}
          role="listitem"
          aria-label={`${day.dateStr} — ${day.state}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 400,
              color: day.isToday ? 'var(--ink)' : 'var(--ink4)',
              letterSpacing: '0.02em',
            }}
          >
            {day.label}
          </span>
          <span
            style={{
              display: 'block',
              width: 3,
              height: 3,
              borderRadius: '50%',
              ...dotStyle(day.state),
            }}
          />
        </div>
      ))}
    </div>
  );
}
