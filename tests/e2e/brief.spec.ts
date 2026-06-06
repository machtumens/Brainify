import { test, expect } from '@playwright/test';

test.describe('AI Daily Brief', () => {
  test.beforeEach(async ({ page }) => {
    // Clear sessionStorage so brief always fetches fresh
    await page.addInitScript(() => sessionStorage.removeItem('sb_brief'));
  });

  test('skeleton appears before brief loads', async ({ page }) => {
    // Intercept /api/brief to delay response
    await page.route('/api/brief', async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.fulfill({ json: { success: true, data: { brief: 'Test brief text.' }, error: null } });
    });

    await page.goto('/today');
    // Skeleton must be visible before response arrives
    await expect(page.getByLabel('Loading brief')).toBeVisible();
  });

  test('brief text renders after load', async ({ page }) => {
    const briefText = 'Pure Maths is on track. ML goal flagged — 5 days missed.';
    await page.route('/api/brief', (route) =>
      route.fulfill({ json: { success: true, data: { brief: briefText }, error: null } })
    );

    await page.goto('/today');
    await expect(page.getByText(briefText)).toBeVisible({ timeout: 5000 });
  });

  test('no spinner visible during loading', async ({ page }) => {
    await page.route('/api/brief', async (route) => {
      await new Promise((r) => setTimeout(r, 200));
      await route.fulfill({ json: { success: true, data: { brief: 'Brief loaded.' }, error: null } });
    });

    await page.goto('/today');
    // Should never see a spinner role
    await expect(page.locator('[role="progressbar"], .spinner, [data-spinner]')).not.toBeVisible();
  });

  test('brief text has correct typography — italic, weight 300', async ({ page }) => {
    await page.route('/api/brief', (route) =>
      route.fulfill({ json: { success: true, data: { brief: 'Typography test brief.' }, error: null } })
    );

    await page.goto('/today');
    const briefEl = page.getByText('Typography test brief.');
    await expect(briefEl).toBeVisible({ timeout: 5000 });

    const styles = await briefEl.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontStyle: cs.fontStyle, fontWeight: cs.fontWeight };
    });
    expect(styles.fontStyle).toBe('italic');
    expect(styles.fontWeight).toBe('300');
  });

  test('error state shows graceful message when API fails', async ({ page }) => {
    await page.route('/api/brief', (route) =>
      route.fulfill({ status: 500, json: { success: false, data: null, error: 'failed' } })
    );

    await page.goto('/today');
    await expect(page.getByText('Unable to load your brief.')).toBeVisible({ timeout: 5000 });
  });

  test('sessionStorage cache prevents re-fetch on navigation', async ({ page }) => {
    let callCount = 0;
    await page.route('/api/brief', (route) => {
      callCount++;
      return route.fulfill({ json: { success: true, data: { brief: 'Cached brief.' }, error: null } });
    });

    await page.goto('/today');
    await expect(page.getByText('Cached brief.')).toBeVisible({ timeout: 5000 });

    // Navigate away and back
    await page.goto('/goals');
    await page.goto('/today');
    await expect(page.getByText('Cached brief.')).toBeVisible({ timeout: 5000 });

    expect(callCount).toBe(1); // only one fetch — second load used cache
  });

  test('brief mentions Mitchell or ML when seed data present', async ({ page }) => {
    // This test runs against real Supabase seed data — skip if no env vars
    test.skip(!process.env.NEXT_PUBLIC_SUPABASE_URL, 'Requires Supabase seed data');

    await page.goto('/today');
    // Wait for brief to load (real API call)
    const briefEl = page.locator('p[style*="italic"]').first();
    await expect(briefEl).toBeVisible({ timeout: 10000 });

    const text = await briefEl.textContent();
    expect(text?.toLowerCase()).toMatch(/mitchell|ml|machine learning/i);
  });
});
