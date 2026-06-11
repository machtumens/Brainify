// ================================================================
// memoryManager — persistent AI memory core (v1.1 Phase 1)
//
// One MAIN memory (scope='main'): a markdown document that every AI
// feature reads before anything else. Scoped memories (tutor,
// test_gen, brief, retro) layer agent-specific notes on top.
//
// Read order (fixed priority):
//   1. main memory            (~first 8k chars of budget)
//   2. scope-specific memory  (if scope given)
//   3. live context           (caller appends context-assembler output)
//
// Write path: every platform use (session logged, test submitted,
// chat exchange, capture ingested) calls rewriteMainMemory() — the
// AI distills the event INTO the main document and the whole document
// is rewritten (not appended). memory_log keeps the audit trail.
//
// Law 14: createServiceClient server-only — this module is server-only.
// Law 15: provider name never surfaces.
// ================================================================

import { createServiceClient } from '@/lib/supabase';
import { callAI } from '@/lib/ai-router';

export type MemoryScope = 'main' | 'tutor' | 'test_gen' | 'brief' | 'retro';
export type MemoryTrigger = 'session' | 'test' | 'chat' | 'ingest' | 'manual';

// Budget: main memory gets first slice of every prompt. Keep it tight.
const MAIN_MEMORY_CHAR_BUDGET = 8000;
const SCOPE_MEMORY_CHAR_BUDGET = 4000;

const EMPTY_MAIN_MEMORY = `# Main Memory
(no memory yet — will populate as the platform is used)

## Identity
## Current Position
## Confusion Digest
## Recent Struggles
## Preferences
`;

export interface MemoryRecord {
  scope: MemoryScope;
  content: string;
  version: number;
  updated_at: string;
}

// ── Read ─────────────────────────────────────────────────────────

export async function getMemory(
  userId: string,
  scope: MemoryScope
): Promise<MemoryRecord | null> {
  const db = createServiceClient();
  const { data } = await db
    .from('ai_memory')
    .select('scope, content, version, updated_at')
    .eq('user_id', userId)
    .eq('scope', scope)
    .maybeSingle();
  if (!data) return null;
  return { ...data, scope: data.scope as MemoryScope };
}

/**
 * Assemble the memory block that precedes live context in every AI
 * prompt. Order: main first, scope-specific second. Token-budgeted.
 */
export async function readMemoryBlock(
  userId: string,
  scope?: Exclude<MemoryScope, 'main'>
): Promise<string> {
  const main = await getMemory(userId, 'main');
  const parts: string[] = [
    '=== PERMANENT MEMORY (authoritative — trust over raw data below) ===',
    (main?.content ?? EMPTY_MAIN_MEMORY).slice(0, MAIN_MEMORY_CHAR_BUDGET),
  ];

  if (scope) {
    const scoped = await getMemory(userId, scope);
    if (scoped?.content) {
      parts.push(`=== ${scope.toUpperCase()} MEMORY ===`);
      parts.push(scoped.content.slice(0, SCOPE_MEMORY_CHAR_BUDGET));
    }
  }

  return parts.join('\n\n');
}

// ── Write ────────────────────────────────────────────────────────

const DISTILL_INSTRUCTION = `You maintain the MAIN MEMORY of a personal learning OS — a single markdown document that is the permanent, authoritative memory about one student. A new event just happened on the platform. Rewrite the ENTIRE memory document, integrating the event.

RULES:
1. Keep exactly these sections: ## Identity, ## Current Position, ## Confusion Digest, ## Recent Struggles, ## Preferences.
2. Integrate the new event into the right sections. Update stale facts instead of appending duplicates.
3. Recent Struggles keeps at most 10 bullet points — drop the oldest when full.
4. Be specific: topics, chapter numbers, error patterns, dates (ISO).
5. Stay under 6000 characters total. Compress older detail before dropping recent detail.
6. Output ONLY the rewritten markdown document. No preamble, no fences.`;

/**
 * Rewrite main memory after a platform event. Fire-and-forget from
 * routes: callers should .catch(() => {}) — memory failure must never
 * break the user-facing request.
 */
export async function rewriteMainMemory(
  userId: string,
  trigger: MemoryTrigger,
  eventSummary: string
): Promise<void> {
  const db = createServiceClient();
  const current = await getMemory(userId, 'main');
  const currentContent = current?.content ?? EMPTY_MAIN_MEMORY;
  const nextVersion = (current?.version ?? 0) + 1;

  const prompt = [
    DISTILL_INSTRUCTION,
    '--- CURRENT MAIN MEMORY ---',
    currentContent,
    `--- NEW EVENT (trigger: ${trigger}, at ${new Date().toISOString()}) ---`,
    eventSummary.slice(0, 4000),
  ].join('\n\n');

  const { text } = await callAI(prompt);
  const rewritten = text.trim().slice(0, 8000);
  if (rewritten.length < 50) return; // refuse to clobber memory with garbage

  await db.from('ai_memory').upsert(
    {
      user_id: userId,
      scope: 'main',
      content: rewritten,
      version: nextVersion,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,scope' }
  );

  await db.from('memory_log').insert({
    user_id: userId,
    scope: 'main',
    trigger_type: trigger,
    summary: eventSummary.slice(0, 300),
    version: nextVersion,
  });
}

/**
 * Direct write to a scoped memory (manual edit via /api/memory, or an
 * agent persisting its own notes). No AI distill — verbatim store.
 */
export async function writeMemory(
  userId: string,
  scope: MemoryScope,
  content: string,
  trigger: MemoryTrigger = 'manual'
): Promise<void> {
  const db = createServiceClient();
  const current = await getMemory(userId, scope);
  const nextVersion = (current?.version ?? 0) + 1;

  await db.from('ai_memory').upsert(
    {
      user_id: userId,
      scope,
      content: content.slice(0, 16000),
      version: nextVersion,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,scope' }
  );

  await db.from('memory_log').insert({
    user_id: userId,
    scope,
    trigger_type: trigger,
    summary: `direct write (${content.length} chars)`,
    version: nextVersion,
  });
}
