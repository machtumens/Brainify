'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface ContextCounts {
  goals: number;
  errors: number;
  captures: number;
  sessions: number;
  textbooks: number;
}

export interface UseChatReturn {
  messages: Message[];
  isStreaming: boolean;
  inputText: string;
  setInputText: (v: string) => void;
  contextCounts: ContextCounts | null;
  streamError: string | null;
  submit: () => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputText, setInputText] = useState('');
  const [contextCounts, setContextCounts] = useState<ContextCounts | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load context counts on mount
  useEffect(() => {
    fetch('/api/tutor')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setContextCounts(json.data);
      })
      .catch(() => { /* non-fatal — indicator shows nothing if fetch fails */ });
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submit = useCallback(async () => {
    const content = inputText.trim().slice(0, 2000);
    if (!content || isStreaming) return;

    setInputText('');
    setStreamError(null);

    // Append user message immediately
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Prepare AI message placeholder
    const aiId = generateId();
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: 'ai', content: '', timestamp: Date.now() },
    ]);
    setIsStreaming(true);

    // Build history from existing messages (exclude the new AI placeholder)
    const history = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'ai',
      content: m.content,
    }));

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Response stream unavailable');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;

          try {
            const { token, error } = JSON.parse(raw) as { token?: string; error?: string };
            if (error) {
              setStreamError('Response interrupted. Try again.');
              break;
            }
            if (token) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiId ? { ...m, content: m.content + token } : m
                )
              );
            }
          } catch {
            // Malformed SSE line — skip
          }
        }
      }
    } catch {
      setStreamError('Response interrupted. Try again.');
      // Remove the empty AI placeholder on failure
      setMessages((prev) => prev.filter((m) => m.id !== aiId || m.content));
    } finally {
      setIsStreaming(false);
    }
  }, [inputText, isStreaming, messages]);

  return {
    messages,
    isStreaming,
    inputText,
    setInputText,
    contextCounts,
    streamError,
    submit,
    messagesEndRef,
  };
}
