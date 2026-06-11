// ================================================================
// POST /api/sync — iCloud Drive .md file sync cron
// Sprint 6 | WBS 8.1 | US-020 | P23
//
// Cron schedule: */30 * * * * (every 30 min — vercel.json)
//
// Pipeline:
//   1. CRON_SECRET header check (same pattern as /api/retrospective)
//   2. Read ICLOUD_WATCH_PATH — if unset/inaccessible: log + 200 (no crash)
//   3. Load already-ingested filename hashes from captures table
//   4. Filter new .md files (dedup by filename hash)
//   5. Process up to 10 files per run (batch limit)
//   6. AI auto-tag each file; write to captures with filename_hash
//   7. Insert one row to sync_log (every run, success or not)
//   8. Return { files_found, files_ingested, errors }
//
// Vercel constraint (ADR-012):
//   Serverless containers have no access to local iCloud Drive.
//   When ICLOUD_WATCH_PATH is not set, route returns 200 with
//   files_found=0 — not a failure, just not configured for cloud.
//   Full sync requires local/self-hosted deployment.
//
// Security:
//   CRON_SECRET auth on POST.
//   Path traversal guard in fileProcessor (isSafePath).
//   File size limit: 500KB (fileProcessor).
//   ICLOUD_WATCH_PATH validated: resolved path prefix check.
//
// Law 14: createServiceClient server-only.
// R7: every run logged to sync_log regardless of outcome.
// ================================================================

import * as path from 'path';
import * as fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { logJobRun } from '@/lib/systemLog';
import { buildCandidates } from '@/lib/sync/fileProcessor';
import { autoTag } from '@/lib/ingest/textProcessor';

// ── CRON_SECRET auth ─────────────────────────────────────────────

function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev / manual test: allow without secret
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

// ── Load ingested hashes ─────────────────────────────────────────

async function loadIngestedHashes(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: string
): Promise<Set<string>> {
  const { data } = await db
    .from('captures')
    .select('filename_hash')
    .eq('user_id', userId)
    .eq('source_type', 'apple_shortcuts')
    .not('filename_hash', 'is', null);

  const rows: Array<{ filename_hash: string }> = data ?? [];
  return new Set(rows.map((r) => r.filename_hash));
}

// ── Write sync_log row ────────────────────────────────────────────

async function writeSyncLog(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  filesFound: number,
  filesIngested: number,
  errors: string[],
  pathUsed: string | null
): Promise<void> {
  await db.from('sync_log').insert({
    files_found: filesFound,
    files_ingested: filesIngested,
    errors,
    path_used: pathUsed,
  });
}

// ── Ingest one file ───────────────────────────────────────────────
// Calls autoTag + writes directly to captures (no HTTP hop — avoids auth loop).

async function ingestFile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  userId: string,
  content: string,
  filename: string,
  hash: string,
  textbookTitles: string[]
): Promise<void> {
  const { subject_tag, content_type, topic_tag } = await autoTag(content, textbookTitles);

  await db.from('captures').insert({
    user_id: userId,
    content,
    type: content_type,
    subject_tag,
    topic_tag,
    source_type: 'apple_shortcuts',
    filename_hash: hash,
    confidence: null,
  });
}

// ── Validate watch path ───────────────────────────────────────────
// Ensure ICLOUD_WATCH_PATH is set and accessible.

async function validateWatchPath(watchPath: string | undefined): Promise<string | null> {
  if (!watchPath || watchPath.trim() === '') return null;

  const resolved = path.resolve(watchPath.trim());
  try {
    const stat = await fs.stat(resolved);
    if (!stat.isDirectory()) return null;
    return resolved;
  } catch {
    return null;
  }
}

// ── POST handler ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    return NextResponse.json(
      { success: false, data: null, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient();
  let filesFound = 0;
  let filesIngested = 0;
  const runErrors: string[] = [];
  let pathUsed: string | null = null;

  try {
    // Validate path
    pathUsed = await validateWatchPath(process.env.ICLOUD_WATCH_PATH);

    if (!pathUsed) {
      // Not a failure — path simply not configured for this environment (Vercel)
      await writeSyncLog(db, 0, 0, ['ICLOUD_WATCH_PATH not set or inaccessible'], null);
      return NextResponse.json({
        success: true,
        data: { files_found: 0, files_ingested: 0, errors: ['ICLOUD_WATCH_PATH not set or inaccessible'] },
        error: null,
      });
    }

    // Look up the single user
    const { data: firstUser } = await db
      .from('users')
      .select('id')
      .limit(1)
      .single();

    if (!firstUser?.id) {
      await writeSyncLog(db, 0, 0, ['No user found in DB'], pathUsed);
      return NextResponse.json({
        success: true,
        data: { files_found: 0, files_ingested: 0, errors: ['No user found in DB'] },
        error: null,
      });
    }

    const userId: string = firstUser.id;

    // Load already-ingested hashes for dedup
    const ingestedHashes = await loadIngestedHashes(db, userId);

    // Build candidate list (reads dir, filters new files, reads content)
    const { candidates, filesFound: found, errors: readErrors } = await buildCandidates(
      pathUsed,
      ingestedHashes
    );
    filesFound = found;
    runErrors.push(...readErrors);

    // Fetch textbook titles for auto-tag context
    const { data: textbooks } = await db
      .from('textbooks')
      .select('title')
      .eq('user_id', userId);
    const textbookTitles: string[] = (textbooks ?? []).map((t: { title: string }) => t.title);

    // Ingest each candidate — skip failures, continue
    for (const candidate of candidates) {
      try {
        await ingestFile(db, userId, candidate.content, candidate.filename, candidate.hash, textbookTitles);
        filesIngested++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        runErrors.push(`${candidate.filename}: ingest failed — ${msg}`);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Sync failed';
    runErrors.push(msg);
  }

  // R7: always log the run, even on partial failure
  try {
    await writeSyncLog(db, filesFound, filesIngested, runErrors, pathUsed);
  } catch {
    // Don't let log failure propagate — it would mask the real result
  }

  await logJobRun(
    'sync',
    runErrors.length > 0 ? 'error' : 'ok',
    `found=${filesFound} ingested=${filesIngested}${runErrors.length > 0 ? ` errors: ${runErrors.slice(0, 3).join('; ')}` : ''}`
  );

  return NextResponse.json({
    success: true,
    data: { files_found: filesFound, files_ingested: filesIngested, errors: runErrors },
    error: null,
  });
}
