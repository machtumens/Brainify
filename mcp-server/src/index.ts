// ================================================================
// Second Brain MCP server — stdio transport (v1.1 Phase 2)
//
// Exposes the learning OS to any MCP client (Claude Code, Claude
// Desktop): permanent memory, quiz generation, textbook pulls,
// capture search, confusion map, session logging.
//
// Env (loaded from ../.env.local): NEXT_PUBLIC_SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY?, GROQ_API_KEY?,
// OPENROUTER_API_KEY?
//
// Law 15 carries over: provider names never appear in tool output.
// ================================================================

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(here, '../../.env.local') });

// ── Supabase ─────────────────────────────────────────────────────

function db(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase env missing — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

async function singleUserId(client: SupabaseClient): Promise<string> {
  const { data } = await client.from('users').select('id').limit(1).maybeSingle();
  if (!data?.id) throw new Error('No user found in Second Brain DB');
  return data.id;
}

// ── AI cascade (compact mirror of src/lib/ai-router.js) ──────────

async function callAI(prompt: string): Promise<string> {
  type Provider = { available: boolean; run: (p: string) => Promise<string> };
  const providers: Provider[] = [
    {
      available: Boolean(process.env.GEMINI_API_KEY),
      run: async (p) => {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] }),
          }
        );
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
        const text = json.candidates?.[0]?.content?.parts?.map((x) => x.text ?? '').join('') ?? '';
        if (!text) throw new Error('empty');
        return text;
      },
    },
    {
      available: Boolean(process.env.GROQ_API_KEY),
      run: async (p) => {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: p }],
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = json.choices?.[0]?.message?.content ?? '';
        if (!text) throw new Error('empty');
        return text;
      },
    },
    {
      available: Boolean(process.env.OPENROUTER_API_KEY),
      run: async (p) => {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [{ role: 'user', content: p }],
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = json.choices?.[0]?.message?.content ?? '';
        if (!text) throw new Error('empty');
        return text;
      },
    },
  ];

  for (const p of providers.filter((x) => x.available)) {
    try {
      return await p.run(prompt);
    } catch {
      // try next provider
    }
  }
  throw new Error('AI service unavailable');
}

// ── Result helpers ───────────────────────────────────────────────

