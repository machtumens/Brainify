// ================================================================
// GET  /api/test-results — last 10 test results for user
// POST /api/test-results — submit test: create errors + test_results row
// Sprint 5 | WBS 4.5, 4.7 | US-015 | P20
//
// POST pipeline:
//   1. Auth check
//   2. Identify wrong answers (selections[q.id] !== q.correct_answer)
//   3. Create error row for each wrong answer (topic, subtopic, problem_type, description)
//   4. Insert test_results: score, total, duration, wrong_ids[], topics[], subject
//   5. Return TestResultSummary
//
// Breaking-change guard (principles.md §10 Mistake 18):
//   wrong_ids must contain actual errors.id values — created synchronously here.
//
// Law 14: createServiceClient server-only.
// ================================================================

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rewriteMainMemory } from '@/lib/memory/memoryManager';
import type { Question, SubmitTestRequest } from '@/types/test';

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
          } catch { /* read-only */ }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── GET — past test history ───────────────────────────────────────

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient();

    const { data, error } = await db
      .from('test_results')
      .select('id, score, total, duration, topics, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return Response.json({ success: true, data: data ?? [], error: null });
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

// ── POST — submit test ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as Partial<SubmitTestRequest>;

    const questions: Question[] = Array.isArray(body.questions) ? body.questions : [];
    const selections: Record<string, number> =
      body.selections && typeof body.selections === 'object' ? body.selections : {};
    const topics: string[] = Array.isArray(body.topics)
      ? body.topics.filter((t): t is string => typeof t === 'string')
      : [];
    const duration = Math.max(0, Number(body.duration) || 0);

    if (questions.length === 0) {
      return Response.json(
        { success: false, data: null, error: 'No questions provided' },
        { status: 400 }
      );
    }

    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient();

    // Identify wrong answers (answered and incorrect)
    const wrongQuestions = questions.filter(
      (q) => selections[q.id] !== undefined && selections[q.id] !== q.correct_answer
    );

    const score = questions.filter((q) => selections[q.id] === q.correct_answer).length;

    // Create error rows synchronously — wrong_ids must reference real errors.id
    const LABELS = ['A', 'B', 'C', 'D'] as const;
    const wrongIds: string[] = [];

    for (const q of wrongQuestions) {
      const selectedIdx = selections[q.id];
      const selectedLabel = LABELS[selectedIdx] ?? '?';
      const correctLabel  = LABELS[q.correct_answer];

      const { data: errData, error: errErr } = await db
        .from('errors')
        .insert({
          user_id:             user.id,
          session_id:          null,
          topic:               q.topic.slice(0, 200),
          subtopic:            q.topic.slice(0, 200),
          problem_type:        'recall',
          mistake_description: `Test: chose ${selectedLabel}, correct ${correctLabel}. Q: ${q.text.slice(0, 200)}`,
        })
        .select('id')
        .single();

      if (!errErr && errData?.id) wrongIds.push(errData.id);
    }

    // Insert test_results row
    const { data: trData, error: trErr } = await db
      .from('test_results')
      .insert({
        user_id:   user.id,
        test_type: 'timed',
        subject:   topics[0] ?? 'mixed',
        topics,
        score,
        total:     questions.length,
        duration,
        wrong_ids: wrongIds,
      })
      .select('id, score, total, duration, topics, wrong_ids, created_at')
      .single();

    if (trErr) throw trErr;

    // Memory rewrite — fire-and-forget
    const wrongTopics = Array.from(new Set(wrongQuestions.map((q) => q.topic))).slice(0, 5);
    rewriteMainMemory(
      user.id,
      'test',
      `Test submitted: ${score}/${questions.length} on topics [${topics.join(', ')}], duration ${duration}s.${wrongTopics.length > 0 ? ` Wrong answers in: ${wrongTopics.join(', ')}.` : ' No mistakes.'}`
    ).catch(() => { /* memory lag acceptable */ });

    return Response.json({
      success: true,
      data: {
        id:         trData.id,
        score:      trData.score,
        total:      trData.total,
        duration:   trData.duration,
        topics:     trData.topics ?? [],
        wrong_ids:  trData.wrong_ids ?? [],
        created_at: trData.created_at,
      },
      error: null,
    });
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Failed to submit test' },
      { status: 500 }
    );
  }
}
