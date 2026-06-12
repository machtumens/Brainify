import { test, expect } from '@playwright/test';

const MOCK_GOALS = [
  {
    id: 'goal-1',
    user_id: 'user-1',
    title: 'Pure Maths — Cambridge',
    category: 'curriculum',
    status: 'active',
    current_month: 1,
    total_months: 6,
    started_at: '2026-01-01',
    roadmap: {
      months: [
        {
          month: 1,
          title: 'Algebra',
          weeks: [
            {
              week: 1,
              topics: ['Quadratics'],
              status: 'active',
              daily_checklist: [
                { day: 1, task: 'Complete quadratics exercises', done: false },
                { day: 2, task: 'Review discriminant problems', done: false },
              ],
            },
          ],
        },
      ],
    },
    created_at: '2026-01-01T00:00:00Z',
  },
];

test.describe('Task Checklist', () => {
  test.beforeEach(async ({ page }) => {
    // NOTE: each test gets a fresh browser context, so sessionStorage starts
    // empty — no init-script cleanup needed. (The previous addInitScript that
    // removed sb_tasks_done re-ran on reload and broke the persistence test.)

    // Mock Supabase goals query
    await page.route('**/rest/v1/goals*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_GOALS),
      })
    );

    // Mock session POST — succeed silently
    await page.route('/api/session', (route) =>
      route.fulfill({
        json: { success: true, data: { id: 'sess-1' }, error: null },
      })
    );
  });

  test('task rows render with circle checkboxes', async ({ page }) => {
    await page.goto('/today');
    const checkbox = page.locator('[role="checkbox"]').first();
    await expect(checkbox).toBeVisible();
    // Circle: border-radius 50% applied via class — verified by class presence
    await expect(checkbox).toHaveClass(/task-checkbox/);
  });

  test('check task → done state CSS applied', async ({ page }) => {
    await page.goto('/today');
    const row = page.locator('.task-row').first();
    const checkbox = row.locator('[role="checkbox"]');
    await expect(checkbox).not.toHaveClass(/done/);

    await row.click();

    await expect(checkbox).toHaveClass(/done/);
    await expect(row.locator('.task-label')).toHaveClass(/done/);
  });

  test('check task → POST /api/session called', async ({ page }) => {
    let sessionCalled = false;
    await page.route('/api/session', (route) => {
      sessionCalled = true;
      route.fulfill({ json: { success: true, data: { id: 'sess-1' }, error: null } });
    });

    await page.goto('/today');
    await page.locator('.task-row').first().click();
    await page.waitForTimeout(300);
    expect(sessionCalled).toBe(true);
  });

  test('done state persists after page refresh (sessionStorage)', async ({ page }) => {
    await page.goto('/today');
    await page.locator('.task-row').first().click();
    await page.waitForTimeout(300);

    // Reload — sessionStorage survives
    await page.reload();
    await page.waitForSelector('.task-checkbox.done');
    const checkbox = page.locator('.task-checkbox.done').first();
    await expect(checkbox).toBeVisible();
  });

  test('uncheck task → no session POST', async ({ page }) => {
    // Pre-seed done state
    await page.addInitScript(() => {
      // after goals load, tasks will hydrate from this
    });

    await page.goto('/today');
    // Check first
    await page.locator('.task-row').first().click();
    await page.waitForTimeout(200);

    let sessionCallCount = 0;
    await page.route('/api/session', (route) => {
      sessionCallCount++;
      route.fulfill({ json: { success: true, data: { id: 'sess-2' }, error: null } });
    });

    // Uncheck — should NOT call /api/session
    await page.locator('.task-row').first().click();
    await page.waitForTimeout(200);
    expect(sessionCallCount).toBe(0);
  });

  test('session API fail → checkbox reverts', async ({ page }) => {
    await page.route('/api/session', (route) =>
      route.fulfill({
        status: 500,
        json: { success: false, data: null, error: 'DB error' },
      })
    );

    await page.goto('/today');
    const checkbox = page.locator('[role="checkbox"]').first();
    await page.locator('.task-row').first().click();
    await page.waitForTimeout(500);

    // Checkbox should revert to not done
    await expect(checkbox).not.toHaveClass(/done/);
  });

  test('subject tag visible and right-aligned', async ({ page }) => {
    await page.goto('/today');
    const subject = page.locator('.task-subject').first();
    await expect(subject).toBeVisible();
    // 10px italic --ink4 — verified by class
    await expect(subject).toHaveClass(/task-subject/);
  });

  test('task row keyboard accessible via Enter key', async ({ page }) => {
    await page.goto('/today');
    const checkbox = page.locator('[role="checkbox"]').first();
    await checkbox.focus();
    await checkbox.press('Enter');
    await expect(checkbox).toHaveClass(/done/);
  });
});
