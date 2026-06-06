-- ================================================================
-- Migration 002: iCloud Sync support
-- Sprint 6 | WBS 8.1–8.2 | US-020 | P23
--
-- Changes:
--   1. captures.filename_hash  — dedup key for Apple Shortcuts .md files
--   2. sync_log table          — audit log for every /api/sync run (R7)
--
-- Rollback (down):
--   ALTER TABLE captures DROP COLUMN IF EXISTS filename_hash;
--   DROP TABLE IF EXISTS sync_log;
-- ================================================================

-- 1. Add filename_hash to captures (nullable — pre-existing rows have none)
ALTER TABLE captures
  ADD COLUMN IF NOT EXISTS filename_hash text;

-- Index for fast dedup lookup on every sync run
CREATE INDEX IF NOT EXISTS idx_captures_filename_hash
  ON captures (filename_hash)
  WHERE filename_hash IS NOT NULL;

-- 2. sync_log — system table, no user_id, no RLS needed (single-user cron)
CREATE TABLE IF NOT EXISTS sync_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at          timestamptz NOT NULL DEFAULT now(),
  files_found     int NOT NULL DEFAULT 0,
  files_ingested  int NOT NULL DEFAULT 0,
  errors          text[] NOT NULL DEFAULT '{}',
  path_used       text
);

-- Keep only last 100 runs (trim older rows after insert via cron)
-- Note: no automatic trim — manual cleanup if needed; 100 rows = negligible storage
