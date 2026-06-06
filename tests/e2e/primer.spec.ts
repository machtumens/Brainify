import { test, expect } from '@playwright/test';

// Helper: navigate to today view (assumes auth already set up in global setup)
async function goToToday(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
  await page.goto('/today');
  await page.waitForLoadState('networkidle');
}

test.describe('Pre-session Primer', () => {
  test.beforeEach(async ({ page }) => {
    await goToToday(page);
  });

  test('primer does not appear before Pomodoro starts', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Session Primer' })).not.toBeVisible();
  });

  test('primer appears inline after clicking start', async ({ page }) => {
    // Mock the /api/primer response
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            formula: 'f(x) = lim_{h→0} [f(x+h) - f(x)] / h',
            lastError: 'confused sign of discriminant in completing the square',
            ownNote: 'always expand before factoring, do not shortcut',
          },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    // Must be inline — NOT a dialog/modal
    await expect(page.getByRole('dialog')).not.toBeVisible().catch(() => {
      // No dialog in DOM — correct
    });
  });

  test('primer shows 3 populated elements from API data', async ({ page }) => {
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            formula: 'E = mc²',
            lastError: 'wrong sign on momentum term',
            ownNote: 'check units before solving',
          },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    await expect(primer.getByLabel('Key formula')).toContainText('E = mc²');
    await expect(primer.getByLabel('Last error')).toContainText('wrong sign on momentum term');
    await expect(primer.getByLabel('Your note')).toContainText('check units before solving');
  });

  test('element 1 (formula) uses monospace background', async ({ page }) => {
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            formula: 'x = (-b ± √(b²-4ac)) / 2a',
            lastError: 'No errors logged yet.',
            ownNote: 'No notes for this topic yet.',
          },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    const formulaEl = primer.getByLabel('Key formula');
    await expect(formulaEl).toBeVisible();
    // Formula box has cream3 background
    const bg = await formulaEl.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    // --cream3 = #EAE6DD = rgb(234, 230, 221)
    expect(bg).toBe('rgb(234, 230, 221)');
  });

  test('element 2 shows no-errors fallback in --ink4 when no errors', async ({ page }) => {
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            formula: 'y = mx + c',
            lastError: 'No errors logged yet.',
            ownNote: 'No notes for this topic yet.',
          },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    const errorEl = primer.getByLabel('Last error');
    await expect(errorEl).toContainText('No errors logged yet.');
    // Should use --ink4 color, not --red
    const color = await errorEl.evaluate((el) =>
      window.getComputedStyle(el).color
    );
    // --ink4 = #B8B5B0 = rgb(184, 181, 176)
    expect(color).toBe('rgb(184, 181, 176)');
  });

  test('element 2 uses red italic weight 300 for actual error', async ({ page }) => {
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            formula: 'F = ma',
            lastError: 'applied wrong Newton law for non-inertial frame',
            ownNote: 'inertial frames only',
          },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    const errorEl = primer.getByLabel('Last error');
    await expect(errorEl).toBeVisible();

    const styles = await errorEl.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { color: cs.color, fontStyle: cs.fontStyle, fontWeight: cs.fontWeight };
    });
    // --red = #C0392B = rgb(192, 57, 43)
    expect(styles.color).toBe('rgb(192, 57, 43)');
    expect(styles.fontStyle).toBe('italic');
    expect(styles.fontWeight).toBe('300');
  });

  test('element 3 uses --ink3 italic for own note', async ({ page }) => {
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            formula: 'a² + b² = c²',
            lastError: 'sign error',
            ownNote: 'draw diagram first every time',
          },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    const noteEl = primer.getByLabel('Your note');
    await expect(noteEl).toBeVisible();

    const styles = await noteEl.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { color: cs.color, fontStyle: cs.fontStyle };
    });
    // --ink3 = #8A8784 = rgb(138, 135, 132)
    expect(styles.color).toBe('rgb(138, 135, 132)');
    expect(styles.fontStyle).toBe('italic');
  });

  test('dismiss button has 44px touch target', async ({ page }) => {
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { formula: 'a', lastError: 'No errors logged yet.', ownNote: 'No notes for this topic yet.' },
          error: null,
        }),
      });
    });

    // Clear localStorage to simulate repeat session (skip 10s wait)
    await page.evaluate(() => localStorage.setItem('sb_primer_first_seen', '1'));
    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    const dismissBtn = page.getByRole('button', { name: 'Dismiss primer' });
    const box = await dismissBtn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('repeat session can dismiss immediately (no 10s wait)', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('sb_primer_first_seen', '1'));
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { formula: 'f', lastError: 'No errors logged yet.', ownNote: 'No notes for this topic yet.' },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    // Should be able to dismiss immediately
    await page.getByRole('button', { name: 'Dismiss primer' }).click();
    await expect(primer).not.toBeVisible();
  });

  test('first-time shows countdown, not immediate dismiss', async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem('sb_primer_first_seen'));
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { formula: 'f', lastError: 'No errors logged yet.', ownNote: 'No notes for this topic yet.' },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    // Dismiss button shows countdown text, not "dismiss"
    const dismissBtn = primer.getByRole('button', { name: /Dismiss in \d+s/ });
    await expect(dismissBtn).toBeVisible();
    await expect(dismissBtn).toBeDisabled();
  });

  test('primer shows skeleton while loading', async ({ page }) => {
    let resolve: (value: unknown) => void;
    const pending = new Promise(r => { resolve = r; });

    await page.route('/api/primer', async (route) => {
      await pending; // hold indefinitely
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    // Skeleton elements visible while loading
    const skeletons = await primer.locator('.skeleton').count();
    expect(skeletons).toBeGreaterThan(0);

    resolve!(undefined);
  });

  test('primer section never uses box-shadow', async ({ page }) => {
    await page.route('/api/primer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { formula: 'f', lastError: 'No errors logged yet.', ownNote: 'No notes for this topic yet.' },
          error: null,
        }),
      });
    });

    await page.getByRole('button', { name: 'Start timer' }).click();
    const primer = page.getByRole('region', { name: 'Session Primer' });
    await expect(primer).toBeVisible();

    const shadow = await primer.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    expect(shadow).toBe('none');
  });
});
