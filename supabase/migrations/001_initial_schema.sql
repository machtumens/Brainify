-- ================================================================
-- Migration: 001_initial_schema
-- Sprint 1 | WBS 1.3 + 1.5 | US-002
-- Description: Create all 9 tables with RLS for Second Brain
-- Tables: users, goals, textbooks, sessions, errors,
--         captures, test_results, sources, retrospectives
-- ================================================================

-- ----------------------------------------------------------------
-- TABLE: users
-- id IS the auth.uid() — no separate user_id column on this table.
-- RLS uses: auth.uid() = id
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text UNIQUE NOT NULL,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_user_policy" ON public.users
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger: auto-create public.users row on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------
-- TABLE: goals
-- roadmap: jsonb — nested months → weeks → daily_checklist[]
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.goals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title         text NOT NULL,
  category      text CHECK (category IN ('curriculum', 'personal')),
  status        text CHECK (status IN ('active', 'done', 'locked')) NOT NULL DEFAULT 'active',
  total_months  int,
  current_month int DEFAULT 1,
  started_at    date,
  roadmap       jsonb DEFAULT '{}'::jsonb,
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS goals_user_id_idx ON public.goals(user_id);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_user_policy" ON public.goals
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TABLE: textbooks
-- topic_map: jsonb — { chapter_number: [topic_ids] }
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.textbooks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title        text NOT NULL,
  author       text,
  subject      text,
  total_pages  int,
  current_page int DEFAULT 0,
  active_from  date,
  topic_map    jsonb DEFAULT '{}'::jsonb,
  created_at   timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS textbooks_user_id_idx ON public.textbooks(user_id);

ALTER TABLE public.textbooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "textbooks_user_policy" ON public.textbooks
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TABLE: sessions
-- difficulty: 1=light / 2=medium / 3=hard (cognitive load budget)
-- mode: 'struggle' | 'flow' | 'standard'
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_title    text,
  subject       text,
  pomodoros     int DEFAULT 0,
  pages_done    int DEFAULT 0,
  problems_done int DEFAULT 0,
  difficulty    int CHECK (difficulty IN (1, 2, 3)),
  mode          text CHECK (mode IN ('struggle', 'flow', 'standard')),
  started_at    timestamptz DEFAULT now() NOT NULL,
  notes         text,
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx    ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_started_at_idx ON public.sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS sessions_subject_idx    ON public.sessions(subject);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_user_policy" ON public.sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TABLE: errors
-- session_id nullable: errors can be logged outside a session
-- problem_type: 'algebraic'|'geometric'|'proof'|'application'|'recall'
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.errors (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id          uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  topic               text,
  subtopic            text,
  problem_type        text CHECK (problem_type IN ('algebraic', 'geometric', 'proof', 'application', 'recall')),
  mistake_description text,
  flagged_at          timestamptz DEFAULT now() NOT NULL,
  created_at          timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS errors_user_id_idx    ON public.errors(user_id);
CREATE INDEX IF NOT EXISTS errors_session_id_idx ON public.errors(session_id);
CREATE INDEX IF NOT EXISTS errors_topic_idx      ON public.errors(topic);

ALTER TABLE public.errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "errors_user_policy" ON public.errors
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TABLE: captures
-- type: 'note'|'formula'|'problem'|'explanation'|'idea'|'voice'|'photo'
-- source_type: origin of the capture
-- confidence: 1–5
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.captures (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content     text,
  type        text CHECK (type IN ('note', 'formula', 'problem', 'explanation', 'idea', 'voice', 'photo')),
  subject_tag text,
  topic_tag   text,
  source_type text CHECK (source_type IN ('quick_type', 'voice', 'photo', 'apple_shortcuts', 'share_extension', 'pdf')),
  confidence  int CHECK (confidence BETWEEN 1 AND 5),
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS captures_user_id_idx    ON public.captures(user_id);
CREATE INDEX IF NOT EXISTS captures_created_at_idx ON public.captures(created_at DESC);
CREATE INDEX IF NOT EXISTS captures_subject_tag_idx ON public.captures(subject_tag);

ALTER TABLE public.captures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "captures_user_policy" ON public.captures
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TABLE: test_results
-- wrong_ids: uuid[] — array of errors.id references (no FK array constraint)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_results (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_type  text,
  subject    text,
  topics     text[],
  score      int,
  total      int,
  duration   int,   -- seconds
  wrong_ids  uuid[],
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS test_results_user_id_idx    ON public.test_results(user_id);
CREATE INDEX IF NOT EXISTS test_results_created_at_idx ON public.test_results(created_at DESC);

ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "test_results_user_policy" ON public.test_results
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TABLE: sources
-- resource_id is polymorphic: references goals.id OR textbooks.id
-- No FK constraint on resource_id — enforced at application layer.
-- resource_type clarifies which table resource_id points to.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id   uuid NOT NULL,
  resource_type text CHECK (resource_type IN ('textbook', 'capture', 'note')),
  topic         text,
  quality       text CHECK (quality IN ('strong', 'partial', 'missing')),
  last_updated  timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS sources_user_id_idx     ON public.sources(user_id);
CREATE INDEX IF NOT EXISTS sources_resource_id_idx ON public.sources(resource_id);
CREATE INDEX IF NOT EXISTS sources_topic_idx       ON public.sources(topic);

ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sources_user_policy" ON public.sources
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- TABLE: retrospectives
-- coverage_rate, consistency_rate: numeric (decimal percentages)
-- period_type: 'weekly' | 'monthly'
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.retrospectives (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_type      text CHECK (period_type IN ('weekly', 'monthly')),
  period_start     date,
  content          text,
  coverage_rate    numeric,
  consistency_rate numeric,
  risk_topic       text,
  created_at       timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS retrospectives_user_id_idx    ON public.retrospectives(user_id);
CREATE INDEX IF NOT EXISTS retrospectives_created_at_idx ON public.retrospectives(created_at DESC);

ALTER TABLE public.retrospectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "retrospectives_user_policy" ON public.retrospectives
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
