import { test, expect } from '@playwright/test';

// Requires env: BASE_URL, TEST_EMAIL, TEST_PASSWORD
// Run: npx playwright test tests/e2e/ask-ai.spec.ts

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const EMAIL = process.env.TEST_EMAIL ?? '';
const PASSWORD = process.env.TEST_PASSWORD ?? '';

test.describe('Ask AI — TutorChat', () => {
  test.beforeEach(async ({ page }) => {
    // NOTE: this spec exercises the real /api/tutor pipeline (no route mocks),
    // so it stays gated on real credentials even when E2E_AUTH_BYPASS is set.
    test.skip(!EMAIL || !PASSWORD, 'TEST_EMAIL and TEST_PASSWORD env vars required');
    await page.context().clearCookies();
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/today/, { timeout: 10000 });
    await page.goto(BASE_URL + '/ask-ai');
  });

  test('ask-ai page loads with "Ask AI" heading', async ({ page }) => {
    // ADR-015: view title promoted to display-size h1 (heading hierarchy fix)
    await expect(page.locator('h1:has-text("Ask AI")')).toBeVisible();
  });

  test('context indicator shows non-zero counts after load', async ({ page }) => {
    const indicator = page.locator('[aria-label="Context loaded"]');
    await expect(indicator).toBeVisible({ timeout: 5000 });
    const text = await indicator.textContent();
    // Expect at least one positive count — seed data has goals + errors
    expect(text).toMatch(/Context:/);
    expect(text).not.toMatch(/0 goals/);
  });

  test('context indicator shows all 5 dimensions', async ({ page }) => {
    const indicator = page.locator('[aria-label="Context loaded"]');
    await expect(indicator).toBeVisible({ timeout: 5000 });
    const text = await indicator.textContent() ?? '';
    expect(text).toContain('goal');
    expect(text).toContain('error');
    expect(text).toContain('capture');
    expect(text).toContain('textbook');
    expect(text).toContain('session');
  });

  test('textarea and send button present', async ({ page }) => {
    await expect(page.locator('textarea[aria-label="Ask your tutor"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Send message"]')).toBeVisible();
  });

  test('send button disabled when input empty', async ({ page }) => {
    await expect(page.locator('button[aria-label="Send message"]')).toBeDisabled();
  });

  test('user message appears right-aligned after submit', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="Ask your tutor"]');
    await textarea.fill('What is my top error topic?');
    await page.click('button[aria-label="Send message"]');

    // User message should appear in thread
    const userMsg = page.locator('[role="log"]').getByText('What is my top error topic?');
    await expect(userMsg).toBeVisible({ timeout: 3000 });

    // Check right-alignment via justify-content
    const bubble = userMsg.locator('..');
    const parent = bubble.locator('..');
    const justifyContent = await parent.evaluate(
      (el) => window.getComputedStyle(el).justifyContent
    );
    expect(justifyContent).toBe('flex-end');
  });

  test('AI response appears after user message', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="Ask your tutor"]');
    await textarea.fill('What should I study today?');
    await page.click('button[aria-label="Send message"]');

    // "thinking..." or actual content should appear in the AI bubble
    const chatLog = page.locator('[role="log"]');
    await expect(chatLog).toContainText(/(thinking\.\.\.|study|goal|error)/i, {
      timeout: 30000,
    });
  });

  test('input clears after submit', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="Ask your tutor"]');
    await textarea.fill('Hello tutor');
    await page.click('button[aria-label="Send message"]');
    await expect(textarea).toHaveValue('', { timeout: 3000 });
  });

  test('enter key submits message', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="Ask your tutor"]');
    await textarea.fill('Testing enter key');
    await textarea.press('Enter');
    await expect(textarea).toHaveValue('', { timeout: 3000 });
  });

  test('provider name never visible on page', async ({ page }) => {
    const content = await page.content();
    const lowerContent = content.toLowerCase();
    // Provider names must never appear (Law 15)
    expect(lowerContent).not.toContain('gemini');
    expect(lowerContent).not.toContain('groq');
    expect(lowerContent).not.toContain('openrouter');
    expect(lowerContent).not.toContain('llama');
    expect(lowerContent).not.toContain('mistral');
  });

  test('no modal dialogs appear during chat', async ({ page }) => {
    const textarea = page.locator('textarea[aria-label="Ask your tutor"]');
    await textarea.fill('Quick test question');
    await page.click('button[aria-label="Send message"]');
    await page.waitForTimeout(2000);
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    await expect(page.locator('[role="alertdialog"]')).toHaveCount(0);
  });
});
