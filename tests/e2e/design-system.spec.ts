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

  // ADR-014 (v1.1): depth tokens exist — shadows allowed via var(--shadow-*) only
  test('depth tokens are defined (ADR-014)', async ({ page }) => {
    await page.goto('/');
    const depth = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        shadow1: style.getPropertyValue('--shadow-1').trim(),
        shadow2: style.getPropertyValue('--shadow-2').trim(),
        shadow3: style.getPropertyValue('--shadow-3').trim(),
        blurGlass: style.getPropertyValue('--blur-glass').trim(),
        springGentle: style.getPropertyValue('--spring-gentle').trim(),
        springSnappy: style.getPropertyValue('--spring-snappy').trim(),
      };
    });
    expect(depth.shadow1).toContain('rgba(26, 25, 23');
    expect(depth.shadow2).toContain('rgba(26, 25, 23');
    expect(depth.shadow3).toContain('rgba(26, 25, 23');
    expect(depth.blurGlass).toContain('blur');
    expect(depth.springGentle).toContain('cubic-bezier');
    expect(depth.springSnappy).toContain('cubic-bezier');
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

  // ADR-015 (v1.2): token architecture growth — spacing, type scale,
  // z-index, semantic aliases. Additive; everything above stays frozen.
  test('spacing scale tokens are defined (ADR-015)', async ({ page }) => {
    await page.goto('/');
    const sp = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return ['1', '2', '3', '4', '5', '6', '8', '10'].map((n) =>
        style.getPropertyValue(`--sp-${n}`).trim()
      );
    });
    expect(sp).toEqual(['4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px']);
  });

  test('type scale tokens are defined (ADR-015)', async ({ page }) => {
    await page.goto('/');
    const fs = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        micro: style.getPropertyValue('--fs-micro').trim(),
        caption: style.getPropertyValue('--fs-caption').trim(),
        bodyS: style.getPropertyValue('--fs-body-s').trim(),
        body: style.getPropertyValue('--fs-body').trim(),
        title: style.getPropertyValue('--fs-title').trim(),
        stat: style.getPropertyValue('--fs-stat').trim(),
        display: style.getPropertyValue('--fs-display').trim(),
      };
    });
    expect(fs.micro).toBe('10px');
    expect(fs.caption).toBe('12px');
    expect(fs.bodyS).toBe('13px');
    expect(fs.body).toBe('14px');
    expect(fs.title).toBe('15px');
    expect(fs.stat).toBe('22px');
    expect(fs.display).toBe('28px');
  });

  test('z-index scale tokens are defined (ADR-015)', async ({ page }) => {
    await page.goto('/');
    const z = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        base: style.getPropertyValue('--z-base').trim(),
        raised: style.getPropertyValue('--z-raised').trim(),
        capture: style.getPropertyValue('--z-capture').trim(),
        nav: style.getPropertyValue('--z-nav').trim(),
        overlay: style.getPropertyValue('--z-overlay').trim(),
      };
    });
    expect(z.base).toBe('0');
    expect(z.raised).toBe('10');
    expect(z.capture).toBe('90');
    expect(z.nav).toBe('100');
    expect(z.overlay).toBe('200');
  });

  test('semantic aliases resolve to the frozen palette (ADR-015)', async ({ page }) => {
    await page.goto('/');
    // Resolve aliases by painting them — getPropertyValue returns the raw
    // var() reference, so assert via a probe element's computed color.
    const resolved = await page.evaluate(() => {
      const probe = document.createElement('div');
      document.body.appendChild(probe);
      const resolve = (token: string) => {
        probe.style.color = `var(${token})`;
        return getComputedStyle(probe).color;
      };
      const out = {
        surfacePage: resolve('--surface-page'),
        textPrimary: resolve('--text-primary'),
        textInverse: resolve('--text-inverse'),
        borderDefault: resolve('--border-default'),
        stateDanger: resolve('--state-danger'),
      };
      probe.remove();
      return out;
    });
    expect(resolved.surfacePage).toBe('rgb(250, 248, 244)');   // --cream
    expect(resolved.textPrimary).toBe('rgb(26, 25, 23)');      // --ink
    expect(resolved.textInverse).toBe('rgb(250, 248, 244)');   // --cream, never #FFF
    expect(resolved.borderDefault).toBe('rgb(226, 222, 214)'); // --line
    expect(resolved.stateDanger).toBe('rgb(192, 57, 43)');     // --red
  });
});
