// ================================================================
// GET /api/captures/search?q= — ILIKE search across captured notes
// v1.1 Phase 3 (suggestion #17)
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

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const q = (req.nextUrl.searchParams.get('q') ?? '').trim().slice(0, 200);
    if (!q) {
      return NextResponse.json(
        { success: false, data: null, error: 'q required' },
        { status: 400 }
      );
    }

    const db = createServiceClient();
    const { data, error } = await db
      .from('captures')
      .select('id, content, subject_tag, topic_tag, type, created_at')
      .eq('user_id', user.id)
      .ilike('content', `%${q}%`)
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, data: data ?? [], error: null });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Search failed' },
      { status: 500 }
    );
  }
}
