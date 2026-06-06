// ================================================================
// Unit tests — ingest processors
// Sprint 4 | WBS 7.2 | US-021
// ================================================================

import { sanitize, hasMistakeKeyword, autoTag } from '@/lib/ingest/textProcessor';
import { processAudio } from '@/lib/ingest/audioProcessor';
import { validateImageMime } from '@/lib/ingest/imageProcessor';

// ── Mock ai-router so tests don't hit real API ───────────────────
jest.mock('@/lib/ai-router', () => ({
  callAI: jest.fn(),
}));

import { callAI } from '@/lib/ai-router';
const mockCallAI = callAI as jest.MockedFunction<typeof callAI>;

// ── sanitize ─────────────────────────────────────────────────────

describe('sanitize', () => {
  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });

  it('strips HTML tags', () => {
    expect(sanitize('<b>bold</b> text <script>evil()</script>')).toBe('bold text ');
  });

  it('truncates to 5000 chars', () => {
    const long = 'a'.repeat(6000);
    expect(sanitize(long)).toHaveLength(5000);
  });

  it('returns empty string for empty input', () => {
    expect(sanitize('')).toBe('');
  });
});

// ── hasMistakeKeyword ─────────────────────────────────────────────

describe('hasMistakeKeyword', () => {
  it('detects "wrong"', () => {
    expect(hasMistakeKeyword('I got the wrong answer')).toBe(true);
  });

  it('detects "mistake"', () => {
    expect(hasMistakeKeyword('Made a MISTAKE here')).toBe(true);
  });

  it('detects "error"', () => {
    expect(hasMistakeKeyword('This is an error in my working')).toBe(true);
  });

  it('detects "incorrect"', () => {
    expect(hasMistakeKeyword('The result was incorrect')).toBe(true);
  });

  it('returns false for clean content', () => {
    expect(hasMistakeKeyword('Integration by parts formula')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(hasMistakeKeyword('WRONG DIRECTION')).toBe(true);
  });
});

// ── autoTag ───────────────────────────────────────────────────────

describe('autoTag', () => {
  it('returns valid subject_tag from AI response', async () => {
    mockCallAI.mockResolvedValueOnce({
      text: '{"subject_tag":"pure_maths","content_type":"formula","topic_tag":"integration","textbook_association":null}',
      provider: 'gemini',
    });
    const result = await autoTag('integral formula', []);
    expect(result.subject_tag).toBe('pure_maths');
    expect(result.content_type).toBe('formula');
    expect(result.topic_tag).toBe('integration');
    expect(result.textbook_association).toBeNull();
  });

  it('rejects invalid subject_tag — falls back to general', async () => {
    mockCallAI.mockResolvedValueOnce({
      text: '{"subject_tag":"literature","content_type":"note","topic_tag":"books","textbook_association":null}',
      provider: 'gemini',
    });
    const result = await autoTag('some content', []);
    expect(result.subject_tag).toBe('general');
  });

  it('rejects invalid content_type — falls back to note', async () => {
    mockCallAI.mockResolvedValueOnce({
      text: '{"subject_tag":"physics","content_type":"diagram","topic_tag":"optics","textbook_association":null}',
      provider: 'gemini',
    });
    const result = await autoTag('ray diagram', []);
    expect(result.content_type).toBe('note');
  });

  it('sanitizes topic_tag — removes non-alphanumeric chars', async () => {
    mockCallAI.mockResolvedValueOnce({
      text: '{"subject_tag":"ml","content_type":"note","topic_tag":"decision-trees!","textbook_association":null}',
      provider: 'gemini',
    });
    const result = await autoTag('decision trees', []);
    expect(result.topic_tag).toBe('decision_trees_');
  });

  it('returns fallback on AI failure', async () => {
    mockCallAI.mockRejectedValueOnce(new Error('AI unavailable'));
    const result = await autoTag('some content', []);
    expect(result).toEqual({
      subject_tag: 'general',
      content_type: 'note',
      topic_tag: 'uncategorised',
      textbook_association: null,
    });
  });

  it('returns fallback if AI returns non-JSON', async () => {
    mockCallAI.mockResolvedValueOnce({
      text: 'I cannot tag this content.',
      provider: 'gemini',
    });
    const result = await autoTag('some content', []);
    expect(result.subject_tag).toBe('general');
  });

  it('includes textbook_association when provided', async () => {
    mockCallAI.mockResolvedValueOnce({
      text: '{"subject_tag":"calculus","content_type":"problem","topic_tag":"limits","textbook_association":"Calculus - Spivak"}',
      provider: 'gemini',
    });
    const result = await autoTag('limit problem from Spivak', ['Calculus - Spivak']);
    expect(result.textbook_association).toBe('Calculus - Spivak');
  });
});

// ── audioProcessor ───────────────────────────────────────────────

describe('processAudio', () => {
  it('returns empty content and voice source_type (Sprint 6 stub)', async () => {
    const result = await processAudio(Buffer.from(''));
    expect(result.content).toBe('');
    expect(result.source_type).toBe('voice');
  });
});

// ── imageProcessor ───────────────────────────────────────────────

describe('validateImageMime', () => {
  it('accepts jpeg', () => {
    expect(validateImageMime('image/jpeg')).toBe(true);
  });

  it('accepts png', () => {
    expect(validateImageMime('image/png')).toBe(true);
  });

  it('accepts webp', () => {
    expect(validateImageMime('image/webp')).toBe(true);
  });

  it('rejects pdf', () => {
    expect(validateImageMime('application/pdf')).toBe(false);
  });

  it('rejects exe', () => {
    expect(validateImageMime('application/octet-stream')).toBe(false);
  });
});
