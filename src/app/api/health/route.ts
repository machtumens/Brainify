import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';

// Lightweight provider checks — never expose keys in response.
// Returns { ok: true } or { ok: false } per provider.

async function checkGemini(): Promise<boolean> {
  if (!process.env.GEMINI_API_KEY) return false;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    await model.generateContent('ping');
    return true;
  } catch {
    return false;
  }
}

async function checkGroq(): Promise<boolean> {
  if (!process.env.GROQ_API_KEY) return false;
  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
    });
    return true;
  } catch {
    return false;
  }
}

async function checkOpenRouter(): Promise<boolean> {
  if (!process.env.OPENROUTER_API_KEY) return false;
  try {
    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    await client.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
    });
    return true;
  } catch {
    return false;
  }
}

async function checkRetroLastRun(): Promise<string | null> {
  try {
    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as any;
    const { data } = await db
      .from('retrospectives')
      .select('created_at')
      .eq('period_type', 'weekly')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.created_at ?? null;
  } catch {
    return null;
  }
}

async function checkSyncLastRun(): Promise<string | null> {
  try {
    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as any;
    const { data } = await db
      .from('sync_log')
      .select('run_at')
      .order('run_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.run_at ?? null;
  } catch {
    return null;
  }
}

export async function GET() {
  const [gemini, groq, openrouter, retroLastRun, syncLastRun] = await Promise.all([
    checkGemini(),
    checkGroq(),
    checkOpenRouter(),
    checkRetroLastRun(),
    checkSyncLastRun(),
  ]);

  const anyAvailable = gemini || groq || openrouter;

  return NextResponse.json(
    {
      success: anyAvailable,
      data: {
        gemini: gemini ? 'ok' : 'unavailable',
        groq: groq ? 'ok' : 'unavailable',
        openrouter: openrouter ? 'ok' : 'unavailable',
        retro_cron: retroLastRun ?? 'never',
        sync_last_run: syncLastRun ?? 'never',
      },
      error: anyAvailable ? null : 'All AI providers unavailable',
    },
    { status: anyAvailable ? 200 : 503 }
  );
}
