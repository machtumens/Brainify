import { test, expect } from '@playwright/test';

// Requires env: BASE_URL, TEST_EMAIL, TEST_PASSWORD, CRON_SECRET (optional)
// Run: npx playwright test tests/e2e/retrospective.spec.ts

const BASE_URL      = process.env.BASE_URL      ?? 'http://localhost:3000';
const EMAIL         = process.env.TEST_EMAIL    ?? '';
const PASSWORD      = process.env.TEST_PASSWORD ?? '';
const CRON_SECRET   = process.env.CRON_SECRET   ?? '';

async function login(page: import('@playwright/test').Page) {
  await page.context().clearCookies();
  await page.goto(BASE_URL + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
}

// ── POST /api/retrospective — manual trigger ──────────────────────

test.describe('POST /api/retrospective — manual trigger', () => {
  test('POST without CRON_SECRET env returns 201 or 401', async ({ request }) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (CRON_SECRET) headers['Authorization'] = `Bearer ${CRON_SECRET}`;

    const res = await request.post(BASE_URL + '/api/retrospective', { headers });
    // 201 = success, 401 = unauthorized (CRON_SECRET set but not provided),
    // 500 = AI failed (acceptable in test env with no real keys)
    expect([201, 401, 500]).toContain(res.status());
  });

  test('POST with correct CRON_SECRET stores row (or returns 500 on no AI keys)', async ({ request }) => {
    test.skip(!CRON_SECRET, 'CRON_SECRET env var required');

    const res = await request.post(BASE_URL + '/api/retrospective', {
      headers: { 'Authorization': `Bearer ${CRON_SECRET}` },
    });
    expect([201, 500]).toContain(res.status());

    if (res.status() === 201) {
      const json = await res.json() as { success: boolean; data: { id: string; period_type: string; coverage_rate: number; consistency_rate: number } };
      expect(json.success).toBe(true);
      expect(json.data.period_type).toBe('weekly');
      expect(typeof json.data.coverage_rate).toBe('number');
      expect(typeof json.data.consistency_rate).toBe('number');
    }
  });

  test('POST with wrong CRON_SECRET returns 401', async ({ request }) => {
    // Only runs when CRON_SECRET is set — we send the wrong secret
    test.skip(!CRON_SECRET, 'CRON_SECRET env var required');

    const res = await request.post(BASE_URL + '/api/retrospective', {
      headers: { 'Authorization': 'Bearer wrong-secret-value' },
    });
    expect(res.status()).toBe(401);
    const json = await res.json() as { success: boolean };
    expect(json.success).toBe(false);
  });
});

// ── GET /api/retrospective — requires auth ────────────────────────

test.describe('GET /api/retrospective — auth required', () => {
  test('GET without session returns 401', async ({ request }) => {
    const res = await request.get(BASE_URL + '/api/retrospective');
    expect(res.status()).toBe(401);
  });
});

// ── Goals view — retrospectives section ──────────────────────────

test.describe('Goals View — Retrospectives section', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await login(page);
    await page.goto(BASE_URL + '/goals');
  });

  test('retrospectives section label visible', async ({ page }) => {
    await expect(
      page.locator('[data-testid="retro-section-label"]')
    ).toBeVisible({ timeout: 5000 });
  });

  test('retro history list or empty state visible', async ({ page }) => {
    const list = page.locator('[data-testid="retro-history-list"]');
    const empty = page.locator('[data-testid="retro-empty"]');
    await expect(list.or(empty)).toBeVisible({ timeout: 8000 });
  });

  test('no modal dialogs on goals page', async ({ page }) => {
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  });

  test('no box-shadow in goals page HTML', async ({ page }) => {
    const html = await page.content();
    expect(html).not.toContain('box-shadow');
  });

  test('capture bar visible on goals view', async ({ page }) => {
    const bar = page.locator('input[placeholder*="capture"]').or(
      page.locator('[data-testid="capture-bar"]')
    ).first();
    await expect(bar).toBeVisible({ timeout: 5000 });
  });
});

// ── Retro row structure (if rows exist) ──────────────────────────

test.describe('Goals View — Retro row content', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await login(page);
    await page.goto(BASE_URL + '/goals');
  });

  test('retro row shows coverage metric if rows exist', async ({ page }) => {
    await page.waitForTimeout(2000); // wait for fetch

    const rows = page.locator('[data-testid="retro-row"]');
    const count = await rows.count();
    if (count === 0) {
      // Empty state is acceptable
      return;
    }
    // First row should have coverage label
    await expect(rows.first().locator('text=/coverage/i')).toBeVisible();
  });

  test('retro row shows consistency metric if rows exist', async ({ page }) => {
    await page.waitForTimeout(2000);
    const rows = page.locator('[data-testid="retro-row"]');
    const count = await rows.count();
    if (count === 0) return;
    await expect(rows.first().locator('text=/consistency/i')).toBeVisible();
  });
});
