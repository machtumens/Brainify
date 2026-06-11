// ================================================================
// POST /api/goals/replan — AI weekly re-plan for a drifting goal
// v1.1 Phase 3 (suggestion #18)
//
// action 'propose': AI looks at the amber-flagged goal's current
//   month + recent sessions and proposes a revised week plan
//   (smaller, recoverable). Nothing is written.
// action 'apply':   write the approved weeks array into the goal's
//   roadmap (current month only).
//
// The user always approves the diff — AI never silently rewrites
// the roadmap.
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';
import { callAI } from '@/lib/ai-router';
import type { GoalRoadmap, MonthEntry, WeekEntry } from '@/types/database';

async function getAuthUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* read-only in route handlers */ }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

interface ReplanBody {
  action?: 'propose' | 'apply';
  goal_id?: string;
  weeks?: WeekEntry[]; // for apply
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as ReplanBody;
    if (!body.goal_id) {
      return NextResponse.json(
        { success: false, data: null, error: 'goal_id required' },
        { status: 400 }
      );
    }

    const db = createServiceClient();
    const { data: goal, error: goalErr } = await db
      .from('goals')
      .select('id, title, current_month, roadmap')
      .eq('id', body.goal_id)
      .eq('user_id', user.id)
      .single();
    if (goalErr || !goal) {
      return NextResponse.json(
        { success: false, data: null, error: 'Goal not found' },
        { status: 404 }
      );
    }

    const roadmap = (goal.roadmap ?? {}) as unknown as GoalRoadmap;
    const months: MonthEntry[] = roadmap?.months ?? [];
    const currentMonth = months.find((m) => m.month === (goal.current_month ?? 1));

    if (body.action === 'apply') {
      if (!Array.isArray(body.weeks) || body.weeks.length === 0 || !currentMonth) {
        return NextResponse.json(
          { success: false, data: null, error: 'weeks required for apply' },
          { status: 400 }
        );
      }
      const newRoadmap: GoalRoadmap = {
        ...roadmap,
        months: months.map((m) =>
          m.month === currentMonth.month ? { ...m, weeks: body.weeks as WeekEntry[] } : m
        ),
      };
      const { error: updErr } = await db
        .from('goals')
        .update({ roadmap: newRoadmap as unknown as undefined })
        .eq('id', goal.id)
        .eq('user_id', user.id);
      if (updErr) throw new Error(updErr.message);
      return NextResponse.json({ success: true, data: { applied: true }, error: null });
    }

    // propose
    const { data: sessions } = await db
      .from('sessions')
      .select('subject, started_at, pomodoros')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(30);

    const prompt = `A student is behind on the goal "${goal.title}" (amber flag: 5+ days missed).
Current month plan (month ${currentMonth?.month ?? '?'}):
${JSON.stringify(currentMonth ?? {}, null, 2)}

Recent sessions (newest first):
${JSON.stringify(sessions ?? [], null, 2)}

Propose a REVISED weeks array for this month that is realistically recoverable:
- keep completed weeks ("status":"done") untouched
- shrink or re-sequence remaining weeks so the student can catch up without burnout
- keep the same JSON shape as the existing weeks entries

Return ONLY valid JSON: {"rationale": "<2 sentences>", "weeks": [ ...revised weeks array... ]}
No markdown fences, no extra text.`;

    const { text } = await callAI(prompt);
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    let proposal: { rationale?: string; weeks?: WeekEntry[] };
    try {
      proposal = JSON.parse(cleaned) as { rationale?: string; weeks?: WeekEntry[] };
    } catch {
      return NextResponse.json(
        { success: false, data: null, error: 'Could not generate a plan — try again' },
        { status: 502 }
      );
    }

    if (!Array.isArray(proposal.weeks) || proposal.weeks.length === 0) {
      return NextResponse.json(
        { success: false, data: null, error: 'Could not generate a plan — try again' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        goal_id: goal.id,
        rationale: String(proposal.rationale ?? '').slice(0, 500),
        weeks: proposal.weeks,
        current_weeks: currentMonth?.weeks ?? [],
      },
      error: null,
    });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Replan failed' },
      { status: 500 }
    );
  }
}
