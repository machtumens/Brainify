// Test Simulator types — Sprint 5 | US-014, US-015 | P19, P20
// Question format: 4 options (A/B/C/D), one correct answer

export interface Question {
  id: string;          // uuid v4 generated server-side
  topic: string;       // which topic this question addresses
  text: string;        // question stem
  options: [string, string, string, string]; // exactly 4 options
  correct_answer: 0 | 1 | 2 | 3;            // index of correct option
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GenerateTestRequest {
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  count?: number; // default 5
}

export interface GenerateTestResponse {
  questions: Question[];
}

// P20 — timed test submission
export interface SubmitTestRequest {
  questions: Question[];
  selections: Record<string, number>; // questionId → selectedOptionIndex
  /** v1.1: calibration — sure/unsure per answered question */
  confidence?: Record<string, 'sure' | 'unsure'>;
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // seconds elapsed
}

export interface TestResultSummary {
  id: string;
  score: number;
  total: number;
  duration: number;
  topics: string[];
  wrong_ids: string[];
  /** v1.1: questionId → errors.id for wrong answers (post-mortem wiring) */
  wrong_map?: Record<string, string>;
  created_at: string;
}

export interface TestHistoryItem {
  id: string;
  score: number;
  total: number;
  duration: number;
  topics: string[];
  created_at: string;
}
