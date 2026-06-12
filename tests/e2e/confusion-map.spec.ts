import { test, expect } from '@playwright/test';

// Confusion Map E2E tests — P12 US-009
// Assumes: user is logged in, seed errors present (5 Pure Maths errors via P02 seed)

test.describe('Confusion Map', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth so the page loads without real Supabase credentials
    await page.route('**/auth/v1/**', (route) => route.fulfill({ status: 200, body: '{}' }));

    // Stub sessions: one mathematics session
    await page.route('**/rest/v1/sessions*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ subject: 'mathematics' }]),
      })
    );

    // Stub errors: 5 Pure Maths errors → errorCount >= 2 for 'pure maths' → Danger
    await page.route('**/rest/v1/errors*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { topic: 'pure maths' },
          { topic: 'pure maths' },
          { topic: 'pure maths' },
          { topic: 'pure maths' },
          { topic: 'pure maths' },
        ]),
      })
    );

    // Stub textbooks: one textbook subject not yet in sessions → Upcoming
    await page.route('**/rest/v1/textbooks*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ subject: 'statistics' }]),
      })
    );

    await page.goto('/today');
    await page.waitForSelector('[aria-label="Confusion Map"]', { timeout: 10000 });
  });

  test('renders Confusion Map section', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Confusion Map' })).toBeVisible();
  });

  test('shows 4 quadrant labels: SAFE, DANGER, WATCH, UPCOMING', async ({ page }) => {
    const map = page.getByRole('region', { name: 'Confusion Map' });
    for (const label of ['SAFE', 'DANGER', 'WATCH', 'UPCOMING']) {
      await expect(map.getByText(label)).toBeVisible();
    }
  });

  test('DANGER quadrant has correct background color #FDF0EF', async ({ page }) => {
    const dangerCell = page.locator('text=DANGER').locator('..');
    const bg = await dangerCell.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #FDF0EF = rgb(253, 240, 239)
    expect(bg).toBe('rgb(253, 240, 239)');
  });

  test('WATCH quadrant has correct background color #FDF8EF', async ({ page }) => {
    const watchCell = page.locator('text=WATCH').locator('..');
    const bg = await watchCell.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #FDF8EF = rgb(253, 248, 239)
    expect(bg).toBe('rgb(253, 248, 239)');
  });

  test('no box-shadow on any quadrant card', async ({ page }) => {
    const cards = page.locator('[aria-label="Confusion Map"] > div > div');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const shadow = await cards.nth(i).evaluate((el) => getComputedStyle(el).boxShadow);
      expect(shadow).toBe('none');
    }
  });

  test('seed errors → pure maths topic appears in DANGER quadrant', async ({ page }) => {
    const dangerSection = page.locator('text=DANGER').locator('..');
    await expect(dangerSection.getByText('pure maths')).toBeVisible();
  });

  test('DANGER quadrant pill has red text color', async ({ page }) => {
    // Target the topic pill itself — `span.first()` under the quadrant
    // matched the DANGER label (transparent bg), not the pill.
    const pill = page.locator('text=DANGER').locator('..').getByText('pure maths');
    await expect(pill).toBeVisible();
    const color = await pill.evaluate((el) => getComputedStyle(el).color);
    // --red = #C0392B = rgb(192, 57, 43)
    expect(color).toBe('rgb(192, 57, 43)');
  });

  test('DANGER pill background is #F5D9D7', async ({ page }) => {
    const pill = page.locator('text=DANGER').locator('..').getByText('pure maths');
    await expect(pill).toBeVisible();
    const bg = await pill.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #F5D9D7 = rgb(245, 217, 215)
    expect(bg).toBe('rgb(245, 217, 215)');
  });

  test('mathematics (covered, no errors) → appears in SAFE quadrant', async ({ page }) => {
    const safeSection = page.locator('text=SAFE').locator('..');
    await expect(safeSection.getByText('mathematics')).toBeVisible();
  });

  test('statistics (textbook only) → appears in UPCOMING quadrant', async ({ page }) => {
    const upcomingSection = page.locator('text=UPCOMING').locator('..');
    await expect(upcomingSection.getByText('statistics')).toBeVisible();
  });

  test('empty state renders quadrant shells with labels when no data', async ({ page }) => {
    // Override stubs to return empty arrays
    await page.route('**/rest/v1/sessions*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('**/rest/v1/errors*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('**/rest/v1/textbooks*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.goto('/today');
    await page.waitForSelector('[aria-label="Confusion Map"]');

    const map = page.getByRole('region', { name: 'Confusion Map' });
    // All 4 labels still visible with no pills
    for (const label of ['SAFE', 'DANGER', 'WATCH', 'UPCOMING']) {
      await expect(map.getByText(label)).toBeVisible();
    }
  });
});
