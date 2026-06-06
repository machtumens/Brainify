export type AIProvider = 'gemini' | 'groq' | 'openrouter';

export interface ContextPayload {
  goals: {
    id: string;
    title: string;
    category: string;
    status: string;
    current_month: number | null;
    roadmap: Record<string, unknown> | null;
  }[];
  sessions: {
    id: string;
    task_title: string | null;
    subject: string | null;
    pomodoros: number | null;
    difficulty: number | null;
    mode: string | null;
    notes: string | null;
    started_at: string | null;
  }[];
  errors: {
    topic: string | null;
    subtopic: string | null;
    problem_type: string | null;
    count: number;
  }[];
  captures: {
    id: string;
    content: string | null;
    type: string | null;
    subject_tag: string | null;
    topic_tag: string | null;
  }[];
  textbooks: {
    id: string;
    title: string;
    subject: string | null;
    current_page: number | null;
    total_pages: number | null;
    topic_map: Record<string, unknown> | null;
  }[];
  sources: {
    topic: string | null;
    quality: string | null;
    resource_type: string | null;
  }[];
}

export interface AIResponse {
  text: string;
  provider: AIProvider;
}
