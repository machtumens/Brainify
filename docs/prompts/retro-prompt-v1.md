# Retrospective Prompt — v1

**Feature:** Weekly Retrospective Cron (US-019 / WBS 7.4)
**Route:** `POST /api/retrospective`
**Created:** 2026-06-06
**Status:** Active
**Trigger:** Vercel cron — every Sunday 8am UTC (`0 8 * * 0`)

---

## Prompt Directive

```
Weekly study retrospective. Tone: direct, factual.
Analyse the provided data covering the last 7 days.

Return ONLY valid JSON with exactly these 5 fields:
{
  "coverage_rate": <number 0-1, proportion of 7 days that had at least one study session>,
  "consistency_rate": <number 0-1, same as coverage_rate unless you have reason to weight it differently>,
  "velocity_trend": <"improving" | "stable" | "declining" — based on session frequency vs prior pattern>,
  "risk_topic": <string, the goal or topic most at risk of falling behind>,
  "recommendation": <string, one specific actionable recommendation for the coming week>
}

Do not add explanation, headers, or markdown fences. Return only the JSON object.
```

**Source:** ROADMAP.md §12.3 Per-Feature Prompt Strategy — Retrospective row.

---

## Context Schema Injected

```json
{
  "period": "last 7 days",
  "sessions_this_week": 5,
  "days_with_sessions": 4,
  "goals": [{ "id", "title", "category", "status", "current_month" }],
  "top_errors": [{ "topic": "quadratic equations", "count": 3 }],
  "captures_count": 7
}
```

**Window:** sessions — last 7 days; goals — active + locked; errors — last 7 days grouped by topic; captures — count only (token budget).

---

## Key Constraints

- 5 structured JSON fields only. No prose outside the JSON object.
- `coverage_rate` and `consistency_rate` must be numbers in [0, 1].
- `velocity_trend` must be one of: `"improving"`, `"stable"`, `"declining"`.
- `risk_topic` cites a specific goal title or topic name from the data — not generic.
- `recommendation` is a single specific action for the coming week.
- Provider name never appears in the response or error message (Law 15).
- If AI response is unparseable: fallback derives coverage/consistency from raw session count, stores raw text as recommendation.

---

## Expected Output Format

```json
{
  "coverage_rate": 0.57,
  "consistency_rate": 0.57,
  "velocity_trend": "declining",
  "risk_topic": "Machine Learning — Mitchell",
  "recommendation": "Schedule two dedicated ML sessions before Thursday to prevent further drift from the amber threshold."
}
```

---

## Storage

Stored in `retrospectives` table:

| Column | Source |
|--------|--------|
| `coverage_rate` | JSON field (clamped 0-1) |
| `consistency_rate` | JSON field (clamped 0-1) |
| `risk_topic` | JSON field (truncated 200 chars) |
| `content` | Pipe-separated summary: `Coverage: X% | Consistency: Y% | Velocity: Z | Risk: R | recommendation` |
| `period_type` | Always `'weekly'` (monthly deferred to v1.5) |
| `period_start` | ISO date 7 days before cron fire time |

---

## Rate Limit Handling (R8)

Retrospective uses the same AI cascade router (Gemini → Groq → OpenRouter). Rate-limited Sunday 8am calls fall through automatically. No retry on cron fail — next Sunday fires fresh.

---

## Tech Debt

| Item | Deferred to |
|------|------------|
| `period_type: 'monthly'` — AI identity portrait (3–5 sentence learning character summary) | v1.5 |
| Velocity trend derived from multi-week history (currently single-week heuristic) | v1.1 |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| v1 | 2026-06-06 | Initial — P22 implementation |
