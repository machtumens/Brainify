'use client';

import { motion } from 'framer-motion';
import type { Task } from '@/types/tasks';
import { checkPop } from '@/lib/motion';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
}

// Pure presentation — no DB access. Styles via globals.css .task-* classes.
export default function TaskRow({ task, onToggle }: Props) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(task.id);
    }
  }

  return (
    <div
      className="task-row"
      onClick={() => onToggle(task.id)}
    >
      <motion.div
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.title}
        tabIndex={0}
        className={task.done ? 'task-checkbox done' : 'task-checkbox'}
        onKeyDown={handleKeyDown}
        animate={task.done ? checkPop : undefined}
      >
        {task.done && (
          <span style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--surface-page)',
            display: 'block',
          }} />
        )}
      </motion.div>
      <span className={task.done ? 'task-label done' : 'task-label'}>
        {task.title}
      </span>
      {task.subject && (
        <span className="task-subject">{task.subject}</span>
      )}
    </div>
  );
}
