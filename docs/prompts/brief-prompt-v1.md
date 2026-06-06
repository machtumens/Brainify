# Daily Brief Prompt — v1

**Feature:** AI Daily Brief (US-004 / WBS 2.2)
**Route:** `POST /api/brief`
**Created:** 2026-06-06
**Status:** Active

---

## Prompt Directive

```
In 2-4 sentences, plain language: detect drift, surface danger topics, flag ML goal if >5 days
missed, adjust today's tasks if needed. Reference the specific goal and session data provided.
```

**Source:** ROADMAP.md §12.3 Per-Feature Prompt Strategy — Daily Brief row.

---

## Context Schema Injected

```json
{
  "goals": [{ "title", "category", "status", "current_month", "roadmap" }],
  "sessions": [{ "task_title", "subject", "pomodoros", "difficulty", "mode", "notes", "started_at" }],
  "errors": [{ "topic", "subtopic", "problem_type", "count" }],
  "captures": [{ "content", "type", "subject_tag", "topic_tag" }],
  "textbooks": [{ "title", "subject", "current_page", "total_pages" }],
  "sources": [{ "topic", "quality", "resource_type" }]
}
```

**Window:** goals — active only; sessions — last 14; errors — top 20 by frequency; captures — last 30 days.

---

## Key Constraints

- 2–4 sentences maximum. No more. No less.
- Plain language — no academic framing, no headers, no bullet lists.
- Must cite specific data: goal titles, session counts, topic names from DB.
- ML goal (Mitchell) missed >5 days → must surface amber flag explicitly.
- Drift = consecutive missed sessions, off-pace progress, danger-zone topics not addressed.
- Provider name never appears in the response or any error message (Law 15).
- No hallucination — only reference data present in the injected context.

---

## Expected Output Format

Plain prose paragraph. 2–4 sentences. Examples (not templates):

> "You haven't touched Machine Learning — Mitchell in 5 days; it's flagged and needs a session today. Pure Maths is on track for M1 W3 — Coordinate Geometry is next. Your top recurring error is sign errors in completing the square — worth a primer before your next Maths session."

---

## Caching

Stored in `sessionStorage` under key `sb_brief`. Cleared on page refresh. Not re-fetched on tab/view switch within same session.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| v1 | 2026-06-06 | Initial — P07 implementation |
