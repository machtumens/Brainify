-- ================================================================
-- Migration 003: system_log — cron + background job observability
-- v1.1 Phase 0 | suggestion #24
--
-- Every cron run (sync, retrospective) and background job writes one
-- row: job name, status, detail. /api/health surfaces the latest row
-- per job; Today view shows a red dot when the latest run failed.
--
-- Rollback (down):
--   DROP TABLE IF EXISTS system_log;
-- ================================================================

CREATE TABLE IF NOT EXISTS system_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job        text NOT NULL,              -- 'sync' | 'retrospective' | 'memory_rewrite' | ...
  status     text NOT NULL,              -- 'ok' | 'error'
  detail     text,                       -- error message or run summary
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_log_job_created
  ON system_log (job, created_at DESC);

-- System table, service-role access only (no RLS — never exposed to anon)
