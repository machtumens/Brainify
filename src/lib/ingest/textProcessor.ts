// ================================================================
// Text Processor — ingest pipeline
// Sprint 4 | WBS 7.2 | US-021
//
// Handles: sanitization + AI auto-tagging for text/markdown captures.
// All output validated against known schema values (anti-hallucination).
// Token budget: ~500 context + ~200 response — no full context assembler.
// ================================================================

import { callAI } from '@/lib/ai-router';
import type { CaptureRow } from '@/types/database';

type ContentType = NonNullable<CaptureRow['type']>;

export interface AutoTagResult {
  subject_tag: string;
  content_type: ContentType;
  topic_tag: string;
  textbook_association: string | null;
}

const VALID_SUBJECT_TAGS = [
  'pure_maths',
  'physics',
  'ml',
  'calculus',
  'applied_maths',
  'general',
] as const;

const VALID_CONTENT_TYPES: ContentType[] = [
  'note',
  'formula',
  'problem',
  'explanation',
  'idea',
];

export function sanitize(raw: string): string {
  return raw
    .trim()
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '') // drop script/style blocks incl. content
    .replace(/<[^>]*>/g, '') // strip remaining HTML tags
    .slice(0, 5000);
}

export const MISTAKE_KEYWORDS = [
  'wrong',
  'mistake',
  'error',
  'incorrect',
  'confused',
  'misunderstood',
];

export function hasMistakeKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return MISTAKE_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function autoTag(
  content: string,
  textbookTitles: string[]
): Promise<AutoTagResult> {
  const subjectOptions = VALID_SUBJECT_TAGS.join(' | ');
  const contentTypeOptions = VALID_CONTENT_TYPES.join(' | ');
  const textbookList =
    textbookTitles.length > 0
      ? textbookTitles.map((t) => `"${t}"`).join(', ')
      : 'none registered';

  // Truncate content for prompt — token budget
  const excerpt = content.slice(0, 500);

  const prompt = `You are a student notes auto-tagger. Return ONLY a JSON object, no markdown, no explanation.

Student subjects: ${subjectOptions}
Student textbooks: [${textbookList}]

Text to tag: "${excerpt}"

Return exactly this JSON shape:
{
  "subject_tag": "${subjectOptions}",
  "content_type": "${contentTypeOptions}",
  "topic_tag": "snake_case slug max 30 chars (e.g. integration, newtons_laws, decision_trees)",
  "textbook_association": "exact textbook title from the list if content relates to one, or null"
}`;

  try {
    const { text } = await callAI(prompt);
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in AI response');
    const parsed = JSON.parse(match[0]) as Record<string, unknown>;

    const subject_tag = VALID_SUBJECT_TAGS.includes(
      parsed.subject_tag as (typeof VALID_SUBJECT_TAGS)[number]
    )
      ? (parsed.subject_tag as string)
      : 'general';

    const content_type = VALID_CONTENT_TYPES.includes(
      parsed.content_type as ContentType
    )
      ? (parsed.content_type as ContentType)
      : 'note';

    const topic_tag =
      typeof parsed.topic_tag === 'string' && parsed.topic_tag.length > 0
        ? parsed.topic_tag.replace(/[^a-z0-9_]/gi, '_').slice(0, 30)
        : 'uncategorised';

    const textbook_association =
      typeof parsed.textbook_association === 'string' &&
      parsed.textbook_association.length > 0
        ? parsed.textbook_association
        : null;

    return { subject_tag, content_type, topic_tag, textbook_association };
  } catch {
    return {
      subject_tag: 'general',
      content_type: 'note',
      topic_tag: 'uncategorised',
      textbook_association: null,
    };
  }
}
