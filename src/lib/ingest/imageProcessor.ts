// ================================================================
// Image Processor — ingest pipeline
// Sprint 4 | WBS 7.2 | US-021
//
// Handles: raw image buffer (JPEG/PNG/WEBP) from multipart form upload.
// 1. Uploads raw image to Supabase Storage bucket 'captures-images'
// 2. Returns storage URL + extracted content
//
// Tech debt: Full AI OCR/text extraction deferred to Sprint 6.
// Gemini Flash vision requires multimodal SDK call (not text-only ai-router).
// Sprint 6 will use Gemini multimodal API directly for handwritten note OCR.
// ================================================================

import { createServiceClient } from '@/lib/supabase';

export interface ImageProcessResult {
  content: string;
  storageUrl: string | null;
  source_type: 'photo';
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export function validateImageMime(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

export async function processImage(
  imageData: Buffer,
  mimeType: string,
  userId: string
): Promise<ImageProcessResult> {
  if (!validateImageMime(mimeType)) {
    return { content: '', storageUrl: null, source_type: 'photo' };
  }
  if (imageData.byteLength > MAX_IMAGE_BYTES) {
    return { content: '[Image too large — max 5MB]', storageUrl: null, source_type: 'photo' };
  }

  let storageUrl: string | null = null;

  try {
    const db = createServiceClient();
    const ext = mimeType.split('/')[1] ?? 'jpg';
    const fileName = `${userId}/${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadError } = await db.storage
      .from('captures-images')
      .upload(fileName, imageData, { contentType: mimeType, upsert: false });

    if (!uploadError && uploadData) {
      const { data: urlData } = db.storage
        .from('captures-images')
        .getPublicUrl(uploadData.path);
      storageUrl = urlData.publicUrl ?? null;
    }
  } catch {
    // Storage upload non-fatal — proceed without URL
  }

  // v1.1: multimodal OCR — extract text + formulas from the image.
  const extracted = await extractImageText(imageData, mimeType);
  const content =
    extracted ||
    (storageUrl
      ? `[Image captured — no text extracted. Storage: ${storageUrl}]`
      : '[Image captured — no text extracted]');

  return { content, storageUrl, source_type: 'photo' };
}

// ── Multimodal OCR (v1.1 Phase 4) ────────────────────────────────
// Handwritten/printed note → markdown text with formulas preserved.
// Law 15: provider name never surfaces in returned content.

async function extractImageText(imageData: Buffer, mimeType: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return '';
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    'Transcribe ALL text in this study-note image to plain markdown. ' +
                    'Preserve mathematical formulas in standard notation. ' +
                    'If the image contains diagrams, describe them in one line each. ' +
                    'Output only the transcription — no commentary.',
                },
                { inline_data: { mime_type: mimeType, data: imageData.toString('base64') } },
              ],
            },
          ],
        }),
      }
    );
    if (!res.ok) return '';
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return (
      json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
    )
      .trim()
      .slice(0, 5000);
  } catch {
    return '';
  }
}
