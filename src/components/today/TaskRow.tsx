'use client';

import type { Task } from '@/types/tasks';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
}

// Pure presentation — no DB access. Styles injected by parent (TaskList).
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
      <div
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.title}
        tabIndex={0}
        className={task.done ? 'task-checkbox done' : 'task-checkbox'}
        onKeyDown={handleKeyDown}
      >
        {task.done && (
          <span style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--cream)',
            display: 'block',
          }} />
        )}
      </div>
      <span className={task.done ? 'task-label done' : 'task-label'}>
        {task.title}
      </span>
      {task.subject && (
        <span className="task-subject">{task.subject}</span>
      )}
    </div>
  );
}
