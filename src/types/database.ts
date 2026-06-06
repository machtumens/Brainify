// ================================================================
// Database TypeScript types — Second Brain
// Sprint 1 | WBS 1.3 | US-002
//
// Hand-written to match 001_initial_schema.sql exactly.
// Regenerate with: npx supabase gen types typescript --linked
// ================================================================

// ----------------------------------------------------------------
// Jsonb sub-types
// ----------------------------------------------------------------

export interface DailyChecklistItem {
  day: number;
  task: string;
  done: boolean;
}

export interface WeekEntry {
  week: number;
  topics: string[];
  status: 'pending' | 'active' | 'done';
  daily_checklist: DailyChecklistItem[];
}

export interface MonthEntry {
  month: number;
  title: string;
  weeks: WeekEntry[];
}

export interface GoalRoadmap {
  months: MonthEntry[];
  tracks?: string[];
  total_hours?: number;
  unlock_condition?: string;
  unlock_goal_id_ref?: string;
  unlock_month?: number;
  amber_trigger?: string;
}

export interface UserPreferences {
  peak_windows?: string[];
  daily_budget_limit?: number;
  mode_defaults?: string;
  provider_priority?: string[];
}

// chapter_number (as string) → array of topic_ids
export type TopicMap = Record<string, string[]>;

// ----------------------------------------------------------------
// Row types — mirrors exact column names from schema
// ----------------------------------------------------------------

export interface UserRow {
  id: string;
  email: string;
  preferences: UserPreferences;
  created_at: string;
}

export interface GoalRow {
  id: string;
  user_id: string;
  title: string;
  category: 'curriculum' | 'personal' | null;
  status: 'active' | 'done' | 'locked';
  total_months: number | null;
  current_month: number | null;
  started_at: string | null;
  roadmap: GoalRoadmap;
  created_at: string;
}

export interface TextbookRow {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  subject: string | null;
  total_pages: number | null;
  current_page: number;
  active_from: string | null;
  topic_map: TopicMap;
  created_at: string;
}

export interface SessionRow {
  id: string;
  user_id: string;
  task_title: string | null;
  subject: string | null;
  pomodoros: number;
  pages_done: number;
  problems_done: number;
  difficulty: 1 | 2 | 3 | null;
  mode: 'struggle' | 'flow' | 'standard' | null;
  started_at: string;
  notes: string | null;
  created_at: string;
}

export interface ErrorRow {
  id: string;
  user_id: string;
  session_id: string | null;
  topic: string | null;
  subtopic: string | null;
  problem_type: 'algebraic' | 'geometric' | 'proof' | 'application' | 'recall' | null;
  mistake_description: string | null;
  flagged_at: string;
  created_at: string;
}

export interface CaptureRow {
  id: string;
  user_id: string;
  content: string | null;
  type: 'note' | 'formula' | 'problem' | 'explanation' | 'idea' | 'voice' | 'photo' | null;
  subject_tag: string | null;
  topic_tag: string | null;
  source_type: 'quick_type' | 'voice' | 'photo' | 'apple_shortcuts' | 'share_extension' | 'pdf' | null;
  confidence: 1 | 2 | 3 | 4 | 5 | null;
  filename_hash: string | null;
  created_at: string;
}

export interface TestResultRow {
  id: string;
  user_id: string;
  test_type: string | null;
  subject: string | null;
  topics: string[] | null;
  score: number | null;
  total: number | null;
  duration: number | null;
  wrong_ids: string[] | null;
  created_at: string;
}

export interface SourceRow {
  id: string;
  user_id: string;
  resource_id: string;
  resource_type: 'textbook' | 'capture' | 'note' | null;
  topic: string | null;
  quality: 'strong' | 'partial' | 'missing' | null;
  last_updated: string | null;
  created_at: string;
}

export interface RetrospectiveRow {
  id: string;
  user_id: string;
  period_type: 'weekly' | 'monthly' | null;
  period_start: string | null;
  content: string | null;
  coverage_rate: number | null;
  consistency_rate: number | null;
  risk_topic: string | null;
  created_at: string;
}

export interface SyncLogRow {
  id: string;
  run_at: string;
  files_found: number;
  files_ingested: number;
  errors: string[];
  path_used: string | null;
}

// ----------------------------------------------------------------
// Insert types (omit generated fields)
// ----------------------------------------------------------------

export type UserInsert = Omit<UserRow, 'created_at'>;
export type GoalInsert = Omit<GoalRow, 'id' | 'created_at'>;
export type TextbookInsert = Omit<TextbookRow, 'id' | 'created_at'>;
export type SessionInsert = Omit<SessionRow, 'id' | 'created_at'>;
export type ErrorInsert = Omit<ErrorRow, 'id' | 'created_at' | 'flagged_at'>;
export type CaptureInsert = Omit<CaptureRow, 'id' | 'created_at'>;
export type TestResultInsert = Omit<TestResultRow, 'id' | 'created_at'>;
export type SourceInsert = Omit<SourceRow, 'id' | 'created_at'>;
export type RetrospectiveInsert = Omit<RetrospectiveRow, 'id' | 'created_at'>;

// ----------------------------------------------------------------
// Database type — used to type the Supabase client
// ----------------------------------------------------------------

export interface Database {
  public: {
    // supabase-js v2 requires Views, Functions, Enums, CompositeTypes
    // to be present in the schema type or generic resolution falls back to never.
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: Partial<UserInsert>;
      };
      goals: {
        Row: GoalRow;
        Insert: GoalInsert;
        Update: Partial<GoalInsert>;
      };
      textbooks: {
        Row: TextbookRow;
        Insert: TextbookInsert;
        Update: Partial<TextbookInsert>;
      };
      sessions: {
        Row: SessionRow;
        Insert: SessionInsert;
        Update: Partial<SessionInsert>;
      };
      errors: {
        Row: ErrorRow;
        Insert: ErrorInsert;
        Update: Partial<ErrorInsert>;
      };
      captures: {
        Row: CaptureRow;
        Insert: CaptureInsert;
        Update: Partial<CaptureInsert>;
      };
      test_results: {
        Row: TestResultRow;
        Insert: TestResultInsert;
        Update: Partial<TestResultInsert>;
      };
      sources: {
        Row: SourceRow;
        Insert: SourceInsert;
        Update: Partial<SourceInsert>;
      };
      retrospectives: {
        Row: RetrospectiveRow;
        Insert: RetrospectiveInsert;
        Update: Partial<RetrospectiveInsert>;
      };
    };
  };
}
