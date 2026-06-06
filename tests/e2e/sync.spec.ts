import { test, expect } from '@playwright/test';

// E2E tests for POST /api/sync
// Requires env: BASE_URL, CRON_SECRET (optional)
// Run: npx playwright test tests/e2e/sync.spec.ts
//
// Note: These tests validate route behaviour only.
// Actual iCloud file ingestion requires local deployment with
// ICLOUD_WATCH_PATH configured (ADR-012 — Vercel inaccessible).

const BASE_URL    = process.env.BASE_URL   ?? 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET ?? '';

function cronHeaders(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (CRON_SECRET) h['Authorization'] = `Bearer ${CRON_SECRET}`;
  return h;
}

// ── POST /api/sync — basic invocation ────────────────────────────

test.describe('POST /api/sync', () => {
  test('returns 200 when ICLOUD_WATCH_PATH not configured', async ({ request }) => {
    // In test env, ICLOUD_WATCH_PATH is typically not set.
    // Route must return 200 (graceful no-op), never 500.
    const res = await request.post(BASE_URL + '/api/sync', {
      headers: cronHeaders(),
    });
    // 200 = graceful (path not configured or success)
    // 401 = CRON_SECRET set and not provided
    expect([200, 401]).toContain(res.status());
  });

  test('returns structured JSON envelope', async ({ request }) => {
    const res = await request.post(BASE_URL + '/api/sync', {
      headers: cronHeaders(),
    });
    if (res.status() === 401) return; // skip if auth required

    const body = await res.json();
    expect(body).toHaveProperty('success');
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('error');
  });

  test('data contains files_found, files_ingested, errors', async ({ request }) => {
    const res = await request.post(BASE_URL + '/api/sync', {
      headers: cronHeaders(),
    });
    if (res.status() === 401) return;

    const body = await res.json();
    if (!body.success) return; // AI/DB not configured in test env

    expect(typeof body.data.files_found).toBe('number');
    expect(typeof body.data.files_ingested).toBe('number');
    expect(Array.isArray(body.data.errors)).toBe(true);
  });

  test('returns 401 when wrong CRON_SECRET provided', async ({ request }) => {
    if (!CRON_SECRET) {
      // No secret configured — skip (any bearer is allowed)
      return;
    }
    const res = await request.post(BASE_URL + '/api/sync', {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer wrong-secret' },
    });
    expect(res.status()).toBe(401);
  });
});

// ── GET /api/health — sync_last_run field ────────────────────────

test.describe('GET /api/health — sync_last_run', () => {
  test('health response includes sync_last_run field', async ({ request }) => {
    const res = await request.get(BASE_URL + '/api/health');
    // 200 or 503 (all providers down) — either way body should be present
    const body = await res.json();
    expect(body.data).toHaveProperty('sync_last_run');
  });

  test('sync_last_run is "never" or ISO timestamp string', async ({ request }) => {
    const res = await request.get(BASE_URL + '/api/health');
    const body = await res.json();
    const val: string = body.data?.sync_last_run ?? '';
    const isNever = val === 'never';
    const isISO = /^\d{4}-\d{2}-\d{2}T/.test(val);
    expect(isNever || isISO).toBe(true);
  });
});

// ── Today view — sync label ───────────────────────────────────────

test.describe('Today view — sync label', () => {
  test('sync label renders when health returns sync_last_run', async ({ page }) => {
    // Intercept health call and return a fake sync_last_run
    const fakeTime = new Date(Date.now() - 5 * 60000).toISOString(); // 5 min ago
    await page.route('**/api/health', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            gemini: 'ok',
            groq: 'ok',
            openrouter: 'ok',
            retro_cron: 'never',
            sync_last_run: fakeTime,
          },
          error: null,
        }),
      });
    });

    await page.goto(BASE_URL + '/today');
    // Label should eventually show "synced Xm ago"
    await expect(page.getByText(/synced \d+m ago/)).toBeVisible({ timeout: 5000 });
  });

  test('sync label shows "never synced" when sync_last_run is never', async ({ page }) => {
    await page.route('**/api/health', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            gemini: 'ok', groq: 'ok', openrouter: 'ok',
            retro_cron: 'never',
            sync_last_run: 'never',
          },
          error: null,
        }),
      });
    });

    await page.goto(BASE_URL + '/today');
    await expect(page.getByText('never synced')).toBeVisible({ timeout: 5000 });
  });
});
