import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';
import { buildGoalUpdates } from '@/lib/goalTracker';
import type { GoalRow, SessionRow } from '@/types/database';

export async function GET() {
  try {
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
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from('goals')
      .select('id, title, category, status, total_months, current_month, started_at, roadmap, created_at')
      .eq('user_id', user.id)
      .order('status', { ascending: true }) // active < done < locked alphabetically — adjust below
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    // Sort: active first, done second, locked last
    const order: Record<string, number> = { active: 0, done: 1, locked: 2 };
    const sorted = [...(data ?? [])].sort(
      (a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3)
    );

    return NextResponse.json({ success: true, data: sorted, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load goals';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}

// POST /api/goals — recalculate progress, amber flag, Spivak unlock
// Called after every session complete or daily item check.
export async function POST() {
  try {
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
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = createServiceClient();

    // Fetch all goals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: goalsData, error: goalsError } = await (db as any)
      .from('goals')
      .select('id, title, category, status, total_months, current_month, started_at, roadmap, created_at')
      .eq('user_id', user.id);

    if (goalsError) throw new Error(goalsError.message);
    const goals: GoalRow[] = goalsData ?? [];

    // Fetch sessions for amber check — all time, most recent first, limited for performance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: allMLSessions, error: mlError } = await (db as any)
      .from('sessions')
      .select('subject, started_at')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(100);

    if (mlError) throw new Error(mlError.message);

    const sessions: Pick<SessionRow, 'subject' | 'started_at'>[] = allMLSessions ?? [];

    // Compute which goals need updates
    const updates = buildGoalUpdates(goals, sessions);

    // Apply updates to DB
    for (const update of updates) {
      const patch: Record<string, unknown> = {};
      if (update.status !== undefined) patch.status = update.status;
      if (update.roadmap !== undefined) patch.roadmap = update.roadmap;

      if (Object.keys(patch).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (db as any)
          .from('goals')
          .update(patch)
          .eq('id', update.id)
          .eq('user_id', user.id);

        if (updateError) {
          // non-fatal: continue updating remaining goals
        }
      }
    }

    // Refetch updated goals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: refreshed, error: refreshError } = await (db as any)
      .from('goals')
      .select('id, title, category, status, total_months, current_month, started_at, roadmap, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (refreshError) throw new Error(refreshError.message);

    const order: Record<string, number> = { active: 0, done: 1, locked: 2 };
    const sorted = [...((refreshed as GoalRow[]) ?? [])].sort(
      (a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3)
    );

    return NextResponse.json({ success: true, data: sorted, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to recalculate goals';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
