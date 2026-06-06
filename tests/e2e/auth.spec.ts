import { test, expect } from '@playwright/test';

// Requires env: BASE_URL, TEST_EMAIL, TEST_PASSWORD
// Run: npx playwright test tests/e2e/auth.spec.ts

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const EMAIL = process.env.TEST_EMAIL ?? '';
const PASSWORD = process.env.TEST_PASSWORD ?? '';

test.describe('Auth guard', () => {
  test('unauthenticated visit to / redirects to /login', async ({ page }) => {
    // Clear cookies to ensure unauthenticated state
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('unauthenticated visit to /today redirects to /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/today');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders brand and form', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await expect(page.getByText('second brain')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('wrong credentials show inline error, no modal', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // Inline error text — no dialog/modal
    await expect(page.locator('p:has-text("Invalid")')).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page.locator('[role="alertdialog"]')).toHaveCount(0);
  });
});

test.describe('Authenticated navigation', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
  });

  test('login redirects to /today', async ({ page }) => {
    await expect(page).toHaveURL(/\/today/);
  });

  test('nav renders all 5 text items', async ({ page }) => {
    const navItems = ['today', 'goals', 'test sim', 'ask ai', 'textbooks'];
    for (const label of navItems) {
      await expect(page.locator(`nav a:has-text("${label}")`)).toBeVisible();
    }
  });

  test('today nav item is active on /today', async ({ page }) => {
    const todayLink = page.locator('nav a[href="/today"]');
    await expect(todayLink).toHaveAttribute('aria-current', 'page');
  });

  test('nav items have no icons', async ({ page }) => {
    // All nav items are text-only — no img or svg children
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      await expect(navLinks.nth(i).locator('img')).toHaveCount(0);
      await expect(navLinks.nth(i).locator('svg')).toHaveCount(0);
    }
  });

  test('clicking goals nav item navigates to /goals and updates active state', async ({ page }) => {
    await page.click('nav a[href="/goals"]');
    await expect(page).toHaveURL(/\/goals/);
    await expect(page.locator('nav a[href="/goals"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('nav a[href="/today"]')).not.toHaveAttribute('aria-current', 'page');
  });

  test('authenticated visit to /login redirects to /today', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    await expect(page).toHaveURL(/\/today/);
  });
});
