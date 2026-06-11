// ================================================================
// GET /api/memory — read permanent memory (all scopes + recent log)
// PUT /api/memory — manually edit a memory scope
// v1.1 Phase 1
//
// Law 14: createServiceClient server-only.
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';
import { writeMemory, type MemoryScope } from '@/lib/memory/memoryManager';

const SCOPES: MemoryScope[] = ['main', 'tutor', 'test_gen', 'brief', 'retro'];

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
    const [memRes, logRes] = await Promise.all([
      db
        .from('ai_memory')
        .select('scope, content, version, updated_at')
        .eq('user_id', user.id),
      db
        .from('memory_log')
        .select('scope, trigger_type, summary, version, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    return NextResponse.json({
      success: true,
      data: { memories: memRes.data ?? [], log: logRes.data ?? [] },
      error: null,
    });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to load memory' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as { scope?: string; content?: string };
    const scope = body.scope as MemoryScope;
    const content = typeof body.content === 'string' ? body.content : null;

    if (!SCOPES.includes(scope) || content === null) {
      return NextResponse.json(
        { success: false, data: null, error: 'scope and content required' },
        { status: 400 }
      );
    }

    await writeMemory(user.id, scope, content, 'manual');

    return NextResponse.json({ success: true, data: { scope }, error: null });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to save memory' },
      { status: 500 }
    );
  }
}
