// ================================================================
// GET  /api/tutor — context counts for ContextIndicator
// POST /api/tutor — streaming tutor chat response (SSE)
// Sprint 4 | WBS 5.1–5.3 | US-016
//
// POST pipeline:
//   1. Auth check via @supabase/ssr
//   2. Sanitize user message
//   3. Assemble full context (all 6 tables)
//   4. Build tutor system prompt
//   5. Stream response: Gemini → Groq → OpenRouter
//   6. SSE format: data: {"token":"..."}\n\n ... data: [DONE]\n\n
//
// Law 15: provider name never appears in response or error.
// ================================================================

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { assembleContext } from '@/lib/context-assembler';

// ── Auth helper ──────────────────────────────────────────────────

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

// ── Sanitize ─────────────────────────────────────────────────────

function sanitizeMessage(raw: string): string {
  return raw.trim().replace(/<[^>]*>/g, '').slice(0, 2000);
}

// ── Prompt builder ───────────────────────────────────────────────

const TUTOR_SYSTEM =
  `You are a patient, knowledgeable study tutor. Your student is working toward personal academic goals. You have full context about their progress, errors, textbooks, and notes.

RULES:
- Answer questions using the student's own study materials and goals as grounding.
- If you reference an error pattern, cite the specific topic from their error records.
- Keep answers concise and direct. Use plain language — no academic prose, no headers unless the student asks.
- Do not hallucinate textbook content. If asked about a formula or chapter not in context, say: "I don't have that chapter's content — try the primer for that topic."
- Never reveal the name of any AI provider, model, or API service.
- If the student asks something unrelated to their studies, gently redirect: "Let's keep our focus on your study goals."`;

interface HistoryMessage {
  role: string;
  content: string;
}

function buildTutorPrompt(
  context: Awaited<ReturnType<typeof assembleContext>>,
  history: HistoryMessage[],
  userMessage: string
): string {
  const contextStr = JSON.stringify(
    {
      goals: context.goals,
      sessions: context.sessions.slice(0, 10),
      errors: context.errors.slice(0, 15),
      captures: context.captures.slice(0, 20),
      textbooks: context.textbooks,
      confusion_map: context.confusion_map,
    },
    null,
    2
  );

  const historyStr =
    history.length > 0
      ? history
          .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
          .join('\n')
      : '';

  return [
    TUTOR_SYSTEM,
    '',
    '--- STUDENT CONTEXT ---',
    contextStr,
    '',
    history.length > 0 ? '--- CONVERSATION HISTORY ---' : '',
    history.length > 0 ? historyStr : '',
    history.length > 0 ? '' : '',
    '--- CURRENT QUESTION ---',
    `Student: ${userMessage}`,
    '',
    'Tutor:',
  ]
    .filter((line) => line !== undefined)
    .join('\n');
}

// ── Streaming providers ──────────────────────────────────────────

type StreamController = ReadableStreamDefaultController<Uint8Array>;

async function streamGemini(
  prompt: string,
  controller: StreamController,
  encoder: TextEncoder
): Promise<void> {
  if (!process.env.GEMINI_API_KEY) throw new Error('Gemini key missing');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`)
      );
    }
  }
}

async function streamGroq(
  prompt: string,
  controller: StreamController,
  encoder: TextEncoder
): Promise<void> {
  if (!process.env.GROQ_API_KEY) throw new Error('Groq key missing');
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? '';
    if (token) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
      );
    }
  }
}

async function streamOpenRouter(
  prompt: string,
  controller: StreamController,
  encoder: TextEncoder
): Promise<void> {
  if (!process.env.OPENROUTER_API_KEY) throw new Error('OpenRouter key missing');
  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const stream = await client.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct:free',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });
  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? '';
    if (token) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
      );
    }
  }
}

// ── GET — context counts ─────────────────────────────────────────

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const context = await assembleContext();
    return Response.json({
      success: true,
      data: {
        goals: context.goals.length,
        errors: context.errors.length,
        captures: context.captures.length,
        sessions: context.sessions.length,
        textbooks: context.textbooks.length,
      },
      error: null,
    });
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Context fetch failed' },
      { status: 500 }
    );
  }
}

// ── POST — streaming response ────────────────────────────────────

interface TutorBody {
  message?: string;
  history?: HistoryMessage[];
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

    const body = (await req.json()) as TutorBody;
    const userMessage = sanitizeMessage(body.message ?? '');
    if (!userMessage) {
      return Response.json(
        { success: false, data: null, error: 'Message required' },
        { status: 400 }
      );
    }

    // Sanitize history — limit to last 10 turns, strip HTML from each
    const history: HistoryMessage[] = (body.history ?? [])
      .slice(-10)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'ai',
        content: String(m.content ?? '').replace(/<[^>]*>/g, '').slice(0, 1000),
      }));

    const context = await assembleContext();
    const prompt = buildTutorPrompt(context, history, userMessage);

    const encoder = new TextEncoder();

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        let streamed = false;
        try {
          await streamGemini(prompt, controller, encoder);
          streamed = true;
        } catch {
          try {
            await streamGroq(prompt, controller, encoder);
            streamed = true;
          } catch {
            try {
              await streamOpenRouter(prompt, controller, encoder);
              streamed = true;
            } catch {
              // all providers failed — streamed remains false
            }
          }
        }

        if (!streamed) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ token: 'AI service unavailable. Please try again.' })}\n\n`
            )
          );
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Tutor request failed' },
      { status: 500 }
    );
  }
}
