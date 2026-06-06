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

  // Sprint 6: call Gemini multimodal API to extract text from image.
  // For now: placeholder content so capture row is created with source_type='photo'.
  const content = storageUrl
    ? `[Image captured — text extraction coming in Sprint 6. Storage: ${storageUrl}]`
    : '[Image captured — text extraction coming in Sprint 6]';

  return { content, storageUrl, source_type: 'photo' };
}
