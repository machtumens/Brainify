# Memory Distill Prompt v1

**Where:** `src/lib/memory/memoryManager.ts` → `rewriteMainMemory()`
**When:** after every platform event — session logged, test submitted, chat exchange, capture ingested.
**Model:** AI cascade (Gemini Flash → Groq Llama 3.3 → OpenRouter) via `callAI`.

## Design decisions

1. **Rewrite, not append.** The whole document is regenerated each time. Append-only memories grow stale and contradictory; a rewrite forces the model to reconcile new facts with old ones ("Update stale facts instead of appending duplicates").
2. **Fixed section skeleton.** `Identity / Current Position / Confusion Digest / Recent Struggles / Preferences` — stable structure means downstream prompts can rely on section presence, and the distill model can't reorganize itself into drift.
3. **Hard budgets.** 6000-char target, 8000 hard cap on store, 10-bullet cap on Recent Struggles. Main memory is the *first* thing every AI prompt reads — it must stay cheap.
4. **Garbage guard.** If the distilled output is under 50 chars, the rewrite is dropped — a provider hiccup must not clobber a good memory with an empty one.
5. **Audit trail.** Every rewrite appends to `memory_log` with trigger + version, so a bad memory state can be traced to the event that caused it.

## Prompt text

See `DISTILL_INSTRUCTION` in `memoryManager.ts` (kept in code as the single source of truth).

## Failure mode

`rewriteMainMemory` is fired-and-forgotten from routes (`.catch(() => {})`): if all providers fail, the memory simply stays one event behind. The next event's rewrite sees the missed data through the live-context portion of its prompt.
