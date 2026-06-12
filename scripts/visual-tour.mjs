// Visual tour — screenshots every view with realistic mocked data at
// desktop + iPad Pro 13" portrait viewports. Run with the dev server up
// (E2E_AUTH_BYPASS=1). Output: visual-tour/*.png (gitignored).
//   node scripts/visual-tour.mjs
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:3000';
const OUT = 'visual-tour';
mkdirSync(OUT, { recursive: true });

const in45Days = new Date(Date.now() + 45 * 864e5).toISOString().slice(0, 10);

const GOALS = [
  {
    id: 'goal-maths', user_id: 'u1', title: 'Pure Maths — Cambridge', category: 'curriculum',
    status: 'active', current_month: 1, total_months: 6, started_at: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    roadmap: {
      total_hours: 120,
      months: [{
        month: 1, title: 'Algebra', weeks: [
          {
            week: 1, topics: ['Quadratics', 'Surds'], status: 'done',
            daily_checklist: [
              { day: 1, task: 'Complete quadratics exercises 4.1–4.6', done: true },
              { day: 2, task: 'Review discriminant problems', done: true },
            ],
          },
          {
            week: 2, topics: ['Polynomials'], status: 'active',
            daily_checklist: [
              { day: 1, task: 'Read polynomial division §5.2', done: true },
              { day: 2, task: 'Factor theorem exercise set', done: false },
              { day: 3, task: 'Remainder theorem past-paper Qs', done: false },
              { day: 4, task: 'Mixed review — 40 minutes', done: false },
            ],
          },
        ],
      }],
    },
  },
  {
    id: 'goal-ml', user_id: 'u1', title: 'Machine Learning — Mitchell', category: 'curriculum',
    status: 'active', current_month: 1, total_months: 6, started_at: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    roadmap: {
      amber_trigger: '5 days without a session',
      months: [{
        month: 1, title: 'Concept Learning', weeks: [
          {
            week: 1, topics: ['Version spaces'], status: 'active',
            daily_checklist: [
              { day: 1, task: 'Read Mitchell ch. 2 — concept learning', done: false },
              { day: 3, task: 'Candidate-elimination worked example', done: false },
            ],
          },
        ],
      }],
    },
  },
  {
    id: 'goal-spivak', user_id: 'u1', title: 'Calculus — Spivak', category: 'personal',
    status: 'locked', current_month: 1, total_months: 6, started_at: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    roadmap: { unlock_condition: 'Finish Pure Maths month 2', months: [] },
  },
];

const TEXTBOOKS = [
  { id: 'b1', user_id: 'u1', title: 'Pure Mathematics — Cambridge', author: 'Hugh Neill', subject: 'mathematics', total_pages: 300, current_page: 90, active_from: '2026-01-01', topic_map: {}, created_at: '2026-01-01T00:00:00Z' },
  { id: 'b2', user_id: 'u1', title: 'Machine Learning', author: 'Tom Mitchell', subject: 'machine learning', total_pages: 414, current_page: 52, active_from: '2026-01-01', topic_map: {}, created_at: '2026-01-01T00:00:00Z' },
  { id: 'b3', user_id: 'u1', title: 'Physics — Serway Vol. 1', author: 'Raymond Serway', subject: 'physics', total_pages: 500, current_page: 210, active_from: '2026-01-01', topic_map: {}, created_at: '2026-01-01T00:00:00Z' },
];

const ok = (data) => ({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data, error: null }) });
const raw = (data) => ({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });

async function mockRoutes(page) {
  // Catch-all FIRST — Playwright matches routes newest-first, so the
  // specific mocks below must be registered after it to take precedence.
  await page.route('**/api/**', (r) => r.fulfill(ok([])));
  await page.route('**/auth/v1/**', (r) => r.fulfill({ status: 200, body: '{}' }));
  await page.route('**/rest/v1/goals*', (r) => r.fulfill(raw(GOALS)));
  await page.route('**/rest/v1/textbooks*', (r) => r.fulfill(raw(TEXTBOOKS)));
  await page.route('**/rest/v1/errors*', (r) => r.fulfill(raw([
    { topic: 'integration by parts' }, { topic: 'integration by parts' },
    { topic: 'integration by parts' }, { topic: 'bayes theorem' },
  ])));
  await page.route('**/rest/v1/sessions*', (r) => r.fulfill(raw([
    { subject: 'mathematics' }, { subject: 'mathematics' }, { subject: 'machine learning' },
  ])));

  await page.route('**/api/brief', (r) => r.fulfill(ok({
    brief: 'Pure Maths is on pace — polynomial week is half done. ML is flagged: five days without a session, so today’s 25 minutes on Mitchell ch. 2 matters more than another maths block.',
  })));
  await page.route('**/api/review*', (r) =>
    r.request().method() === 'GET'
      ? r.fulfill(ok([{ id: 'r1', topic: 'integration by parts', prompt_text: 'When integrating x·eˣ, which factor do you differentiate — and why?', interval_idx: 1, due_at: new Date().toISOString(), last_result: null }]))
      : r.fulfill(ok({})));
  await page.route('**/api/health', (r) => r.fulfill(ok({
    jobs: { sync: { status: 'ok' }, retrospective: { status: 'ok' } },
    sync_last_run: new Date(Date.now() - 12 * 60e3).toISOString(),
  })));
  await page.route('**/api/goals/insight', (r) => r.fulfill(ok({
    insight: 'Strong week-one momentum — protect the polynomial streak before the exam window opens.',
  })));
  await page.route('**/api/goals', (r) =>
    r.request().method() === 'GET' ? r.fulfill(ok(GOALS)) : r.fulfill(ok(GOALS)));
  await page.route('**/api/exams*', (r) => r.fulfill(ok([
    { id: 'e1', title: 'Pure Maths Final', exam_date: in45Days, subject: 'mathematics' },
  ])));
  await page.route('**/api/test-results*', (r) => r.fulfill(ok([
    { id: 't1', score: 4, total: 5, topics: ['Quadratics'], difficulty: 'medium', created_at: '2026-06-08T10:00:00Z' },
    { id: 't2', score: 3, total: 5, topics: ['Integration'], difficulty: 'hard', created_at: '2026-06-05T10:00:00Z' },
  ])));
  await page.route('**/api/retrospective*', (r) => r.fulfill(ok([])));
  await page.route('**/api/textbooks', (r) => r.fulfill(ok({ books: TEXTBOOKS, sources: [] })));
}

const VIEWS = [
  ['today', '/today'],
  ['goals', '/goals'],
  ['test-sim', '/test-sim'],
  ['ask-ai', '/ask-ai'],
  ['textbooks', '/textbooks'],
];

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['ipad-portrait', { width: 1024, height: 1366 }],
];

const browser = await chromium.launch();
for (const [vpName, viewport] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1.5 });
  const page = await ctx.newPage();
  await mockRoutes(page);
  for (const [name, path] of VIEWS) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900); // let entrance springs settle
    if (name === 'goals') {
      // expand the first goal so the hierarchy shows
      await page.locator('[data-testid="goal-card-goal-maths"] button[aria-expanded]').first().click().catch(() => {});
      await page.waitForTimeout(700);
    }
    await page.screenshot({ path: `${OUT}/${name}-${vpName}.png`, fullPage: false });
    process.stdout.write(`shot ${name}-${vpName}\n`);
  }
  await ctx.close();
}
await browser.close();
process.stdout.write('done\n');
