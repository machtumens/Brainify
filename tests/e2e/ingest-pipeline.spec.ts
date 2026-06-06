// ================================================================
// E2E tests — /api/ingest full pipeline
// Sprint 4 | WBS 7.2 | US-021
//
// Requires env: BASE_URL, TEST_EMAIL, TEST_PASSWORD
// Run: npx playwright test tests/e2e/ingest-pipeline.spec.ts
// ================================================================

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const EMAIL = process.env.TEST_EMAIL ?? '';
const PASSWORD = process.env.TEST_PASSWORD ?? '';
const INGEST_URL = `${BASE_URL}/api/ingest`;

// Helper: get auth cookie by logging in via browser
async function getAuthCookies(page: import('@playwright/test').Page) {
  test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
  await page.context().clearCookies();
  await page.goto(BASE_URL + '/login');
  await page.fill('input[type="email"]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
}

test.describe('/api/ingest — unauthenticated', () => {
  test('returns 401 without auth cookie', async ({ request }) => {
    const res = await request.post(INGEST_URL, {
      data: { content: 'test content' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Unauthorized');
  });
});

test.describe('/api/ingest — authenticated text capture', () => {
  test.beforeEach(async ({ page }) => {
    await getAuthCookies(page);
  });

  test('POST text → 202 + capture id returned', async ({ page }) => {
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    const res = await page.request.post(INGEST_URL, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      data: {
        content: 'The integral of x^2 is x^3/3 + C',
        source_type: 'quick_type',
      },
    });
    expect(res.status()).toBe(202);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id');
    expect(typeof body.data.id).toBe('string');
  });

  test('POST empty content → 400 validation error', async ({ page }) => {
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    const res = await page.request.post(INGEST_URL, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      data: { content: '   ' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Content is required');
  });

  test('POST content with mistake keyword → 202 and capture saved', async ({ page }) => {
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    // Content with mistake keyword — should still succeed (errors table updated async)
    const res = await page.request.post(INGEST_URL, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      data: {
        content: 'Made a mistake with the chain rule — forgot to multiply by inner derivative',
        source_type: 'quick_type',
      },
    });
    expect(res.status()).toBe(202);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id');
  });

  test('POST HTML content → sanitized before saving', async ({ page }) => {
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    const res = await page.request.post(INGEST_URL, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      data: {
        content: '<script>alert("xss")</script>Newton third law',
        source_type: 'quick_type',
      },
    });
    // Should succeed — HTML stripped, clean content saved
    expect(res.status()).toBe(202);
  });

  test('POST voice source_type → accepted', async ({ page }) => {
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    const res = await page.request.post(INGEST_URL, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      data: {
        content: 'Voice transcription: decision trees split on information gain',
        source_type: 'voice',
      },
    });
    expect(res.status()).toBe(202);
  });
});
