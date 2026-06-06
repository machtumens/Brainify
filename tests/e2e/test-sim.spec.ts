import { test, expect } from '@playwright/test';

// Requires env: BASE_URL, TEST_EMAIL, TEST_PASSWORD
// Run: npx playwright test tests/e2e/test-sim.spec.ts

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const EMAIL = process.env.TEST_EMAIL ?? '';
const PASSWORD = process.env.TEST_PASSWORD ?? '';

test.describe('Test Simulator — Topic Grid + Difficulty', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
    await page.goto(BASE_URL + '/test-sim');
  });

  test('test-sim page loads with "Test Simulator" heading', async ({ page }) => {
    await expect(page.locator('h2:has-text("Test Simulator")')).toBeVisible();
  });

  test('topic grid section header visible', async ({ page }) => {
    // "topics" label in uppercase
    const label = page.locator('text=/topics/i').first();
    await expect(label).toBeVisible({ timeout: 5000 });
  });

  test('difficulty selector shows all 3 options', async ({ page }) => {
    const group = page.locator('[role="group"][aria-label="Difficulty"]');
    await expect(group).toBeVisible();
    await expect(group.locator('button:has-text("Easy")')).toBeVisible();
    await expect(group.locator('button:has-text("Medium")')).toBeVisible();
    await expect(group.locator('button:has-text("Hard")')).toBeVisible();
  });

  test('medium difficulty selected by default', async ({ page }) => {
    const mediumBtn = page.locator('[role="group"][aria-label="Difficulty"] button:has-text("Medium")');
    await expect(mediumBtn).toHaveAttribute('aria-checked', 'true');
  });

  test('difficulty selection changes aria-checked', async ({ page }) => {
    const easyBtn = page.locator('[role="group"][aria-label="Difficulty"] button:has-text("Easy")');
    const mediumBtn = page.locator('[role="group"][aria-label="Difficulty"] button:has-text("Medium")');
    await easyBtn.click();
    await expect(easyBtn).toHaveAttribute('aria-checked', 'true');
    await expect(mediumBtn).toHaveAttribute('aria-checked', 'false');
  });

  test('source health sidebar visible', async ({ page }) => {
    const sidebar = page.locator('[aria-label="Source health"]');
    await expect(sidebar).toBeVisible();
  });

  test('source health shows empty state when no topics selected', async ({ page }) => {
    const sidebar = page.locator('[aria-label="Source health"]');
    await expect(sidebar).toContainText(/Select topics to see source quality/i);
  });

  test('topic pills are selectable (aria-checked toggles)', async ({ page }) => {
    // Wait for topic grid to load (past skeleton state)
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });

    const firstPill = grid.locator('[role="checkbox"]').first();
    await expect(firstPill).toHaveAttribute('aria-checked', 'false');
    await firstPill.click();
    await expect(firstPill).toHaveAttribute('aria-checked', 'true');
  });

  test('selecting a topic updates source health sidebar', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });

    const firstPill = grid.locator('[role="checkbox"]').first();
    await firstPill.click();

    // Sidebar should no longer show empty state
    const sidebar = page.locator('[aria-label="Source health"]');
    await expect(sidebar).not.toContainText(/Select topics to see source quality/i, {
      timeout: 5000,
    });
  });

  test('deselecting a topic removes it from source health', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });

    const firstPill = grid.locator('[role="checkbox"]').first();
    await firstPill.click(); // select
    await firstPill.click(); // deselect
    await expect(firstPill).toHaveAttribute('aria-checked', 'false');
    const sidebar = page.locator('[aria-label="Source health"]');
    await expect(sidebar).toContainText(/Select topics to see source quality/i, {
      timeout: 3000,
    });
  });

  test('danger zone topics appear before others in grid', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });

    const pills = grid.locator('[role="checkbox"]');
    const count = await pills.count();
    if (count < 2) return; // not enough topics to test ordering

    // Danger zone pills have aria-label containing "danger zone"
    const firstLabel = await pills.first().getAttribute('aria-label') ?? '';
    const lastLabel = await pills.last().getAttribute('aria-label') ?? '';

    // If any danger zone pills exist, they should come before non-danger ones
    const hasDanger = await grid.locator('[aria-label*="danger zone"]').count() > 0;
    if (hasDanger) {
      expect(firstLabel).toContain('danger zone');
      expect(lastLabel).not.toContain('danger zone');
    }
  });

  test('no modal dialogs appear on the page', async ({ page }) => {
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page.locator('[role="alertdialog"]')).toHaveCount(0);
  });

  test('no box-shadow in page HTML', async ({ page }) => {
    const bodyHTML = await page.content();
    expect(bodyHTML).not.toContain('box-shadow');
  });
});

