// ================================================================
// Audio Processor — ingest pipeline stub
// Sprint 4 | WBS 7.2 | US-021
//
// Tech debt: full audio transcription pipeline deferred to Sprint 6 (US-020).
// Client-side voice capture (CaptureBar) already transcribes via Web Speech API
// before POST — the route receives transcribed text with source_type='voice'.
// This processor handles raw audio binary uploads (e.g. from Apple Shortcuts).
// Full Whisper/AssemblyAI integration planned for Sprint 6.
// ================================================================

export interface AudioProcessResult {
  content: string;
  source_type: 'voice';
}

export async function processAudio(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _audioData: Buffer
): Promise<AudioProcessResult> {
  // Sprint 6: transcribe via Whisper or AssemblyAI, return text.
  // For now: empty content — caller saves capture with source_type='voice'
  // flagged for manual review if content is empty.
  return { content: '', source_type: 'voice' };
}
