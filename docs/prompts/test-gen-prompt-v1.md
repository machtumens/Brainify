# Test Generation Prompt — v1

**Sprint 5 | P19 | US-014 | WBS 4.3**
**Route:** `POST /api/test`

---

## Prompt Strategy (ROADMAP §12.3)

- **Source-anchored:** questions MUST reference actual content from the student's textbook chapters and captured notes. No hallucinated facts.
- **Weighted toward danger zone:** topics with the highest error count receive proportionally more questions.
- **Difficulty distribution:** controlled by `DIFFICULTY_PRESETS` (easy/medium/hard percentages). Default: 30% easy / 50% medium / 20% hard.
- **Count:** 5 questions per test (v1 default). Configurable 1–10 via `count` param.
- **Format:** strict JSON array — no markdown, no prose.

---

## System Constraints

| Rule | Enforcement |
|------|-------------|
| Anti-hallucination | Textbook chapters + captures injected as grounding material |
| Provider opacity | Law 15 — no provider name in response or error |
| Token budget | Materials capped at selected topics only; captures sliced to 20 items × 300 chars |
| XSS | All text fields sanitized via `replace(/<[^>]*>/g, '')` before use |

---

## Prompt Template

```
You are a rigorous exam question generator for a student's personal study materials.
Your ONLY job is to generate multiple-choice questions grounded in the provided source materials.

CRITICAL RULES:
1. Questions MUST reference actual content from the textbook chapters or student notes below.
2. Every question must have exactly 4 options. Only one option is correct.
3. Distribute difficulty: {easyCount} easy, {mediumCount} medium, {hardCount} hard.
4. Weight questions toward DANGER ZONE topics: {dangerTopics}.
5. Cover these selected topics: {topics}.
6. Output ONLY valid JSON — no markdown, no explanation, no preamble.

SOURCE MATERIALS:
{textbookSummary}

STUDENT NOTES:
{capturesSummary}

OUTPUT FORMAT:
[
  {
    "topic": "<one of the selected topics>",
    "text": "<question stem>",
    "options": ["<A>", "<B>", "<C>", "<D>"],
    "correct_answer": <0|1|2|3>,
    "difficulty": "<easy|medium|hard>"
  }
]

Generate exactly {count} questions now.
```

---

## Output Parsing

1. Strip markdown code fences if present
2. Extract from first `[` to last `]`
3. `JSON.parse()` → validate each item: text, 4 options, correct_answer 0–3
4. Sanitize all string fields (strip HTML tags)
5. Assign `crypto.randomUUID()` as `id`

---

## AI Cascade

Primary → Gemini 1.5 Flash
Fallback-1 → Groq Llama 3.3 70B
Fallback-2 → OpenRouter Mistral 7B

Non-streaming (full JSON response required before parsing).

---

## Tech Debt / v1.1

- Question count: 5 fixed in v1 → adaptive based on topic count in v1.1
- Danger-zone weighting: linear count-based in v1 → score-based (errors × recency) in v1.1
- No test_results written back to DB in v1 → write back on reveal in v1.1
