import { test, expect } from '@playwright/test';

const MOCK_TEXTBOOKS = [
  {
    id: 'book-1',
    user_id: 'user-1',
    title: 'Pure Mathematics — Cambridge',
    author: 'Hugh Neill',
    subject: 'mathematics',
    total_pages: 300,
    current_page: 90,
    active_from: '2026-01-01',
    topic_map: {},
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'book-2',
    user_id: 'user-1',
    title: 'Physics — Serway Vol.1',
    author: 'Raymond Serway',
    subject: 'physics',
    total_pages: 500,
    current_page: 100,
    active_from: '2026-01-01',
    topic_map: {},
    created_at: '2026-01-01T00:00:00Z',
  },
];

test.describe('Textbook Progress Bars', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/textbooks*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_TEXTBOOKS),
      })
    );
    // Stub goals and brief so today page renders cleanly
    await page.route('**/rest/v1/goals*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('/api/brief', (route) =>
      route.fulfill({ json: { brief: 'Test brief.' } })
    );
  });

  test('renders one bar per active textbook (2 from mock)', async ({ page }) => {
    await page.goto('/today');
    const bars = page.locator('[role="progressbar"]');
    await expect(bars).toHaveCount(2);
  });

  test('progress bar computed height is 1px', async ({ page }) => {
    await page.goto('/today');
    const track = page.locator('[role="progressbar"]').first();
    await expect(track).toBeVisible();
    const height = await track.evaluate((el) => getComputedStyle(el).height);
    expect(height).toBe('1px');
  });

  test('fill width matches (current_page / total_pages) * 100%', async ({ page }) => {
    await page.goto('/today');
    // book-1: 90/300 = 30%
    const fill = page.locator('[role="progressbar"]').first().locator('div');
    const width = await fill.evaluate((el) => (el as HTMLElement).style.width);
    expect(width).toBe('30%');
  });

  test('percentage label visible and right-aligned above bar', async ({ page }) => {
    await page.goto('/today');
    // 30% for book-1
    await expect(page.getByText('30%').first()).toBeVisible();
  });

  test('page count label "p.X / Y" visible', async ({ page }) => {
    await page.goto('/today');
    await expect(page.getByText('p.90 / 300').first()).toBeVisible();
  });

  test('tap bar navigates to /textbooks', async ({ page }) => {
    await page.goto('/today');
    const bar = page.locator('[role="progressbar"]').first();
    // Find the parent Link wrapping the bar
    const link = bar.locator('xpath=ancestor::a').first();
    const href = await link.getAttribute('href');
    expect(href).toBe('/textbooks');
  });

  test('progress bar has aria-valuenow and aria-valuemax', async ({ page }) => {
    await page.goto('/today');
    const bar = page.locator('[role="progressbar"]').first();
    await expect(bar).toHaveAttribute('aria-valuenow', '30');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
  });
});
