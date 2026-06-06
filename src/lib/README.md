# /src/lib — Module Reference

## supabase.ts

| Export | Use |
|--------|-----|
| `createClient()` | Anon key client — browser/client components, respects RLS |
| `createServiceClient()` | Service role client — **server-side `/api/*` routes only**, bypasses RLS |

**CRITICAL:** Never import `createServiceClient` from a client component. Service key never hits the browser.

---

## ai-router.js

Manages AI provider cascade: **Gemini Flash → Groq Llama 3.3 → OpenRouter**.

| Export | Signature | Use |
|--------|-----------|-----|
| `callAI(prompt)` | `(string) → Promise<{ text, provider }>` | Call AI with pre-built prompt string |
| `buildPrompt(instruction, context)` | `(string, ContextPayload) → string` | Combine instruction + context JSON |

**Rules:**
- Provider name logged server-side only — never in returned data
- Missing env var: provider skipped with `console.warn`, never throws at startup
- All providers fail → throws `'AI service unavailable'`

**Required env vars:** `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`

---

## context-assembler.js

Assembles unified context from Supabase before every AI call.

| Export | Signature | Use |
|--------|-----------|-----|
| `assembleContext()` | `() → Promise<ContextPayload>` | Reads 6 tables, returns typed payload |

**Token limits (principles.md §8):**
| Table | Limit |
|-------|-------|
| goals | active/locked only |
| sessions | last 14 records |
| errors | top 20 by frequency |
| captures | last 30 days |
| textbooks | current page only, no full topic_map |
| sources | all quality records |
| **Total** | **< 50,000 tokens** |

**Graceful:** empty table = empty array, never throws on missing data.
**Server-side only:** uses `createServiceClient()`.
