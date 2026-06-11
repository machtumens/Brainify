-- ================================================================
-- Migration 004: AI memory core
-- v1.1 Phase 1
--
-- ai_memory   — one row per (user, scope). scope 'main' is THE memory:
--               a markdown document every AI feature reads first.
--               Other scopes hold per-agent memory (tutor, test_gen,
--               brief, retro) layered on top of main.
-- memory_log  — append-only history of every rewrite (who/what/why).
--
-- Read order (memoryManager.readMemory):
--   main → scope-specific → live context (context-assembler)
-- Write path (memoryManager.rewriteMainMemory):
--   every platform use (session, test, chat, ingest) triggers an AI
--   distill that REWRITES scope='main' and bumps version.
--
-- Rollback (down):
--   DROP TABLE IF EXISTS memory_log;
--   DROP TABLE IF EXISTS ai_memory;
-- ================================================================

CREATE TABLE IF NOT EXISTS ai_memory (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope      text NOT NULL CHECK (scope IN ('main', 'tutor', 'test_gen', 'brief', 'retro')),
  content    text NOT NULL DEFAULT '',
  sections   jsonb,
  version    int  NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, scope)
);

ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_memory_owner" ON ai_memory
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS memory_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scope        text NOT NULL,
  trigger_type text NOT NULL,   -- 'session' | 'test' | 'chat' | 'ingest' | 'manual'
  summary      text,            -- one-line description of what changed
  version      int NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE memory_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "memory_log_owner" ON memory_log
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_memory_log_user_created
  ON memory_log (user_id, created_at DESC);
