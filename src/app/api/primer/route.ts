import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';
import { callAI } from '@/lib/ai-router.js';

export interface PrimerData {
  formula: string;
  lastError: string;
  ownNote: string;
}

interface PrimerBody {
  subject?: string;
  topic?: string;
}

function sanitize(raw: string): string {
  return raw.trim().replace(/<[^>]*>/g, '').slice(0, 200);
}

function buildPrimerPrompt(
  subject: string,
  topic: string | null,
  textbookInfo: string,
  errorRecord: string,
  captureRecord: string,
): string {
  return `You are preparing a pre-session study primer. Return a JSON object with exactly these 3 keys.

RULES:
- "formula": The key formula or concept for the topic, taken from the textbook data below. If textbook data is unavailable, write the most fundamental formula for the topic using only standard notation.
- "lastError": Copy the user's last error description exactly from the error record below. If no error record: use "No errors logged yet."
- "ownNote": Copy one sentence from the user's own note below. If no capture record: use "No notes for this topic yet."
- Use ONLY the data provided. Do not invent errors or notes.
- Respond with ONLY the JSON object — no markdown, no explanation, no code fences.

DATA:
Subject: ${subject}
Topic: ${topic ?? 'general'}
${textbookInfo}
Last error record: ${errorRecord}
Last note/capture: ${captureRecord}

Return format:
{"formula":"...","lastError":"...","ownNote":"..."}`;
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
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
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json() as PrimerBody;
    const subject = body.subject ? sanitize(body.subject) : 'general';
    const topic = body.topic ? sanitize(body.topic) : null;

    const db = createServiceClient();

    // Fetch last error for this topic/subject
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorQuery = (db as any)
      .from('errors')
      .select('topic, subtopic, problem_type, mistake_description, flagged_at')
      .eq('user_id', user.id)
      .order('flagged_at', { ascending: false })
      .limit(1);

    if (topic) {
      errorQuery.ilike('topic', `%${topic}%`);
    }

    const { data: errors } = await errorQuery;
    const lastError = errors?.[0] ?? null;

    // Fetch last capture for this subject
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: captures } = await (db as any)
      .from('captures')
      .select('content, type, topic_tag, created_at')
      .eq('user_id', user.id)
      .eq('subject_tag', subject)
      .not('content', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1);
    const lastCapture = captures?.[0] ?? null;

    // Fetch textbook for this subject
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: textbooks } = await (db as any)
      .from('textbooks')
      .select('title, author, subject, current_page, total_pages, topic_map')
      .eq('user_id', user.id)
      .eq('subject', subject)
      .limit(1);
    const textbook = textbooks?.[0] ?? null;

    // Build context strings for the prompt
    const textbookInfo = textbook
      ? `Textbook: "${textbook.title}" by ${textbook.author ?? 'unknown'}. Current page: ${textbook.current_page}/${textbook.total_pages}. Topic map chapters: ${Object.keys(textbook.topic_map ?? {}).join(', ')}.`
      : 'Textbook: None registered for this subject.';

    const errorRecord = lastError
      ? `Topic: ${lastError.topic ?? 'unknown'}. Subtopic: ${lastError.subtopic ?? 'unknown'}. Type: ${lastError.problem_type ?? 'unknown'}. Error: ${lastError.mistake_description ?? 'no description'}. Flagged: ${lastError.flagged_at}.`
      : 'None';

    const captureRecord = lastCapture
      ? `"${lastCapture.content}"`
      : 'None';

    const prompt = buildPrimerPrompt(subject, topic, textbookInfo, errorRecord, captureRecord);

    // Call AI
    const { text } = await callAI(prompt);

    // Parse JSON response — extract from potential markdown fences
    let primerData: PrimerData;
    try {
      const clean = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      const parsed = JSON.parse(jsonMatch[0]);
      primerData = {
        formula: String(parsed.formula ?? 'Formula unavailable.'),
        lastError: String(parsed.lastError ?? (lastError ? 'Error record unavailable.' : 'No errors logged yet.')),
        ownNote: String(parsed.ownNote ?? 'No notes for this topic yet.'),
      };
    } catch {
      // Fallback: use raw text as formula, derive rest from DB directly
      primerData = {
        formula: text.slice(0, 200),
        lastError: lastError?.mistake_description ?? 'No errors logged yet.',
        ownNote: lastCapture?.content?.slice(0, 200) ?? 'No notes for this topic yet.',
      };
    }

    return NextResponse.json({ success: true, data: primerData, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Primer fetch failed';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
