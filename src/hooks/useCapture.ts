'use client';

import { useState, useRef, useCallback } from 'react';

export interface UseCaptureReturn {
  inputText: string;
  setInputText: (v: string) => void;
  isSubmitting: boolean;
  showConfirm: boolean;
  errorMsg: string | null;
  voiceActive: boolean;
  cameraMsg: string | null;
  submit: () => Promise<void>;
  startVoice: () => void;
  stopVoice: () => void;
  triggerCamera: () => void;
}

export function useCapture(): UseCaptureReturn {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [cameraMsg, setCameraMsg] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const submit = useCallback(async () => {
    const content = inputText.trim().slice(0, 5000);
    if (!content || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, source_type: 'quick_type' }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? 'Capture failed');
      setInputText('');
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Capture failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [inputText, isSubmitting]);

  const startVoice = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = typeof window !== 'undefined' ? (window as any) : null;
    const SpeechRec = w ? (w.SpeechRecognition ?? w.webkitSpeechRecognition) : null;
    if (!SpeechRec) { setErrorMsg('Voice not supported in this browser'); return; }
    const rec = new SpeechRec();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      setInputText(e.results[0][0].transcript);
    };
    rec.onerror = () => { setErrorMsg('Voice capture failed'); setVoiceActive(false); };
    rec.onend = () => setVoiceActive(false);
    recognitionRef.current = rec;
    rec.start();
    setVoiceActive(true);
  }, []);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceActive(false);
  }, []);

  const triggerCamera = useCallback(() => {
    setCameraMsg('Photo capture coming in Sprint 6');
    setTimeout(() => setCameraMsg(null), 2000);
  }, []);

  return {
    inputText, setInputText, isSubmitting, showConfirm, errorMsg,
    voiceActive, cameraMsg, submit, startVoice, stopVoice, triggerCamera,
  };
}
