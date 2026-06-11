// ================================================================
// POST /api/error — create error row, return id
// Sprint 5 | WBS 7.3 | US-015 | P20
//
// Used by:
//   - Manual "flag mistake" button (future UI)
//   - /api/test-results (auto-logging wrong answers)
//
// Auth required. Validates topic. Returns { id }.
// problem_type must be one of the DB enum values or null.
// Law 14: createServiceClient server-only.
// ================================================================

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const VALID_PROBLEM_TYPES = new Set([
  'algebraic', 'geometric', 'proof', 'application', 'recall',
]);

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

interface CreateErrorRequest {
  session_id?: string | null;
  topic: string;
  subtopic?: string | null;
  problem_type?: string | null;
  mistake_description?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as Partial<CreateErrorRequest>;

    const topic = String(body.topic ?? '').trim().slice(0, 200);
    if (!topic) {
      return Response.json(
        { success: false, data: null, error: 'topic required' },
        { status: 400 }
      );
    }

    const rawProblemType = String(body.problem_type ?? '').trim();
    const problemType = VALID_PROBLEM_TYPES.has(rawProblemType)
      ? rawProblemType
      : null;

    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient();

    const { data, error } = await db
      .from('errors')
      .insert({
        user_id:             user.id,
        session_id:          body.session_id ?? null,
        topic,
        subtopic:            String(body.subtopic ?? '').trim().slice(0, 200) || null,
        problem_type:        problemType,
        mistake_description: String(body.mistake_description ?? '').trim().slice(0, 1000) || null,
      })
      .select('id')
      .single();

    if (error) throw error;

    return Response.json({ success: true, data: { id: data.id }, error: null });
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Failed to log error' },
      { status: 500 }
    );
  }
}
