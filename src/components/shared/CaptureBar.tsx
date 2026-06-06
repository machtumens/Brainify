'use client';

import { IconMicrophone, IconCamera, IconArrowRight } from '@tabler/icons-react';
import { useCapture } from '@/hooks/useCapture';

export default function CaptureBar() {
  const {
    inputText, setInputText, isSubmitting, showConfirm, errorMsg,
    voiceActive, cameraMsg, submit, startVoice, stopVoice, triggerCamera,
  } = useCapture();

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit();
  }

  return (
    <div
      role="region"
      aria-label="Quick capture"
      style={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        padding: '12px 24px 16px',
        background: 'var(--cream)',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Pill input */}
        <input
          type="text"
          placeholder="capture a thought…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          aria-label="Capture text"
          style={{
            flex: 1,
            border: '1px solid var(--line2)',
            borderRadius: 99,
            padding: '8px 16px',
            fontSize: 14,
            fontFamily: "'Newsreader', serif",
            background: 'var(--cream)',
            color: 'var(--ink)',
            outline: 'none',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ink2)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line2)')}
        />

        {/* Voice button — hold to record */}
        <IconBtn
          label="Voice capture — hold to record"
          onMouseDown={startVoice}
          onMouseUp={stopVoice}
          onTouchStart={startVoice}
          onTouchEnd={stopVoice}
          active={voiceActive}
        >
          <IconMicrophone size={14} stroke={1.5} />
        </IconBtn>

        {/* Camera button */}
        <IconBtn label="Camera capture" onClick={triggerCamera}>
          <IconCamera size={14} stroke={1.5} />
        </IconBtn>

        {/* Send button */}
        <IconBtn
          label="Send capture"
          onClick={submit}
          disabled={isSubmitting || !inputText.trim()}
        >
          <IconArrowRight size={14} stroke={1.5} />
        </IconBtn>
      </div>

      {/* Inline feedback row */}
      {showConfirm && (
        <p style={{
          margin: '4px 0 0 16px',
          fontSize: 12,
          fontStyle: 'italic',
          color: 'var(--ink3)',
          animation: 'captureConfirm 150ms ease-out',
        }}>
          Captured
        </p>
      )}
      {cameraMsg && (
        <p style={{ margin: '4px 0 0 16px', fontSize: 12, fontStyle: 'italic', color: 'var(--ink3)' }}>
          {cameraMsg}
        </p>
      )}
      {errorMsg && (
        <p style={{ margin: '4px 0 0 16px', fontSize: 12, fontStyle: 'italic', color: 'var(--red)' }}>
          {errorMsg}
        </p>
      )}

      <style>{`
        @keyframes captureConfirm {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Outer button = 44×44px touch target (Apple HIG minimum).
// Inner span = 28×28px visible circle per §4.2 icon-only spec.
function IconBtn({
  label, onClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd,
  active, disabled, children,
}: {
  label: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={disabled}
      style={{
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span style={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '1px solid var(--line)',
        background: active ? 'var(--cream3)' : 'transparent',
        color: disabled ? 'var(--ink4)' : 'var(--ink2)',
      }}>
        {children}
      </span>
    </button>
  );
}
