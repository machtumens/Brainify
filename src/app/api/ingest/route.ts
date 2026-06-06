// ================================================================
// POST /api/ingest — Full ingest pipeline
// Sprint 4 | WBS 7.2 | US-021
//
// Accepts: text (JSON) | audio (multipart) | image (multipart) |
//          pdf (multipart, treated as text) | markdown (JSON)
//
// Pipeline:
//   1. Auth check via @supabase/ssr
//   2. Parse content by Content-Type (JSON vs multipart/form-data)
//   3. Route to content-type processor
//   4. AI auto-tag: subject_tag, content_type, topic_tag, textbook_association
//   5. Write to captures table
//   6. Mistake detection: keywords → insert to errors table
//   7. Source web recalculation: upsert sources table quality for topic
//   8. Return 202 Accepted (async-safe — non-blocking for UI)
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/lib/supabase';
import { sanitize, autoTag, hasMistakeKeyword } from '@/lib/ingest/textProcessor';
import { processAudio } from '@/lib/ingest/audioProcessor';
import { processImage } from '@/lib/ingest/imageProcessor';
import type { CaptureRow } from '@/types/database';

type SourceType = NonNullable<CaptureRow['source_type']>;

// ── Auth helper ─────────────────────────────────────────────────

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

// ── Source web recalculation ─────────────────────────────────────
// After every ingest, upsert a sources row reflecting capture coverage for the topic.
// Quality: ≥3 captures on topic → 'strong' | ≥1 → 'partial' | 0 → 'missing'

async function recalculateSourceQuality(
  userId: string,
  topicTag: string,
  captureId: string
): Promise<void> {
  const db = createServiceClient();

  // Count captures for this topic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (db as any)
    .from('captures')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('topic_tag', topicTag);

  const quality: 'strong' | 'partial' | 'missing' =
    (count ?? 0) >= 3 ? 'strong' : 'partial';

  // Upsert: one sources row per (user_id, topic, resource_type='capture')
  // Use the triggering capture's id as resource_id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (db as any)
    .from('sources')
    .upsert(
      {
        user_id: userId,
        resource_id: captureId,
        resource_type: 'capture',
        topic: topicTag,
        quality,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'user_id,topic,resource_type' }
    );
}

// ── Mistake detection → errors table ─────────────────────────────

async function maybeLogMistake(
  userId: string,
  content: string,
  topicTag: string
): Promise<void> {
  if (!hasMistakeKeyword(content)) return;

  const db = createServiceClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (db as any).from('errors').insert({
    user_id: userId,
    session_id: null,
    topic: topicTag || null,
    subtopic: null,
    problem_type: null,
    mistake_description: content.slice(0, 500),
  });
}

// ── JSON body handler (text / markdown) ──────────────────────────

interface JsonBody {
  content?: string;
  source_type?: SourceType;
}

async function handleJsonBody(
  req: NextRequest
): Promise<{ content: string; source_type: SourceType }> {
  const body = (await req.json()) as JsonBody;
  const content = sanitize(body.content ?? '');
  const source_type: SourceType = body.source_type ?? 'quick_type';
  return { content, source_type };
}

// ── Multipart form data handler (image / audio / pdf) ────────────

async function handleMultipart(req: NextRequest): Promise<{
  content: string;
  source_type: SourceType;
  userId: string; // passed through for storage upload
} | null> {
  const formData = await req.formData();
  const userId = formData.get('user_id') as string ?? '';

  const imageFile = formData.get('image') as File | null;
  const audioFile = formData.get('audio') as File | null;
  const pdfFile = formData.get('pdf') as File | null;
  const textField = formData.get('content') as string | null;

  if (imageFile) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const result = await processImage(buffer, imageFile.type, userId);
    return { content: result.content, source_type: 'photo', userId };
  }

  if (audioFile) {
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const result = await processAudio(buffer);
    return { content: result.content, source_type: 'voice', userId };
  }

  if (pdfFile) {
    // PDF text extraction (full pipeline Sprint 6) — treat as plain text for now
    const raw = await pdfFile.text();
    return { content: sanitize(raw), source_type: 'pdf', userId };
  }

  if (textField) {
    const sourceTypeField = formData.get('source_type') as SourceType | null;
    return {
      content: sanitize(textField),
      source_type: sourceTypeField ?? 'apple_shortcuts',
      userId,
    };
  }

  return null;
}

// ── Route handler ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse content by content type
    const contentType = req.headers.get('content-type') ?? '';
    let content: string;
    let source_type: SourceType;

    if (contentType.includes('multipart/form-data')) {
      const parsed = await handleMultipart(req);
      if (!parsed) {
        return NextResponse.json(
          { success: false, data: null, error: 'No recognized field in form data' },
          { status: 400 }
        );
      }
      content = parsed.content;
      source_type = parsed.source_type;
    } else {
      const parsed = await handleJsonBody(req);
      content = parsed.content;
      source_type = parsed.source_type;
    }

    if (!content) {
      return NextResponse.json(
        { success: false, data: null, error: 'Content is required' },
        { status: 400 }
      );
    }

    // 3. Fetch textbook titles for auto-tag context (lightweight — titles only)
    const db = createServiceClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: textbooks } = await (db as any)
      .from('textbooks')
      .select('title')
      .eq('user_id', user.id);
    const textbookTitles: string[] = (textbooks ?? []).map(
      (t: { title: string }) => t.title
    );

    // 4. AI auto-tag (lightweight — subject list + textbooks only)
    const { subject_tag, content_type, topic_tag } = await autoTag(
      content,
      textbookTitles
    );

    // 5. Write to captures
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: capture, error: captureError } = await (db as any)
      .from('captures')
      .insert({
        user_id: user.id,
        content,
        type: content_type,
        subject_tag,
        topic_tag,
        source_type,
        confidence: null,
      })
      .select('id')
      .single();

    if (captureError) throw new Error(captureError.message);

    // 6 + 7. Non-fatal side effects — run in parallel, don't block response
    Promise.all([
      maybeLogMistake(user.id, content, topic_tag),
      recalculateSourceQuality(user.id, topic_tag, capture.id as string),
    ]).catch(() => { /* non-fatal side-effect — does not block response */ });

    // 202 Accepted — content saved, side effects async
    return NextResponse.json(
      { success: true, data: { id: capture.id }, error: null },
      { status: 202 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ingest failed';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
