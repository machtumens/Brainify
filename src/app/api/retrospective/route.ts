// ================================================================
// POST /api/retrospective — Weekly retrospective cron
// GET  /api/retrospective — History list for RetroHistoryList
// Sprint 5 | WBS 7.4 | US-019 | P22
//
// POST pipeline (called by Vercel cron every Sunday 8am UTC):
//   0 8 * * 0 (vercel.json)
//   1. CRON_SECRET header check
//   2. Look up single user (single-user prototype)
//   3. Assemble last 7 days: sessions, goals, errors, captures
//   4. AI generates 5 structured fields as JSON
//   5. Insert into retrospectives table → 201
//
// GET pipeline (called by RetroHistoryList component):
//   1. Cookie-based auth check
//   2. Query retrospectives for user, newest first
//
// Security: CRON_SECRET checked on POST. If CRON_SECRET env var is
//   unset (local dev), request is allowed without the header.
//
// R8 risk: AI rate-limited → same cascade router handles it.
// Error on cron fail: logged, next Sunday fires fresh (no retry).
//
// Law 14: createServiceClient server-only.
// Law 15: provider name never in response.
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { callAI } from '@/lib/ai-router';
import type { RetrospectiveRow } from '@/types/database';

// ── CRON_SECRET auth ─────────────────────────────────────────────
// Vercel sends: Authorization: Bearer <CRON_SECRET>
// If env var not set, skip check (dev / manual test).

function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

// ── Cookie-based auth (for GET) ──────────────────────────────────

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

// ── Weekly context assembly ──────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

interface RetroContext {
  period: string;
  sessions_this_week: number;
  days_with_sessions: number;
  goals: object[];
  top_errors: object[];
  captures_count: number;
}

async function assembleRetroContext(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any
): Promise<RetroContext> {
  const weekStart = daysAgo(7);

  const [sessionsRes, goalsRes, errorsRes, capturesRes] = await Promise.all([
    db
      .from('sessions')
      .select('id, task_title, subject, pomodoros, difficulty, mode, started_at')
      .gte('started_at', weekStart)
      .order('started_at', { ascending: false }),
    db
      .from('goals')
      .select('id, title, category, status, current_month')
      .in('status', ['active', 'locked']),
    db
      .from('errors')
      .select('topic, subtopic, problem_type')
      .gte('flagged_at', weekStart),
    db
      .from('captures')
      .select('id')
      .gte('created_at', weekStart),
  ]);

  const sessions: Array<{ started_at: string }> = sessionsRes.data ?? [];
  const goals: object[] = goalsRes.data ?? [];
  const errors: object[] = errorsRes.data ?? [];
  const captures: object[] = capturesRes.data ?? [];

  // Days in the past week that had at least one session
  const daysWithSessions = new Set(
    sessions.map((s) => new Date(s.started_at).toDateString())
  ).size;

  // Top error topics this week
  const errorFreq = new Map<string, number>();
  for (const e of errors as Array<{ topic: string }>) {
    const k = e.topic ?? 'unknown';
    errorFreq.set(k, (errorFreq.get(k) ?? 0) + 1);
  }
  const topErrors = Array.from(errorFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  return {
    period: 'last 7 days',
    sessions_this_week: sessions.length,
    days_with_sessions: daysWithSessions,
    goals,
    top_errors: topErrors,
    captures_count: captures.length,
  };
}

// ── Retro prompt ─────────────────────────────────────────────────
// §12.3: "Weekly report. Tone: direct, factual. Cover: coverage rate,
//  consistency rate, velocity trend, highest-risk goal, one actionable
//  recommendation." | Store structured fields separately.

const RETRO_INSTRUCTION = `Weekly study retrospective. Tone: direct, factual.
Analyse the provided data covering the last 7 days.

Return ONLY valid JSON with exactly these 5 fields:
{
  "coverage_rate": <number 0-1, proportion of 7 days that had at least one study session>,
  "consistency_rate": <number 0-1, same as coverage_rate unless you have reason to weight it differently>,
  "velocity_trend": <"improving" | "stable" | "declining" — based on session frequency vs prior pattern>,
  "risk_topic": <string, the goal or topic most at risk of falling behind>,
  "recommendation": <string, one specific actionable recommendation for the coming week>
}

Do not add explanation, headers, or markdown fences. Return only the JSON object.`;

// ── Structured AI parse ──────────────────────────────────────────

interface RetroFields {
  coverage_rate: number;
  consistency_rate: number;
  velocity_trend: string;
  risk_topic: string;
  recommendation: string;
}

function parseRetroFields(text: string, fallback: RetroContext): RetroFields {
  try {
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned) as Partial<RetroFields>;
    return {
      coverage_rate: Math.min(1, Math.max(0, Number(parsed.coverage_rate) || 0)),
      consistency_rate: Math.min(1, Math.max(0, Number(parsed.consistency_rate) || 0)),
      velocity_trend: String(parsed.velocity_trend || 'unknown').slice(0, 50),
      risk_topic: String(parsed.risk_topic || 'unknown').slice(0, 200),
      recommendation: String(parsed.recommendation || '').slice(0, 1000),
    };
  } catch {
    // Derive metrics from raw context if AI response is unparseable
    const consistencyRate = +(fallback.days_with_sessions / 7).toFixed(2);
    return {
      coverage_rate: consistencyRate,
      consistency_rate: consistencyRate,
      velocity_trend: 'unknown',
      risk_topic: 'unknown',
      recommendation: text.slice(0, 500),
    };
  }
}

// ── POST — cron entry point ──────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    if (!isCronAuthorized(req)) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as any;

    // Look up the single user (single-user prototype)
    const { data: firstUser } = await db
      .from('users')
      .select('id')
      .limit(1)
      .single();

    const userId: string | null = firstUser?.id ?? null;

    // Assemble last-7-day context
    const context = await assembleRetroContext(db);

    // AI call
    const prompt = `${RETRO_INSTRUCTION}\n\nData:\n${JSON.stringify(context, null, 2)}`;
    const { text } = await callAI(prompt);
    const fields = parseRetroFields(text, context);

    // Build content summary (stored in content column)
    const content = [
      `Coverage: ${Math.round(fields.coverage_rate * 100)}%`,
      `Consistency: ${Math.round(fields.consistency_rate * 100)}%`,
      `Velocity: ${fields.velocity_trend}`,
      `Risk: ${fields.risk_topic}`,
      fields.recommendation,
    ].join(' | ');

    // period_start = 7 days ago (start of this week window)
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - 7);
    const period_start = periodStart.toISOString().slice(0, 10);

    const insertRow: Record<string, unknown> = {
      period_type: 'weekly',
      period_start,
      content,
      coverage_rate: fields.coverage_rate,
      consistency_rate: fields.consistency_rate,
      risk_topic: fields.risk_topic,
    };
    if (userId) insertRow.user_id = userId;

    const { data: retro, error: insertErr } = await db
      .from('retrospectives')
      .insert(insertRow)
      .select('*')
      .single();

    if (insertErr) throw insertErr;

    return NextResponse.json(
      { success: true, data: retro as RetrospectiveRow, error: null },
      { status: 201 }
    );
  } catch (err) {
    // Cron fail: log, do not retry — next Sunday fires fresh
    const message = err instanceof Error ? err.message : 'Retrospective generation failed';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}

// ── GET — history for RetroHistoryList ───────────────────────────

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as any;

    const { data, error } = await db
      .from('retrospectives')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: (data ?? []) as RetrospectiveRow[],
      error: null,
    });
  } catch {
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch retrospectives' },
      { status: 500 }
    );
  }
}
