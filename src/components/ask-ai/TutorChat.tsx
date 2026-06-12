'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Message } from '@/hooks/useChat';
import { IconArrowRight } from '@tabler/icons-react';
import { springGentle } from '@/lib/motion';

interface Props {
  messages: Message[];
  isStreaming: boolean;
  inputText: string;
  onInputChange: (v: string) => void;
  onSubmit: () => Promise<void>;
  streamError: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function MessageBubble({ message, isStreaming }: { message: Message; isStreaming: boolean }) {
  const isUser = message.role === 'user';
  const isEmpty = !message.content && !isUser;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springGentle}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          maxWidth: '72%',
          padding: '10px 14px',
          borderRadius: '11px',
          border: '1px solid var(--line)',
          background: isUser ? 'var(--cream3)' : 'var(--cream2)',
          fontSize: '14px',
          fontWeight: isUser ? 400 : 300,
          color: 'var(--ink)',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {isEmpty && isStreaming ? (
          // animated three-dot pulse while first token loads
          // (.thinking-dots in globals.css; collapses under reduced motion)
          <span aria-label="Thinking" className="thinking-dots">
            <span /><span /><span />
          </span>
        ) : (
          message.content
        )}
      </div>
    </motion.div>
  );
}

export default function TutorChat({
  messages,
  isStreaming,
  inputText,
  onInputChange,
  onSubmit,
  streamError,
  messagesEndRef,
}: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Message thread */}
      <div
        role="log"
        aria-label="Chat history"
        aria-live="polite"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '16px',
        }}
      >
        {!hasMessages && (
          <p
            style={{
              color: 'var(--ink4)',
              fontStyle: 'italic',
              fontSize: '13px',
              marginTop: '8px',
            }}
          >
            Ask anything about your goals, errors, or study materials.
          </p>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && msg === messages[messages.length - 1]}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {streamError && (
        <p
          role="alert"
          style={{
            fontSize: '12px',
            color: 'var(--red)',
            fontStyle: 'italic',
            marginBottom: '8px',
          }}
        >
          {streamError}
        </p>
      )}

      {/* Input row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          borderTop: '1px solid var(--line)',
          paddingTop: '12px',
          marginTop: '4px',
        }}
      >
        <textarea
          ref={inputRef}
          aria-label="Ask your tutor"
          placeholder="Ask a question..."
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          rows={2}
          style={{
            flex: 1,
            resize: 'none',
            border: '1px solid var(--line2)',
            borderRadius: '11px',
            padding: '10px 14px',
            fontSize: '14px',
            fontFamily: 'inherit',
            fontWeight: 300,
            color: 'var(--ink)',
            background: 'var(--cream)',
            outline: 'none',
            lineHeight: 1.5,
            transition: 'border-color var(--t-fast)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--ink2)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line2)'; }}
        />
        <button
          aria-label="Send message"
          onClick={onSubmit}
          disabled={isStreaming || !inputText.trim()}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid var(--line2)',
            background: inputText.trim() && !isStreaming ? 'var(--ink)' : 'var(--cream2)',
            color: inputText.trim() && !isStreaming ? 'var(--cream)' : 'var(--ink4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !isStreaming ? 'pointer' : 'not-allowed',
            flexShrink: 0,
            transition: 'background var(--t-fast), color var(--t-fast)',
          }}
        >
          <IconArrowRight size={16} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}
