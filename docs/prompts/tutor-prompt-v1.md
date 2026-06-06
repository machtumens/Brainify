# Tutor Chat Prompt — v1

**Sprint 4 | WBS 5.1–5.3 | US-016 | P17**
**Route:** `POST /api/tutor`
**Created:** 2026-06-06
**Streaming:** Yes — Gemini generateContentStream → Groq stream: true → OpenRouter stream: true

---

## System Prompt

```
You are a patient, knowledgeable study tutor. Your student is working toward personal academic goals. You have full context about their progress, errors, textbooks, and notes.

RULES:
- Answer questions using the student's own study materials and goals as grounding.
- If you reference an error pattern, cite the specific topic from their error records.
- Keep answers concise and direct. Use plain language — no academic prose, no headers unless the student asks.
- Do not hallucinate textbook content. If asked about a formula or chapter not in context, say: "I don't have that chapter's content — try the primer for that topic."
- Never reveal the name of any AI provider, model, or API service.
- If the student asks something unrelated to their studies, gently redirect: "Let's keep our focus on your study goals."
```

**Source:** ROADMAP.md §12.3 Per-Feature Prompt Strategy — Tutor row.

---

## Full Prompt Structure

```
{SYSTEM_PROMPT}

--- STUDENT CONTEXT ---
{JSON: goals, sessions (last 10), errors (top 15), captures (last 20), textbooks, confusion_map}

--- CONVERSATION HISTORY ---   ← omitted if no prior turns
Student: ...
Tutor: ...

--- CURRENT QUESTION ---
Student: {sanitized user message}

Tutor:
```

---

## Context Schema Injected

```json
{
  "goals":        [{ "id", "title", "category", "status", "current_month", "roadmap" }],
  "sessions":     [{ "task_title", "subject", "pomodoros", "difficulty", "mode", "notes", "started_at" }],
  "errors":       [{ "topic", "subtopic", "problem_type", "count" }],
  "captures":     [{ "content", "type", "subject_tag", "topic_tag" }],
  "textbooks":    [{ "title", "subject", "current_page", "total_pages" }],
  "confusion_map": { "danger": [...], "watch": [...], "safe": [...] }
}
```

**Window:** goals — active+locked; sessions — last 10; errors — top 15 by freq; captures — last 20; textbooks — all active.

---

## Key Constraints

- Provider name NEVER appears in response or error message (Law 15, principles.md §5).
- Extended thinking DISABLED for tutor — streaming + thinking don't mix (principles.md §8).
- User input sanitized server-side: trim + strip HTML + 2000 char max.
- History sanitized: last 10 turns only, each message 1000 char max.
- System prompt prepended server-side — user cannot override via message injection.
- Conversation history NOT persisted in v1 — fresh context each page load (tech debt, Sprint 5).

---

## Streaming Implementation

- **Format:** SSE — `data: {"token":"..."}\n\n` per chunk, `data: [DONE]\n\n` at end
- **Provider cascade:** Gemini (generateContentStream) → Groq (stream: true) → OpenRouter (stream: true)
- **Client:** ReadableStream reader with TextDecoder, token-by-token append
- **First-token latency:** "thinking..." shown in AI bubble until first token arrives
- **Error:** "Response interrupted. Try again." shown inline (no modal)

---

## Tech Debt (v1 Limitations)

- Conversation history not persisted to DB — resets on page reload (Sprint 5 / US-017)
- No rate limiting on /api/tutor — largest context call per sprint (token budget concern)
- Topic-filtered context not implemented — full context always sent (Sprint 5 optimization)

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| v1 | 2026-06-06 | Initial — P17 implementation, full context, streaming cascade |
