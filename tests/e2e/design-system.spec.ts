import { test, expect } from '@playwright/test';

test.describe('Design System', () => {
  test('page background is cream (#FAF8F4)', async ({ page }) => {
    await page.goto('/');
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    // #FAF8F4 = rgb(250, 248, 244)
    expect(bgColor).toBe('rgb(250, 248, 244)');
  });

  test('body font-family includes Newsreader', async ({ page }) => {
    await page.goto('/');
    const fontFamily = await page.evaluate(() =>
      getComputedStyle(document.body).fontFamily
    );
    expect(fontFamily.toLowerCase()).toContain('newsreader');
  });

  test('Newsreader loads from Google Fonts CDN', async ({ page }) => {
    const fontRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('fonts.googleapis.com') || req.url().includes('fonts.gstatic.com')) {
        fontRequests.push(req.url());
      }
    });
    await page.goto('/');
    expect(fontRequests.length).toBeGreaterThan(0);
    expect(fontRequests.some((url) => url.includes('Newsreader'))).toBe(true);
  });

  test('body font-weight is 300', async ({ page }) => {
    await page.goto('/');
    const fontWeight = await page.evaluate(() =>
      getComputedStyle(document.body).fontWeight
    );
    expect(fontWeight).toBe('300');
  });

  test('all 12 design tokens defined in :root', async ({ page }) => {
    await page.goto('/');
    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        cream:  style.getPropertyValue('--cream').trim(),
        cream2: style.getPropertyValue('--cream2').trim(),
        cream3: style.getPropertyValue('--cream3').trim(),
        ink:    style.getPropertyValue('--ink').trim(),
        ink2:   style.getPropertyValue('--ink2').trim(),
        ink3:   style.getPropertyValue('--ink3').trim(),
        ink4:   style.getPropertyValue('--ink4').trim(),
        line:   style.getPropertyValue('--line').trim(),
        line2:  style.getPropertyValue('--line2').trim(),
        red:    style.getPropertyValue('--red').trim(),
        amber:  style.getPropertyValue('--amber').trim(),
        green:  style.getPropertyValue('--green').trim(),
      };
    });
    expect(tokens.cream).toBe('#FAF8F4');
    expect(tokens.cream2).toBe('#F3F0EA');
    expect(tokens.cream3).toBe('#EAE6DD');
    expect(tokens.ink).toBe('#1A1917');
    expect(tokens.ink2).toBe('#4A4845');
    expect(tokens.ink3).toBe('#8A8784');
    expect(tokens.ink4).toBe('#B8B5B0');
    expect(tokens.line).toBe('#E2DED6');
    expect(tokens.line2).toBe('#CBC7BF');
    expect(tokens.red).toBe('#C0392B');
    expect(tokens.amber).toBe('#8B5E00');
    expect(tokens.green).toBe('#2D6A4F');
  });

  test('body has no box-shadow', async ({ page }) => {
    await page.goto('/');
    const boxShadow = await page.evaluate(() =>
      getComputedStyle(document.body).boxShadow
    );
    expect(boxShadow).toBe('none');
  });

  test('timing tokens are defined', async ({ page }) => {
    await page.goto('/');
    const timings = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        fast:     style.getPropertyValue('--t-fast').trim(),
        task:     style.getPropertyValue('--t-task').trim(),
        expand:   style.getPropertyValue('--t-expand').trim(),
        progress: style.getPropertyValue('--t-progress').trim(),
        skeleton: style.getPropertyValue('--t-skeleton').trim(),
      };
    });
    expect(timings.fast).toBe('80ms ease');
    expect(timings.task).toBe('150ms ease');
    expect(timings.expand).toBe('200ms ease-in-out');
    expect(timings.progress).toBe('300ms ease');
    expect(timings.skeleton).toBe('1.5s ease-in-out');
  });
});
