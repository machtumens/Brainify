// ================================================================
// POST /api/test — AI question generation for Test Simulator
// Sprint 5 | WBS 4.3 | US-014 | P19
//
// Pipeline:
//   1. Auth check via @supabase/ssr
//   2. Validate topics[] + difficulty
//   3. Fetch materials: textbook chapters + captures for selected topics
//   4. Fetch danger-zone errors for weighting
//   5. Build test-gen prompt (weighted toward danger zone, source-anchored)
//   6. AI cascade: Gemini → Groq → OpenRouter (non-streaming, JSON output)
//   7. Parse + validate Question[] response
//   8. Return { questions: Question[] }
//
// Law 14: createServiceClient server-only.
// Law 15: provider name never in response or error.
// Token budget: cap at 20k tokens (selected topic materials only).
// ================================================================

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import type { Question, GenerateTestRequest } from '@/types/test';
import { DIFFICULTY_PRESETS } from '@/utils/difficultyDefaults';

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

// ── DB helpers ───────────────────────────────────────────────────

interface TextbookRow {
  subject: string | null;
  title: string;
  topic_map: Record<string, string[]> | null;
}

interface CaptureRow {
  content: string | null;
  subject_tag: string | null;
  topic_tag: string | null;
}

interface ErrorRow {
  topic: string | null;
  subtopic: string | null;
  count: number;
}

async function fetchMaterials(topics: string[]): Promise<{
  textbooks: TextbookRow[];
  captures: CaptureRow[];
  dangerErrors: ErrorRow[];
}> {
  // Server-side: use service client for full read access
  const { createServiceClient } = await import('@/lib/supabase');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  const [tbRes, capRes, errRes] = await Promise.all([
    db.from('textbooks').select('subject, title, topic_map'),
    db.from('captures').select('content, subject_tag, topic_tag').order('captured_at', { ascending: false }).limit(50),
    db.from('errors').select('topic, subtopic').order('flagged_at', { ascending: false }).limit(100),
  ]);

  const textbooks: TextbookRow[] = (tbRes.data ?? []).filter((t: TextbookRow) =>
    topics.some((topic) =>
      t.subject?.toLowerCase() === topic.toLowerCase() ||
      Object.values(t.topic_map ?? {}).flat().some(
        (ch) => typeof ch === 'string' && ch.toLowerCase() === topic.toLowerCase()
      )
    )
  );

  const topicSet = new Set(topics.map((t) => t.toLowerCase()));

  const captures: CaptureRow[] = (capRes.data ?? []).filter((c: CaptureRow) =>
    (c.subject_tag && topicSet.has(c.subject_tag.toLowerCase())) ||
    (c.topic_tag && topicSet.has(c.topic_tag.toLowerCase()))
  );

  // Count errors per topic for danger-zone weighting
  const errFreq = new Map<string, number>();
  for (const e of (errRes.data ?? [])) {
    const key = (e.topic ?? '').toLowerCase();
    if (key) errFreq.set(key, (errFreq.get(key) ?? 0) + 1);
  }

  const dangerErrors: ErrorRow[] = Array.from(errFreq.entries())
    .filter(([k]) => topicSet.has(k))
    .map(([topic, count]) => ({ topic, subtopic: null, count }))
    .sort((a, b) => b.count - a.count);

  return { textbooks, captures, dangerErrors };
}

// ── Prompt builder ───────────────────────────────────────────────

function buildTestGenPrompt(
  topics: string[],
  difficulty: GenerateTestRequest['difficulty'],
  count: number,
  textbooks: TextbookRow[],
  captures: CaptureRow[],
  dangerErrors: ErrorRow[]
): string {
  const preset = DIFFICULTY_PRESETS[difficulty];
  const easyCount  = Math.round(count * preset.easy   / 100);
  const mediumCount = Math.round(count * preset.medium / 100);
  const hardCount  = count - easyCount - mediumCount;

  const dangerTopics = dangerErrors.map((e) => e.topic).filter(Boolean).slice(0, 5);

  const textbookSummary = textbooks.map((t) => {
    const chapters = t.topic_map ? Object.entries(t.topic_map).map(([ch, subtopics]) =>
      `  Chapter "${ch}": ${Array.isArray(subtopics) ? subtopics.join(', ') : '(no subtopics)'}`
    ).join('\n') : '  (no chapter map)';
    return `Textbook: "${t.title}" (subject: ${t.subject ?? 'unknown'})\n${chapters}`;
  }).join('\n\n');

  const capturesSummary = captures.slice(0, 20).map((c, i) =>
    `[Note ${i + 1}] (${c.topic_tag ?? c.subject_tag ?? 'general'}): ${(c.content ?? '').slice(0, 300)}`
  ).join('\n');

  return `You are a rigorous exam question generator for a student's personal study materials. Your ONLY job is to generate multiple-choice questions grounded in the provided source materials.

CRITICAL RULES:
1. Questions MUST reference actual content from the textbook chapters or student notes below. Do not invent facts.
2. Every question must have exactly 4 options. Only one option is correct.
3. Distribute difficulty: ${easyCount} easy, ${mediumCount} medium, ${hardCount} hard question${count !== 1 ? 's' : ''}.
4. Weight questions toward DANGER ZONE topics (topics with most recorded mistakes): ${dangerTopics.length > 0 ? dangerTopics.join(', ') : 'none flagged — distribute evenly'}.
5. Cover these selected topics: ${topics.join(', ')}.
6. Output ONLY valid JSON — no markdown, no explanation, no preamble.

SOURCE MATERIALS:
${textbookSummary || '(no textbook chapters available for selected topics)'}

STUDENT NOTES:
${capturesSummary || '(no captured notes available for selected topics)'}

OUTPUT FORMAT (strict JSON array):
[
  {
    "topic": "<one of the selected topics>",
    "text": "<question stem>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "correct_answer": <0|1|2|3>,
    "difficulty": "<easy|medium|hard>"
  }
]

Generate exactly ${count} question${count !== 1 ? 's' : ''} now.`;
}

