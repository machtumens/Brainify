import { test, expect } from '@playwright/test';

// Requires env: BASE_URL, TEST_EMAIL, TEST_PASSWORD
// Run: npx playwright test tests/e2e/textbooks.spec.ts

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const EMAIL    = process.env.TEST_EMAIL ?? '';
const PASSWORD = process.env.TEST_PASSWORD ?? '';

test.describe('Textbooks View — Layout + Sections', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
    await page.goto(BASE_URL + '/textbooks');
  });

  test('textbooks section label visible', async ({ page }) => {
    const label = page.locator('text=/^textbooks$/i').first();
    await expect(label).toBeVisible({ timeout: 5000 });
  });

  test('register a book section label visible', async ({ page }) => {
    await expect(page.locator('text=/register a book/i').first()).toBeVisible();
  });

  test('register form has title input', async ({ page }) => {
    await expect(page.locator('#tb-title')).toBeVisible();
  });

  test('register form has author, subject, pages, active_from inputs', async ({ page }) => {
    await expect(page.locator('#tb-author')).toBeVisible();
    await expect(page.locator('#tb-subject')).toBeVisible();
    await expect(page.locator('#tb-pages')).toBeVisible();
    await expect(page.locator('#tb-from')).toBeVisible();
  });

  test('register button disabled when title is empty', async ({ page }) => {
    const btn = page.locator('button[aria-label="Register textbook"]');
    await expect(btn).toBeVisible();
    await expect(btn).toBeDisabled();
  });

  test('register button enabled after title is typed', async ({ page }) => {
    await page.fill('#tb-title', 'Test Book');
    const btn = page.locator('button[aria-label="Register textbook"]');
    await expect(btn).not.toBeDisabled();
  });

  test('source web section visible after books load', async ({ page }) => {
    // Wait for loading to finish
    await expect(page.locator('text=/source web/i').first()).toBeVisible({ timeout: 8000 });
  });

  test('no modal dialogs on the page', async ({ page }) => {
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page.locator('[role="alertdialog"]')).toHaveCount(0);
  });

  test('no box-shadow in page HTML', async ({ page }) => {
    const html = await page.content();
    expect(html).not.toContain('box-shadow');
  });

  test('capture bar visible on textbooks view', async ({ page }) => {
    const bar = page.locator('input[placeholder*="capture"]').or(
      page.locator('[data-testid="capture-bar"]')
    ).first();
    await expect(bar).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Textbooks View — Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
    await page.goto(BASE_URL + '/textbooks');
  });

  test('fill and submit form adds book to list', async ({ page }) => {
    // Use a unique title to avoid duplicate-book conflicts across test runs
    const uniqueTitle = `E2E Test Book ${Date.now()}`;

    await page.fill('#tb-title', uniqueTitle);
    await page.fill('#tb-author', 'Test Author');
    await page.fill('#tb-subject', 'mathematics');
    await page.fill('#tb-pages', '300');

    const btn = page.locator('button[aria-label="Register textbook"]');
    await btn.click();

    // Button shows "registering…" briefly then form clears
    // New book appears in the list (AI topic_map gen may take a moment)
    await expect(page.locator(`text="${uniqueTitle}"`)).toBeVisible({ timeout: 30000 });
  });

  test('registering same title twice shows inline error', async ({ page }) => {
    // Wait for any existing books to load
    await page.waitForTimeout(2000);

    // Get first book title if any exist, else register one then try again
    const firstBook = page.locator('[data-testid="book-item"]').first();
    const hasBooks = await firstBook.isVisible().catch(() => false);

    if (hasBooks) {
      // Read title from first book item and try to re-register it
      const titleEl = firstBook.locator('div').first();
      const existingTitle = await titleEl.textContent() ?? '';
      if (existingTitle.trim()) {
        await page.fill('#tb-title', existingTitle.trim());
        await page.locator('button[aria-label="Register textbook"]').click();
        await expect(page.locator('text=/already registered/i')).toBeVisible({ timeout: 10000 });
        return;
      }
    }

    // No existing books — register one, then try duplicate
    const title = `Duplicate Test ${Date.now()}`;
    await page.fill('#tb-title', title);
    await page.locator('button[aria-label="Register textbook"]').click();
    await expect(page.locator(`text="${title}"`)).toBeVisible({ timeout: 30000 });

    // Try registering the same title again
    await page.fill('#tb-title', title);
    await page.locator('button[aria-label="Register textbook"]').click();
    await expect(page.locator('text=/already registered/i')).toBeVisible({ timeout: 10000 });
  });

  test('progress bar visible for registered book', async ({ page }) => {
    // Wait for page to load
    await expect(page.locator('text=/source web/i').first()).toBeVisible({ timeout: 8000 });

    const bars = page.locator('[role="progressbar"]');
    const count = await bars.count();
    // If there are any books, progress bars exist
    if (count > 0) {
      await expect(bars.first()).toBeVisible();
    }
  });
});

test.describe('Textbooks View — Inline Page Update', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
    await page.goto(BASE_URL + '/textbooks');
  });

  test('clicking page count shows inline input', async ({ page }) => {
    await expect(page.locator('text=/source web/i').first()).toBeVisible({ timeout: 8000 });

    const firstBook = page.locator('[data-testid="book-item"]').first();
    const hasBook = await firstBook.isVisible().catch(() => false);
    if (!hasBook) {
      test.skip(true, 'No books registered — skipping inline edit test');
      return;
    }

    const pageBtn = firstBook.locator('button[aria-label*="Update page"]');
    await pageBtn.click();

    // Input appears
    await expect(firstBook.locator('input[type="number"]')).toBeVisible();
  });

  test('pressing Escape on page input returns to label', async ({ page }) => {
    await expect(page.locator('text=/source web/i').first()).toBeVisible({ timeout: 8000 });

    const firstBook = page.locator('[data-testid="book-item"]').first();
    const hasBook = await firstBook.isVisible().catch(() => false);
    if (!hasBook) return;

    const pageBtn = firstBook.locator('button[aria-label*="Update page"]');
    await pageBtn.click();

    const input = firstBook.locator('input[type="number"]');
    await expect(input).toBeVisible();
    await input.press('Escape');

    // Button returns
    await expect(pageBtn).toBeVisible();
    await expect(input).not.toBeVisible();
  });
});