function ok(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function fail(message: string) {
  return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
}

function msg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

// ── Server + tools ───────────────────────────────────────────────

const server = new McpServer({ name: 'second-brain', version: '0.1.0' });

server.registerTool(
  'memory_read',
  {
    title: 'Read permanent memory',
    description:
      'Read the Second Brain permanent AI memory. scope "main" is the authoritative document; tutor/test_gen/brief/retro are agent-scoped layers.',
    inputSchema: {
      scope: z.enum(['main', 'tutor', 'test_gen', 'brief', 'retro']).default('main'),
    },
  },
  async ({ scope }) => {
    try {
      const client = db();
      const userId = await singleUserId(client);
      const { data } = await client
        .from('ai_memory')
        .select('content, version, updated_at')
        .eq('user_id', userId)
        .eq('scope', scope)
        .maybeSingle();
      if (!data) return ok(`(no ${scope} memory yet)`);
      return ok(`[v${data.version} · ${data.updated_at}]\n\n${data.content}`);
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'memory_write',
  {
    title: 'Write permanent memory',
    description:
      'Overwrite a Second Brain memory scope with new content. Bumps version and records the rewrite in memory_log.',
    inputSchema: {
      scope: z.enum(['main', 'tutor', 'test_gen', 'brief', 'retro']),
      content: z.string().min(1).max(16000),
    },
  },
  async ({ scope, content }) => {
    try {
      const client = db();
      const userId = await singleUserId(client);
      const { data: current } = await client
        .from('ai_memory')
        .select('version')
        .eq('user_id', userId)
        .eq('scope', scope)
        .maybeSingle();
      const version = (current?.version ?? 0) + 1;

      const { error } = await client.from('ai_memory').upsert(
        { user_id: userId, scope, content, version, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,scope' }
      );
      if (error) throw new Error(error.message);

      await client.from('memory_log').insert({
        user_id: userId,
        scope,
        trigger_type: 'manual',
        summary: `MCP write (${content.length} chars)`,
        version,
      });
      return ok({ scope, version });
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'quiz_generate',
  {
    title: 'Generate quiz',
    description:
      'Generate multiple-choice questions from the student\'s own textbooks and captured notes, weighted toward danger-zone topics (most recorded mistakes).',
    inputSchema: {
      topics: z.array(z.string().min(1)).min(1).max(5),
      difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
      count: z.number().int().min(1).max(10).default(5),
    },
  },
  async ({ topics, difficulty, count }) => {
    try {
      const client = db();
      const topicSet = new Set(topics.map((t) => t.toLowerCase()));

      const [tbRes, capRes, errRes] = await Promise.all([
        client.from('textbooks').select('subject, title, topic_map'),
        client.from('captures').select('content, subject_tag, topic_tag').order('created_at', { ascending: false }).limit(50),
        client.from('errors').select('topic').order('flagged_at', { ascending: false }).limit(100),
      ]);

      const errFreq = new Map<string, number>();
      for (const e of errRes.data ?? []) {
        const k = (e.topic ?? '').toLowerCase();
        if (k && topicSet.has(k)) errFreq.set(k, (errFreq.get(k) ?? 0) + 1);
      }
      const dangerTopics = Array.from(errFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([t]) => t);

      const textbookSummary = (tbRes.data ?? [])
        .map((t) => {
          const map = (t.topic_map ?? {}) as Record<string, string[]>;
          const chapters = Object.entries(map)
            .map(([ch, subs]) => `  ${ch}: ${Array.isArray(subs) ? subs.join(', ') : ''}`)
            .join('\n');
          return `Textbook "${t.title}" (${t.subject ?? 'unknown'})\n${chapters}`;
        })
        .join('\n\n');

      const notes = (capRes.data ?? [])
        .filter(
          (c) =>
            (c.subject_tag && topicSet.has(c.subject_tag.toLowerCase())) ||
            (c.topic_tag && topicSet.has(c.topic_tag.toLowerCase()))
        )
        .slice(0, 20)
        .map((c, i) => `[Note ${i + 1}]: ${(c.content ?? '').slice(0, 300)}`)
        .join('\n');

      const prompt = `Generate exactly ${count} ${difficulty} multiple-choice questions for topics: ${topics.join(', ')}.
Weight toward danger-zone topics: ${dangerTopics.join(', ') || 'none'}.
Ground every question in the materials below — do not invent facts.
Each question: 4 options, exactly one correct.
Output ONLY a JSON array: [{"topic":"...","text":"...","options":["A","B","C","D"],"correct_answer":0,"difficulty":"${difficulty}"}]

MATERIALS:
${textbookSummary || '(none)'}

NOTES:
${notes || '(none)'}`;

      const raw = await callAI(prompt);
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      return ok(cleaned);
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'quiz_history',
  {
    title: 'Quiz history',
    description: 'Past test results: score, total, topics, duration.',
    inputSchema: { limit: z.number().int().min(1).max(50).default(10) },
  },
  async ({ limit }) => {
    try {
      const client = db();
      const { data, error } = await client
        .from('test_results')
        .select('score, total, topics, duration, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return ok(data ?? []);
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'textbook_list',
  {
    title: 'List textbooks',
    description: 'All registered textbooks with subject, progress and chapter map.',
    inputSchema: {},
  },
  async () => {
    try {
      const client = db();
      const { data, error } = await client
        .from('textbooks')
        .select('id, title, subject, current_page, total_pages, topic_map');
      if (error) throw new Error(error.message);
      return ok(data ?? []);
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'textbook_pull',
  {
    title: 'Pull textbook topic',
    description:
      'Pull everything Second Brain knows about a topic: the matching textbook chapters (from topic_map), related captured notes, and source health.',
    inputSchema: { topic: z.string().min(1) },
  },
  async ({ topic }) => {
    try {
      const client = db();
      const t = topic.toLowerCase();

      const [tbRes, capRes, srcRes] = await Promise.all([
        client.from('textbooks').select('title, subject, current_page, total_pages, topic_map'),
        client
          .from('captures')
          .select('content, subject_tag, topic_tag, created_at')
          .or(`subject_tag.ilike.%${topic}%,topic_tag.ilike.%${topic}%`)
          .order('created_at', { ascending: false })
          .limit(20),
        client.from('sources').select('topic, quality, resource_type').ilike('topic', `%${topic}%`),
      ]);

      const chapters: { textbook: string; chapter: string; subtopics: string[] }[] = [];
      for (const tb of tbRes.data ?? []) {
        const map = (tb.topic_map ?? {}) as Record<string, string[]>;
        for (const [ch, subs] of Object.entries(map)) {
          const subList = Array.isArray(subs) ? subs : [];
          if (
            ch.toLowerCase().includes(t) ||
            (tb.subject ?? '').toLowerCase().includes(t) ||
            subList.some((s) => s.toLowerCase().includes(t))
          ) {
            chapters.push({ textbook: tb.title, chapter: ch, subtopics: subList });
          }
        }
      }

      return ok({
        topic,
        chapters,
        notes: (capRes.data ?? []).map((c) => ({
          when: c.created_at,
          tag: c.topic_tag ?? c.subject_tag,
          content: (c.content ?? '').slice(0, 500),
        })),
        sources: srcRes.data ?? [],
      });
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'captures_search',
  {
    title: 'Search captures',
    description: 'Full-text (ILIKE) search across all captured notes.',
    inputSchema: { query: z.string().min(1), limit: z.number().int().min(1).max(50).default(20) },
  },
  async ({ query, limit }) => {
    try {
      const client = db();
      const { data, error } = await client
        .from('captures')
        .select('content, subject_tag, topic_tag, type, created_at')
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return ok(data ?? []);
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'confusion_map_get',
  {
    title: 'Confusion map',
    description:
      'Current confusion map quadrants: danger (2+ errors), watch (1 error), safe (covered, no errors), derived from sessions + errors.',
    inputSchema: {},
  },
  async () => {
    try {
      const client = db();
      const [sessRes, errRes] = await Promise.all([
        client.from('sessions').select('subject').order('started_at', { ascending: false }).limit(30),
        client.from('errors').select('topic'),
      ]);

      const covered = new Set(
        (sessRes.data ?? []).map((s) => (s.subject ?? '').toLowerCase().trim()).filter(Boolean)
      );
      const counts = new Map<string, number>();
      for (const e of errRes.data ?? []) {
        const k = (e.topic ?? '').toLowerCase().trim();
        if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
      }

      const danger: string[] = [];
      const watch: string[] = [];
      const safe: string[] = [];
      const all = new Set([...covered, ...counts.keys()]);
      for (const topic of all) {
        const n = counts.get(topic) ?? 0;
        if (n >= 2) danger.push(topic);
        else if (n === 1) watch.push(topic);
        else safe.push(topic);
      }
      return ok({ danger: danger.sort(), watch: watch.sort(), safe: safe.sort() });
    } catch (err) {
      return fail(msg(err));
    }
  }
);

server.registerTool(
  'session_log',
  {
    title: 'Log study session',
    description: 'Log a completed study session from any MCP client.',
    inputSchema: {
      subject: z.string().min(1),
      pomodoros: z.number().int().min(0).max(20).default(1),
      pages_done: z.number().int().min(0).default(0),
      notes: z.string().max(2000).optional(),
    },
  },
  async ({ subject, pomodoros, pages_done, notes }) => {
    try {
      const client = db();
      const userId = await singleUserId(client);
      const { data, error } = await client
        .from('sessions')
        .insert({
          user_id: userId,
          subject,
          task_title: `MCP session: ${subject}`,
          pomodoros,
          pages_done,
          problems_done: 0,
          difficulty: 1,
          mode: 'standard',
          started_at: new Date().toISOString(),
          notes: notes ?? null,
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      return ok({ logged: true, id: data.id });
    } catch (err) {
      return fail(msg(err));
    }
  }
);

// ── Start ────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
