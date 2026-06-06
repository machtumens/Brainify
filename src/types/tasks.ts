// Task type — used by TaskList and TaskRow (P08).
// Tasks are derived from goals.roadmap jsonb, not a separate DB table.
export interface Task {
  id: string;       // goalId + '-' + weekNum + '-' + day + '-' + idx
  title: string;
  subject: string;  // derived from goal title
  done: boolean;
  goalId: string;
  day: number;      // 1=Mon ... 7=Sun, matches DailyChecklistItem.day
}
