import { test, expect } from '@playwright/test';

// ADR-015 §5 — iPad Pro 13" M2 adaptability.
// Runs in three projects: chromium (1280×720), ipad-landscape (1366×1024),
// ipad-portrait (1024×1366). At ≤1024px viewport width the sidebar pages
// collapse to a single column and the aside reflows into a 2-up band.

function expectsSingleColumn(viewportWidth: number): boolean {
  return viewportWidth <= 1024;
}

test.describe('Responsive layout — sidebar pages', () => {
  for (const path of ['/today', '/test-sim']) {
    test(`${path}: grid adapts to viewport`, async ({ page }) => {
      await page.goto(path);
      const grid = page.locator('.layout-sidebar').first();
      await expect(grid).toBeVisible();

      const width = page.viewportSize()!.width;
      const cols = await grid.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns
      );
      const colCount = cols.trim().split(/\s+/).length;

      if (expectsSingleColumn(width)) {
        expect(colCount, `${path} at ${width}px should be single column`).toBe(1);
      } else {
        expect(colCount, `${path} at ${width}px should be two columns`).toBe(2);
      }
    });

    test(`${path}: aside reflows to 2-up band at ≤1024px`, async ({ page }) => {
      const width = page.viewportSize()!.width;
      test.skip(!expectsSingleColumn(width), 'desktop keeps the sidebar column');

      await page.goto(path);
      const aside = page.locator('.layout-sidebar__aside').first();
      await expect(aside).toBeVisible();

      const display = await aside.evaluate((el) => getComputedStyle(el).display);
      const cols = await aside.evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns
      );
      expect(display).toBe('grid');
      expect(cols.trim().split(/\s+/).length).toBe(2);
    });

    test(`${path}: no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.layout-sidebar').first()).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, 'content must fit viewport width').toBeLessThanOrEqual(0);
    });
  }
});

test.describe('Responsive layout — touch targets', () => {
  test('today: pomodoro start button keeps ≥44px touch target', async ({ page }) => {
    await page.goto('/today');
    const startBtn = page.getByRole('button', { name: /start timer/i });
    await expect(startBtn).toBeVisible();
    const box = await startBtn.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('capture bar send button keeps ≥44px touch target', async ({ page }) => {
    await page.goto('/today');
    const sendBtn = page.getByRole('button', { name: /send capture/i });
    await expect(sendBtn).toBeVisible();
    const box = await sendBtn.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
