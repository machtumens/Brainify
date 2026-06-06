import { test, expect } from '@playwright/test';

// Goal Hierarchy E2E tests — P14 US-012
// Mocks /api/goals and /api/goals/insight so tests run without real credentials.

const MOCK_GOALS = [
  {
    id: 'goal-maths',
    user_id: 'user-1',
    title: 'A Level Pure Mathematics',
    category: 'curriculum',
    status: 'active',
    total_months: 6,
    current_month: 1,
    started_at: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    roadmap: {
      months: [
        {
          month: 1,
          title: 'M1: Algebra & Functions',
          weeks: [
            {
              week: 1,
              topics: ['Coordinate Geometry', 'Quadratics'],
              status: 'done',
              daily_checklist: [
                { day: 1, task: 'Read textbook Ch.1', done: true },
                { day: 2, task: 'Problem set A', done: false },
              ],
            },
            {
              week: 2,
              topics: ['Polynomials'],
              status: 'active',
              daily_checklist: [],
            },
          ],
        },
      ],
      total_hours: 360,
      tracks: ['Pure', 'Stats', 'Mechanics'],
    },
  },
  {
    id: 'goal-physics',
    user_id: 'user-1',
    title: 'Physics — Serway Vol.1',
    category: 'curriculum',
    status: 'active',
    total_months: 4,
    current_month: 1,
    started_at: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    roadmap: { months: [] },
  },
  {
    id: 'goal-ml',
    user_id: 'user-1',
    title: 'Machine Learning — Mitchell',
    category: 'personal',
    status: 'active',
    total_months: 3,
    current_month: 1,
    started_at: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    roadmap: { months: [], amber_trigger: '5 days missed' },
  },
  {
    id: 'goal-spivak',
    user_id: 'user-1',
    title: 'Calculus — Spivak',
    category: 'personal',
    status: 'locked',
    total_months: 3,
    current_month: null,
    started_at: null,
    created_at: '2026-01-01T00:00:00Z',
    roadmap: { months: [], unlock_condition: 'Pure Maths M3 Integration complete' },
  },
];

test.describe('Goal Hierarchy', () => {
  test.beforeEach(async ({ page }) => {
    // Auth stub
    await page.route('**/auth/v1/**', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ user: { id: 'user-1' }, session: {} }) })
    );

    // /api/goals
    await page.route('**/api/goals', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: MOCK_GOALS, error: null }),
        });
      }
      return route.continue();
    });

    // /api/goals/insight — return stub insight
    await page.route('**/api/goals/insight', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { insight: 'On pace for milestone.' }, error: null }),
      })
    );

    await page.goto('/goals');
  });

  test('renders 4 goal cards', async ({ page }) => {
    const list = page.locator('[data-testid="goal-list"]');
    await expect(list).toBeVisible();
    const cards = list.locator('[data-testid^="goal-card-"]');
    await expect(cards).toHaveCount(4);
  });

  test('Spivak goal has locked indicator', async ({ page }) => {
    const spivakCard = page.locator('[data-testid="goal-card-goal-spivak"]');
    await expect(spivakCard).toBeVisible();
    const lockIndicator = spivakCard.locator('[data-testid="lock-indicator"]');
    await expect(lockIndicator).toBeVisible();
    await expect(lockIndicator).toContainText('locked');
  });

  test('Spivak goal has reduced opacity', async ({ page }) => {
    const spivakCard = page.locator('[data-testid="goal-card-goal-spivak"]');
    const opacity = await spivakCard.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeLessThan(1);
  });

  test('expand macro goal shows month rows', async ({ page }) => {
    const mathsCard = page.locator('[data-testid="goal-card-goal-maths"]');
    const expandBtn = mathsCard.locator('button[aria-expanded]').first();

    await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
    await expandBtn.click();
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');

    // Month row should now be visible
    await expect(mathsCard.locator('text=M1: Algebra & Functions')).toBeVisible();
  });

  test('expand month row shows week rows', async ({ page }) => {
    const mathsCard = page.locator('[data-testid="goal-card-goal-maths"]');
    // Expand macro first
    await mathsCard.locator('button[aria-expanded]').first().click();

    // Find and click the month row expand button
    const monthBtn = mathsCard.locator('button[aria-expanded]').nth(1);
    await monthBtn.click();
    await expect(monthBtn).toHaveAttribute('aria-expanded', 'true');

    // Week rows should appear
    await expect(mathsCard.locator('text=Week 1')).toBeVisible();
    await expect(mathsCard.locator('text=Week 2')).toBeVisible();
  });

  test('expand week row shows daily items', async ({ page }) => {
    const mathsCard = page.locator('[data-testid="goal-card-goal-maths"]');
    await mathsCard.locator('button[aria-expanded]').first().click();
    const monthBtn = mathsCard.locator('button[aria-expanded]').nth(1);
    await monthBtn.click();

    // Expand week 1
    const weekBtn = mathsCard.locator('button[aria-expanded]').nth(2);
    await weekBtn.click();
    await expect(weekBtn).toHaveAttribute('aria-expanded', 'true');

    await expect(mathsCard.locator('text=Read textbook Ch.1')).toBeVisible();
    await expect(mathsCard.locator('text=Problem set A')).toBeVisible();
  });

  test('locked goal expand button is disabled', async ({ page }) => {
    const spivakCard = page.locator('[data-testid="goal-card-goal-spivak"]');
    const expandBtn = spivakCard.locator('button[aria-expanded]').first();
    await expect(expandBtn).toBeDisabled();
  });

  test('AI insight blurb renders per goal', async ({ page }) => {
    const mathsCard = page.locator('[data-testid="goal-card-goal-maths"]');
    await expect(mathsCard.locator('text=On pace for milestone.')).toBeVisible();
  });

  test('ML goal shows amber badge when sessions missed', async ({ page }) => {
    const mlCard = page.locator('[data-testid="goal-card-goal-ml"]');
    const badge = mlCard.locator('[data-testid="amber-badge"]');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('attention needed');
  });

  test('daily item check triggers POST /api/goals recalculation', async ({ page }) => {
    let postCalled = false;

    await page.route('**/api/goals', (route) => {
      if (route.request().method() === 'POST') {
        postCalled = true;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: MOCK_GOALS, error: null }),
        });
      }
      return route.continue();
    });

    const mathsCard = page.locator('[data-testid="goal-card-goal-maths"]');
    await mathsCard.locator('button[aria-expanded]').first().click();
    await mathsCard.locator('button[aria-expanded]').nth(1).click();
    await mathsCard.locator('button[aria-expanded]').nth(2).click();

    const unchecked = mathsCard.locator('[role="checkbox"][aria-checked="false"]').first();
    await unchecked.click();

    // POST should fire after check
    await page.waitForTimeout(300);
    expect(postCalled).toBe(true);
  });

  test('daily check item toggles on click', async ({ page }) => {
    const mathsCard = page.locator('[data-testid="goal-card-goal-maths"]');
    await mathsCard.locator('button[aria-expanded]').first().click();
    const monthBtn = mathsCard.locator('button[aria-expanded]').nth(1);
    await monthBtn.click();
    const weekBtn = mathsCard.locator('button[aria-expanded]').nth(2);
    await weekBtn.click();

    const uncheckedItem = mathsCard.locator('[role="checkbox"][aria-checked="false"]').first();
    await expect(uncheckedItem).toBeVisible();
    await uncheckedItem.click();
    await expect(uncheckedItem).toHaveAttribute('aria-checked', 'true');
  });
});
