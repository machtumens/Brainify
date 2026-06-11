import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';

interface SessionBody {
  task_title?: string;
  subject?: string;
  pomodoros?: number;
  pages_done?: number;
  problems_done?: number;
  difficulty?: 1 | 2 | 3;
  mode?: 'struggle' | 'flow' | 'standard';
  notes?: string;
}

function sanitize(raw: string): string {
  return raw
    .trim()
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .slice(0, 500);
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
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

    const body = await req.json() as SessionBody;

    const task_title = body.task_title ? sanitize(body.task_title) : null;
    const subject = body.subject ? sanitize(body.subject) : null;

    const db = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await db
      .from('sessions')
      .insert({
        user_id: user.id,
        task_title,
        subject,
        pomodoros: body.pomodoros ?? 0,
        pages_done: body.pages_done ?? 0,
        problems_done: body.problems_done ?? 0,
        difficulty: body.difficulty ?? 1,
        mode: body.mode ?? 'standard',
        started_at: new Date().toISOString(),
        notes: body.notes ?? null,
      })
      .select('id')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: { id: data.id }, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Session log failed';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
