import { NextResponse } from 'next/server';
import { assembleContext } from '@/lib/context-assembler';
import { callAI, buildPrompt } from '@/lib/ai-router';
import { createServiceClient } from '@/lib/supabase';

const BRIEF_INSTRUCTION =
  'In 2-4 sentences, plain language: detect drift, surface danger topics, flag ML goal if >5 days missed, adjust today\'s tasks if needed. Reference the specific goal and session data provided. The PERMANENT MEMORY section is authoritative — trust it over raw rows when they conflict.';

export async function POST() {
  try {
    // Single-user prototype: resolve user for permanent-memory read
    const db = createServiceClient();
    const { data: firstUser } = await db.from('users').select('id').limit(1).maybeSingle();

    const context = await assembleContext(
      firstUser?.id ? { userId: firstUser.id, scope: 'brief' } : {}
    );

    const prompt = buildPrompt(BRIEF_INSTRUCTION, context);
    const { text } = await callAI(prompt);

    return NextResponse.json({ success: true, data: { brief: text }, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Brief generation failed';
    // Provider name never surfaces here — callAI throws generic messages only
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
