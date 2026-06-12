'use client';
// PageShell primitive — ADR-015 §6. View chrome: padding, max-width,
// display-size <h1> (fixes broken heading hierarchy — C2), and page
// entrance motion (rise 8px + fade, gentle spring).
// width='sidebar' renders the responsive .layout-sidebar grid; pass
// `aside` for the right column (collapses to 2-up band ≤1024px).

import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { pageVariants } from '@/lib/motion';

interface PageShellProps {
  title?: string;
  /** Right-aligned content on the title line (date, status). */
  titleAside?: ReactNode;
  width?: 'full' | 'content' | 'chat' | 'sidebar';
  /** Right column content — only used with width='sidebar'. */
  aside?: ReactNode;
  style?: CSSProperties;
  children: ReactNode;
}

const WIDTH_STYLE: Record<'full' | 'content' | 'chat', CSSProperties> = {
  full: { padding: 'var(--sp-5) var(--sp-6)' },
  content: { padding: 'var(--sp-5) var(--sp-6)', maxWidth: 'var(--w-content-max)' },
  chat: {
    padding: 'var(--sp-5) var(--sp-6)',
    maxWidth: 'var(--w-chat-max)',
    margin: '0 auto',
    width: '100%',
  },
};

function Title({ title, titleAside }: { title: string; titleAside?: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 'var(--sp-5)',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 'var(--fs-display)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--text-primary)',
          fontFamily: 'Newsreader, serif',
          lineHeight: 'var(--lh-tight)',
        }}
      >
        {title}
      </h1>
      {titleAside}
    </div>
  );
}

export default function PageShell({
  title,
  titleAside,
  width = 'content',
  aside,
  style,
  children,
}: PageShellProps) {
  if (width === 'sidebar') {
    return (
      <motion.div
        className="layout-sidebar"
        style={style}
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <div className="layout-sidebar__main">
          {title && <Title title={title} titleAside={titleAside} />}
          {children}
        </div>
        <div className="layout-sidebar__aside">{aside}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ ...WIDTH_STYLE[width], ...style }}
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {title && <Title title={title} titleAside={titleAside} />}
      {children}
    </motion.div>
  );
}
