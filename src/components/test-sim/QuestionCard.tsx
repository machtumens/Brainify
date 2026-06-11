'use client';

import type { Question } from '@/types/test';

interface Props {
  question: Question;
  index: number;
  selectedOption: number | null;
  onSelect: (questionId: string, optionIndex: number) => void;
  revealed: boolean;
}

const LABELS = ['A', 'B', 'C', 'D'] as const;

export default function QuestionCard({
  question,
  index,
  selectedOption,
  onSelect,
  revealed,
}: Props) {
  return (
    <article
      aria-label={`Question ${index + 1}`}
      style={{
        border: '1px solid var(--line)',
        borderRadius: 11,
        boxShadow: 'var(--shadow-1)',
        background: 'var(--cream)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Question number + topic badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color: 'var(--ink4)',
          fontFamily: 'Newsreader, serif',
        }}>
          Q{index + 1}
        </span>
        <span style={{
          fontSize: 10,
          fontStyle: 'italic',
          color: 'var(--ink3)',
          fontFamily: 'Newsreader, serif',
        }}>
          {question.topic}
        </span>
      </div>

      {/* Question stem */}
      <p style={{
        margin: 0,
        fontSize: 14,
        fontFamily: 'Newsreader, serif',
        color: 'var(--ink)',
        lineHeight: 1.5,
      }}>
        {question.text}
      </p>

      {/* Options */}
      <div
        role="radiogroup"
        aria-label={`Options for question ${index + 1}`}
        style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
      >
        {question.options.map((optionText, optIdx) => {
          const isSelected = selectedOption === optIdx;
          const isCorrect  = optIdx === question.correct_answer;
          let background = 'transparent';
          let borderColor = 'var(--line)';
          let color = 'var(--ink2)';

          if (revealed) {
            if (isCorrect) {
              background  = 'var(--cream2)';
              borderColor = 'var(--green)';
              color       = 'var(--green)';
            } else if (isSelected && !isCorrect) {
              background  = 'var(--cream2)';
              borderColor = 'var(--red)';
              color       = 'var(--red)';
            }
          } else if (isSelected) {
            background  = 'var(--cream3)';
            borderColor = 'var(--ink3)';
            color       = 'var(--ink)';
          }

          return (
            <button
              key={optIdx}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(question.id, optIdx)}
              disabled={revealed}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                border: `1px solid ${borderColor}`,
                background,
                color,
                fontFamily: 'Newsreader, serif',
                fontSize: 13,
                textAlign: 'left',
                cursor: revealed ? 'default' : 'pointer',
                transition: 'background 150ms ease, border-color 150ms ease',
                minHeight: 44,
                lineHeight: 1.4,
              }}
            >
              <span style={{
                flexShrink: 0,
                fontSize: 10,
                fontWeight: 400,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginTop: 2,
                color: isSelected || revealed ? 'inherit' : 'var(--ink4)',
              }}>
                {LABELS[optIdx]}
              </span>
              <span>{optionText}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
