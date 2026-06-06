/**
 * Unit tests for /lib/sync/fileProcessor.ts
 * Run: npx jest tests/unit/sync-fileProcessor.test.ts
 *
 * Tests:
 *   - hashFilename produces consistent MD5 hex strings
 *   - filterNewFiles returns only files not in ingestedHashes
 *   - filterNewFiles skips files whose hash is already ingested (dedup)
 *   - readFileContent rejects paths outside watchRoot (path traversal)
 *   - buildCandidates graceful error when dir doesn't exist
 */

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs/promises';
import { hashFilename, filterNewFiles, readFileContent, buildCandidates } from '../../src/lib/sync/fileProcessor';

// ── hashFilename ─────────────────────────────────────────────────

describe('hashFilename', () => {
  it('returns 32-char hex string', () => {
    const h = hashFilename('test.md');
    expect(h).toMatch(/^[a-f0-9]{32}$/);
  });

  it('same filename always same hash', () => {
    expect(hashFilename('note.md')).toBe(hashFilename('note.md'));
  });

  it('different filenames produce different hashes', () => {
    expect(hashFilename('a.md')).not.toBe(hashFilename('b.md'));
  });
});

// ── filterNewFiles ────────────────────────────────────────────────

describe('filterNewFiles', () => {
  it('returns all files when ingestedHashes empty', () => {
    const result = filterNewFiles(['a.md', 'b.md'], new Set());
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.filename)).toEqual(['a.md', 'b.md']);
  });

  it('skips files whose hash already ingested (dedup)', () => {
    const hash = hashFilename('existing.md');
    const result = filterNewFiles(['existing.md', 'new.md'], new Set([hash]));
    expect(result).toHaveLength(1);
    expect(result[0].filename).toBe('new.md');
  });

  it('returns empty array when all files already ingested', () => {
    const hashes = new Set(['a.md', 'b.md'].map(hashFilename));
    expect(filterNewFiles(['a.md', 'b.md'], hashes)).toHaveLength(0);
  });

  it('each result has correct hash for its filename', () => {
    const result = filterNewFiles(['test.md'], new Set());
    expect(result[0].hash).toBe(hashFilename('test.md'));
  });
});

// ── readFileContent — path traversal guard ────────────────────────

describe('readFileContent', () => {
  it('returns null for path outside watchRoot (traversal attempt)', async () => {
    const watchRoot = '/tmp/watch';
    // Path that resolves outside watchRoot via ../
    const traversalPath = path.join(watchRoot, '../outside.md');
    const result = await readFileContent(traversalPath, watchRoot);
    expect(result).toBeNull();
  });
});

// ── buildCandidates — graceful on missing dir ─────────────────────

describe('buildCandidates', () => {
  it('returns empty candidates with error when dir does not exist', async () => {
    const nonExistentPath = path.join(os.tmpdir(), 'second-brain-test-nonexistent-xyz123');
    const result = await buildCandidates(nonExistentPath, new Set());
    expect(result.candidates).toHaveLength(0);
    expect(result.filesFound).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toMatch(/readdir failed/);
  });

  it('returns new files from a real temp directory', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sb-sync-test-'));
    try {
      await fs.writeFile(path.join(tmpDir, 'note1.md'), 'Hello world');
      await fs.writeFile(path.join(tmpDir, 'note2.md'), 'Another note');
      await fs.writeFile(path.join(tmpDir, 'ignore.txt'), 'not markdown');

      const result = await buildCandidates(tmpDir, new Set());
      expect(result.filesFound).toBe(2); // only .md files counted
      expect(result.candidates).toHaveLength(2);
      expect(result.candidates.every((c) => c.filename.endsWith('.md'))).toBe(true);
    } finally {
      await fs.rm(tmpDir, { recursive: true });
    }
  });

  it('skips already-ingested files', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sb-sync-dedup-'));
    try {
      await fs.writeFile(path.join(tmpDir, 'old.md'), 'Already ingested');
      await fs.writeFile(path.join(tmpDir, 'new.md'), 'Fresh content');

      const alreadyIngested = new Set([hashFilename('old.md')]);
      const result = await buildCandidates(tmpDir, alreadyIngested);

      expect(result.candidates).toHaveLength(1);
      expect(result.candidates[0].filename).toBe('new.md');
    } finally {
      await fs.rm(tmpDir, { recursive: true });
    }
  });

  it('respects batchLimit', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sb-sync-batch-'));
    try {
      for (let i = 0; i < 15; i++) {
        await fs.writeFile(path.join(tmpDir, `note${i}.md`), `Content ${i}`);
      }
      const result = await buildCandidates(tmpDir, new Set(), 5);
      expect(result.candidates.length).toBeLessThanOrEqual(5);
    } finally {
      await fs.rm(tmpDir, { recursive: true });
    }
  });
});
