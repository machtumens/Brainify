-- ================================================================
-- Migration 005: Learning engine — spaced repetition, exam dates,
-- error post-mortems + confidence
-- v1.1 Phase 3
--
-- review_queue — SR ladder (1/3/7/21 days). One row per reviewable
--   item (an error). due_at advances on success, resets on failure.
-- exam_dates  — explicit exam registry (ExamCountdown source of truth;
--   replaces deriving from goals jsonb).
-- errors.post_mortem — student's 1-line "why I got this wrong".
-- errors.confidence  — 'sure' | 'unsure' at answer time; confidently-
--   wrong items weigh 2x in the confusion map.
--
-- Rollback (down):
--   DROP TABLE IF EXISTS review_queue;
--   DROP TABLE IF EXISTS exam_dates;
--   ALTER TABLE errors DROP COLUMN IF EXISTS post_mortem;
--   ALTER TABLE errors DROP COLUMN IF EXISTS confidence;
-- ================================================================

CREATE TABLE IF NOT EXISTS review_queue (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  error_id     uuid REFERENCES errors(id) ON DELETE CASCADE,
  topic        text NOT NULL,
  prompt_text  text NOT NULL,        -- what to show at review time
  interval_idx int  NOT NULL DEFAULT 0,  -- index into [1,3,7,21] day ladder
  due_at       timestamptz NOT NULL,
  last_result  text,                 -- 'pass' | 'fail' | null
  reviewed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "review_queue_owner" ON review_queue
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_review_queue_due
  ON review_queue (user_id, due_at);

CREATE TABLE IF NOT EXISTS exam_dates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  subject    text,
  exam_on    date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE exam_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exam_dates_owner" ON exam_dates
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE errors ADD COLUMN IF NOT EXISTS post_mortem text;
ALTER TABLE errors ADD COLUMN IF NOT EXISTS confidence text
  CHECK (confidence IN ('sure', 'unsure') OR confidence IS NULL);

-- Captures search support (suggestion #17)
CREATE INDEX IF NOT EXISTS idx_captures_content_trgm
  ON captures USING gin (to_tsvector('english', coalesce(content, '')));
