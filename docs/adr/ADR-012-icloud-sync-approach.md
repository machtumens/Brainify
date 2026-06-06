# ADR-012: iCloud Sync Approach and Limitations

**Status:** Accepted
**Date:** 2026-06-06
**Sprint:** 6 | WBS 8.1–8.2 | US-020 | P23

---

## Context

US-020 requires Apple Notes exported as `.md` files to be auto-ingested every 30 minutes. The ROADMAP specifies `ICLOUD_WATCH_PATH` as the env var pointing to the watched iCloud Drive folder.

The app is deployed on Vercel (serverless). Risk R2 in the ROADMAP notes: "iCloud Drive inaccessible on Windows dev machine."

A deeper constraint was discovered during implementation: **Vercel serverless functions run in cloud containers — they have no access to the user's local machine filesystem**, including iCloud Drive.

---

## Decision

Implement `/api/sync` fully with correct file-watching logic using Node.js `fs/promises`. The route:

1. Reads `ICLOUD_WATCH_PATH` at runtime
2. If the path is unset or inaccessible → returns 200 with `files_found: 0`, logs gracefully to `sync_log`
3. If path is accessible → reads `.md` files, deduplicates by MD5 filename hash, ingests new files
4. Always writes a `sync_log` row per run (R7: no silent failures)

The cron fires every 30 minutes on Vercel (`*/30 * * * *` in `vercel.json`). On Vercel, it will log "ICLOUD_WATCH_PATH not set or inaccessible" on every run — this is expected and not a crash.

**Full functionality requires local or self-hosted deployment** where iCloud Drive is mounted at the configured path.

---

## Alternatives Considered

| Option | Rejected Reason |
|--------|----------------|
| HTTP webhook from Apple Shortcuts | Requires iOS automation setup; out of v1 scope |
| Supabase Storage as intermediary | Requires iOS app to upload; out of v1 scope |
| Polling Supabase for staged files | Adds complexity with no benefit over direct fs access |
| Skip implementation entirely | Fails Phase Gate 6 criterion; US-020 AC not met |

---

## Consequences

**Positive:**
- Route fully implemented — works correctly on local dev where iCloud is mounted
- Graceful degradation on Vercel (no crashes, R7 satisfied)
- Dedup logic prevents duplicate ingestion on re-runs
- `sync_log` provides full audit trail per run
- `sync_last_run` surfaced in `/api/health` and Today view

**Negative / Limitations:**
- Automatic sync does not function on Vercel free tier (serverless filesystem limitation)
- On Vercel: cron fires → path inaccessible → logs gracefully → 0 files ingested
- Full automation (v2.0) will require native iOS Share Extension per ROADMAP §15

**For v1 manual testing:**
1. Set `ICLOUD_WATCH_PATH` in `.env.local` to your iCloud Drive Notes export folder
2. Run `npm run dev`
3. `curl -X POST http://localhost:3000/api/sync`
4. Verify: new `.md` files appear in Supabase `captures` table with `source_type = 'apple_shortcuts'`

---

## Dedup Mechanism

- Hash: `MD5(filename)` — not content hash
- Rationale: filename is the stable identifier for a Note; MD5 is sufficient at this scale
- Stored in `captures.filename_hash` (nullable column — pre-existing rows have null)
- Query: `SELECT filename_hash FROM captures WHERE source_type = 'apple_shortcuts' AND filename_hash IS NOT NULL`

---

## Migration

`supabase/migrations/002_sync_migration.sql`

Rollback:
```sql
ALTER TABLE captures DROP COLUMN IF EXISTS filename_hash;
DROP TABLE IF EXISTS sync_log;
```
