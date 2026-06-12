import { test, expect, type Page } from '@playwright/test';

// Stub Supabase + API calls so Today page renders cleanly
async function stubRoutes(page: Page) {
  await page.route('**/rest/v1/goals*', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );
  await page.route('**/rest/v1/textbooks*', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  );
  await page.route('/api/brief', r =>
    r.fulfill({ json: { brief: 'Test brief.' } })
  );
}

test.describe('Pomodoro Ring', () => {
  test.beforeEach(async ({ page }) => {
    await stubRoutes(page);
    await page.goto('/today');
  });

  test('renders SVG with track and progress circle', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
    const circles = svg.locator('circle');
    await expect(circles).toHaveCount(2);
  });

  test('progress circle strokeDasharray ≈ 339.292', async ({ page }) => {
    const progress = page.locator('svg circle').nth(1);
    // React renders the camelCase prop as the real SVG attribute name
    const da = await progress.getAttribute('stroke-dasharray');
    expect(parseFloat(da!)).toBeCloseTo(339.292, 1);
  });

  test('shows 25:00 and "focus" phase at start', async ({ page }) => {
    await expect(page.getByText('25:00')).toBeVisible();
    await expect(page.getByText('focus')).toBeVisible();
  });

  test('start button is exactly 44×44px', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Start timer' });
    const box = await btn.boundingBox();
    expect(box!.width).toBe(44);
    expect(box!.height).toBe(44);
  });

  test('clicking start changes label to "pause"', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click();
    await expect(page.getByRole('button', { name: 'Pause timer' })).toBeVisible();
  });

  test('clicking pause while running restores "start"', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click();
    await page.getByRole('button', { name: 'Pause timer' }).click();
    await expect(page.getByRole('button', { name: 'Start timer' })).toBeVisible();
  });

  test('4 session dots rendered, all empty at start', async ({ page }) => {
    const group = page.getByRole('group', { name: 'Session progress' });
    const dots = group.locator('div');
    await expect(dots).toHaveCount(4);
    // All dots should render with --line2 background (empty state)
    const first = await dots.first().evaluate(
      el => getComputedStyle(el).backgroundColor
    );
    expect(first).toBeTruthy();
  });

  test('timer has role=timer with aria-label containing phase and "remaining"', async ({ page }) => {
    const timer = page.locator('[role="timer"]');
    await expect(timer).toBeVisible();
    const label = await timer.getAttribute('aria-label');
    expect(label).toContain('focus');
    expect(label).toContain('remaining');
  });

  test('mode toggle renders standard/struggle/flow options', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'standard', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'struggle', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'flow', exact: true })).toBeVisible();
  });

  test('mode toggle disappears while timer is running', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click();
    await expect(page.getByRole('button', { name: 'struggle', exact: true })).not.toBeVisible();
  });

  test('POSTs to /api/session when focus phase completes', async ({ page }) => {
    // runFor drives 1500 real interval ticks through React — needs headroom.
    test.setTimeout(120_000);
    let sessionPosted = false;
    let postedBody: Record<string, unknown> = {};

    // Must install clock BEFORE page load to control setInterval
    await page.clock.install({ time: 0 });

    await page.route('**/rest/v1/goals*', r =>
      r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('**/rest/v1/textbooks*', r =>
      r.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    );
    await page.route('/api/brief', r => r.fulfill({ json: { brief: 'Test.' } }));
    await page.route('/api/session', async r => {
      sessionPosted = true;
      postedBody = r.request().postDataJSON() as Record<string, unknown>;
      await r.fulfill({ json: { success: true, data: { id: 'x' }, error: null } });
    });

    await page.goto('/today');
    await page.getByRole('button', { name: 'Start timer' }).click();

    // Run the clock for 1501 seconds (25min + 1s buffer). runFor fires every
    // due interval tick; fastForward fires each timer at most once, which
    // would only decrement the countdown by a single second.
    await page.clock.runFor(1501 * 1000);
    await page.waitForTimeout(300);

    expect(sessionPosted).toBe(true);
    expect(postedBody.pomodoros).toBe(1);
  });
});
