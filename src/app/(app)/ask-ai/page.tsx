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
        // Fills the flex space between Nav and CaptureBar ((app)/layout.tsx);
        // min-height 0 lets the chat log scroll internally instead of
        // growing the page (replaces the old calc(100vh - 56px - 72px)).
        flex: 1,
        minHeight: 0,
        padding: 'var(--sp-5) var(--sp-6) 0',
        maxWidth: 'var(--w-chat-max)',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <h1
        style={{
          margin: '0 0 var(--sp-2)',
          fontSize: 'var(--fs-display)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
          fontFamily: 'Newsreader, serif',
          lineHeight: 'var(--lh-tight)',
        }}
      >
        Ask AI
      </h1>

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
