import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { callAI } from '@/lib/ai-router';

interface InsightBody {
  goalId: string;
  title: string;
  status: string;
  pctToMilestone: number;
  amberTrigger: string | null;
  unlockCondition: string | null;
}

export async function POST(req: NextRequest) {
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
            } catch { /* read-only */ }
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, data: null, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as InsightBody;

    const statusNote = body.status === 'locked'
      ? `This goal is locked. Unlock condition: ${body.unlockCondition ?? 'unknown'}.`
      : body.amberTrigger
        ? `FLAGGED: ${body.amberTrigger}. Currently ${body.pctToMilestone}% complete.`
        : `Currently ${body.pctToMilestone}% complete.`;

    const prompt = `Goal: "${body.title}". ${statusNote}
Write exactly 1 sentence (max 20 words) about pace vs plan or readiness. Be specific, not generic. No filler. No markdown.`;

    const { text } = await callAI(prompt);
    const insight = text.trim().replace(/^["']|["']$/g, '');

    return NextResponse.json({ success: true, data: { insight }, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Insight failed';
    return NextResponse.json({ success: false, data: null, error: message }, { status: 500 });
  }
}
