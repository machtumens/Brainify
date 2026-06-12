import { defineConfig, devices } from "@playwright/test";

// Make the bypass flag visible to specs (auth.spec skips redirect tests).
process.env.E2E_AUTH_BYPASS ??= "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // ADR-015 §5 — iPad Pro 13" M2 logical viewports. Scoped to the
    // responsive spec to keep the suite fast; widen testMatch if needed.
    {
      name: "ipad-landscape",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 1024 },
        hasTouch: true,
      },
      testMatch: /responsive-layout\.spec\.ts/,
    },
    {
      name: "ipad-portrait",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 1366 },
        hasTouch: true,
      },
      testMatch: /responsive-layout\.spec\.ts/,
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    // View specs mock APIs and need authenticated views to render.
    // Bypass is dev-only (middleware also checks NODE_ENV !== production).
    env: { ...process.env, E2E_AUTH_BYPASS: "1" },
  },
});
