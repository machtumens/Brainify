'use client';

import TutorChat from '@/components/ask-ai/TutorChat';
import ContextIndicator from '@/components/ask-ai/ContextIndicator';
import { useChat } from '@/hooks/useChat';

// Ask AI — full-width layout. No right panel. US-016.
export default function AskAIPage() {
  const {
    messages,
    isStreaming,
    inputText,
    setInputText,
    contextCounts,
    streamError,
    submit,
    messagesEndRef,
  } = useChat();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 56px - 72px)', // viewport - nav - capture bar
        padding: '20px 24px 0',
        maxWidth: '720px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <h2
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: 'var(--ink3)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        Ask AI
      </h2>

      <ContextIndicator counts={contextCounts} />

      <TutorChat
        messages={messages}
        isStreaming={isStreaming}
        inputText={inputText}
        onInputChange={setInputText}
        onSubmit={submit}
        streamError={streamError}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}
