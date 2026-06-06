# Ingest Auto-Tag Prompt — v1
**Feature:** /api/ingest auto-tagging
**WBS:** 7.2 | US-021 | Sprint 4
**Filed:** 2026-06-06

---

## Purpose

Assigns 4 metadata fields to any captured student note:
- `subject_tag` — which subject the content belongs to
- `content_type` — what kind of note it is
- `topic_tag` — specific topic slug (used for confusion map + source web)
- `textbook_association` — which registered textbook it relates to (or null)

## Design Constraints

| Constraint | Decision |
|-----------|----------|
| Token budget | ~500 token context + ~200 token response. No full context assembler. |
| Anti-hallucination | All output validated against known schema values before DB write |
| No provider leak | callAI() abstraction — provider is infrastructure detail |
| Fallback behavior | On any failure: general / note / uncategorised / null |

## Prompt Template

```
You are a student notes auto-tagger. Return ONLY a JSON object, no markdown, no explanation.

Student subjects: pure_maths | physics | ml | calculus | applied_maths | general
Student textbooks: [{textbook_list}]

Text to tag: "{content_excerpt_500_chars}"

Return exactly this JSON shape:
{
  "subject_tag": "pure_maths | physics | ml | calculus | applied_maths | general",
  "content_type": "note | formula | problem | explanation | idea",
  "topic_tag": "snake_case slug max 30 chars (e.g. integration, newtons_laws, decision_trees)",
  "textbook_association": "exact textbook title from the list if content relates to one, or null"
}
```

## Validation Rules (applied after parse)

| Field | Rule |
|-------|------|
| `subject_tag` | Must be in `VALID_SUBJECT_TAGS` — else → `'general'` |
| `content_type` | Must be in `['note','formula','problem','explanation','idea']` — else → `'note'` |
| `topic_tag` | Must be string — replace `/[^a-z0-9_]/gi` with `_`, slice to 30 chars — else → `'uncategorised'` |
| `textbook_association` | Must be string if present — else → `null` |

## Example Input / Output

**Input:** "The integral ∫x² dx = x³/3 + C by the power rule"
**Output:**
```json
{
  "subject_tag": "pure_maths",
  "content_type": "formula",
  "topic_tag": "integration",
  "textbook_association": null
}
```

**Input:** "Decision tree splits on entropy or information gain — Mitchell Ch.3"
**Output:**
```json
{
  "subject_tag": "ml",
  "content_type": "note",
  "topic_tag": "decision_trees",
  "textbook_association": "Machine Learning - Mitchell"
}
```

## Implementation Location

`src/lib/ingest/textProcessor.ts` — `autoTag()` function

## Version History

| Version | Date | Change |
|---------|------|--------|
| v1 | 2026-06-06 | Initial — 4 fields, lightweight context, fallback on failure |
