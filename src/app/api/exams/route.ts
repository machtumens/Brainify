// ================================================================
// GET  /api/exams — upcoming exam dates (soonest first)
// POST /api/exams — register an exam { title, subject?, exam_on }
// DELETE /api/exams?id= — remove one
// v1.1 Phase 4 (suggestion #15): explicit exam registry replaces
// deriving the countdown from goals jsonb.
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';

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

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = createServiceClient();
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await db
      .from('exam_dates')
      .select('id, title, subject, exam_on')
      .eq('user_id', user.id)
      .gte('exam_on', today)
      .order('exam_on', { ascending: true });
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data ?? [], error: null });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to load exams' },
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

    const body = (await req.json()) as { title?: string; subject?: string; exam_on?: string };
    const title = String(body.title ?? '').trim().slice(0, 200);
    const examOn = String(body.exam_on ?? '').trim();
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(examOn)) {
      return NextResponse.json(
        { success: false, data: null, error: 'title and exam_on (YYYY-MM-DD) required' },
        { status: 400 }
      );
    }

    const db = createServiceClient();
    const { data, error } = await db
      .from('exam_dates')
      .insert({
        user_id: user.id,
        title,
        subject: String(body.subject ?? '').trim().slice(0, 100) || null,
        exam_on: examOn,
      })
      .select('id, title, subject, exam_on')
      .single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data, error: null }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to register exam' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = req.nextUrl.searchParams.get('id') ?? '';
    if (!id) {
      return NextResponse.json(
        { success: false, data: null, error: 'id required' },
        { status: 400 }
      );
    }

    const db = createServiceClient();
    const { error } = await db
      .from('exam_dates')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: { id }, error: null });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to delete exam' },
      { status: 500 }
    );
  }
}
