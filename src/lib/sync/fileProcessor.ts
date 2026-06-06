// ================================================================
// /lib/sync/fileProcessor.ts — iCloud Drive .md file processor
// Sprint 6 | WBS 8.2 | US-020 | P23
//
// Responsibilities:
//   - Read ICLOUD_WATCH_PATH directory for .md files
//   - Hash filenames (MD5) for dedup tracking
//   - Filter files not yet in captures table
//   - Read file content with 500KB size limit
//   - Path traversal guard
//
// Note on Vercel: serverless functions cannot access local iCloud Drive.
// This module works correctly on local machine or self-hosted server.
// On Vercel: ICLOUD_WATCH_PATH is unset → caller handles gracefully.
//
// ADR-012 documents this constraint.
// ================================================================

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500KB

// ── Types ────────────────────────────────────────────────────────

export interface SyncCandidate {
  filename: string;
  filePath: string;
  content: string;
  hash: string;
}

export interface FolderReadResult {
  candidates: SyncCandidate[];
  filesFound: number;
  errors: string[];
}

// ── Hash ─────────────────────────────────────────────────────────

export function hashFilename(filename: string): string {
  return crypto.createHash('md5').update(filename).digest('hex');
}

// ── Path guard ───────────────────────────────────────────────────
// Resolve the full path and confirm it stays within watchRoot.
// Prevents path traversal via crafted filenames.

function isSafePath(filePath: string, watchRoot: string): boolean {
  const resolved = path.resolve(filePath);
  const resolvedRoot = path.resolve(watchRoot);
  return resolved.startsWith(resolvedRoot + path.sep) || resolved === resolvedRoot;
}

// ── Folder read ──────────────────────────────────────────────────

export async function readSyncFolder(watchPath: string): Promise<string[]> {
  const entries = await fs.readdir(watchPath);
  return entries.filter((name) => name.toLowerCase().endsWith('.md'));
}

// ── Content read ─────────────────────────────────────────────────

export async function readFileContent(
  filePath: string,
  watchPath: string
): Promise<string | null> {
  if (!isSafePath(filePath, watchPath)) return null;

  const stat = await fs.stat(filePath);
  if (stat.size > MAX_FILE_SIZE_BYTES) return null; // skip oversized files

  const raw = await fs.readFile(filePath, 'utf-8');
  // Trim whitespace, hard-limit at 5000 chars (same as CaptureBar sanitize)
  return raw.trim().slice(0, 5000) || null;
}

// ── Dedup filter ─────────────────────────────────────────────────
// Given the set of hashes already in captures table,
// return only filenames not yet ingested.

export function filterNewFiles(
  filenames: string[],
  ingestedHashes: Set<string>
): Array<{ filename: string; hash: string }> {
  return filenames
    .map((filename) => ({ filename, hash: hashFilename(filename) }))
    .filter(({ hash }) => !ingestedHashes.has(hash));
}

// ── Main entry: build candidates list ────────────────────────────
// Returns up to `batchLimit` new files with their content ready for ingest.

export async function buildCandidates(
  watchPath: string,
  ingestedHashes: Set<string>,
  batchLimit = 10
): Promise<FolderReadResult> {
  const errors: string[] = [];
  let allMdFiles: string[] = [];

  try {
    allMdFiles = await readSyncFolder(watchPath);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { candidates: [], filesFound: 0, errors: [`readdir failed: ${msg}`] };
  }

  const newFiles = filterNewFiles(allMdFiles, ingestedHashes).slice(0, batchLimit);
  const candidates: SyncCandidate[] = [];

  for (const { filename, hash } of newFiles) {
    const filePath = path.join(watchPath, filename);
    try {
      const content = await readFileContent(filePath, watchPath);
      if (!content) {
        errors.push(`${filename}: empty or oversized — skipped`);
        continue;
      }
      candidates.push({ filename, filePath, content, hash });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${filename}: read error — ${msg}`);
    }
  }

  return { candidates, filesFound: allMdFiles.length, errors };
}
