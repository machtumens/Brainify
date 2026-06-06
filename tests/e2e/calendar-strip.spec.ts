import { test, expect } from '@playwright/test';

// Calendar Strip + Exam Countdown E2E tests — P13 US-010
// Mocks Supabase REST calls so tests run without real credentials.

const TODAY = new Date();
const todayStr = [
  TODAY.getFullYear(),
  String(TODAY.getMonth() + 1).padStart(2, '0'),
  String(TODAY.getDate()).padStart(2, '0'),
].join('-');

// Sessions stub: one session today (done dot) + one yesterday (done dot)
const yesterdayDate = new Date(TODAY);
yesterdayDate.setDate(TODAY.getDate() - 1);
const yesterdayStr = [
  yesterdayDate.getFullYear(),
  String(yesterdayDate.getMonth() + 1).padStart(2, '0'),
  String(yesterdayDate.getDate()).padStart(2, '0'),
].join('-');

test.describe('Calendar Strip', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/**', (route) =>
      route.fulfill({ status: 200, body: '{}' })
    );

    // Sessions for current week: today + yesterday
    await page.route('**/rest/v1/sessions*', (route) => {
      const url = route.request().url();
      // Calendar strip query (started_at filter present)
      if (url.includes('started_at')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { started_at: `${todayStr}T10:00:00Z` },
            { started_at: `${yesterdayStr}T09:00:00Z` },
          ]),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ subject: 'mathematics' }]),
      });
    });

    await page.route('**/rest/v1/errors*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('**/rest/v1/textbooks*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('**/rest/v1/goals*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            started_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            total_months: 6,
            roadmap: {
              months: [
                {
                  month: 1,
                  title: 'Algebra',
                  weeks: [
                    { week: 1, topics: ['Algebra'], status: 'done', daily_checklist: [] },
                    { week: 2, topics: ['Quadratics', 'Inequalities'], status: 'active', daily_checklist: [] },
                  ],
                },
              ],
            },
          },
        ]),
      })
    );

    await page.goto('/today');
    await page.waitForSelector('[aria-label="Calendar strip — current week"]', { timeout: 10000 });
  });

  test('renders calendar strip with 7 day items', async ({ page }) => {
    const strip = page.getByRole('list', { name: 'Calendar strip — current week' });
    await expect(strip).toBeVisible();
    const items = strip.getByRole('listitem');
    await expect(items).toHaveCount(7);
  });

  test("today's dot item has correct aria-label state 'done'", async ({ page }) => {
    const todayItem = page.getByRole('listitem', { name: new RegExp(`${todayStr} — done`) });
    await expect(todayItem).toBeVisible();
  });

  test('day labels include M and S characters', async ({ page }) => {
    const strip = page.getByRole('list', { name: 'Calendar strip — current week' });
    // At least one M (Monday) and one S (Saturday or Sunday) label
    const text = await strip.textContent();
    expect(text).toContain('M');
    expect(text).toContain('S');
  });

  test('no box-shadow on calendar strip', async ({ page }) => {
    const strip = page.getByRole('list', { name: 'Calendar strip — current week' });
    const shadow = await strip.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toBe('none');
  });
});

test.describe('Exam Countdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/v1/**', (route) =>
      route.fulfill({ status: 200, body: '{}' })
    );

    await page.route('**/rest/v1/sessions*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { started_at: `${todayStr}T10:00:00Z`, pages_done: 8 },
          { started_at: `${yesterdayStr}T09:00:00Z`, pages_done: 10 },
        ]),
      })
    );

    await page.route('**/rest/v1/errors*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('**/rest/v1/textbooks*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('**/rest/v1/goals*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            started_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            total_months: 6,
            roadmap: {
              months: [
                {
                  month: 1,
                  title: 'Algebra',
                  weeks: [
                    { week: 1, topics: ['Algebra'], status: 'done', daily_checklist: [] },
                    { week: 2, topics: ['Quadratics', 'Inequalities'], status: 'active', daily_checklist: [] },
                  ],
                },
              ],
            },
          },
        ]),
      })
    );

    await page.goto('/today');
    await page.waitForSelector('[aria-label="Exam countdown"]', { timeout: 10000 });
  });

  test('renders exam countdown card', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Exam countdown' }).or(
      page.locator('[aria-label="Exam countdown"]')
    )).toBeVisible();
  });

  test('shows a positive number of days', async ({ page }) => {
    const card = page.locator('[aria-label="Exam countdown"]');
    const text = await card.textContent();
    expect(text).toMatch(/\d+/);
    expect(text).toContain('days to mock');
  });

  test('shows topics unfinished text', async ({ page }) => {
    const card = page.locator('[aria-label="Exam countdown"]');
    await expect(card.getByText(/topics unfinished/)).toBeVisible();
  });

  test('shows daily load text', async ({ page }) => {
    const card = page.locator('[aria-label="Exam countdown"]');
    await expect(card.getByText(/Daily load/)).toBeVisible();
  });

  test('no box-shadow on countdown card', async ({ page }) => {
    const card = page.locator('[aria-label="Exam countdown"]');
    const shadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toBe('none');
  });

  test('shows "No exam date set" when goals return empty', async ({ page }) => {
    await page.route('**/rest/v1/goals*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.goto('/today');
    await page.waitForTimeout(1000);
    await expect(page.getByText('No exam date set')).toBeVisible();
  });
});
