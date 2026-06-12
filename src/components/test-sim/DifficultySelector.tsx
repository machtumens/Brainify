'use client';

import {
  DIFFICULTY_LABELS,
  DIFFICULTY_PRESETS,
  type DifficultyLevel,
} from '@/utils/difficultyDefaults';

interface Props {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}

const LEVELS: DifficultyLevel[] = ['easy', 'medium', 'hard'];

export default function DifficultySelector({ value, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Difficulty"
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <span style={{
        fontSize: 10,
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: 'var(--ink4)',
        fontFamily: 'Newsreader, serif',
      }}>
        difficulty
      </span>

      <div style={{ display: 'flex', gap: 8 }}>
        {LEVELS.map((level) => {
          const selected = value === level;
          const preset = DIFFICULTY_PRESETS[level];
          return (
            <button
              key={level}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(level)}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                border: selected ? 'none' : '1px solid var(--line2)',
                background: selected ? 'var(--ink)' : 'transparent',
                color: selected ? 'var(--text-inverse)' : 'var(--ink2)',
                fontFamily: 'Newsreader, serif',
                fontSize: 13,
                fontStyle: 'italic',
                cursor: 'pointer',
                transition: 'background 80ms ease, color 80ms ease, border-color 80ms ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                // 44px min touch target
                minHeight: 44,
                justifyContent: 'center',
              }}
              aria-label={`${DIFFICULTY_LABELS[level]}: ${preset.easy}% easy, ${preset.medium}% medium, ${preset.hard}% hard`}
            >
              <span>{DIFFICULTY_LABELS[level]}</span>
              <span style={{
                fontSize: 10,
                fontStyle: 'normal',
                opacity: 0.7,
                fontFamily: 'monospace',
              }}>
                {preset.easy}/{preset.medium}/{preset.hard}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
