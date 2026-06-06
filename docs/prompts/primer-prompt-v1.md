# Pre-Session Primer Prompt — v1

**Sprint 3 | WBS 2.6 | US-008 | P11**
**Route:** `POST /api/primer/route.ts`
**Created:** 2026-06-06
**Anti-hallucination design:** prompt injects exact DB records; AI can only echo/summarize provided data.

---

## Prompt Template

```
You are preparing a pre-session study primer. Return a JSON object with exactly these 3 keys.

RULES:
- "formula": The key formula or concept for the topic, taken from the textbook data below. If textbook data is unavailable, write the most fundamental formula for the topic using only standard notation.
- "lastError": Copy the user's last error description exactly from the error record below. If no error record: use "No errors logged yet."
- "ownNote": Copy one sentence from the user's own note below. If no capture record: use "No notes for this topic yet."
- Use ONLY the data provided. Do not invent errors or notes.
- Respond with ONLY the JSON object — no markdown, no explanation, no code fences.

DATA:
Subject: {subject}
Topic: {topic}
{textbookInfo}
Last error record: {errorRecord}
Last note/capture: {captureRecord}

Return format:
{"formula":"...","lastError":"...","ownNote":"..."}
```

---

## Data Sources

| Element | DB Source | Query |
|---------|-----------|-------|
| formula | `textbooks.topic_map` + textbook title/author/pages | `WHERE subject = ? AND user_id = ? LIMIT 1` |
| lastError | `errors.mistake_description` | `WHERE user_id = ? [AND topic ILIKE ?] ORDER BY flagged_at DESC LIMIT 1` |
| ownNote | `captures.content` | `WHERE user_id = ? AND subject_tag = ? ORDER BY created_at DESC LIMIT 1` |

---

## Anti-Hallucination Design Decisions

1. **Exact DB record injection**: Each DB value is serialized into the prompt verbatim. The AI cannot hallucinate errors or notes that differ from the DB.
2. **Explicit "Use ONLY the data provided"** constraint in the prompt.
3. **"Do not invent errors or notes"** — second-order constraint blocking formula-level hallucination for lastError/ownNote.
4. **Fallback on parse fail**: If AI returns non-JSON, the route falls back to DB values directly (`lastError = error.mistake_description`, `ownNote = capture.content.slice(0, 200)`).
5. **Empty state strings are explicit**: "No errors logged yet." and "No notes for this topic yet." are returned verbatim — the UI distinguishes them from real data by color (`--ink4` instead of `--red`/`--ink3`).

---

## Key Constraint (ROADMAP §12.3)

> "Return exactly 3 items: (1) key formula for [topic], (2) user's last error: [error record], (3) user's own note: [capture record]. Use only provided data."

Risk R9 (ROADMAP §10): *Pre-session primer hallucinates formula/error — HIGH risk*.
Mitigation: "Primer prompt must include: 'Use only the following DB data: [error record], [capture record], [textbook chapter]. Do not invent.'"

---

## Response Schema

```typescript
interface PrimerData {
  formula: string;    // key concept/formula — shown in monospace, --cream3 bg
  lastError: string;  // last error text or "No errors logged yet."
  ownNote: string;    // own note or "No notes for this topic yet."
}
```

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| v1 | 2026-06-06 | Initial prompt — 3-item JSON, strict DB citation, no markdown response |