// ── AI cascade (non-streaming, structured JSON) ──────────────────

async function callGemini(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) throw new Error('Gemini key missing');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callGroq(prompt: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) throw new Error('Groq key missing');
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  });
  return completion.choices[0]?.message?.content ?? '';
}

async function callOpenRouter(prompt: string): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) throw new Error('OpenRouter key missing');
  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const completion = await client.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct:free',
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  });
  return completion.choices[0]?.message?.content ?? '';
}

async function generateQuestions(prompt: string): Promise<string> {
  try {
    const text = await callGemini(prompt);
    return text;
  } catch {
    try {
      const text = await callGroq(prompt);
      return text;
    } catch {
      const text = await callOpenRouter(prompt);
      return text;
    }
  }
}

// ── Parse + validate ─────────────────────────────────────────────

function extractJson(raw: string): string {
  // Strip markdown code fences if present
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  // Find first '[' to last ']'
  const start = raw.indexOf('[');
  const end   = raw.lastIndexOf(']');
  if (start !== -1 && end !== -1 && end > start) return raw.slice(start, end + 1);
  return raw.trim();
}

function validateQuestion(q: unknown, idx: number): Question {
  if (typeof q !== 'object' || q === null) throw new Error(`Question ${idx} not an object`);
  const obj = q as Record<string, unknown>;

  const text = String(obj.text ?? '').replace(/<[^>]*>/g, '').trim();
  const topic = String(obj.topic ?? '').replace(/<[^>]*>/g, '').trim();
  const difficulty = ['easy', 'medium', 'hard'].includes(String(obj.difficulty))
    ? (String(obj.difficulty) as 'easy' | 'medium' | 'hard')
    : 'medium';
  const correct_answer = Number(obj.correct_answer);

  if (!text) throw new Error(`Question ${idx} missing text`);
  if (!Array.isArray(obj.options) || obj.options.length !== 4) {
    throw new Error(`Question ${idx} must have exactly 4 options`);
  }
  if (![0, 1, 2, 3].includes(correct_answer)) {
    throw new Error(`Question ${idx} correct_answer must be 0–3`);
  }

  const options = obj.options.map((o: unknown) =>
    String(o ?? '').replace(/<[^>]*>/g, '').trim()
  ) as [string, string, string, string];

  return {
    id: crypto.randomUUID(),
    topic,
    text,
    options,
    correct_answer: correct_answer as 0 | 1 | 2 | 3,
    difficulty,
  };
}

function parseQuestions(raw: string): Question[] {
  const jsonStr = extractJson(raw);
  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) throw new Error('Expected JSON array');
  return parsed.map((q, i) => validateQuestion(q, i));
}

// ── POST handler ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as Partial<GenerateTestRequest>;
    const topics: string[] = Array.isArray(body.topics) ? body.topics.filter(
      (t): t is string => typeof t === 'string' && t.trim().length > 0
    ).slice(0, 10) : [];

    if (topics.length === 0) {
      return Response.json(
        { success: false, data: null, error: 'At least one topic required' },
        { status: 400 }
      );
    }

    const difficulty = ['easy', 'medium', 'hard'].includes(String(body.difficulty))
      ? (body.difficulty as GenerateTestRequest['difficulty'])
      : 'medium';

    const count = Math.min(Math.max(Number(body.count) || 5, 1), 10);

    const { textbooks, captures, dangerErrors } = await fetchMaterials(topics);

    const prompt = buildTestGenPrompt(
      topics, difficulty, count, textbooks, captures, dangerErrors
    );

    const rawText = await generateQuestions(prompt);
    const questions = parseQuestions(rawText);

    return Response.json({
      success: true,
      data: { questions },
      error: null,
    });
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Question generation failed' },
      { status: 500 }
    );
  }
}
