// ================================================================
// GET  /api/textbooks — all books + sources for user
// POST /api/textbooks — action: 'register' | 'update_page'
// Sprint 5 | WBS 6.3 | US-017 | P21
//
// POST register pipeline:
//   1. Auth check
//   2. Duplicate title check (409 if exists)
//   3. AI generates topic_map (chapter → topics[])
//   4. Insert textbook row
//   5. Upsert sources rows per topic
//
// POST update_page:
//   1. Auth + fetch book
//   2. Update current_page
//   3. Recalculate source quality from reading progress
//
// Law 14: createServiceClient server-only.
// ================================================================

import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { TopicMap } from '@/types/database';

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

// ── Source quality from reading progress ─────────────────────────
// strong: ≥80% read | partial: ≥20% | missing: <20%

function pageQuality(current: number, total: number): 'strong' | 'partial' | 'missing' {
  if (!total) return 'partial';
  const pct = current / total;
  if (pct >= 0.8) return 'strong';
  if (pct >= 0.2) return 'partial';
  return 'missing';
}

// ── Upsert sources rows for a textbook's topics ──────────────────

async function recalculateTextbookSources(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: string,
  textbookId: string,
  topicMap: TopicMap,
  currentPage: number,
  totalPages: number
): Promise<void> {
  const quality = pageQuality(currentPage, totalPages);
  const allTopics: string[] = Object.values(topicMap).flat();
  const uniqueTopics = Array.from(new Set(allTopics)).slice(0, 30);

  const rows = uniqueTopics.length > 0
    ? uniqueTopics.map((topic) => ({
        user_id: userId,
        resource_id: textbookId,
        resource_type: 'textbook',
        topic,
        quality,
        last_updated: new Date().toISOString(),
      }))
    : [{
        user_id: userId,
        resource_id: textbookId,
        resource_type: 'textbook',
        topic: 'general',
        quality,
        last_updated: new Date().toISOString(),
      }];

  await db
    .from('sources')
    .upsert(rows, { onConflict: 'user_id,topic,resource_type' });
}

// ── topic_map generation via AI ──────────────────────────────────

async function generateTopicMap(
  title: string,
  author: string,
  subject: string,
  totalPages: number
): Promise<TopicMap> {
  try {
    const { callAI } = await import('@/lib/ai-router.js');
    const prompt = `Generate a chapter-topic map for the textbook "${title}"${author ? ` by ${author}` : ''}${subject ? ` (subject: ${subject})` : ''}${totalPages ? `, approximately ${totalPages} pages` : ''}.
Return JSON only. Format: { "1": ["topic1", "topic2"], "2": ["topic3", "topic4"] }
Include up to 12 chapters. Each chapter: 2-4 specific syllabus-level topics.
Return only valid JSON with no explanation, no markdown code fences.`;

    const { text } = await callAI(prompt);
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned) as TopicMap;
    if (typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

// ── GET — all textbooks + textbook-type sources ──────────────────

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

    const [booksRes, sourcesRes] = await Promise.all([
      db
        .from('textbooks')
        .select('*')
        .eq('user_id', user.id)
        .order('active_from', { ascending: false }),
      db
        .from('sources')
        .select('*')
        .eq('user_id', user.id)
        .eq('resource_type', 'textbook'),
    ]);

    if (booksRes.error) throw booksRes.error;
    if (sourcesRes.error) throw sourcesRes.error;

    return Response.json({
      success: true,
      data: { books: booksRes.data ?? [], sources: sourcesRes.data ?? [] },
      error: null,
    });
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Failed to fetch textbooks' },
      { status: 500 }
    );
  }
}

// ── POST bodies ──────────────────────────────────────────────────

interface RegisterBody {
  action: 'register';
  title: string;
  author?: string;
  subject?: string;
  total_pages?: number;
  active_from?: string;
}

interface UpdatePageBody {
  action: 'update_page';
  id: string;
  current_page: number;
}

type PostBody = RegisterBody | UpdatePageBody;

// ── POST — register | update_page ────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await req.json()) as Partial<PostBody>;
    const { createServiceClient } = await import('@/lib/supabase');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient();

    // ── action: register ─────────────────────────────────────────
    if (body.action === 'register') {
      const title = ((body as RegisterBody).title ?? '').trim().slice(0, 500);
      if (!title) {
        return Response.json(
          { success: false, data: null, error: 'Title is required' },
          { status: 400 }
        );
      }
      const author = ((body as RegisterBody).author ?? '').trim().slice(0, 300) || null;
      const subject = ((body as RegisterBody).subject ?? '').trim().slice(0, 100) || null;
      const total_pages = Number((body as RegisterBody).total_pages) || null;
      const active_from =
        (body as RegisterBody).active_from ?? new Date().toISOString().slice(0, 10);

      // Duplicate check
      const { data: existing } = await db
        .from('textbooks')
        .select('id')
        .eq('user_id', user.id)
        .ilike('title', title)
        .maybeSingle();

      if (existing) {
        return Response.json(
          { success: false, data: null, error: 'Book already registered' },
          { status: 409 }
        );
      }

      // AI topic_map generation (non-blocking if it fails — falls back to {})
      const topic_map = await generateTopicMap(
        title,
        author ?? '',
        subject ?? '',
        total_pages ?? 0
      );

      const { data: newBook, error: insertErr } = await db
        .from('textbooks')
        .insert({
          user_id: user.id,
          title,
          author,
          subject,
          total_pages,
          current_page: 0,
          active_from,
          topic_map,
        })
        .select('*')
        .single();

      if (insertErr) throw insertErr;

      // Upsert sources — await for immediate source web visibility
      await recalculateTextbookSources(
        db, user.id, newBook.id, topic_map, 0, total_pages ?? 0
      );

      return Response.json({ success: true, data: newBook, error: null }, { status: 201 });
    }

    // ── action: update_page ──────────────────────────────────────
    if (body.action === 'update_page') {
      const id = (body as UpdatePageBody).id;
      const current_page = Math.max(0, Number((body as UpdatePageBody).current_page) || 0);

      if (!id) {
        return Response.json(
          { success: false, data: null, error: 'Book id is required' },
          { status: 400 }
        );
      }

      const { data: book, error: fetchErr } = await db
        .from('textbooks')
        .select('total_pages, topic_map')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchErr || !book) {
        return Response.json(
          { success: false, data: null, error: 'Book not found' },
          { status: 404 }
        );
      }

      const capped = book.total_pages
        ? Math.min(current_page, book.total_pages)
        : current_page;

      const { data: updated, error: updateErr } = await db
        .from('textbooks')
        .update({ current_page: capped })
        .eq('id', id)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (updateErr) throw updateErr;

      // Recalculate sources async — does not block response
      recalculateTextbookSources(
        db, user.id, id, (book.topic_map ?? {}) as TopicMap, capped, book.total_pages ?? 0
      ).catch(() => { /* non-fatal */ });

      return Response.json({ success: true, data: updated, error: null });
    }

    return Response.json(
      { success: false, data: null, error: 'Invalid action' },
      { status: 400 }
    );
  } catch {
    return Response.json(
      { success: false, data: null, error: 'Request failed' },
      { status: 500 }
    );
  }
}