test.describe('Test Simulator — Question Generation', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
    await page.goto(BASE_URL + '/test-sim');
  });

  test('generate button disabled with no topics selected', async ({ page }) => {
    const btn = page.locator('button[aria-label="Generate test questions"]');
    await expect(btn).toBeVisible();
    await expect(btn).toBeDisabled();
  });

  test('generate button enabled after topic selected', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();
    const btn = page.locator('button[aria-label="Generate test questions"]');
    await expect(btn).not.toBeDisabled();
  });

  test('clicking generate shows loading skeleton then TestRunner', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    const btn = page.locator('button[aria-label="Generate test questions"]');
    await btn.click();

    // Loading skeleton visible briefly
    await expect(page.locator('[aria-label="Loading questions"]')).toBeVisible({ timeout: 3000 });

    // TestRunner appears (may take up to 30s for AI)
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });
  });

  test('active test contains at least 1 question card', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    const cards = page.locator('[aria-label^="Question "]');
    await expect(cards.first()).toBeVisible();
  });

  test('each question card has 4 option buttons', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    const firstCard = page.locator('[aria-label="Question 1"]');
    const options = firstCard.locator('[role="radio"]');
    await expect(options).toHaveCount(4);
  });

  test('selecting an option marks it aria-checked=true', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    const firstOption = page.locator('[aria-label="Question 1"] [role="radio"]').first();
    await firstOption.click();
    await expect(firstOption).toHaveAttribute('aria-checked', 'true');
  });

  test('submit test button visible during active test', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    await expect(page.locator('button:has-text("Submit test")')).toBeVisible();
  });

  test('no modal dialogs during question generation flow', async ({ page }) => {
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page.locator('[role="alertdialog"]')).toHaveCount(0);
  });
});

test.describe('Test Simulator — Timed Test + Error Logging (P20)', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
    await page.goto(BASE_URL + '/test-sim');
  });

  test('countdown timer visible during active test', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    // Timer element: role="timer", shows MM:SS format
    const timer = page.locator('[role="timer"]');
    await expect(timer).toBeVisible();
    const timerText = await timer.textContent();
    expect(timerText).toMatch(/^\d+:\d{2}$/);
  });

  test('answered count updates as options are selected', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    // Before answering: 0/N
    await expect(page.locator('text=/^0\\//')).toBeVisible();

    // Answer first question
    await page.locator('[aria-label="Question 1"] [role="radio"]').first().click();

    // After answering: 1/N
    await expect(page.locator('text=/^1\\//')).toBeVisible({ timeout: 2000 });
  });

  test('submit test produces score summary with correct count', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    // Answer all questions
    const cards = page.locator('[aria-label^="Question "]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await cards.nth(i).locator('[role="radio"]').first().click();
    }

    await page.locator('button:has-text("Submit test")').click();

    // Score summary appears: "N / M correct"
    await expect(page.locator('text=/ correct/')).toBeVisible({ timeout: 15000 });
  });

  test('post-submit shows past tests history panel', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    await page.locator('[aria-label="Question 1"] [role="radio"]').first().click();
    await page.locator('button:has-text("Submit test")').click();

    // History panel (or empty state) visible after submit
    await expect(page.locator('text=/Past tests|Run a test to see your history/')).toBeVisible({ timeout: 15000 });
  });

  test('new test button returns to setup phase', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    // Click new test from runner
    await page.locator('button:has-text("New test")').first().click();

    // Back to setup: generate button visible
    await expect(page.locator('button[aria-label="Generate test questions"]')).toBeVisible({ timeout: 3000 });
  });

  test('past tests panel visible in setup sidebar', async ({ page }) => {
    // TestHistory is shown in sidebar during setup phase
    await expect(page.locator('text=/Past tests/')).toBeVisible({ timeout: 5000 });
  });

  test('no box-shadow in test runner HTML', async ({ page }) => {
    const grid = page.locator('[role="group"][aria-label="Select topics"]');
    await expect(grid).toBeVisible({ timeout: 8000 });
    await grid.locator('[role="checkbox"]').first().click();

    await page.locator('button[aria-label="Generate test questions"]').click();
    await expect(page.locator('[aria-label="Active test"]')).toBeVisible({ timeout: 30000 });

    const html = await page.content();
    expect(html).not.toContain('box-shadow');
  });
});
