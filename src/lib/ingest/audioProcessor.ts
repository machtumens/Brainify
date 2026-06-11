// ================================================================
// Audio Processor — Whisper transcription via Groq (v1.1 Phase 4)
// Sprint 4 stub → real pipeline.
//
// Client-side voice capture (CaptureBar) already transcribes via the
// Web Speech API before POST. This processor handles raw audio binary
// uploads (e.g. Apple Shortcuts voice memos).
//
// Law 15: provider name never surfaces in returned content.
// ================================================================

export interface AudioProcessResult {
  content: string;
  source_type: 'voice';
}

const MAX_AUDIO_BYTES = 20 * 1024 * 1024; // 20MB

export async function processAudio(audioData: Buffer): Promise<AudioProcessResult> {
  if (audioData.byteLength === 0 || audioData.byteLength > MAX_AUDIO_BYTES) {
    return { content: '', source_type: 'voice' };
  }
  if (!process.env.GROQ_API_KEY) {
    return { content: '', source_type: 'voice' };
  }

  try {
    const form = new FormData();
    form.append('model', 'whisper-large-v3');
    form.append(
      'file',
      new Blob([new Uint8Array(audioData)], { type: 'audio/m4a' }),
      'capture.m4a'
    );
    form.append('response_format', 'text');

    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form,
    });

    if (!res.ok) return { content: '', source_type: 'voice' };

    const text = (await res.text()).trim().slice(0, 5000);
    return { content: text, source_type: 'voice' };
  } catch {
    // Transcription unavailable — capture still lands, flagged empty
    return { content: '', source_type: 'voice' };
  }
}
