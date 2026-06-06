import { NextResponse } from 'next/server';
import { assembleContext } from '@/lib/context-assembler';
import { callAI, buildPrompt } from '@/lib/ai-router';

const BRIEF_INSTRUCTION =
  'In 2-4 sentences, plain language: detect drift, surface danger topics, flag ML goal if >5 days missed, adjust today\'s tasks if needed. Reference the specific goal and session data provided.';

export async function POST() {
  try {
    const context = await assembleContext();

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
