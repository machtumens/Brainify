import type { QuadrantType } from '@/utils/computeConfusionMap';
import { PILL_BG } from '@/utils/confusionMapColors';

interface TopicPillProps {
  topic: string;
  quadrant: QuadrantType;
}

const PILL_TEXT_COLOR: Record<QuadrantType, string> = {
  danger:   'var(--red)',
  watch:    'var(--amber)',
  safe:     'var(--ink2)',
  upcoming: 'var(--ink4)',
};

const PILL_STYLES: Record<QuadrantType, React.CSSProperties> = {
  danger:   { background: PILL_BG.danger,   color: PILL_TEXT_COLOR.danger   },
  watch:    { background: PILL_BG.watch,     color: PILL_TEXT_COLOR.watch    },
  safe:     { background: PILL_BG.safe,      color: PILL_TEXT_COLOR.safe     },
  upcoming: { background: PILL_BG.upcoming,  color: PILL_TEXT_COLOR.upcoming },
};

export default function TopicPill({ topic, quadrant }: TopicPillProps) {
  return (
    <span
      style={{
        ...PILL_STYLES[quadrant],
        display: 'inline-block',
        fontSize: 11,
        fontStyle: 'italic',
        fontFamily: 'Newsreader, serif',
        padding: '2px 8px',
        borderRadius: 99,
        transition: 'background var(--t-task), color var(--t-task)',
        lineHeight: 1.5,
      }}
    >
      {topic}
    </span>
  );
}
