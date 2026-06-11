// ================================================================
// GET  /api/review — due review items (SR queue); ?window=presleep
//                    returns today's 5 hardest items instead
// POST /api/review — record a review outcome { id, result }
// v1.1 Phase 3 (suggestions #1, #8)
//
// Enqueueing happens at error-creation time (/api/test-results,
// /api/error) — each new error becomes a review item due tomorrow.
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';
import { nextInterval, dueDate, type ReviewResult } from '@/lib/sr/scheduler';

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

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = createServiceClient();
    const presleep = req.nextUrl.searchParams.get('window') === 'presleep';

    if (presleep) {
      // 5 hardest items of the day: today's failures first, then lowest rung
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { data, error } = await db
        .from('review_queue')
        .select('id, topic, prompt_text, interval_idx, due_at, last_result')
        .eq('user_id', user.id)
        .or(`last_result.eq.fail,and(created_at.gte.${todayStart.toISOString()})`)
        .order('interval_idx', { ascending: true })
        .limit(5);
      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true, data: data ?? [], error: null });
    }

    const { data, error } = await db
      .from('review_queue')
      .select('id, topic, prompt_text, interval_idx, due_at, last_result')
      .eq('user_id', user.id)
      .lte('due_at', new Date().toISOString())
      .order('due_at', { ascending: true })
      .limit(20);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data ?? [], error: null });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to load review queue' },
      { status: 500 }
    );
  }
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

    const body = (await req.json()) as { id?: string; result?: string };
    const result = body.result as ReviewResult;
    if (!body.id || (result !== 'pass' && result !== 'fail')) {
      return NextResponse.json(
        { success: false, data: null, error: 'id and result (pass|fail) required' },
        { status: 400 }
      );
    }

    const db = createServiceClient();
    const { data: item, error: fetchErr } = await db
      .from('review_queue')
      .select('id, interval_idx')
      .eq('id', body.id)
      .eq('user_id', user.id)
      .single();
    if (fetchErr || !item) {
      return NextResponse.json(
        { success: false, data: null, error: 'Review item not found' },
        { status: 404 }
      );
    }

    const idx = nextInterval(item.interval_idx, result);
    const { error: updErr } = await db
      .from('review_queue')
      .update({
        interval_idx: idx,
        due_at: dueDate(idx).toISOString(),
        last_result: result,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', item.id)
      .eq('user_id', user.id);
    if (updErr) throw new Error(updErr.message);

    return NextResponse.json({
      success: true,
      data: { id: item.id, next_interval_idx: idx },
      error: null,
    });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to record review' },
      { status: 500 }
    );
  }
}
