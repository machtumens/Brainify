# SECOND BRAIN — COMPLETE BUILD PROMPTS
## 25 Claude Code Prompts · VSCode · Paste-and-Run
## Source of truth: ROADMAP.md + principles.md + ui-ux-principles.md
## DO NOT SKIP ANY SECTION. EVERY FIELD IS MANDATORY.

---

> **HOW TO USE THESE PROMPTS**
> 1. Open VSCode in `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\`
> 2. Open Claude Code panel (Ctrl+Shift+P → Claude Code)
> 3. Paste the full prompt block into the input
> 4. Do NOT skip the mandatory pre-read — Claude Code starts cold every session
> 5. Complete every checklist item before moving to the next prompt
> 6. Write memory updates at the end of EVERY session

---

══════════════════════════════════════════════════════════════════════
## PROMPT P01 — PROJECT SCAFFOLD
**Sprint 1 | WBS 1.1–1.2 | US-001 partial | Phase Gate 1 prereq**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ (read every line before any tool call)
```
1. READ C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\ROADMAP.md
   Focus: §1 (Charter), §3 (Tech Stack), §9 Sprint 1, §14 (Env Vars), §16 (Dependency Map)

2. READ C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\principles.md
   Focus: §5 AI Behavior Laws (ALL 15), §12 Modularity Manifesto, §13 Naming Conventions,
          §1 Review Gate (memorize the checklist), §17 Learning Laws (3 existing laws)

3. READ C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\ui-ux-principles.md
   Focus: §14 Implementation Reference (CSS setup) — memorize the :root block

4. READ C:\Users\Richard Amadeus\.claude\projects\C--Users-Richard-Amadeus-Documents-Everything-Code-Projects-Quikphic\memory\MEMORY.md
   Focus: project_secondbrain.md entry — confirm current sprint state
```

### COLD START VERIFICATION (answer from what you just read)
Before any tool use, state aloud:
- [ ] What sprint are we on and what is its theme?
- [ ] What is the AI router fallback order?
- [ ] What does Phase Gate 1 require to pass?
- [ ] What is the file size hard cap per module?
- [ ] Which env var must NEVER be exposed to the client?

### SKILLS TO INVOKE (50 — invoke in the order listed)
**Invoke via Skill tool immediately as needed:**
1. `/plan` — MANDATORY FIRST. No code before plan approved.
2. `senior-architect` — review scaffold decisions before creating files
3. `tech-stack-evaluator` — confirm Next.js 14 + Supabase + Vercel choices
4. `senior-fullstack` — architecture decisions for app router vs pages router
5. `hexagonal-architecture` — separation of concerns in /src structure
6. `coding-standards` — file org, naming, immutability rules from §12-13
7. `deployment-patterns` — Vercel config, build output, region settings
8. `ci-cd-pipeline-builder` — GitHub Actions for auto-deploy on push
9. `github-ops` — repo init, branch strategy, .gitignore contents
10. `git-workflow` — initial commit message format, branch naming
11. `env-secrets-manager` — .env.local structure, .gitignore entries for secrets
12. `api-design` — establish /api/* route contract pattern before building
13. `database-designer` — confirm Supabase project setup approach
14. `senior-backend` — serverless function architecture in Next.js
15. `configure-ecc` — Claude Code settings for this project
16. `hookify-rules` — set up pre-task hooks (read ui-ux-principles before CSS)
17. `hooks:setup` — configure hooks in .claude/settings.json
18. `update-config` — permissions and allowed tools
19. `decision-logger` — log: why Next.js 14 app router, why Vercel, why Supabase
20. `architecture-decision-records` — write ADR-001: Supabase over alternatives
21. `/tdd` — even scaffold needs tests: verify deploy works, env vars present
22. `tdd-guide` — TDD approach for auth setup
23. `e2e-testing` — set up Playwright for E2E from day one
24. `pw:init` — initialize Playwright in the project
25. `coding-standards` — establish linting: ESLint + Prettier config
26. `monorepo-navigator` — confirm single-repo structure is correct for this scope
27. `security-review` — review .gitignore, env var handling before first commit
28. `security-reviewer` (agent) — run before any commit
29. `senior-security` — confirm RLS will be enforced from Sprint 1
30. `gateguard` — access control verification on Supabase setup
31. `dependency-auditor` — audit initial npm dependencies for vulnerabilities
32. `/code-review` — after writing any config file
33. `code-reviewer` (agent) — review package.json, tsconfig, next.config.js
34. `typescript-reviewer` (agent) — tsconfig.json strict mode verification
35. `error-handling` — establish global error boundary in layout.tsx
36. `git-workflow` — conventional commits from first commit
37. `github:repo-analyze` — verify repo structure matches §12 Modularity Manifesto
38. `checkpoint` — save session state after scaffold complete
39. `memory:memory-persist` — write sprint 1 start to MEMORY.md
40. `self-improving-agent:remember` — log any non-obvious scaffold decisions
41. `quality-gate` — Phase Gate 1 checklist: app loads on Vercel URL
42. `production-audit` — verify Vercel deploy pipeline works before moving on
43. `canary-watch` — set up deployment monitoring
44. `observability-designer` — plan logging strategy for API routes
45. `runbook-generator` — document: how to deploy, how to roll back
46. `save-session` — save session state to memory
47. `update-docs` — update MEMORY.md with scaffold decisions
48. `hooks:post-task` — run review gate after task complete
49. `hooks:pre-task` — hook: read ui-ux-principles before any CSS work
50. `project-management` — confirm PMBOK Sprint 1 process group running

### SCOPE
**BUILD:**
- GitHub repo initialized with correct .gitignore (node_modules, .env.local, .next, *.log)
- Next.js 14 app router scaffold via `npx create-next-app@latest second-brain --typescript --tailwind --app --src-dir --import-alias "@/*"`
- `/src` directory structure per §12 Modularity Manifesto:
  `/src/components/today` `/src/components/goals` `/src/components/test-sim`
  `/src/components/ask-ai` `/src/components/textbooks` `/src/components/shared`
  `/src/lib` `/src/hooks` `/src/api` (Next.js API routes go in `/src/app/api/`)
  `/src/types` `/src/utils` `/src/styles`
- `tsconfig.json` with `strict: true`, no implicit any
- `.env.local.example` with all 6 vars from ROADMAP §14 (no values, just keys)
- `package.json` with `"engines": { "node": ">=18.0.0" }`
- Vercel project linked via `vercel link`, auto-deploy on push to main
- `/docs/adr/ADR-001-supabase-over-alternatives.md` written
- Playwright initialized: `npx playwright install`
- ESLint config with no-console rule (warn level)
- Initial README.md stub (title + stack only, no fluff)

**DO NOT BUILD:**
- Any UI components (that is P03 and beyond)
- Supabase schema (that is P02)
- CSS variables (that is P03)
- Any API routes (that is P04+)
- Auth logic (that is part of P02/P05)

### EXECUTION STEPS
```
Step 1: Invoke /plan. Present scaffold plan. Wait for approval.
Step 2: Run create-next-app command. Verify /src structure created.
Step 3: Create all missing directories from §12 that scaffold didn't create.
Step 4: Configure tsconfig.json — strict mode ON, paths alias @/* → ./src/*.
Step 5: Configure .gitignore — add .env.local, .env.*.local, *.log, .vercel.
Step 6: Create .env.local.example with all 6 keys, empty values, comments from §14.
Step 7: Add engines to package.json. Verify node version >=18.
Step 8: Run `vercel link` — connect to Vercel project. Set project name: second-brain.
Step 9: Write ADR-001 to /docs/adr/. Log: why Supabase, why Next.js 14 app router, why Vercel.
Step 10: Run `npx playwright install` — set up E2E test infrastructure.
Step 11: Configure ESLint — add no-console: warn rule.
Step 12: Invoke /security-review. Verify .env.local in .gitignore BEFORE first commit.
Step 13: Run `npm run build` locally. Fix any errors.
Step 14: Initial commit: `feat: scaffold Next.js 14 project with app router and Vercel pipeline`
Step 15: Push to main. Verify Vercel auto-deploys. Check build logs.
Step 16: Verify Vercel URL loads (even empty page). Phase Gate 1 first criterion: PASS.
Step 17: Update MEMORY.md — Sprint 1 started, scaffold deployed to Vercel.
Step 18: Invoke /checkpoint — save session state.
```

### FILES TO CREATE / MODIFY
```
second-brain/
├── .gitignore                          ← CRITICAL: .env.local must be here
├── .env.local.example                  ← 6 keys, empty values, inline comments
├── package.json                        ← engines field added
├── tsconfig.json                       ← strict: true
├── next.config.js                      ← minimal, no custom config needed yet
├── .eslintrc.json                      ← no-console: warn
├── playwright.config.ts                ← basic config, base URL from env
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ← root layout shell only (no CSS vars yet — P03)
│   │   └── page.tsx                    ← empty shell, "Second Brain — loading"
│   ├── components/
│   │   ├── today/.gitkeep
│   │   ├── goals/.gitkeep
│   │   ├── test-sim/.gitkeep
│   │   ├── ask-ai/.gitkeep
│   │   ├── textbooks/.gitkeep
│   │   └── shared/.gitkeep
│   ├── lib/.gitkeep
│   ├── hooks/.gitkeep
│   ├── types/.gitkeep
│   ├── utils/.gitkeep
│   └── styles/.gitkeep
├── docs/
│   └── adr/
│       └── ADR-001-supabase-over-alternatives.md
└── tests/
    └── e2e/.gitkeep
```

### EMBEDDED CONSTRAINTS
```
- NEVER commit .env.local — verify .gitignore before git add
- tsconfig strict: true — no exceptions, no @ts-ignore without comment
- App router only — no /pages directory
- Node engines >=18 — Vercel uses Node 18 by default
- Import alias @/* — all internal imports use this
```

### ACCEPTANCE CRITERIA (from ROADMAP US-001 partial)
- [ ] `npm run build` exits with code 0 locally
- [ ] Vercel deploy succeeds — URL loads without error
- [ ] `.env.local` confirmed absent from git history (`git log --all -- .env.local` = empty)
- [ ] `tsconfig.json` has `"strict": true`
- [ ] `/docs/adr/ADR-001` exists with context + decision + consequences sections
- [ ] All 6 directories under `/src/components/` exist

### REVIEW GATE (before marking P01 done)
```
Design: N/A (no UI this prompt)
Code:   [ ] tsconfig strict ON
        [ ] No hardcoded values anywhere
        [ ] ESLint config present
Security: [ ] .env.local NOT in git (verify with: git ls-files .env.local → no output)
          [ ] .gitignore has all secret file patterns
Testing:  [ ] Playwright initialized
          [ ] `npm run build` passes
Deploy:   [ ] Vercel URL accessible
          [ ] Build logs clean (no warnings)
```

### MEMORY UPDATE PROTOCOL
```
After completing P01, append to MEMORY.md:
---
# Sprint 1 Status
- P01 COMPLETE: Scaffold deployed to Vercel
- Vercel URL: [paste URL here]
- GitHub repo: [paste URL here]
- Node version: 18.x
- Next.js version: 14.x
- Sprint 1 Phase Gate 1 criterion 1 (deploy): PASS
---
Also write ADR-001 path to memory as a reference entry.
```

### HANDOFF STATE
When P01 is done:
- Empty Next.js 14 app runs on Vercel
- `/src` structure matches §12 exactly
- No UI, no DB, no CSS vars yet
- Playwright ready, ESLint configured
- First commit is clean — no secrets, no debug code
- MEMORY.md updated with Vercel URL

---

══════════════════════════════════════════════════════════════════════
## PROMPT P02 — SUPABASE SCHEMA + SEED DATA
**Sprint 1 | WBS 1.3–1.6 | US-002 | Phase Gate 1 prereq**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md §5 (Data Model — read every table definition word for word)
   READ ROADMAP.md §2.4 (Active Goals — exact seed data values)
   READ ROADMAP.md §9 Phase Gate 1 (schema criterion: "All 8 tables visible in Supabase")
   READ ROADMAP.md §10 Risk Register R3 (Supabase 500MB limit) and R6 (empty confusion map)

2. READ principles.md §1 Review Gate — Security section (RLS rules)
   READ principles.md §5 Law 14 (Supabase Service Key is Sacred)
   READ principles.md §13 Naming Conventions — Database section
   READ principles.md §17 LAW-003 (CSS tokens before components — note: here it's seed before UI)
   READ principles.md §23 Rollback Covenant — Database Migrations section

3. READ ui-ux-principles.md §10.1 (First Run — Never Empty — confirms seed requirement)

4. READ MEMORY.md — confirm P01 complete, Vercel URL recorded
```

### COLD START VERIFICATION
- [ ] What are the 8 table names in exact snake_case?
- [ ] What are the 4 seeded goals and their exact statuses?
- [ ] What does LAW-001 say about seed data and UI?
- [ ] What is the RLS policy pattern for all tables?
- [ ] What risk does R6 describe and how is it mitigated?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `database-designer` — 8-table schema design review before writing SQL
3. `database-schema-designer` — SQL generation for Supabase PostgreSQL
4. `database-migrations` — up() and down() for every migration per §23
5. `postgres-patterns` — PostgreSQL best practices: indexes, constraints, types
6. `database-reviewer` (agent) — review all schema before applying
7. `senior-backend` — serverless + Supabase integration patterns
8. `hexagonal-architecture` — DB layer isolation from business logic
9. `api-design` — confirm API shapes match data model before writing routes
10. `env-secrets-manager` — Supabase keys in .env.local, service key server-only
11. `security-review` — RLS policies, service key exposure check
12. `security-reviewer` (agent) — review before applying any migration
13. `gateguard` — RLS: every table gets `USING (auth.uid() = user_id)` policy
14. `gdpr-dsgvo-expert` — single-user privacy: what data is stored, what's PII
15. `/tdd` — write migration tests: verify tables exist, RLS blocks unauthed reads
16. `tdd-guide` — test: seed data present after migration
17. `e2e-testing` — E2E: login → Supabase query returns seeded data
18. `pw:generate` — generate tests that verify DB state
19. `coding-standards` — migration file naming: timestamp_description.sql
20. `error-handling` — what happens if Supabase connection fails at startup
21. `decision-logger` — log: why jsonb for roadmap/preferences/topic_map
22. `architecture-decision-records` — ADR-002: schema design decisions
23. `risk-management-specialist` — R3 (storage), R6 (empty map) — mitigations in place
24. `senior-fullstack` — Supabase client setup: anon vs service role usage
25. `/code-review` — review migration SQL before applying
26. `code-reviewer` (agent) — review seed script
27. `typescript-reviewer` (agent) — review Supabase TypeScript types
28. `git-workflow` — commit migration files before applying to production
29. `memory:memory-persist` — record schema version in MEMORY.md
30. `self-improving-agent:remember` — log any schema surprises as laws
31. `quality-gate` — Phase Gate 1 schema criterion
32. `checkpoint` — save after schema applied
33. `save-session` — record session state
34. `update-docs` — update ROADMAP.md §5 if any schema deviations
35. `hooks:pre-task` — read §5 Data Model before any SQL write
36. `hooks:post-task` — run security review after SQL written
37. `observability-designer` — plan query logging in development
38. `runbook-generator` — runbook: how to apply migrations, how to roll back
39. `rollback-covenant` (§23) — verify down() migration written for every up()
40. `agile-product-owner` — verify seed data matches §2.4 goals exactly
41. `senior-data-engineer` — indexes on foreign keys, created_at timestamps
42. `production-audit` — verify Supabase dashboard shows all 8 tables post-migration
43. `canary-watch` — Supabase storage dashboard: record baseline MB used
44. `tech-debt-tracker` — note: sources table will need backfill logic in Sprint 5
45. `dependency-auditor` — verify @supabase/supabase-js version is current stable
46. `deployment-patterns` — env vars set in Vercel dashboard (not CLI)
47. `senior-secops` — confirm service role key absent from any client component
48. `project-management` — Risk R6 mitigation: 5 errors seeded before Sprint 2 UI
49. `update-config` — add Supabase CLI to allowed tools if needed
50. `decision-logger` — why UUID primary keys, why created_at timestamptz

### SCOPE
**BUILD:**
- Supabase project created (or existing project used)
- All 8 tables per ROADMAP §5 exact schema — no column name deviations
- Migration file: `/supabase/migrations/001_initial_schema.sql` with up() logic
- Rollback file: `/supabase/migrations/001_initial_schema_down.sql` with down() logic
- RLS enabled on ALL 8 tables, policy: `auth.uid() = user_id` pattern
- Seed script: `/supabase/seed.sql` — 4 goals, 5 errors, 3 sessions, 2 textbooks
  (exact values from ROADMAP §2.4 — A Level Pure Maths M1W3, Physics Ch.3, ML amber, Spivak locked)
- Supabase TypeScript types generated: `/src/types/database.ts` via `supabase gen types`
- `/src/lib/supabase.ts` — client factory (anon key for client, service key for server)

**DO NOT BUILD:**
- Any UI components
- Any API routes (P04)
- Auth UI (P05)
- CSS variables (P03)

### EXECUTION STEPS
```
Step 1: /plan — present schema approach. Get approval.
Step 2: Install @supabase/supabase-js. Add to package.json.
Step 3: Install supabase CLI: npm install supabase --save-dev
Step 4: Run supabase init in project root. Creates /supabase directory.
Step 5: Write migration SQL for all 8 tables per ROADMAP §5 EXACT column names.
        Order: users → goals → textbooks → sessions → errors → captures → test_results → sources → retrospectives
        (Note: 9 tables total including retrospectives — ROADMAP §5 lists 8 but retrospectives is in the schema)
Step 6: Write RLS policies for every table in same migration file.
Step 7: Write down() migration in 001_initial_schema_down.sql.
Step 8: Invoke /security-review — verify service key not in client, RLS complete.
Step 9: Apply migration: supabase db push (or apply via Supabase dashboard SQL editor).
Step 10: Verify in Supabase dashboard: all 8 tables present, RLS enabled (green lock icon).
Step 11: Write seed.sql with exact data from ROADMAP §2.4.
         Goals: Pure Maths (active, month 1 week 3), Physics (active, ch 3),
                ML-Mitchell (active, amber — status: flagged), Spivak (locked)
         Errors: 5 sample errors across Pure Maths + Physics topics
         Sessions: 3 recent sessions
         Textbooks: 2 registered books
Step 12: Apply seed: supabase db seed or paste in Supabase SQL editor.
Step 13: Verify seed: SELECT * FROM goals; — 4 rows. SELECT * FROM errors; — 5 rows.
Step 14: Generate TypeScript types: supabase gen types typescript --linked > src/types/database.ts
Step 15: Write /src/lib/supabase.ts — two exports: createClient (anon) and createServiceClient (service role, server only).
Step 16: Invoke /code-review on supabase.ts — verify service key only in server context.
Step 17: Run up() then down() then up() migration cycle locally — verify rollback works.
Step 18: Commit: feat: add Supabase schema, RLS policies, and seed data
Step 19: Update MEMORY.md — schema applied, seed present, tables count verified.
```

### FILES TO CREATE / MODIFY
```
second-brain/
├── supabase/
│   ├── config.toml                          ← supabase init output
│   ├── migrations/
│   │   ├── 001_initial_schema.sql           ← all 8 tables + RLS (up migration)
│   │   └── 001_initial_schema_down.sql      ← drop all tables (down migration)
│   └── seed.sql                             ← 4 goals + 5 errors + 3 sessions + 2 textbooks
├── src/
│   ├── lib/
│   │   └── supabase.ts                      ← createClient + createServiceClient
│   └── types/
│       └── database.ts                      ← generated by supabase gen types
└── docs/
    └── adr/
        └── ADR-002-schema-design-decisions.md
```

### EMBEDDED CONSTRAINTS
```sql
-- Every table: uuid PRIMARY KEY DEFAULT gen_random_uuid()
-- Every table: created_at timestamptz DEFAULT now()
-- RLS template for every table:
ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "[table]_user_policy" ON [table]
  USING (auth.uid() = user_id);

-- CRITICAL: users table has id uuid = auth.uid() — not a separate user_id column
-- goals.roadmap is jsonb — nested months→weeks→daily_checklist
-- sessions.difficulty: 1=light, 2=medium, 3=hard (INTEGER, not text)
-- captures.type: 'note'|'formula'|'problem'|'explanation'|'idea'|'voice'|'photo'
-- test_results.wrong_ids: uuid[] — array of errors.id references
```

### ACCEPTANCE CRITERIA (US-002)
- [ ] All 8 tables visible in Supabase dashboard
- [ ] RLS enabled on every table (green lock icon in dashboard)
- [ ] Seed: 4 goals matching §2.4 exact statuses (active/active/active-amber/locked)
- [ ] Seed: 5 sample errors across Pure Maths + Physics
- [ ] `SELECT * FROM goals WHERE status = 'locked'` returns 1 row (Spivak)
- [ ] down() migration: runs without error, drops all tables
- [ ] TypeScript types generated with no `any` types

### REVIEW GATE
```
Security: [ ] service role key only in server-side supabase.ts export
          [ ] RLS enabled on all 8 tables — verify in dashboard
          [ ] .env.local has all 3 Supabase keys (URL, anon, service)
Code:     [ ] supabase.ts < 50 lines
          [ ] No hardcoded connection strings
          [ ] TypeScript strict — database.ts has no implicit any
Data:     [ ] Seed data matches ROADMAP §2.4 exactly
          [ ] All foreign keys valid (errors.session_id references existing session)
Rollback: [ ] down() migration tested and works
```

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Schema Status
- P02 COMPLETE: All 8 tables created, RLS enabled, seed applied
- Supabase project URL: [paste]
- Tables: users, goals, textbooks, sessions, errors, captures, test_results, sources, retrospectives
- Seed: 4 goals, 5 errors, 3 sessions, 2 textbooks present
- TypeScript types: /src/types/database.ts generated
- Migration: 001_initial_schema.sql applied + tested rollback
- Phase Gate 1 schema criterion: PASS
---
```

### HANDOFF STATE
- All 8 tables exist in Supabase with RLS
- Seed data loaded and verified
- TypeScript DB types generated
- `/src/lib/supabase.ts` ready for use in P04
- MEMORY.md updated

---

══════════════════════════════════════════════════════════════════════
## PROMPT P03 — DESIGN SYSTEM
**Sprint 1 | WBS 1.7 | US-003 | Phase Gate 1 prereq**
**Estimated: 1.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md — READ THE ENTIRE FILE. Every section. No skipping.
   This is the governing document for ALL UI work in this project.
   Memorize: §1 Color (all 12 tokens), §2 Typography (full type scale),
             §3 Layout specs, §12 Anti-Pattern Blacklist (EVERY item),
             §14 Implementation Reference (exact CSS and font import code)

2. READ ROADMAP.md §4 (Design System — all subsections 4.1–4.5)
   READ ROADMAP.md US-003 Acceptance Criteria (§8 EPIC 0)
   READ ROADMAP.md §11.1 (Design Quality Gates — memorize the grep commands)

3. READ principles.md §1 Review Gate — DESIGN section (top 6 items)
   READ principles.md §5 Law 9 (Never Change Design Tokens Without Review Gate)
   READ principles.md §17 LAW-003 (CSS Token System Before Components)

4. READ MEMORY.md — confirm P01 + P02 complete
```

### COLD START VERIFICATION
- [ ] What are the exact hex values for --cream, --ink, --line, --red, --amber, --green?
- [ ] What font is used and what weight is body text?
- [ ] What is card border-radius? What is card padding?
- [ ] What does `grep -r "box-shadow" ./src` need to return?
- [ ] What is the 5% rule for semantic colors?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `ui-design-system` — design token application and CSS custom properties
3. `design-system` — design system audit and maintenance strategy
4. `frontend-design-direction` — enforce Apple HIG direction on every token choice
5. `frontend-patterns` — CSS architecture patterns for this stack
6. `react-patterns` — how design tokens flow through React components
7. `nextjs-turbopack` — Next.js 14 global CSS setup with app router
8. `make-interfaces-feel-better` — verify tokens produce the intended warmth
9. `accessibility` — contrast ratios per §11.1 (--ink4 warning for body text)
10. `frontend-a11y` — focus states, color-independent state communication
11. `motion-foundations` — establish animation timing variables in tokens
12. `motion-patterns` — CSS transition tokens for 150ms, 80ms, 200ms, 300ms
13. `liquid-glass-design` — reference as anti-pattern: what NOT to do
14. `coding-standards` — no hardcoded hex, CSS vars only, file < 800 lines
15. `/tdd` — write tests: grep for box-shadow = 0, grep for hardcoded hex = 0
16. `tdd-guide` — test: Newsreader font loaded (Network tab check in Playwright)
17. `browser-qa` — verify font renders at correct weight in browser
18. `pw:generate` — Playwright test: page background is var(--cream) color value
19. `react-testing` — component test: Card renders with border-radius 11px
20. `test-coverage` — design system coverage: every token used at least once
21. `senior-frontend` — architecture decision: CSS modules vs Tailwind for design tokens
22. `ui-demo` — demonstrate all token states before committing
23. `ux-researcher-designer` — validate cream palette reads as warm, not clinical
24. `/code-review` — after writing globals.css
25. `code-reviewer` (agent) — verify zero hardcoded hex in any file
26. `typescript-reviewer` (agent) — if CSS-in-JS patterns used, verify types
27. `security-review` — N/A for CSS but run anyway (habit before commit)
28. `git-workflow` — commit: style: add design system CSS custom properties
29. `decision-logger` — log: why Newsreader over Inter, why cream over white
30. `architecture-decision-records` — ADR-003: design system token approach
31. `quality-gate` — US-003 acceptance criteria check
32. `production-audit` — deploy to Vercel, visually verify cream background renders
33. `/verify` — MANDATORY after any CSS change
34. `verify` — verify in real browser on Vercel URL (not just localhost)
35. `checkpoint` — save session
36. `memory:memory-persist` — record design system complete
37. `self-improving-agent:remember` — log: design token freeze from this point
38. `save-session` — save state
39. `update-docs` — update MEMORY.md
40. `hooks:pre-task` — confirm: ALWAYS read ui-ux-principles §12 before any CSS change
41. `hooks:post-task` — run grep checks after any CSS change
42. `tech-debt-tracker` — note: any Tailwind utility that hardcodes colors must be replaced
43. `refactor-clean` — remove any default Tailwind color classes from scaffold
44. `plankton-code-quality` — zero violations of design spec in CSS files
45. `simplify` — globals.css should be clean: :root vars + base reset only
46. `observability-designer` — note: design changes should trigger grep CI check
47. `ci-cd-pipeline-builder` — add grep checks to GitHub Actions pipeline
48. `runbook-generator` — document: how to add new design token (approval process)
49. `agile-product-owner` — confirm US-003 AC all met before moving to P04
50. `project-management` — Phase Gate 1 design criterion: no hardcoded hex confirmed

### SCOPE
**BUILD:**
- `/src/styles/globals.css` — complete :root with all 12 CSS custom properties
- Newsreader Google Font import in `/src/app/layout.tsx`
- Base reset in globals.css (box-sizing, margin 0, padding 0)
- Body defaults: background var(--cream), color var(--ink), font-family Newsreader
- CSS transition timing variables added to :root:
  `--t-fast: 80ms ease`, `--t-task: 150ms ease`, `--t-expand: 200ms ease-in-out`,
  `--t-progress: 300ms ease`, `--t-skeleton: 1.5s ease-in-out`
- Skeleton animation keyframe in globals.css
- Tailwind config updated: extend theme with CSS var references (no hardcoded colors)
- Playwright test: `tests/e2e/design-system.spec.ts` — verifies font loads + bg color

**DO NOT BUILD:**
- Any React components (tokens only — components start P05)
- Any page layouts
- Component-specific CSS (only global tokens this prompt)

### EXECUTION STEPS
```
Step 1: /plan — present design system approach. Confirm CSS custom properties strategy.
Step 2: Read ui-ux-principles.md §14 Implementation Reference — copy exact :root block.
Step 3: Write globals.css — :root with all 12 tokens + 5 timing vars + skeleton keyframe.
Step 4: Update layout.tsx — add Newsreader Google Font link tags (exact from §14).
        Apply font-family: 'Newsreader', Georgia, serif to body in globals.css.
Step 5: Update tailwind.config.ts — extend theme colors to reference CSS vars.
        Example: cream: 'var(--cream)' — so Tailwind classes like bg-cream work.
Step 6: Remove any default Tailwind bg-white or text-black from scaffold files.
Step 7: Run grep checks:
        grep -r "box-shadow" ./src → must return 0 results
        grep -r "#[0-9A-Fa-f]{3,6}" ./src/styles → only allowed in :root definitions
        grep -r "#[0-9A-Fa-f]{3,6}" ./src/components → must return 0 results (no components yet — confirm)
        grep -r "white\|#fff\|#FFF" ./src → must return 0 results
Step 8: Write Playwright test for design system (font load + bg color).
Step 9: Run npm run dev — open browser, verify: cream background visible, Newsreader loaded.
Step 10: Deploy to Vercel. Verify cream background on live URL.
Step 11: Invoke /verify — confirm on real Vercel URL.
Step 12: Invoke /code-review on globals.css.
Step 13: Commit: style: add design system CSS custom properties and Newsreader font
Step 14: Update MEMORY.md — design tokens frozen, no changes without review gate.
```

### FILES TO CREATE / MODIFY
```
src/
├── styles/
│   └── globals.css          ← :root vars + reset + base + skeleton keyframe
├── app/
│   └── layout.tsx           ← Newsreader font import added
└── ...
tailwind.config.ts            ← theme extended with CSS var references
tests/
└── e2e/
    └── design-system.spec.ts ← font load + background color tests
docs/
└── adr/
    └── ADR-003-design-token-approach.md
```

### EMBEDDED CONSTRAINTS
```css
/* EXACT :root block — copy from ui-ux-principles.md §14 */
:root {
  --cream: #FAF8F4;   --cream2: #F3F0EA;  --cream3: #EAE6DD;
  --ink: #1A1917;     --ink2: #4A4845;    --ink3: #8A8784;   --ink4: #B8B5B0;
  --line: #E2DED6;    --line2: #CBC7BF;
  --red: #C0392B;     --amber: #8B5E00;   --green: #2D6A4F;
  /* Timing — derived from ui-ux-principles.md §5.1 */
  --t-fast: 80ms ease;
  --t-task: 150ms ease;
  --t-expand: 200ms ease-in-out;
  --t-progress: 300ms ease;
}

/* Forbidden after this commit — these grep checks must pass FOREVER: */
/* grep -r "box-shadow" ./src = 0 results */
/* grep -r "#[0-9A-Fa-f]{3,6}" ./src/components = 0 results */
/* grep -r "white\b\|#fff\b\|#FFF\b\|#ffffff\|#FFFFFF" ./src = 0 results */
```

### ACCEPTANCE CRITERIA (US-003)
- [ ] Newsreader font loading confirmed in Network tab (Google Fonts CDN request)
- [ ] All 12 CSS vars defined in :root
- [ ] `grep -r "box-shadow" ./src` = 0 results
- [ ] `grep -r "#[0-9A-Fa-f]{3,6}" ./src/components` = 0 results (no components yet — stays 0)
- [ ] Page background: #FAF8F4 visible on Vercel live URL
- [ ] Progress bar token defined with 1px height intention documented in comment
- [ ] Card spec documented in globals.css comment block

### REVIEW GATE
```
Design: [ ] --cream matches #FAF8F4 exactly
        [ ] All 12 tokens present, no extras added
        [ ] No box-shadow anywhere
        [ ] No hardcoded hex outside :root
        [ ] Newsreader Georgia serif fallback present
Code:   [ ] globals.css < 100 lines (should be minimal)
        [ ] Tailwind config uses var() references, not hardcoded hex
        [ ] No Tailwind purge removing CSS vars (not applicable — vars are global)
Deploy: [ ] Live Vercel URL shows cream background
        [ ] Browser DevTools: body font-family = Newsreader confirmed
```

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Design System Status
- P03 COMPLETE: Design tokens frozen as of [date]
- CSS vars: 12 tokens in globals.css :root
- Font: Newsreader loaded from Google Fonts
- FROZEN: No design token changes without user approval + grep audit
- Phase Gate 1 design criterion: PASS
---
```

### HANDOFF STATE
- globals.css has all 12 tokens + 5 timing vars
- Newsreader font loads on Vercel
- All grep checks pass (0 results for box-shadow, hardcoded hex, white)
- Design tokens are FROZEN — principles.md Law 9 in effect
- Ready for P04 (AI infrastructure) and then P05 (UI components)

---

══════════════════════════════════════════════════════════════════════
## PROMPT P04 — AI INFRASTRUCTURE
**Sprint 1 | WBS 1.8, 7.1 | US-018 | Phase Gate 1 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md §12 (AI Architecture — ALL subsections: router logic, context assembler,
   per-feature prompt strategy table)
   READ ROADMAP.md §6 (API Routes — all 10 routes, understand the full contract)
   READ ROADMAP.md §3.3 (AI Provider Cascade — free tier limits)
   READ ROADMAP.md §14 (Env Vars — all 6 keys)
   READ ROADMAP.md US-018 Acceptance Criteria

2. READ principles.md §5 Laws 14 + 15 (service key sacred, provider is infrastructure)
   READ principles.md §7 (Context Budget Rules — what gets loaded per task type)
   READ principles.md §8 (Token Economy — context assembler limits per table)
   READ principles.md §15 (MCP Principles — Vercel MCP for deploy monitoring)

3. READ ui-ux-principles.md — N/A for this prompt (no UI)
   But confirm: provider name must NEVER appear in any UI error message

4. READ MEMORY.md — confirm P01+P02+P03 complete, all Phase Gate 1 non-AI criteria passed
```

### COLD START VERIFICATION
- [ ] What is the exact fallback order of AI providers?
- [ ] What does the context assembler read from Supabase and in what token limits?
- [ ] What does Law 15 say about provider names?
- [ ] What is the max context token target per call?
- [ ] What are the 3 env vars for AI providers?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `claude-api` — primary AI integration patterns (applies to any LLM API)
3. `prompt-engineer-toolkit` — designing all 5 AI prompts (brief/tutor/test/primer/retro)
4. `context-engine` — context assembly architecture per §12.2
5. `token-budget-advisor` — context assembler token limits per §8
6. `cost-aware-llm-pipeline` — free tier management (Gemini 1,500/day, Groq 30 RPM)
7. `rag-architect` — retrieval patterns for context assembly from Supabase
8. `ai-first-engineering` — AI-native patterns for the router and assembler
9. `iterative-retrieval` — context retrieval optimization
10. `api-connector-builder` — AI provider connection setup patterns
11. `backend-patterns` — serverless function patterns for /api/* routes
12. `error-handling` — structured errors: { success, data, error } envelope ALWAYS
13. `senior-backend` — serverless AI call patterns, streaming, timeouts
14. `senior-ml-engineer` — ML pipeline architecture for context → AI → structured output
15. `mle-workflow` — ML engineering workflow for prompt iteration
16. `hexagonal-architecture` — ai-router.js does ONE thing: route AI calls
17. `coding-standards` — ai-router.js < 50 lines, context-assembler.js < 200 lines
18. `env-secrets-manager` — validate all 3 AI env vars present at startup
19. `security-review` — API keys never logged, never in error messages
20. `security-reviewer` (agent) — review ai-router.js for key exposure
21. `senior-security` — rate limit responses don't leak provider details
22. `/tdd` — test: router calls Gemini first, falls back to Groq on rate limit
23. `tdd-guide` — mock providers for unit tests
24. `tdd-workflow` — red→green→refactor for each provider integration
25. `react-testing` — N/A but use for testing hooks that call AI routes
26. `eval-harness` — set up AI evaluation framework for output quality
27. `ai-regression-testing` — baseline: brief generates text, tutor responds
28. `benchmark` — measure: context assembly time, AI response latency
29. `latency-critical-systems` — brief must return < 2s (Phase Gate criterion)
30. `content-hash-cache-pattern` — cache context assembly results within session
31. `/code-review` — after writing ai-router.js and context-assembler.js
32. `code-reviewer` (agent) — review both files
33. `typescript-reviewer` (agent) — types: ContextPayload, AIResponse interfaces
34. `api-design-reviewer` — verify /api/brief route contract
35. `regex-vs-llm-structured-text` — note: auto-tagging uses AI, not regex
36. `decision-logger` — log: why Gemini Flash over OpenAI, fallback order rationale
37. `architecture-decision-records` — ADR-004: AI provider cascade design
38. `git-workflow` — commit ai-router + context-assembler + /api/brief stub
39. `memory:memory-persist` — record AI router operational in MEMORY.md
40. `self-improving-agent:remember` — log any rate limit behavior observed
41. `quality-gate` — Phase Gate 1: /api/brief returns response (PASS = this prompt done)
42. `production-audit` — test /api/brief on Vercel (not just localhost)
43. `canary-watch` — monitor Gemini quota after first live test
44. `observability-designer` — plan: log which provider served each request (server-side only)
45. `monitoring:status` — add /api/health endpoint that checks all 3 providers
46. `checkpoint` — save after AI infrastructure confirmed working on Vercel
47. `save-session` — record state
48. `update-docs` — document context assembler in /src/lib/README.md
49. `runbook-generator` — runbook: what to do when Gemini hits rate limit
50. `project-management` — Phase Gate 1 final criterion: AI router works = gate PASSES

### SCOPE
**BUILD:**
- `/src/lib/ai-router.js` — Gemini→Groq→OpenRouter cascade per §12.1 exact pseudocode
- `/src/lib/context-assembler.js` — reads all 6 Supabase tables, token limits per §8
- `/src/types/ai.ts` — TypeScript interfaces: ContextPayload, AIResponse, AIProvider
- `/src/app/api/brief/route.ts` — POST /api/brief stub: calls context assembler + ai-router
- `/src/app/api/health/route.ts` — GET /api/health: returns {gemini: ok/fail, groq: ok/fail}
- Env var validation at startup in ai-router.js
- `/src/lib/README.md` — documents ai-router, context-assembler, supabase exports

**DO NOT BUILD:**
- Full AI prompts (§12.3) — those go in each feature prompt (P07, P11, P17, etc.)
- Streaming (P17 — Ask AI)
- Any UI that displays AI output (P07+)

### EXECUTION STEPS
```
Step 1: /plan — architect ai-router.js and context-assembler.js before writing.
Step 2: Write /src/types/ai.ts — ContextPayload, AIResponse, AIProvider types.
Step 3: Write /src/lib/ai-router.js — exact cascade logic from §12.1.
        Validate env vars present. Try Gemini. Catch RateLimitError → try Groq.
        Catch → try OpenRouter. If all fail → throw structured error.
        CRITICAL: provider name NEVER in returned error message (Law 15).
Step 4: Write /src/lib/context-assembler.js — reads from Supabase using service client.
        Limits: goals (last 7 days active), sessions (last 14), errors (top 20 by freq),
        captures (last 30 days), textbooks (current chapter), total target < 50k tokens.
        Returns typed ContextPayload.
Step 5: Write /src/app/api/brief/route.ts — POST handler.
        Calls context-assembler, calls ai-router with brief prompt stub ("Return test string").
        Returns { success: true, data: { brief: string }, error: null }.
        MUST use service role key (server-side only). MUST return structured error on failure.
Step 6: Write /src/app/api/health/route.ts — GET handler, no auth required.
Step 7: Invoke /tdd — write tests for ai-router: mock Gemini fail → verify Groq called.
Step 8: Invoke /security-review — verify: API keys never logged, provider never in response.
Step 9: Run npm run dev. Test POST /api/brief with curl or Insomnia.
        Verify: returns 200 with { success: true, data: { brief: "..." } }
Step 10: Set env vars in Vercel dashboard (GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY).
Step 11: Deploy to Vercel. Test /api/brief on live URL.
Step 12: Invoke /verify — Phase Gate 1 final criterion: /api/brief returns response. PASS.
Step 13: Write /src/lib/README.md.
Step 14: Commit: feat: add AI router, context assembler, and /api/brief route
Step 15: Update MEMORY.md — Phase Gate 1: ALL criteria MET. Sprint 1 COMPLETE.
Step 16: Sprint 1 retrospective note: record what was harder than expected.
```

### FILES TO CREATE / MODIFY
```
src/
├── types/
│   └── ai.ts                           ← ContextPayload, AIResponse, AIProvider
├── lib/
│   ├── ai-router.js                    ← cascade logic, env validation, no provider leakage
│   ├── context-assembler.js            ← reads 6 tables, returns ContextPayload
│   └── README.md                       ← module documentation
└── app/
    └── api/
        ├── brief/
        │   └── route.ts                ← POST /api/brief stub
        └── health/
            └── route.ts                ← GET /api/health
docs/
└── adr/
    └── ADR-004-ai-provider-cascade.md
```

### EMBEDDED CONSTRAINTS
```javascript
// ai-router.js — key rules from §12.1 + Law 15:
// 1. providers array: [gemini, groq, openrouter] — try in order
// 2. catch ONLY RateLimitError or NetworkError → continue to next provider
// 3. NEVER include provider name in error returned to caller
// 4. ALWAYS inject identical context regardless of provider
// 5. Log provider used SERVER-SIDE ONLY (not in response)

// context-assembler.js — limits from §8:
// goals: active goals only, current week roadmap only
// sessions: last 14 records (not all time)
// errors: top 20 by frequency (grouped + counted)
// captures: last 30 days
// textbooks: current_page, current_chapter only (not full topic_map)
// Total target: < 50,000 tokens
```

### ACCEPTANCE CRITERIA (US-018)
- [ ] `/api/brief` returns a response (string) — any text, real AI or fallback
- [ ] Provider name does NOT appear in any response or error
- [ ] Context assembler reads from all 6 tables without crashing on empty tables
- [ ] Env var validation: missing key logs warning, falls back to next provider
- [ ] `/api/health` returns provider status without exposing keys
- [ ] All API routes return `{ success, data, error }` envelope

### PHASE GATE 1 — FINAL CHECK
```
All 6 Phase Gate 1 criteria must pass before moving to Sprint 2:
[ ] App loads on Vercel URL ✓ (P01)
[ ] Auth: email/password login redirects to Today view (P05 will build this — verify P05 before gate)
    → NOTE: P04 lays AI foundation but auth UI is P05. Gate 1 requires P01+P02+P03+P04+P05.
[ ] Schema: all 8 tables in Supabase ✓ (P02)
[ ] Seed: 4 goals + 5 errors in DB ✓ (P02)
[ ] Design: Newsreader loading, CSS vars in use, no hardcoded hex ✓ (P03)
[ ] AI Router: /api/brief returns any response ✓ (P04)
```

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# AI Infrastructure Status
- P04 COMPLETE: ai-router.js + context-assembler.js operational
- /api/brief tested on Vercel: [paste test result]
- Provider cascade: Gemini Flash → Groq Llama 3.3 → OpenRouter
- Phase Gate 1 AI criterion: PASS
- Sprint 1: 5/6 criteria PASS (P05 auth completes the gate)
---
```

### HANDOFF STATE
- AI router handles Gemini→Groq→OpenRouter fallback
- Context assembler reads all 6 Supabase tables safely
- /api/brief returns structured response on Vercel
- /api/health operational
- Provider never leaks to UI
- Sprint 1 is effectively done pending P05 auth UI

---

══════════════════════════════════════════════════════════════════════
## PROMPT P05 — APP LAYOUT + NAVIGATION + AUTH
**Sprint 2 start | WBS 2.1 | US-001 (auth) | Phase Gate 1 final criterion**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §3.2 (Today View Grid — exact column specs)
   READ ui-ux-principles.md §4.6 (Navigation Bar — full CSS spec)
   READ ui-ux-principles.md §6 (Navigation Patterns — ALL subsections)
   READ ui-ux-principles.md §12 Anti-Pattern Blacklist (memorize §12.1–12.5)
   READ ui-ux-principles.md §0 (Core Philosophy — tool that disappears)

2. READ ROADMAP.md §4.4 (Component Specs — Navigation section)
   READ ROADMAP.md US-001 (Acceptance Criteria — auth redirect behavior)
   READ ROADMAP.md §3.1 (Full Stack — Supabase Auth row)
   READ ROADMAP.md §9 Phase Gate 1 (auth criterion — the last unchecked box)

3. READ principles.md §5 Laws 1+2 (read before build, plan before sprint)
   READ principles.md §12 (Modularity Manifesto — /src/components/shared/ for layout)
   READ principles.md §10 Mistake 15 (no modals for routine actions — applies to login)

4. READ MEMORY.md — confirm P01+P02+P03+P04 complete
```

### COLD START VERIFICATION
- [ ] What are the 5 nav items and what order do they appear?
- [ ] What is the nav item active state (background + border + text color)?
- [ ] What is the right panel fixed width on Today view?
- [ ] What does auth redirect do on successful login vs expired session?
- [ ] What does §6.4 say about expandable sections arrow pattern?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `nextjs-turbopack` — Next.js 14 app router navigation, layouts, route groups
3. `react-patterns` — layout component patterns, context for auth state
4. `frontend-patterns` — top-level layout architecture
5. `frontend-design-direction` — enforce: text-only nav, no icons, cream3 active
6. `ui-design-system` — token application: nav uses --ink2/--cream3/--line2
7. `make-interfaces-feel-better` — nav should feel immediate (80ms transition)
8. `accessibility` — nav: keyboard nav, focus-visible states, ARIA current page
9. `frontend-a11y` — touch targets: nav items min 44×44px
10. `motion-patterns` — nav active state: 80ms transition (--t-fast token)
11. `senior-frontend` — auth guard pattern in Next.js 14 app router
12. `senior-fullstack` — Supabase Auth with Next.js: server vs client auth
13. `database-reviewer` (agent) — verify Supabase auth integration with RLS
14. `security-review` — auth redirect: verify JWT not exposed in URL or localStorage
15. `security-reviewer` (agent) — review auth implementation
16. `gateguard` — middleware.ts for auth protection on all routes except /login
17. `env-secrets-manager` — confirm NEXT_PUBLIC_SUPABASE_ANON_KEY (public) correct
18. `/tdd` — test: unauthenticated → redirected to /login, authenticated → /today
19. `tdd-guide` — TDD for auth guard middleware
20. `e2e-testing` — Playwright E2E: login flow, redirect, session persistence
21. `pw:generate` — generate auth E2E tests
22. `react-testing` — unit test nav component: correct active state on current route
23. `coding-standards` — Nav.tsx < 50 lines, TodayLayout.tsx < 100 lines
24. `error-handling` — login error: inline red italic text (never modal, never alert)
25. `ui-demo` — demo all nav states: default, hover, active — verify before committing
26. `/code-review` — after writing Nav, TodayLayout, login page
27. `code-reviewer` (agent) — review all layout components
28. `typescript-reviewer` (agent) — typed props for all layout components
29. `decision-logger` — log: why no sidebar, why top nav, why no hamburger
30. `architecture-decision-records` — ADR-005: navigation pattern decisions
31. `git-workflow` — commit layout + auth separately (two commits)
32. `/verify` — MANDATORY: open live Vercel URL, click all 5 nav items
33. `verify` — verify: cream3 active bg visible, text-only (no icons), 80ms transition
34. `production-audit` — Phase Gate 1 auth criterion: login works on Vercel
35. `quality-gate` — Phase Gate 1 COMPLETE after this prompt
36. `checkpoint` — save after Phase Gate 1 confirmed
37. `memory:memory-persist` — Phase Gate 1 PASS recorded in MEMORY.md
38. `save-session` — record state
39. `update-docs` — update MEMORY.md sprint status
40. `hooks:pre-task` — read ui-ux-principles §6 + §4.6 before any nav CSS
41. `hooks:post-task` — run grep checks after nav CSS written
42. `refactor-clean` — remove any scaffold default nav/header from create-next-app
43. `self-improving-agent:remember` — log: Supabase Auth in Next.js 14 gotchas
44. `tech-debt-tracker` — note: CaptureBar will be added to layout in P06
45. `senior-devops` — confirm middleware.ts deploys correctly on Vercel Edge
46. `ci-cd-pipeline-builder` — add auth E2E test to GitHub Actions
47. `sprint-health` — Sprint 2 starting: confirm Sprint 1 gate passed first
48. `agile-product-owner` — US-001 acceptance criteria all checked
49. `performance-optimizer` — nav renders fast: no unnecessary re-renders on route change
50. `project-management` — Phase Gate 1 OFFICIALLY CLOSED: record Go decision

### SCOPE
**BUILD:**
- `/src/app/(auth)/login/page.tsx` — login form (email + password, Supabase auth)
- `/src/middleware.ts` — auth guard: unauthenticated → /login, authenticated → /today
- `/src/app/(app)/layout.tsx` — authenticated layout wrapper with Nav
- `/src/components/shared/Nav.tsx` — top nav bar (5 text items + brand + date)
- `/src/app/(app)/today/page.tsx` — Today view shell (empty, just the grid structure)
- `/src/app/(app)/goals/page.tsx` — Goals view shell (empty)
- `/src/app/(app)/test-sim/page.tsx` — Test Sim view shell (empty)
- `/src/app/(app)/ask-ai/page.tsx` — Ask AI view shell (empty)
- `/src/app/(app)/textbooks/page.tsx` — Textbooks view shell (empty)
- Today view grid in today/page.tsx: two-column (fluid left / 272px right) + full-width bottom slot

**DO NOT BUILD:**
- Any content inside views (those are P06–P25)
- Quick capture bar content (P06)
- Login styling beyond functional (keep minimal — this is not a featured screen)

### EXECUTION STEPS
```
Step 1: /plan — layout architecture, route groups, auth flow diagram.
Step 2: Create route groups: (auth) for /login, (app) for all authenticated routes.
Step 3: Write middleware.ts — protect all /(app)/* routes, redirect to /login if no session.
Step 4: Write login page — Supabase signInWithPassword, redirect to /today on success.
        Login error: show inline below form in --red italic text. No modal. No alert box.
Step 5: Write (app)/layout.tsx — imports Nav, wraps children, will later hold CaptureBar.
Step 6: Write Nav.tsx — brand "second brain" italic 15px, 5 nav items (text only),
        active state: cream3 bg + line2 border, date display right-aligned ink4 italic 12px.
        Use Next.js usePathname() for active detection.
        80ms transition on active state change (use var(--t-fast)).
Step 7: Write Today view grid in today/page.tsx:
        Two-column CSS grid: left = flex-1 min 320px, right = 272px fixed, gap 24px.
        Page padding: 24px horizontal, 20px vertical.
        Leave column content empty (slot divs only).
Step 8: Write empty shells for Goals, Test Sim, Ask AI, Textbooks.
Step 9: Invoke /tdd — Playwright test: navigate to / → redirected to /login.
        After login → redirected to /today. Nav shows correct active item.
Step 10: Run grep checks — nav must have zero box-shadow, zero hardcoded hex.
Step 11: Invoke /verify on Vercel — click all 5 nav items, confirm active state visual.
Step 12: Phase Gate 1 auth criterion: login on Vercel → redirects to Today. PASS.
Step 13: Invoke quality-gate — Phase Gate 1: ALL 6 criteria now PASS. Gate CLOSED.
Step 14: Commit auth: feat: add Supabase auth, middleware guard, login page
Step 15: Commit layout: feat: add app layout, navigation, and view shells
Step 16: Update MEMORY.md — Phase Gate 1 COMPLETE. Sprint 2 begins.
```

### FILES TO CREATE / MODIFY
```
src/
└── app/
    ├── (auth)/
    │   └── login/
    │       └── page.tsx                ← login form, Supabase auth
    ├── (app)/
    │   ├── layout.tsx                  ← Nav + children + CaptureBar slot
    │   ├── today/page.tsx              ← two-column grid shell
    │   ├── goals/page.tsx              ← empty shell
    │   ├── test-sim/page.tsx           ← empty shell
    │   ├── ask-ai/page.tsx             ← empty shell
    │   └── textbooks/page.tsx          ← empty shell
    └── middleware.ts                   ← auth guard, redirects
src/components/shared/
    └── Nav.tsx                         ← top nav bar
```

### EMBEDDED CONSTRAINTS
```css
/* Nav — from ui-ux-principles.md §4.6 */
/* brand: 15px italic Newsreader --ink — "second brain" lowercase, NO logo */
/* nav items: 13px --ink2, pill (99px radius), transparent border default */
/* active: background var(--cream3), border 1px solid var(--line2), color var(--ink) */
/* NO icons. Text labels: "today" "goals" "test sim" "ask ai" "textbooks" */
/* transition: var(--t-fast) — 80ms ease */

/* Today grid — from ui-ux-principles.md §3.2 */
/* display: grid; grid-template-columns: 1fr 272px; gap: 24px; */
/* padding: 20px 24px; */
/* Right panel FIXED at 272px — never fluid */
```

### ACCEPTANCE CRITERIA (US-001)
- [ ] Supabase Auth with email/password functional on Vercel
- [ ] JWT handled automatically (no manual session management code)
- [ ] RLS blocks unauthenticated Supabase queries
- [ ] Redirect to Today view on successful login
- [ ] Redirect to login on expired/missing session
- [ ] Phase Gate 1: all 6 criteria PASS

### REVIEW GATE
```
Design: [ ] Nav has zero icons — text labels only
        [ ] Active state: cream3 + line2 border (verify in browser DevTools)
        [ ] No box-shadow anywhere in new files
        [ ] No hardcoded hex in Nav.tsx or layout files
        [ ] Brand "second brain" lowercase, italic — no logo, no uppercase
Auth:   [ ] Login redirects to /today (not /dashboard, not /)
        [ ] Unauthenticated /today → redirects to /login
        [ ] Login error shows inline red italic text, not a modal
        [ ] JWT not in URL params
Security: [ ] middleware.ts protects all (app) routes
          [ ] Service key not referenced in any client component
```

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Phase Gate 1 — COMPLETE
Date: [today]
Result: GO — all 6 criteria PASS
- Deploy: PASS (P01)
- Auth: PASS (P05)
- Schema: PASS (P02)
- Seed: PASS (P02)
- Design: PASS (P03)
- AI Router: PASS (P04)

# Sprint 2 — STARTED
Theme: Today View Core
Current US: US-004 (AI Brief) next
---
```

### HANDOFF STATE
- Login works on Vercel, redirects to Today
- Nav renders with cream3 active state, text-only labels
- Today view has two-column grid ready for components
- All 5 view shells accessible via nav
- Phase Gate 1 CLOSED — Sprint 2 BEGINS
- Next prompt: P06 (Quick Capture Bar)

---

══════════════════════════════════════════════════════════════════════
## PROMPT P06 — QUICK CAPTURE BAR
**Sprint 2/3 | WBS 2.9, 7.2 partial | US-011 | Sprint 2 parallel**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.7 (Quick Capture Bar — full CSS spec)
   READ ui-ux-principles.md §7 (Input & Capture Patterns — ALL subsections)
   READ ui-ux-principles.md §8.2 (Feedback — capture submit row)
   READ ui-ux-principles.md §5.1 (Motion — capture confirm: 150ms fade)
   READ ui-ux-principles.md §9.2 (Modality — capture confirmation: NO modal)

2. READ ROADMAP.md US-011 (Quick capture bar — ALL acceptance criteria)
   READ ROADMAP.md §6 (/api/ingest route spec)
   READ ROADMAP.md §5 (captures table schema — type, source_type fields)

3. READ principles.md §10 Mistake 19 (The 2-Tap Rule — CRITICAL)
   READ principles.md §5 Law 7 (Never Add Unrequested Features — no extra capture types)
   READ principles.md §12 (CaptureBar is a layout component — not a page component)

4. READ MEMORY.md — confirm Phase Gate 1 CLOSED, Sprint 2 started
```

### COLD START VERIFICATION
- [ ] What does the 2-Tap Rule require?
- [ ] What is the border-radius of the capture input?
- [ ] What feedback shows after successful capture? How long does it last?
- [ ] What does §7.5 say about capture bar during a Pomodoro session?
- [ ] What does POST /api/ingest accept as content types?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — layout component pattern, CaptureBar as always-mounted component
3. `nextjs-turbopack` — sticky positioning in Next.js 14 app router layout
4. `frontend-patterns` — capture bar as layout-level concern
5. `frontend-design-direction` — pill shape, 28px icon buttons, Tabler icons
6. `ui-design-system` — token application: line2 border, cream bg, ink text
7. `motion-patterns` — capture confirm: 150ms ease-out fade
8. `motion-ui` — inline feedback (not toast, not modal — inline text fade)
9. `make-interfaces-feel-better` — pill input reads as invitation, not form field
10. `accessibility` — mic/camera/send buttons: aria-label (text equivalent for icons)
11. `frontend-a11y` — touch targets: icon buttons must be 44×44px hit area
12. `motion-foundations` — 150ms for confirm animation exactly
13. `api-connector-builder` — wire capture bar to POST /api/ingest
14. `backend-patterns` — /api/ingest route: handle text first, voice/photo stubs
15. `error-handling` — capture fail: inline error text (--red italic) below bar
16. `senior-frontend` — voice capture: Web Speech API or stub for now
17. `react-testing` — unit test: submit → POST /api/ingest called, input cleared
18. `/tdd` — test: type text → submit → input clears → "Captured" text appears
19. `tdd-guide` — TDD for capture submit flow
20. `e2e-testing` — Playwright E2E: type in capture bar → submit → verify in DB
21. `pw:generate` — generate capture bar E2E test
22. `coding-standards` — CaptureBar.tsx < 80 lines, useCapture.ts hook < 50 lines
23. `hooks` (React) — useCapture hook: manages input state, submit logic
24. `coding-standards` — extract useCapture hook from CaptureBar component
25. `senior-backend` — /api/ingest stub: accepts text, auto-tags with AI, writes to captures
26. `prompt-engineer-toolkit` — auto-tag prompt: assign subject_tag, content_type, topic_tag
27. `context-engine` — ingest uses partial context (subject context only, not full assembly)
28. `token-budget-advisor` — ingest prompt: lightweight, single purpose
29. `security-review` — capture input: sanitize before writing to DB
30. `security-reviewer` (agent) — review /api/ingest for injection
31. `gateguard` — /api/ingest requires authenticated session
32. `/code-review` — after writing CaptureBar + /api/ingest
33. `code-reviewer` (agent) — review both
34. `typescript-reviewer` (agent) — typed props for CaptureBar
35. `decision-logger` — log: voice is Web Speech API stub (full impl is US-020, Sprint 6)
36. `git-workflow` — commit CaptureBar + /api/ingest stub
37. `/verify` — open Vercel, type in capture bar, submit, verify "Captured" text fades in
38. `verify` — check Supabase dashboard: captures table has new row
39. `production-audit` — capture appears in Supabase captures table on Vercel test
40. `quality-gate` — US-011 acceptance criteria checklist
41. `memory:memory-persist` — record CaptureBar operational
42. `self-improving-agent:remember` — log: sticky bottom in app router layout gotcha
43. `checkpoint` — save after capture bar confirmed working
44. `save-session` — record state
45. `update-docs` — document capture bar in components/shared README
46. `hooks:post-task` — run grep checks after CSS written
47. `refactor-clean` — CaptureBar must be in layout, not duplicated in each view
48. `tech-debt-tracker` — voice: Web Speech API stub, full transcription is Sprint 6
49. `react-performance` — CaptureBar rerenders: only on input change, not on route change
50. `agile-product-owner` — US-011 scope: text + voice + camera icons; voice is basic Web Speech

### SCOPE
**BUILD:**
- `/src/components/shared/CaptureBar.tsx` — full-width sticky bottom pill input
  - Text input (pill shaped, border-radius 99px)
  - Three icon buttons: voice (mic), camera (photo), send (arrow)
  - 28px circles, 1px border var(--line), single Tabler icon at 14px each
  - Submit: POST /api/ingest → input clears → inline "Captured" text → fades after 1.5s
  - Voice: Web Speech API (basic, hold to record, show transcription, confirm send)
  - Camera: stub (shows "Coming soon" text — full impl Sprint 6)
- `/src/hooks/useCapture.ts` — manages input state, submit logic, feedback state
- `/src/app/api/ingest/route.ts` — POST handler: text content, AI auto-tag, write to captures
  Auto-tag prompt: assign subject_tag, content_type (note/formula/problem/idea), topic_tag
- Add CaptureBar to `(app)/layout.tsx` — mounted on every view

**DO NOT BUILD:**
- Full voice transcription pipeline (Sprint 6)
- Photo AI text extraction (Sprint 6 / P23)
- PDF upload (Sprint 6)
- Full ingest pipeline with error table updates (P16)

### EXECUTION STEPS
```
Step 1: /plan — CaptureBar as layout component, hook for logic, route for persistence.
Step 2: Install @tabler/icons-react for icon buttons.
Step 3: Write useCapture.ts hook — state: inputText, isSubmitting, showConfirm.
        submit(): POST /api/ingest, clear input, set showConfirm=true, timeout 1.5s reset.
Step 4: Write CaptureBar.tsx — pill input + 3 icon buttons.
        CSS: sticky bottom, border-top 1px var(--line), bg var(--cream), full width.
        Input: border 1px var(--line2), border-radius 99px, padding 8px 16px.
        Confirm text: "Captured" appears below bar, opacity transition 150ms, disappears 1.5s.
Step 5: Write /api/ingest/route.ts — POST handler.
        Accepts: { content: string, type?: string, source_type: 'quick_type' }
        Calls AI router with auto-tag prompt: "Assign subject_tag, content_type, topic_tag to: [content]"
        Writes to captures table via service client.
        Returns: { success: true, data: { id: uuid }, error: null }
Step 6: Add CaptureBar to (app)/layout.tsx below the main content area.
Step 7: Invoke /tdd — write test: submit text → captures table has new row.
Step 8: Invoke /security-review — verify content sanitized before DB write.
Step 9: npm run dev — test: type text, submit, verify confirm fade, check Supabase captures.
Step 10: Voice button: implement basic Web Speech API (SpeechRecognition).
         Hold to record, release to transcribe, show transcription in input field, user confirms.
Step 11: Camera button: show "Photo capture coming in Sprint 6" inline text temporarily.
Step 12: Deploy to Vercel. Test capture on live URL. Verify row in Supabase.
Step 13: Invoke /verify — capture bar visible on all 5 views, sticky at bottom.
Step 14: Run grep checks on CaptureBar.tsx.
Step 15: Commit: feat: add Quick Capture Bar with /api/ingest route
Step 16: Update MEMORY.md — CaptureBar operational, captures table being written.
```

### FILES TO CREATE / MODIFY
```
src/
├── components/shared/
│   └── CaptureBar.tsx              ← pill input + 3 icon buttons + confirm feedback
├── hooks/
│   └── useCapture.ts               ← submit logic, feedback state
├── app/
│   ├── (app)/
│   │   └── layout.tsx              ← MODIFIED: CaptureBar added
│   └── api/
│       └── ingest/
│           └── route.ts            ← POST /api/ingest (text + AI auto-tag)
```

### EMBEDDED CONSTRAINTS
```css
/* CaptureBar — from ui-ux-principles.md §4.7 */
.capture-bar {
  position: sticky; bottom: 0; width: 100%;
  padding: 12px 24px 16px;
  background: var(--cream);
  border-top: 1px solid var(--line);
}
.capture-input {
  border: 1px solid var(--line2);
  border-radius: 99px;   /* pill — invitation, not form field */
  padding: 8px 16px;
  font-size: 14px;
  font-family: 'Newsreader', serif;
  background: var(--cream);
  color: var(--ink);
}
/* Icon buttons: 28px × 28px circle, border-radius 50%, 1px solid var(--line) */
/* Tabler icons at 14px — mic, camera (photo), send (arrow-right) */
/* Confirm text: --ink3, 12px italic, fades in 150ms, auto-removes at 1.5s */
```

### ACCEPTANCE CRITERIA (US-011)
- [ ] Pill shape: border-radius 99px on input
- [ ] CaptureBar present and visible on ALL 5 views
- [ ] Three icon buttons: voice, camera, send (28px circles, 1px border, Tabler icons)
- [ ] Submit → POST /api/ingest → input clears → "Captured" fade (150ms) → disappears 1.5s
- [ ] Successful capture: row appears in Supabase captures table
- [ ] Voice: opens mic, shows transcription before send — never auto-sends
- [ ] No modal on submit — inline feedback only

### REVIEW GATE
```
Design: [ ] Input border-radius is 99px (pill, not rectangle)
        [ ] CaptureBar visible on all 5 views (navigate and verify each)
        [ ] No box-shadow on capture bar or input
        [ ] Icon buttons: 28px circles, correct icons
        [ ] "Captured" text fades inline — not a toast, not a modal
Code:   [ ] CaptureBar uses layout.tsx — NOT copied into each view
        [ ] useCapture hook separates logic from UI
        [ ] /api/ingest returns { success, data, error } envelope
Security: [ ] Content sanitized before DB insert
          [ ] /api/ingest checks auth session before writing
          [ ] No user content logged to console
```

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# CaptureBar Status
- P06 COMPLETE: CaptureBar mounted in (app)/layout.tsx
- /api/ingest: accepts text, AI auto-tags, writes to captures
- Voice: basic Web Speech API (SpeechRecognition)
- Camera: stub (full impl Sprint 6 / P23)
- Sprint 2 progress: layout ✓, capture ✓, brief/tasks/textbooks/pomodoro next
---
```

### HANDOFF STATE
- CaptureBar sticky bottom on all 5 views
- Text capture → Supabase captures table — working on Vercel
- /api/ingest processes text captures with AI tagging
- Voice basic (Web Speech API), camera stub
- Ready for Today View components: P07 (Brief), P08 (Tasks), P09 (Textbook bars), P10 (Pomodoro)

---

══════════════════════════════════════════════════════════════════════
## PROMPT P07 — AI DAILY BRIEF
**Sprint 2 | WBS 2.2 | US-004 | Phase Gate 2 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md US-004 (AI Daily Brief — ALL acceptance criteria)
   READ ROADMAP.md §12.3 (Per-Feature Prompt Strategy — Daily Brief row)
   READ ROADMAP.md §12.2 (Context Assembler — what gets injected)
   READ ROADMAP.md §9 Phase Gate 2 (brief criterion: "Generates from real Supabase data")

2. READ ui-ux-principles.md §5.3 (Loading States — skeleton block, NOT spinner)
   READ ui-ux-principles.md §2.2 (Type scale — AI brief: 14px weight 300 italic --ink)
   READ ui-ux-principles.md §8.2 (Feedback — AI brief loading row)
   READ ui-ux-principles.md §10.2 (Empty States — brief empty state)

3. READ principles.md §10 Mistake 16 (AI Prompt Hallucination — brief must cite DB data)
   READ principles.md §5 Law 15 (Provider never user-facing)
   READ principles.md §8 Token Economy (context assembler limits)

4. READ MEMORY.md — confirm Phase Gate 1 CLOSED, P05+P06 complete
```

### COLD START VERIFICATION
- [ ] What is the exact brief prompt directive from ROADMAP §12.3?
- [ ] What CSS spec does the AI brief text use (size/weight/style/color)?
- [ ] What shows while brief is loading — spinner or skeleton?
- [ ] What does "drift detection" mean in the brief context?
- [ ] How many lines does the skeleton block show?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `prompt-engineer-toolkit` — design the daily brief prompt per §12.3
3. `prompt-optimizer` — refine brief prompt: 2-4 sentences, detect drift, surface danger
4. `context-engine` — context assembly specifically for /api/brief
5. `token-budget-advisor` — brief context: goals + sessions last 7 days + errors + captures
6. `ai-first-engineering` — AI-native patterns: loading skeleton, graceful degradation
7. `claude-api` — provider-agnostic API integration (Gemini Flash primary)
8. `cost-aware-llm-pipeline` — brief fires on every app open — token cost per call
9. `rag-architect` — retrieval: which session + error data is most relevant for brief
10. `iterative-retrieval` — optimize: brief should use compressed context, not full assembly
11. `react-patterns` — async data fetch in Next.js 14 app router (Server Component vs useEffect)
12. `nextjs-turbopack` — Server Action or API route for brief — which pattern fits
13. `frontend-patterns` — brief component: loading state → loaded state → error state
14. `frontend-design-direction` — brief text: italic Newsreader 14px 300 weight --ink
15. `motion-patterns` — skeleton: pulse 1.5s ease-in-out (--t-skeleton token)
16. `make-interfaces-feel-better` — skeleton block at correct width (not full-width)
17. `ui-design-system` — skeleton uses --cream2/--cream3 gradient (from §5.3)
18. `react-testing` — unit test: brief component renders skeleton while loading
19. `/tdd` — test: /api/brief returns object with `brief` string field
20. `tdd-guide` — test: brief mentions specific goal from seed data
21. `e2e-testing` — Playwright: open /today → skeleton appears → brief text loads
22. `pw:generate` — generate brief loading E2E test
23. `eval-harness` — evaluate brief quality: does it mention missed sessions?
24. `ai-regression-testing` — baseline brief response quality check
25. `benchmark` — measure: brief generation time (target < 2s on Gemini)
26. `latency-critical-systems` — Phase Gate criterion: brief < 2s on Vercel cold start
27. `error-handling` — brief fail: show generic "Unable to load brief" in --ink3 italic
28. `backend-patterns` — /api/brief: full implementation with real context + real prompt
29. `senior-backend` — brief: fire on page load, cache per session (don't re-fire on nav)
30. `content-hash-cache-pattern` — cache brief for current session (sessionStorage)
31. `security-review` — brief prompt: no user-identifying data in error messages
32. `security-reviewer` (agent) — review /api/brief full implementation
33. `/code-review` — after writing BriefPanel + /api/brief
34. `code-reviewer` (agent) — review both
35. `typescript-reviewer` (agent) — BriefPanel typed props, BriefResponse type
36. `decision-logger` — log: why session-cached brief (avoid re-firing on tab switch)
37. `architecture-decision-records` — ADR-006: brief caching strategy
38. `git-workflow` — commit: feat: add AI Daily Brief component and /api/brief route
39. `/verify` — open Vercel /today, verify skeleton appears then brief text loads
40. `verify` — verify brief mentions one of the 4 seeded goals by name
41. `production-audit` — Phase Gate 2 brief criterion check
42. `quality-gate` — US-004 acceptance criteria all checked
43. `self-improving-agent:remember` — log: Gemini brief generation latency observed
44. `prompt-archaeology` (§20) — save brief prompt to /docs/prompts/brief-prompt-v1.md
45. `memory:memory-persist` — record brief operational
46. `checkpoint` — save after brief confirmed on Vercel
47. `save-session` — record state
48. `update-docs` — /docs/prompts/brief-prompt-v1.md created
49. `hooks:post-task` — grep check after CSS written
50. `agile-product-owner` — US-004 all AC checked before moving to P08

### SCOPE
**BUILD:**
- `/src/components/today/BriefPanel.tsx` — displays brief text or skeleton
- Full `/api/brief/route.ts` — replace stub with real context + real brief prompt
- Brief prompt per ROADMAP §12.3: "In 2-4 sentences, plain language. Detect drift.
  Surface danger topics. Flag ML if >5 days missed. Adjust today's tasks if needed."
- Session caching: brief stored in sessionStorage, only re-fetches on new session
- `/docs/prompts/brief-prompt-v1.md` — prompt archaeology entry

**DO NOT BUILD:**
- Task list that brief adjusts (P08)
- Confusion map that danger topics feed (P12)
- Any other Today View component

### EXECUTION STEPS
```
Step 1: /plan — brief component architecture, caching strategy, prompt design.
Step 2: Write full brief prompt per §12.3. Test it manually against seed data.
        Must mention: A Level Pure Maths (active), Mitchell ML (5 days missed → amber flag).
Step 3: Update /api/brief/route.ts — replace stub with real context assembly + brief prompt.
        Context: goals (active only), sessions (last 7 days), errors (top 10 by freq),
        captures (last 7 days — brief window shorter than full context).
Step 4: Write BriefPanel.tsx:
        - Loading state: skeleton (two lines, --cream2/--cream3 gradient, 1.5s pulse)
        - Loaded state: brief text (14px weight 300 italic --ink)
        - Error state: "Unable to load your brief." (--ink3 italic 14px)
        - Fetch on mount, check sessionStorage first.
Step 5: Add BriefPanel to today/page.tsx left column (top of left column).
Step 6: Invoke /tdd — test: brief mentions "Mitchell" or "ML" when 5 days missed.
Step 7: Manual test: npm run dev → /today → verify skeleton → verify brief loads.
        Check: brief is 2-4 sentences. Check: no provider name visible anywhere.
Step 8: Deploy to Vercel. Test on live URL with real seed data.
        Time the response: must be < 2s on Gemini (Phase Gate 2 criterion).
Step 9: Invoke /verify — confirm brief renders italic Newsreader 14px 300 weight.
Step 10: Save prompt to /docs/prompts/brief-prompt-v1.md (§20 Prompt Archaeology format).
Step 11: Commit: feat: add AI Daily Brief with skeleton loading and session cache
Step 12: Update MEMORY.md.
```

### FILES TO CREATE / MODIFY
```
src/
├── components/today/
│   └── BriefPanel.tsx              ← skeleton + brief text + error state
└── app/api/brief/
    └── route.ts                    ← UPDATED: real context + real brief prompt
docs/prompts/
    └── brief-prompt-v1.md          ← prompt archaeology entry
```

### EMBEDDED CONSTRAINTS
```css
/* Brief text — from ui-ux-principles.md §2.2 */
/* font-size: 14px; font-weight: 300; font-style: italic; color: var(--ink) */
/* Skeleton — from ui-ux-principles.md §5.3 */
/* background: linear-gradient(90deg, var(--cream2) 25%, var(--cream3) 50%, var(--cream2) 75%) */
/* background-size: 200% 100%; animation: skeleton-sweep 1.5s ease-in-out infinite */
/* height: 14px; border-radius: 4px; */
/* Two skeleton lines: first full width, second ~70% width */
```

### ACCEPTANCE CRITERIA (US-004)
- [ ] Brief generated on every fresh app open via POST /api/brief
- [ ] Context includes: goals + sessions (last 7 days) + errors + captures
- [ ] Brief detects ML goal missed >5 days (seed data: Mitchell is flagged amber)
- [ ] Brief shown in italic --ink at top of Today view
- [ ] Loading: skeleton text block (NOT spinner — verify in browser)
- [ ] Brief renders < 2s on Gemini (Vercel live, not localhost)
- [ ] Provider name never visible in UI or error message

### REVIEW GATE
```
Design: [ ] Brief text: 14px italic weight 300 --ink (verify in DevTools)
        [ ] Skeleton: gradient pulse (not spinner, not static gray box)
        [ ] Two skeleton lines, correct widths
        [ ] No box-shadow on BriefPanel
Code:   [ ] BriefPanel < 80 lines
        [ ] sessionStorage cache prevents re-fetch on nav tab switch
        [ ] Error state shows graceful message in --ink3
AI:     [ ] Brief mentions Mitchell/ML goal missed (seed data test)
        [ ] 2-4 sentences (no more, no less)
        [ ] Provider never in response
```

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Brief Status
- P07 COMPLETE: AI Daily Brief operational on Vercel
- Prompt saved: /docs/prompts/brief-prompt-v1.md
- Cache: sessionStorage — re-fetches on page refresh, not tab switch
- Phase Gate 2 brief criterion: PASS (confirmed < 2s)
- Sprint 2 progress: brief ✓, tasks/textbooks/pomodoro remaining
---
```

### HANDOFF STATE
- BriefPanel renders in Today view left column (top)
- Brief fires on app open, reads from real Supabase seed data
- Mitchell ML amber flag detected by brief
- Prompt saved to /docs/prompts/
- Ready for P08 (Task Checklist)

---

══════════════════════════════════════════════════════════════════════
## PROMPT P08 — TASK CHECKLIST
**Sprint 2 | WBS 2.3 | US-005 | Phase Gate 2 target**
**Estimated: 1.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.3 (Task Checkboxes — full CSS spec)
   READ ui-ux-principles.md §5.1 (Motion — task check: 150ms ease)
   READ ui-ux-principles.md §8.2 (Feedback — task check row)
   READ ui-ux-principles.md §8.3 (Confirmation Dialogs — NEVER for task check)

2. READ ROADMAP.md US-005 (Daily task checklist — ALL acceptance criteria)
   READ ROADMAP.md §5 (sessions table schema — what gets logged on check)
   READ ROADMAP.md §6 (/api/session route spec)

3. READ principles.md §10 Mistake 7 (Mutating Objects — use immutable state update)
   READ principles.md §10 Mistake 15 (No modals for routine actions — no confirm on check)
   READ principles.md §5 Law 7 (Never add unrequested features)

4. READ MEMORY.md — confirm P07 complete
```

### COLD START VERIFICATION
- [ ] What is the checkbox size and border-radius?
- [ ] What CSS changes on done state (3 things: circle, text color, text decoration)?
- [ ] What is the check animation duration?
- [ ] What gets logged to sessions table when a task is checked?
- [ ] What does §8.3 say about confirmation dialogs for task check?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — optimistic UI update for checkbox (no wait for API)
3. `nextjs-turbopack` — client component for interactive checkbox
4. `frontend-patterns` — task list component architecture
5. `frontend-design-direction` — circle checkbox (NOT square form checkbox)
6. `ui-design-system` — done state tokens: --ink fill, --ink4 text, --line2 strikethrough
7. `motion-patterns` — 150ms ease on check (var(--t-task) token)
8. `motion-ui` — binary state: empty → filled (no intermediate states)
9. `make-interfaces-feel-better` — check animation: instant, clean, satisfying
10. `accessibility` — checkbox: role="checkbox", aria-checked, keyboard Enter/Space toggle
11. `frontend-a11y` — touch target: full row is tappable (44px height minimum)
12. `coding-standards` — immutable state: never mutate tasks array, always return new array
13. `react-testing` — test: check task → done state CSS applied → POST /api/session called
14. `/tdd` — test: unchecked → checked → sessions table has new row
15. `tdd-guide` — TDD for check/uncheck with DB persistence
16. `e2e-testing` — Playwright: check task → refresh page → task still shows done
17. `pw:generate` — generate task check E2E test
18. `error-handling` — check API fail: revert optimistic update, show brief inline error
19. `backend-patterns` — /api/session: create session record with task info
20. `senior-backend` — optimistic update pattern: UI updates first, API second, revert on fail
21. `database-reviewer` (agent) — verify sessions insert matches schema exactly
22. `security-review` — /api/session: validate auth, sanitize task_title
23. `security-reviewer` (agent) — review session logging endpoint
24. `senior-frontend` — task data source: goals.roadmap current week daily_checklist
25. `postgres-patterns` — reading nested jsonb: goals.roadmap → current_month → current_week → daily_checklist
26. `context-engine` — how tasks feed into brief and confusion map (downstream)
27. `react-performance` — task list: each TaskRow is memoized, only re-renders when its done state changes
28. `/code-review` — after TaskRow + TaskList + /api/session
29. `code-reviewer` (agent) — review all
30. `typescript-reviewer` (agent) — Task type, SessionLog type
31. `decision-logger` — log: tasks sourced from goals.roadmap jsonb (not a separate tasks table)
32. `git-workflow` — commit: feat: add task checklist with session logging
33. `/verify` — check a task on Vercel, verify sessions table row in Supabase dashboard
34. `verify` — visual: circle fills --ink, text turns --ink4 + strikethrough, 150ms animation
35. `quality-gate` — US-005 AC checklist
36. `production-audit` — Phase Gate 2 tasks criterion: session logged to DB on check
37. `self-improving-agent:remember` — log: jsonb nested access for roadmap tasks
38. `memory:memory-persist` — task checklist operational
39. `checkpoint` — save
40. `save-session` — record state
41. `update-docs` — document TaskRow component
42. `hooks:post-task` — grep check after CSS
43. `tech-debt-tracker` — note: task completion persistence in jsonb vs sessions table
44. `refactor-clean` — TaskRow and TaskList must be separate files
45. `react-performance` — virtualize task list if it grows beyond 20 items (defer to v1.1)
46. `senior-fullstack` — session record links to goal via task_title + subject fields
47. `agile-product-owner` — US-005 all AC checked
48. `sprint-health` — Sprint 2: 2/4 core components done (brief + tasks)
49. `product-analytics` — note: session logging is foundation for confusion map + brief
50. `project-management` — Phase Gate 2 tasks criterion: confirm sessions table writes

### SCOPE
**BUILD:**
- `/src/components/today/TaskList.tsx` — container reads tasks from goals.roadmap
- `/src/components/today/TaskRow.tsx` — single task with circle checkbox
- `/src/app/api/session/route.ts` — POST /api/session: log task completion
- Task data: read from `goals` table, current goal's `roadmap.months[current_month].weeks[current_week].daily_checklist`

**DO NOT BUILD:**
- Goal hierarchy view (P14)
- Session analytics/charts
- Pomodoro session logging (P10 does that separately)

### EXECUTION STEPS
```
Step 1: /plan — task data source (jsonb), optimistic UI, session logging.
Step 2: Write /src/types/tasks.ts — Task interface: { id, title, subject, done, goalId }
Step 3: Write TaskRow.tsx:
        - 16px circle (border-radius 50%, 1px solid var(--line2))
        - Done state: background var(--ink), white 5px inner dot via ::after
        - Done text: color var(--ink4), text-decoration line-through var(--line2)
        - Row hover: background var(--cream2)
        - Subject tag: 10px italic --ink4 right-aligned
        - Animation: transition all var(--t-task) (150ms)
        - onClick: optimistic toggle, then POST /api/session
Step 4: Write TaskList.tsx — fetches active goal, extracts current week daily_checklist.
        Renders TaskRow for each. Handles empty state: "Nothing scheduled. Check goals."
Step 5: Write /api/session/route.ts:
        POST body: { task_title, subject, difficulty: 1, mode: 'standard', pomodoros: 0 }
        Writes to sessions table. Returns { success: true, data: { id }, error: null }.
Step 6: Add TaskList to today/page.tsx left column (below BriefPanel).
Step 7: /tdd — test: check task → POST /api/session called with correct task_title.
Step 8: /security-review — sanitize task_title before DB insert.
Step 9: Run dev. Check a task. Verify: circle fills, text strikes, sessions table row created.
Step 10: Deploy to Vercel. Verify on live URL with real seed data.
Step 11: /verify — visual check: 150ms animation visible, done state clear.
Step 12: Commit: feat: add task checklist with optimistic updates and session logging
Step 13: Update MEMORY.md.
```

### FILES TO CREATE / MODIFY
```
src/
├── types/
│   └── tasks.ts                    ← Task interface
├── components/today/
│   ├── TaskRow.tsx                 ← single task row with circle checkbox
│   └── TaskList.tsx                ← reads from goals.roadmap, renders rows
└── app/api/session/
    └── route.ts                    ← POST /api/session
```

### EMBEDDED CONSTRAINTS
```css
/* TaskRow — from ui-ux-principles.md §4.3 */
/* .checkbox: width 16px, height 16px, border-radius 50%, border 1px solid var(--line2) */
/* .checkbox.done: background var(--ink), border-color var(--ink) */
/* .checkbox.done::after: width 5px, height 5px, border-radius 50%, background white */
/* .task-label.done: color var(--ink4), text-decoration line-through */
/* .task-row: transition all var(--t-task) (150ms ease) */
/* .task-row:hover: background var(--cream2) */
/* .subject-tag: 10px italic var(--ink4), position absolute right */
/* NEVER: square checkbox, colored subject badges, confirmation modal on check */
```

### ACCEPTANCE CRITERIA (US-005)
- [ ] Tasks pulled from goals.roadmap current week
- [ ] 16px circle checkbox (border-radius 50%)
- [ ] Done state: fills --ink + white 5px dot + text --ink4 + strikethrough
- [ ] Animation: 150ms (not instant, not slow)
- [ ] Done state persists to sessions table on check
- [ ] Row hover: background → --cream2

### REVIEW GATE
```
Design: [ ] Checkbox is CIRCLE (border-radius 50%) — NOT square
        [ ] Done: --ink fill, white inner dot, --ink4 text, strikethrough
        [ ] Row hover: cream2 background (no border change)
        [ ] Subject tag: 10px italic --ink4 right-aligned (NOT colored badge)
        [ ] Animation exactly 150ms
Code:   [ ] Optimistic update: UI changes BEFORE API responds
        [ ] On API fail: checkbox reverts to previous state
        [ ] TaskRow is pure component — no direct DB access
        [ ] sessions insert matches schema (all required fields present)
```

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Task Checklist Status
- P08 COMPLETE: TaskRow + TaskList + /api/session operational
- Task source: goals.roadmap jsonb → current_month → current_week → daily_checklist
- Session logging: every task check writes to sessions table
- Sprint 2 progress: brief ✓, tasks ✓, textbooks/pomodoro remaining
- Phase Gate 2 tasks criterion: PASS
---
```

---

══════════════════════════════════════════════════════════════════════
## PROMPT P09 — TEXTBOOK PROGRESS BARS
**Sprint 2 | WBS 2.4 | US-006 | Phase Gate 2 target**
**Estimated: 1hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.4 (Progress Bars — full CSS spec, especially 1px height rule)
   READ ui-ux-principles.md §12.1 (Anti-Pattern — progress bar height > 1px forbidden)
   READ ui-ux-principles.md §2.2 (Type scale — label: 10px italic --ink4)

2. READ ROADMAP.md US-006 (Textbook progress bars — ALL acceptance criteria)
   READ ROADMAP.md §5 (textbooks table — current_page, total_pages, subject fields)
   READ ROADMAP.md §11.1 (Quality Gates — progress bar height: 1px)

3. READ principles.md §1 Review Gate (progress bar height check)
   READ principles.md §10 Mistake 10 (Hardcoded values — height must be CSS var or 1px literal)

4. READ MEMORY.md — confirm P08 complete
```

### COLD START VERIFICATION
- [ ] What is the EXACT height of progress bars in this design system?
- [ ] What color is the progress fill? Is it subject-color-coded?
- [ ] What is the subject accent marker (size, position, what it does)?
- [ ] What does tapping a progress bar do?
- [ ] What label format appears above the bar?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `ui-design-system` — progress bar: 1px height, --line2 track, --ink fill
3. `frontend-design-direction` — 1px is deliberate precision (not a constraint)
4. `react-patterns` — TextbookBar component, list rendering
5. `frontend-patterns` — progress bar as presentational component
6. `motion-patterns` — bar fill: transition width var(--t-progress) (300ms)
7. `make-interfaces-feel-better` — 2px subject accent: the ONLY per-subject color
8. `accessibility` — progress bar: role="progressbar", aria-valuenow, aria-valuemax
9. `frontend-a11y` — tap target: full row must be tappable (navigates to Textbooks)
10. `coding-standards` — TextbookBar.tsx < 50 lines, pure presentational
11. `react-testing` — test: bar width matches (current_page/total_pages)*100%
12. `/tdd` — test: 2 textbooks from seed → 2 bars rendered
13. `tdd-guide` — test: clicking bar navigates to /textbooks
14. `e2e-testing` — Playwright: verify bar height is 1px in computed styles
15. `pw:generate` — generate progress bar visual regression test
16. `postgres-patterns` — read active textbooks: WHERE active_from <= now()
17. `backend-patterns` — GET /api/textbooks returns active textbooks list
18. `senior-frontend` — link to /textbooks on bar click
19. `react-performance` — TextbookList: static data, no re-renders needed
20. `/code-review` — after writing TextbookBar + TextbookList
21. `code-reviewer` (agent) — verify 1px height, no hardcoded hex
22. `typescript-reviewer` (agent) — Textbook type from database.ts
23. `security-review` — GET /api/textbooks: auth check
24. `git-workflow` — commit: feat: add textbook progress bars to Today view
25. `/verify` — Vercel: verify bars are 1px height (browser DevTools)
26. `verify` — check: 2 bars from seed data visible, correct percentages
27. `quality-gate` — US-006 + §11.1 progress bar height check
28. `production-audit` — Phase Gate 2: progress bars 1px on Vercel
29. `self-improving-agent:remember` — log: always check 1px height in DevTools (easy to miss)
30. `memory:memory-persist` — textbook bars operational
31. `checkpoint` — save
32. `save-session` — record state
33. `update-docs` — document TextbookBar component
34. `hooks:post-task` — grep check: no hardcoded height > 1px in progress bars
35. `plankton-code-quality` — zero violations: no height > 1px on any bar
36. `refactor-clean` — subject accent color: must be in a map/config, not hardcoded per subject
37. `tech-debt-tracker` — note: subject colors for accent are the only non-token colors allowed
38. `agile-product-owner` — US-006 all AC checked
39. `sprint-health` — Sprint 2: 3/4 components done
40. `decision-logger` — log: why 1px bars (precision signal per ui-ux-principles §4.4)
41. `react-patterns` — subject accent as CSS custom property per subject (avoid inline style)
42. `frontend-a11y` — color: progress bar has text label (not color-only communication)
43. `coding-standards` — subject accent colors defined in a constants file
44. `database-reviewer` (agent) — verify textbooks query uses correct fields
45. `senior-backend` — textbooks route: include only active books (active_from <= today)
46. `observability-designer` — note: textbook page updates tracked in sessions table
47. `performance-optimizer` — textbook data: cache for session (rarely changes)
48. `product-analytics` — progress bars are a key engagement signal
49. `simplify` — TextbookBar should be ~30 lines — keep it minimal
50. `project-management` — Phase Gate 2 checklist: progress bars 1px confirmed

### SCOPE
**BUILD:**
- `/src/components/today/TextbookList.tsx` — reads active textbooks, renders TextbookBar per book
- `/src/components/today/TextbookBar.tsx` — 1px bar + label + subject accent + tap navigation
- Subject accent color map in `/src/utils/subjectColors.ts`

**DO NOT BUILD:**
- Full Textbooks view (P21)
- Textbook registration form (P21)
- Page update interaction (P21)

### EXECUTION STEPS
```
Step 1: /plan — bar component, data source, subject accent.
Step 2: Write /src/utils/subjectColors.ts — map: { 'maths': '#color', 'physics': '#color', ... }
        Note: these ARE hardcoded per subject (only allowed exception per ui-ux §4.4)
        Keep to 4 subjects max for v1.
Step 3: Write TextbookBar.tsx:
        - 2px vertical accent left marker (color from subjectColors map)
        - Row layout: accent | label-group (title + page count) | bar area | percentage label
        - Progress bar: height 1px, track var(--line2), fill var(--ink), transition 300ms
        - Percentage label: 10px italic --ink4 right-aligned
        - Page count: "p.47 / 120" in 10px italic --ink4
        - Tap → navigate to /textbooks (Next.js Link)
Step 4: Write TextbookList.tsx — fetch active textbooks from Supabase, map to TextbookBar.
        Use service client on server component, or fetch from /api/textbooks.
Step 5: Add TextbookList to today/page.tsx left column (below TaskList).
Step 6: /tdd — test: bar width = (current_page / total_pages) * 100 + '%'
Step 7: Verify in DevTools: computed height of progress bar = 1px.
Step 8: /verify — Vercel: 2 bars visible (seed textbooks), correct percentages.
Step 9: grep check: grep -r "height: [2-9]" ./src/components — must return 0 on bars.
Step 10: Commit: feat: add textbook progress bars to Today view
Step 11: Update MEMORY.md.
```

### EMBEDDED CONSTRAINTS
```css
/* TextbookBar — from ui-ux-principles.md §4.4 */
/* .progress-track: height 1px (EXACT — not 2px, not 4px, not 8px) */
/* .progress-fill: height 1px, background var(--ink), transition width 300ms */
/* .progress-label: font-size 10px, italic, color var(--ink4), text-align right */
/* .subject-accent: width 2px, border-radius 1px — ONLY per-subject color in UI */
/* NO color-coding of bar fills — all bars are var(--ink) */
/* grep check: grep "height: [2-9]px" = 0 results on any progress bar */
```

### ACCEPTANCE CRITERIA (US-006)
- [ ] 1 bar per active textbook (2 from seed data)
- [ ] Height: 1px exactly (verify in browser DevTools computed styles)
- [ ] Track: --line2, fill: --ink (no subject color-coding on bars)
- [ ] Percentage label: 10px italic --ink4 right-aligned above bar
- [ ] 2px subject accent on left of row
- [ ] Page count "p.X / Y" visible
- [ ] Tap → navigates to /textbooks

---

══════════════════════════════════════════════════════════════════════
## PROMPT P10 — POMODORO SVG RING
**Sprint 2 | WBS 2.5 | US-007 | Phase Gate 2 target (ring + session POST)**
**Estimated: 2.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.5 (Pomodoro SVG Ring — full spec including SVG code)
   READ ui-ux-principles.md §5.1 (Motion — Pomodoro ring: 1s linear)
   READ ui-ux-principles.md §7.5 (Study Flow Protection — ring stays visible during session)
   READ ui-ux-principles.md §8.2 (Feedback — session complete: dots update)

2. READ ROADMAP.md US-007 (Pomodoro ring — ALL acceptance criteria, especially SVG spec)
   READ ROADMAP.md §12.3 (Prompt strategy — struggle/flow mode toggle)
   READ ROADMAP.md §6 (/api/session route — already built in P08, just POST on complete)

3. READ principles.md §10 Mistake 4 (Not verifying outputs — test the full 25min cycle)
   READ principles.md §10 Mistake 21 (Over-engineering — no full struggle/flow impl, Sprint 5+)

4. READ MEMORY.md — confirm P09 complete, session route already built in P08
```

### COLD START VERIFICATION
- [ ] What is the SVG circle radius and what is the circumference (dasharray value)?
- [ ] What does stroke-dashoffset animate with and at what duration?
- [ ] What are the session dot states (3 states with colors)?
- [ ] What gets POSTed to /api/session on Pomodoro complete?
- [ ] What does the phase label say during focus vs break?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `motion-advanced` — SVG stroke-dashoffset animation (most complex animation in app)
3. `motion-foundations` — 1s linear transition: clock-like, continuous
4. `motion-patterns` — stroke-dashoffset: CSS transition not JS requestAnimationFrame
5. `motion-ui` — ring is the only 1s animation — all others are 80-300ms
6. `react-patterns` — usePomodoroTimer custom hook: all timer logic extracted
7. `frontend-patterns` — SVG component as pure presentational, hook drives state
8. `react-performance` — timer: useInterval not setInterval directly, cleanup on unmount
9. `nextjs-turbopack` — client component with useEffect for timer
10. `coding-standards` — usePomodoroTimer.ts < 80 lines, PomodoroRing.tsx < 60 lines
11. `make-interfaces-feel-better` — ring should feel like a real clock, not an animation
12. `frontend-design-direction` — 2px stroke, --line track, --ink progress, no color change
13. `ui-design-system` — session dots: 5px circles, 3 states (--line2/--ink2/--ink)
14. `accessibility` — timer: aria-live region for time remaining, role="timer"
15. `frontend-a11y` — start/pause button: 44px touch target
16. `motion-patterns` — start button: no animation on click (instant state change)
17. `/tdd` — test: timer counts down from 1500 (25 * 60), fires complete at 0
18. `tdd-guide` — TDD for timer hook: mock setInterval
19. `react-testing` — test: PomodoroRing renders correct SVG at 50% progress
20. `e2e-testing` — Playwright: fast-forward timer mock, verify POST /api/session fires
21. `pw:generate` — generate timer E2E test
22. `senior-frontend` — SVG viewBox math: r=54, circumference = 2π×54 = 339.292
23. `benchmark` — timer accuracy: verify 1500 ticks = 25 minutes (no drift)
24. `latency-critical-systems` — ring must update every 1s without jank (no dropped frames)
25. `react-performance` — PomodoroRing is pure: only re-renders when offset changes
26. `error-handling` — /api/session POST fail on complete: retry once, then log error inline
27. `backend-patterns` — /api/session: already built in P08, Pomodoro adds pomodoros:1 field
28. `senior-backend` — session POST on complete includes: task, pomodoros, difficulty, duration
29. `database-reviewer` (agent) — verify session insert on complete has all required fields
30. `security-review` — /api/session: auth check, no timer manipulation from client
31. `security-reviewer` (agent) — review timer + session POST
32. `/code-review` — after usePomodoroTimer + PomodoroRing
33. `code-reviewer` (agent) — review timer hook for memory leaks
34. `typescript-reviewer` (agent) — typed PomodoroState, TimerPhase union type
35. `decision-logger` — log: CSS transition (not JS) for ring animation — why
36. `architecture-decision-records` — ADR-007: SVG ring vs CSS border-radius ring
37. `ui-demo` — demo full 25min cycle (or 5s mock) before committing
38. `browser-qa` — verify ring renders correctly in Chrome + Safari
39. `git-workflow` — commit: feat: add Pomodoro SVG ring with session logging on complete
40. `/verify` — Vercel: start timer, watch ring sweep, complete session, check sessions table
41. `verify` — visual: ring sweeps clockwise from 12 o'clock, dots update on complete
42. `quality-gate` — US-007 all AC checked
43. `production-audit` — Phase Gate 2: Pomodoro ring sweeps, session POSTed
44. `self-improving-agent:remember` — log: SVG dashoffset formula, any gotchas
45. `prompt-archaeology` (§20) — note: struggle/flow mode deferred to Sprint 5 per §21
46. `memory:memory-persist` — Pomodoro operational
47. `checkpoint` — save
48. `save-session` — record state
49. `agile-product-owner` — US-007 all AC: ring ✓, timer ✓, dots ✓, session POST ✓
50. `project-management` — Phase Gate 2 ALL criteria: confirm all 5 items met, gate CLOSES

### SCOPE
**BUILD:**
- `/src/hooks/usePomodoroTimer.ts` — all timer logic: countdown, phase toggle, session tracking
- `/src/components/today/PomodoroRing.tsx` — SVG ring + timer text + phase label + dots
- Struggle/Flow toggle: renders UI toggle (UI only — mode field logged in session, no behavior change yet)
- On complete: POST /api/session with pomodoros:1, task from active task, duration:1500
- Session dots: up to 4 dots, updates after each complete

**DO NOT BUILD:**
- Full struggle/flow behavior adjustment (Sprint 5+)
- Primer (P11)
- Pre-session AI call (P11)

### EXECUTION STEPS
```
Step 1: /plan — SVG math, timer hook architecture, session logging on complete.
Step 2: Write /src/types/timer.ts — TimerPhase: 'focus'|'break', PomodoroState interface.
Step 3: Write usePomodoroTimer.ts hook:
        - State: timeRemaining (seconds), phase, isRunning, sessionCount
        - startTimer(), pauseTimer(), resetTimer()
        - useInterval: decrements timeRemaining each second when isRunning
        - On timeRemaining reaches 0: toggle phase, increment sessionCount, fire onComplete
        - onComplete callback: POST /api/session
Step 4: Write PomodoroRing.tsx:
        SVG: viewBox="0 0 120 120"
        Track circle: cx=60 cy=60 r=54, stroke var(--line), strokeWidth=2
        Progress circle: same, stroke var(--ink), strokeWidth=2, strokeLinecap="round"
        strokeDasharray="339.292" (2π×54)
        strokeDashoffset: calculated from timeRemaining/totalTime
        transform="rotate(-90 60 60)" — starts at 12 o'clock
        style={{ transition: 'stroke-dashoffset 1s linear' }}
        Timer text: 22px weight 300 letter-spacing -1px
        Phase label: 10px italic --ink4 "focus" or "break" lowercase
        Session dots: 5px circles, 3 states
        Start/Pause button: 44×44px
        Struggle/Flow toggle: simple UI toggle below ring (logs mode to session)
Step 5: Add PomodoroRing to today/page.tsx right column (top of right panel).
Step 6: /tdd — mock useInterval, test complete fires at 0, POST /api/session called.
Step 7: Manual fast-forward test: set timer to 5s, start, let complete, verify session row.
Step 8: /verify on Vercel: ring sweeps correctly, session dots update after complete.
Step 9: Phase Gate 2 check: ring sweeps ✓, session POSTed ✓.
Step 10: Commit: feat: add Pomodoro SVG ring timer with session logging
Step 11: Update MEMORY.md — Phase Gate 2 ALL criteria: PASS. Gate CLOSED. Sprint 3 begins.
```

### EMBEDDED CONSTRAINTS
```jsx
/* PomodoroRing SVG — from ui-ux-principles.md §4.5 */
// strokeDasharray = 2 * Math.PI * 54 = 339.292
// strokeDashoffset = dasharray * (1 - timeRemaining/totalSeconds)
// transform="rotate(-90 60 60)" — 12 o'clock start
// style={{ transition: 'stroke-dashoffset 1s linear' }} — MUST be 1s linear
// timer text: fontSize=22, fontWeight=300, letterSpacing=-1 — tabular-nums
// phase label: fontSize=10, fontStyle=italic, fill=var(--ink4)
// NEVER: CSS border-radius ring, requestAnimationFrame for animation,
//        color change on phases (always --ink), any non-1s transition on ring
```

### ACCEPTANCE CRITERIA (US-007)
- [ ] SVG circle, 2px stroke, --line track, --ink fill clockwise from 12 o'clock
- [ ] stroke-dashoffset animates: `transition: stroke-dashoffset 1s linear`
- [ ] Default: 25min focus / 5min break
- [ ] Timer: 22px / weight 300 / letter-spacing -1px
- [ ] Phase label: 10px italic --ink4 "focus" or "break" lowercase
- [ ] Session dots: 5px circles, 3 states
- [ ] On complete: POST /api/session with task, pages, problems, difficulty, duration, pomodoros

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Pomodoro Status
- P10 COMPLETE: SVG ring + timer + session logging operational
- SVG math: r=54, circumference=339.292
- Session logging: fires on complete with pomodoros:1
- Struggle/flow: UI toggle only (behavior deferred Sprint 5)
# Phase Gate 2 — COMPLETE
Date: [today]
Result: GO — all 5 criteria PASS
- Brief: PASS (P07) — generates from real Supabase data
- Tasks: PASS (P08) — session logged on check
- Progress bars: PASS (P09) — 1px height confirmed
- Pomodoro: PASS (P10) — SVG ring sweeps, session POSTed
- Design: PASS (ongoing grep checks)
# Sprint 3 — STARTED
Theme: Today View Complete
---
```

---

══════════════════════════════════════════════════════════════════════
## PROMPT P11 — PRE-SESSION PRIMER
**Sprint 3 | WBS 2.6 | US-008 | Phase Gate 3 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.9 (Pre-Session Primer — full spec with layout diagram)
   READ ui-ux-principles.md §9.2 (Modality — primer is NEVER modal, always inline)
   READ ui-ux-principles.md §2.2 (Type scale — primer formula, error, note typography)

2. READ ROADMAP.md US-008 (Pre-session primer — ALL acceptance criteria)
   READ ROADMAP.md §12.3 (Prompt strategy — Pre-session Primer row — CRITICAL: cite DB only)
   READ ROADMAP.md §9 Phase Gate 3 (primer criterion: "Pulls real last error + formula + own note")

3. READ principles.md §10 Mistake 16 (AI Prompt Hallucination — primer MUST cite exact DB records)
   READ principles.md §10 Mistake 5 (Not Using Skills — minimum 3 skills per session)
   READ principles.md §17 LAW-001 (Seed Before UI — verify errors table has seed data)

4. READ MEMORY.md — confirm Phase Gate 2 CLOSED, Sprint 3 started
```

### COLD START VERIFICATION
- [ ] What are the 3 elements in the primer and their exact typography specs?
- [ ] Where does the primer appear — modal, full screen, or inline?
- [ ] What does the primer show if no errors exist yet?
- [ ] What does the prompt directive say about where formula/error data must come from?
- [ ] What does "dismissible after 10s on repeat sessions" mean exactly?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `prompt-engineer-toolkit` — design primer prompt per §12.3 exactly
3. `prompt-optimizer` — primer prompt: 3 items only, strict DB citation, no invention
4. `context-engine` — primer context: textbooks.topic_map + errors + captures (targeted)
5. `token-budget-advisor` — primer is one AI call: lightweight, single topic focus
6. `ai-first-engineering` — primer: async load, non-blocking, doesn't delay session start
7. `rag-architect` — retrieval: last error for THIS topic, formula from THIS textbook chapter
8. `iterative-retrieval` — filter errors by current task's subject/topic
9. `react-patterns` — inline panel component, shown in right column
10. `frontend-patterns` — primer as conditional render (shown only before session start)
11. `frontend-design-direction` — element 1: monospace --cream3 bg, element 2: red italic 300
12. `ui-design-system` — primer box: no shadow, 1px border var(--line), 11px radius
13. `motion-patterns` — dismiss: fade out 150ms (var(--t-task)) — not a slide
14. `make-interfaces-feel-better` — primer feels like a helpful briefing, not an interruption
15. `accessibility` — primer: role="region" aria-label="Session Primer", dismiss keyboard accessible
16. `frontend-a11y` — dismiss button: 44×44px touch target
17. `senior-frontend` — dismiss logic: first time mandatory 10s, repeat sessions can dismiss early
18. `react-testing` — test: primer renders 3 elements from DB data, not generic text
19. `/tdd` — test: primer formula matches textbook chapter, error matches errors table
20. `tdd-guide` — test: empty errors state shows "No errors logged yet" (not empty/broken)
21. `e2e-testing` — Playwright: start session → primer appears → verify 3 elements populated
22. `pw:generate` — generate primer E2E test
23. `eval-harness` — evaluate: primer formula matches current topic (not hallucinated)
24. `ai-regression-testing` — baseline: primer never shows generic math formula
25. `security-review` — primer prompt explicitly says "use only: [error record], [capture record]"
26. `security-reviewer` (agent) — review primer API route
27. `backend-patterns` — /api/brief can serve primer OR create dedicated /api/primer route
28. `decision-logger` — log: primer uses its own lightweight context (not full context assembler)
29. `senior-backend` — primer fires on session start (Pomodoro start button click), not page load
30. `error-handling` — primer AI fail: show static fallback (topic name + "check your notes")
31. `/code-review` — after PrimerPanel + primer API logic
32. `code-reviewer` (agent) — review primer component
33. `typescript-reviewer` (agent) — PrimerData type: { formula, lastError, ownNote }
34. `git-workflow` — commit: feat: add pre-session primer with AI-retrieved study data
35. `/verify` — Vercel: start Pomodoro → primer appears with real error from seed data
36. `verify` — Phase Gate 3 criterion: primer pulls real last error + formula + own note
37. `quality-gate` — US-008 all AC checked
38. `production-audit` — Phase Gate 3 primer criterion
39. `prompt-archaeology` (§20) — save primer prompt to /docs/prompts/primer-prompt-v1.md
40. `self-improving-agent:remember` — log: primer hallucination prevention requires exact DB citations
41. `memory:memory-persist` — primer operational
42. `checkpoint` — save
43. `save-session` — record state
44. `update-docs` — /docs/prompts/primer-prompt-v1.md
45. `hooks:post-task` — grep check after CSS
46. `tech-debt-tracker` — note: primer topic detection uses task subject (not AI classification yet)
47. `agile-product-owner` — US-008 all AC: 3 elements ✓, inline ✓, real DB ✓, dismiss ✓
48. `react-performance` — primer: fetch fires only on Pomodoro start (not on every render)
49. `latency-critical-systems` — primer: async, non-blocking (session can start before primer loads)
50. `product-analytics` — primer shown count: log impression in sessions metadata

### SCOPE
**BUILD:**
- `/src/components/today/PrimerPanel.tsx` — inline right panel, 3-element layout
- Primer API logic in /api/brief (extend) or new `/src/app/api/primer/route.ts`
- Primer fires on Pomodoro start button click (wire to usePomodoroTimer)
- 3 elements: formula (monospace --cream3 bg) + last error (--red italic 300) + own note (--ink3 italic)
- Empty error state: "No errors logged yet." in --ink4
- Dismiss: mandatory 10s on first show, early on repeats
- `/docs/prompts/primer-prompt-v1.md` — prompt archaeology entry

**DO NOT BUILD:**
- Confusion map (P12)
- Any test simulator integration

### EXECUTION STEPS
```
Step 1: /plan — primer trigger (Pomodoro start), data sources, prompt design.
Step 2: Write primer prompt: "Return exactly 3 items as JSON:
        { formula: string, lastError: string, ownNote: string }
        formula: the key formula for [topic] from textbook chapter [chapter].
        lastError: the user's last error: [exact errors record].
        ownNote: one sentence from user's notes: [exact captures record].
        Use ONLY the provided data. Do not invent formulas or errors."
Step 3: Write /api/primer/route.ts (or extend /api/brief):
        POST { task_title, subject, topic } → returns { formula, lastError, ownNote }
        Reads: errors WHERE subject = task.subject ORDER BY flagged_at DESC LIMIT 1
        Reads: captures WHERE subject_tag = task.subject ORDER BY created_at DESC LIMIT 1
        Reads: textbooks WHERE subject = task.subject → topic_map → chapter formula
Step 4: Write PrimerPanel.tsx:
        Right panel inline (not modal, not full-screen).
        Element 1: monospace text, background var(--cream3), border-radius 7px, padding 8px
        Element 2: var(--red) italic weight 300 text
        Element 3: var(--ink3) italic text
        Dismiss: countdown 10s (first time), click anytime on repeat.
        Empty error: "No errors logged yet." in --ink4
Step 5: Wire to PomodoroRing: on start click → fire primer API → show PrimerPanel.
Step 6: /tdd — test: primer error matches last error in seed errors table.
Step 7: /security-review — primer prompt has explicit "use only provided data" instruction.
Step 8: Test on dev: start Pomodoro → primer appears → verify elements have real content.
Step 9: Verify seed data: errors table has Physics error → primer shows that error.
Step 10: Deploy to Vercel. /verify — Phase Gate 3 primer criterion: PASS.
Step 11: Save prompt to /docs/prompts/primer-prompt-v1.md.
Step 12: Commit: feat: add pre-session primer with anti-hallucination data citation
Step 13: Update MEMORY.md.
```

### EMBEDDED CONSTRAINTS
```
/* PrimerPanel — from ui-ux-principles.md §4.9 */
/* NEVER modal, NEVER full-screen — always inline right panel */
/* Element 1: font-family monospace, background var(--cream3), border-radius 7px */
/* Element 2: color var(--red), font-style italic, font-weight 300 */
/* Element 3: color var(--ink3), font-style italic */
/* Primer prompt MUST include: "Use ONLY the provided data. Do not invent." */
/* If no own note: element 3 shows "No notes for this topic yet." in --ink4 */
```

### ACCEPTANCE CRITERIA (US-008)
- [ ] Inline in right column (NEVER modal — verify)
- [ ] Element 1: key formula (monospace --cream3 bg)
- [ ] Element 2: last error in this topic (--red italic weight 300)
- [ ] Element 3: one line from own notes (--ink3 italic)
- [ ] Data: textbooks.topic_map + errors + captures
- [ ] One AI call per session start
- [ ] Dismissible: mandatory 10s first time, early on repeats
- [ ] If no errors: element 2 shows "No errors logged yet" in --ink4

---

══════════════════════════════════════════════════════════════════════
## PROMPT P12 — CONFUSION MAP 2×2
**Sprint 3 | WBS 2.7 | US-009 | Phase Gate 3 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.8 (Confusion Map Quadrants — full CSS spec)
   READ ui-ux-principles.md §10.3 (Empty State — confusion map shells)
   READ ui-ux-principles.md §1.4 (Color Usage — red/amber usage: map quadrants)

2. READ ROADMAP.md US-009 (Confusion map — ALL acceptance criteria)
   READ ROADMAP.md §12.2 (Context Assembler — confusion_map field in context)
   READ ROADMAP.md §9 Phase Gate 3 (confusion map criterion: populates from seed data)

3. READ principles.md §17 LAW-001 (Seed Before UI — seed data required before building this)
   READ principles.md §10 Mistake 20 (Not Seeding DB — verify seed errors present NOW)

4. READ MEMORY.md — confirm P11 complete, seed errors present in DB
```

### COLD START VERIFICATION
- [ ] What are the 4 quadrant names and their background colors (exact CSS)?
- [ ] What data sources determine which quadrant a topic goes in?
- [ ] When does the confusion map recalculate?
- [ ] What does the empty state look like (§10.3)?
- [ ] How does danger zone feed the test simulator?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — derived state: confusion map computed from sessions + errors
3. `frontend-design-direction` — flat fills only, no shadows, quadrant colors exact
4. `ui-design-system` — Danger: #FDF0EF bg, --red label; Watch: #FDF8EF bg, --amber label
5. `senior-frontend` — recalculation trigger: after session POST, error POST, test submit
6. `senior-data-engineer` — algorithm: coverage (from sessions) × confidence (from errors)
7. `postgres-patterns` — query: topics covered (sessions grouped by subject/topic), error frequency
8. `context-engine` — confusion_map is part of ContextPayload fed to every AI call
9. `react-performance` — map recalculates only when sessions or errors table changes
10. `rag-architect` — topic placement logic: danger = covered + many errors
11. `algorithm-design` — quadrant assignment: Safe (covered, few errors), Danger (covered, many errors),
    Watch (confident, not tested), Upcoming (not covered yet)
12. `frontend-patterns` — ConfusionMap: receives computed quadrant data as props
13. `make-interfaces-feel-better` — empty state: quadrant shells with labels (not blank screen)
14. `motion-patterns` — quadrant pill add/remove: 150ms (var(--t-task))
15. `accessibility` — map: role="region" aria-label="Confusion Map", topic pills have text
16. `react-testing` — test: 5 seed errors in Pure Maths → Pure Maths topics in Danger quadrant
17. `/tdd` — test: after logging session, confusion map recalculates
18. `tdd-guide` — test: empty state renders quadrant shells
19. `e2e-testing` — Playwright: verify seed errors produce Danger quadrant pills
20. `pw:generate` — generate confusion map E2E test
21. `observability-designer` — confusion map recalculation: log timing (should be < 200ms)
22. `performance-optimizer` — map computation: memoize with useMemo on sessions+errors dependency
23. `backend-patterns` — confusion map computed client-side or server-side API call?
24. `decision-logger` — log: confusion map computed server-side in /api/brief context assembler
25. `senior-backend` — extend context assembler to export confusion_map separately for Today view
26. `error-handling` — map API fail: show empty quadrant shells (graceful degradation)
27. `security-review` — confusion map data: no raw error text exposed in pills (topic only)
28. `/code-review` — after ConfusionMap + TopicPill
29. `code-reviewer` (agent) — review quadrant computation
30. `typescript-reviewer` (agent) — ConfusionMapData type, QuadrantType union
31. `git-workflow` — commit: feat: add confusion map with topic quadrant classification
32. `/verify` — Vercel: confusion map shows seed errors in Danger quadrant (Pure Maths topics)
33. `verify` — Phase Gate 3: confusion map populates from seed data (not placeholder)
34. `quality-gate` — US-009 all AC checked
35. `production-audit` — Phase Gate 3 confusion map criterion
36. `self-improving-agent:remember` — log: confusion map algorithm decisions
37. `tech-debt-tracker` — note: topic classification is naive (by subject) — improve in v1.1
38. `memory:memory-persist` — confusion map operational, danger zone feeds test sim
39. `checkpoint` — save
40. `save-session` — record state
41. `update-docs` — document confusion map algorithm
42. `hooks:post-task` — grep check after CSS
43. `product-analytics` — confusion map danger zone: key metric for study quality
44. `decision-logger` — log: why computed server-side (context assembler owns this)
45. `agile-product-owner` — US-009 all AC: 4 quadrants ✓, recalculates ✓, danger feeds test ✓
46. `sprint-health` — Sprint 3: 2/4 components done (primer + confusion map)
47. `refactor-clean` — confusion map algorithm in utils (not embedded in component)
48. `simplify` — TopicPill: ~20 lines max
49. `react-performance` — ConfusionMap: memoized, only re-renders when quadrant data changes
50. `project-management` — Phase Gate 3 confusion map criterion: PASS prep

### SCOPE
**BUILD:**
- `/src/components/today/ConfusionMap.tsx` — 2×2 grid, 4 quadrant cards
- `/src/components/today/TopicPill.tsx` — pill per topic in each quadrant
- `/src/utils/computeConfusionMap.ts` — algorithm: sessions + errors → 4 quadrants
- Extend context assembler to export confusion_map for use in test sim (P18)
- Empty state: quadrant shells with labels, no content

**DO NOT BUILD:**
- Test simulator weighting (P18 uses confusion map data)
- Calendar strip (P13)

### EXECUTION STEPS
```
Step 1: /plan — quadrant algorithm, data sources, recalculation triggers.
Step 2: Write computeConfusionMap.ts algorithm:
        Input: sessions[], errors[]
        Logic:
        - For each unique topic:
          covered = sessions.some(s => s.subject matches topic)
          errorCount = errors.filter(e => e.topic matches topic).length
        - Safe: covered=true, errorCount=0
        - Danger: covered=true, errorCount>=2
        - Watch: covered=false, errorCount=0 (topic in textbook but not yet studied)
        - Upcoming: not yet encountered
Step 3: Write TopicPill.tsx — pill: font-size 11px italic, padding 2px 8px, radius 99px.
        Receives: topic name, quadrant type → applies correct background color.
Step 4: Write ConfusionMap.tsx — 2×2 CSS grid.
        Quadrant cards: flat fills from §4.8 (no shadows, border 1px solid var(--line)).
        Labels: 10px uppercase letter-spaced --ink4/--red/--amber.
        Empty state: show quadrant shells with label only (§10.3).
Step 5: Add ConfusionMap to today/page.tsx right column (below PrimerPanel).
Step 6: Wire recalculation: after TaskRow check, after PomodoroRing complete (both write sessions).
Step 7: /tdd — test: seed 5 Pure Maths errors → Pure Maths topics in Danger quadrant.
Step 8: /verify on Vercel — seed errors produce visible Danger quadrant pills.
Step 9: Phase Gate 3 confusion map criterion: populates from seed data (not placeholder). PASS.
Step 10: Extend context assembler: add confusion_map to ContextPayload for AI calls.
Step 11: Commit: feat: add confusion map 2x2 with session+error driven quadrant classification
Step 12: Update MEMORY.md.
```

### EMBEDDED CONSTRAINTS
```css
/* ConfusionMap — from ui-ux-principles.md §4.8 */
/* .quadrant-safe: background var(--cream2) */
/* .quadrant-danger: background #FDF0EF */
/* .quadrant-watch: background #FDF8EF */
/* .quadrant-upcoming: background var(--cream2), opacity 0.6 */
/* Labels: 10px uppercase letter-spacing 0.07em */
/* Safe/Upcoming label: --ink4; Danger: --red; Watch: --amber */
/* TopicPill danger: background #F5D9D7, color var(--red) */
/* TopicPill watch: background #F5E8D0, color var(--amber) */
/* TopicPill safe: background var(--cream3), color var(--ink2) */
/* NO shadows on any quadrant card. Flat fills only. */
```

### ACCEPTANCE CRITERIA (US-009)
- [ ] 4 cards: Safe/Danger/Watch/Upcoming with correct flat bg colors
- [ ] Danger: #FDF0EF bg, --red label, topic pills in #F5D9D7
- [ ] Watch: #FDF8EF bg, --amber label, topic pills in #F5E8D0
- [ ] Seed 5 errors → danger zone has topics (Phase Gate 3 criterion)
- [ ] Recalculates after session complete, error flag, test submit
- [ ] Danger zone feeds test simulator (P18 will use this data)

---

══════════════════════════════════════════════════════════════════════
## PROMPT P13 — CALENDAR STRIP + EXAM COUNTDOWN
**Sprint 3 | WBS 2.8 | US-010 | Phase Gate 3 final**
**Estimated: 1.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §3.2 (Today View Grid — calendar goes in left column)
   READ ui-ux-principles.md §4.1 (Cards — countdown card spec)
   READ ui-ux-principles.md §2.2 (Type scale — countdown numbers: stat number spec)

2. READ ROADMAP.md US-010 (Calendar strip + exam countdown — ALL AC)
   READ ROADMAP.md §9 Phase Gate 3 (calendar criterion: current week dots accurate)
   READ ROADMAP.md §5 (goals table — exam_date or milestone field for countdown)

3. READ principles.md §10 Mistake 10 (no hardcoded dates — always from DB)
   READ principles.md §5 Law 1 (read spec before coding — confirm exam date in goals schema)

4. READ MEMORY.md — confirm P12 complete
```

### COLD START VERIFICATION
- [ ] What do the 3px calendar dots represent (3 states)?
- [ ] What does the countdown text format look like?
- [ ] Where does the exam date come from?
- [ ] When does the countdown recalculate?
- [ ] What is the card spec (radius, border, shadow rule)?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — CalendarStrip component, date computation utilities
3. `frontend-patterns` — presentational: CalendarStrip receives date array as props
4. `frontend-design-direction` — dots: 3px circles, 3 states (done/planned/rest)
5. `ui-design-system` — done dot: --ink, planned dot: --line2, rest: transparent
6. `make-interfaces-feel-better` — strip reads as week at a glance, not a calendar
7. `accessibility` — calendar: role="list", each day has aria-label with date + status
8. `senior-frontend` — date math: current week Monday-Sunday, dot state per day
9. `senior-data-engineer` — velocity: avg pages/sessions per day from last 7 sessions
10. `postgres-patterns` — query: sessions grouped by date for dot states
11. `react-testing` — test: today's dot is correct state
12. `/tdd` — test: countdown shows correct days remaining
13. `tdd-guide` — test: velocity calculation from seed sessions
14. `e2e-testing` — Playwright: countdown number decrements are correct
15. `pw:generate` — generate calendar E2E test
16. `coding-standards` — computeCalendarDots.ts util, computeExamCountdown.ts util
17. `performance-optimizer` — date calculations: memoize, computed once per day
18. `react-performance` — calendar strip: static render, no re-render mid-session
19. `error-handling` — no exam date in goals: show "No exam date set" in --ink4
20. `senior-backend` — goals schema: need exam_date or milestone_date field (check if seeded)
21. `database-reviewer` (agent) — verify goals seed has milestone/exam date field
22. `decision-logger` — log: if exam_date not in schema, derive from goals.roadmap months
23. `/code-review` — after CalendarStrip + ExamCountdown
24. `code-reviewer` (agent) — review date logic
25. `typescript-reviewer` (agent) — DayDot type, CalendarWeek type
26. `git-workflow` — commit: feat: add calendar strip and exam countdown to Today view
27. `/verify` — Vercel: current week shows today's dot as correct state
28. `verify` — Phase Gate 3 calendar criterion: current week dots accurate
29. `quality-gate` — Phase Gate 3 ALL criteria check
30. `production-audit` — Phase Gate 3 COMPLETE after this prompt
31. `self-improving-agent:remember` — log: date timezone handling (use UTC or local?)
32. `memory:memory-persist` — calendar operational, Phase Gate 3 closed
33. `checkpoint` — save
34. `save-session` — record state
35. `update-docs` — update MEMORY.md with Phase Gate 3 CLOSED
36. `hooks:post-task` — grep check
37. `tech-debt-tracker` — exam date: seeded manually, auto-set from Notion in v1.1
38. `agile-product-owner` — US-010 all AC: dots ✓, countdown ✓, velocity ✓
39. `sprint-health` — Sprint 3 complete: all 4 components done
40. `decision-logger` — log: velocity = avg sessions last 7 days × pages per session
41. `react-patterns` — ExamCountdown: separate component from CalendarStrip
42. `frontend-design-direction` — countdown: large stat number (18-40px weight 300)
43. `coding-standards` — date utils in /src/utils/dates.ts, not embedded in component
44. `simplify` — CalendarStrip: 7 dots, that's it — no interactivity in v1
45. `product-analytics` — countdown drives urgency: key feature for daily motivation
46. `security-review` — no user-supplied dates trusted without parsing
47. `agile-product-owner` — US-010 scope confirmed: strip + countdown + velocity estimate
48. `project-management` — Phase Gate 3: Core daily loop functional. Product is daily driver.
49. `sprint-health` — Sprint 4 planning: Goals + Ask AI + Ingest (parallel group)
50. `update-config` — no new permissions needed for date calculations

### SCOPE
**BUILD:**
- `/src/components/today/CalendarStrip.tsx` — 7-day week strip, 3px dots (done/planned/rest)
- `/src/components/today/ExamCountdown.tsx` — card with days remaining + velocity estimate
- `/src/utils/dates.ts` — date helpers: getWeekDays, getDotState, daysUntil
- `/src/utils/computeVelocity.ts` — avg topics/pages per day from sessions

**DO NOT BUILD:**
- Interactive calendar (just visual strip)
- Exam date entry form (seeded manually)
- Monthly calendar view

### EXECUTION STEPS
```
Step 1: /plan — date computation, dot states, velocity algorithm.
Step 2: Check: does goals seed data have an exam_date or milestone_date field?
        If not: add one to seed.sql for A Level Pure Maths (e.g., 6 months from now).
Step 3: Write /src/utils/dates.ts — getWeekDays(), getDotState(date, sessions[]).
        getDotState: 'done' if session exists for date, 'planned' if in future, 'rest' if past + no session.
Step 4: Write /src/utils/computeVelocity.ts — from sessions last 7 days: avg pages/day.
Step 5: Write CalendarStrip.tsx — 7 divs, each with date label and 3px dot.
        Dot states: done=--ink, planned=--line2, rest=transparent with --line2 border.
        Today's date highlighted: date label in --ink (others in --ink4).
Step 6: Write ExamCountdown.tsx — card (1px border, 11px radius, no shadow).
        Large number: days remaining (18-40px weight 300 --ink)
        Sub-text: "At current pace, Y topics unfinished. Daily load: Z pages." (12px italic --ink3)
Step 7: Add CalendarStrip + ExamCountdown to today/page.tsx left column (bottom).
Step 8: /tdd — test: today's dot = 'done' if session logged today.
Step 9: /verify on Vercel — current week visible, today's dot correct.
Step 10: Phase Gate 3 ALL criteria check:
         [ ] Primer pulls real last error ✓ (P11)
         [ ] Confusion map populates from seed ✓ (P12)
         [ ] Confusion map recalculates after session ✓ (P12)
         [ ] Capture bar submits to /api/ingest ✓ (P06)
         [ ] Calendar current week dots accurate ✓ (P13)
         Phase Gate 3: PASS → GO → Core daily loop functional.
Step 11: Commit: feat: add calendar strip and exam countdown to complete Today view
Step 12: Update MEMORY.md — Phase Gate 3 CLOSED. Sprint 3 COMPLETE. Sprint 4 BEGINS.
```

### EMBEDDED CONSTRAINTS
```css
/* Calendar dots — 3px × 3px circles */
/* done: background var(--ink) */
/* planned: background var(--line2) */
/* rest: background transparent, border 1px solid var(--line2) */
/* ExamCountdown card: border 1px solid var(--line), border-radius 11px, no shadow */
/* Countdown number: font-size 32px, font-weight 300, color var(--ink) */
/* Sub-text: font-size 12px, italic, color var(--ink3) */
```

### ACCEPTANCE CRITERIA (US-010)
- [ ] Calendar: current week, 3px dots per day (done/planned/rest)
- [ ] Countdown: "X days to mock. At current pace, Y topics unfinished. Daily load: Z pages."
- [ ] Calculated from exam date in goals + session velocity
- [ ] Updates after every session log

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Phase Gate 3 — COMPLETE
Date: [today]
Result: GO — all 5 criteria PASS
Today View is the core daily driver. Product is now functional for real sessions.
# Sprint 4 — STARTED
Theme: Goals + Ask AI + Ingest (parallel group)
Parallel agents possible: Goals (P14/P15) + Ask AI (P17) + Ingest full (P16)
---
```

---

══════════════════════════════════════════════════════════════════════
## PROMPT P14 — GOAL HIERARCHY UI
**Sprint 4 | WBS 3.1–3.4 | US-012 | Phase Gate 4 target**
**Estimated: 2.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.1 (Cards — expandable card spec)
   READ ui-ux-principles.md §6.4 (Expandable Sections — ↓/↑ arrow pattern)
   READ ui-ux-principles.md §5.1 (Motion — expand/collapse: 200ms ease-in-out)
   READ ui-ux-principles.md §8.3 (Confirmation Dialogs — never for inline check)

2. READ ROADMAP.md US-012 (4-level hierarchy — ALL acceptance criteria)
   READ ROADMAP.md §5 (goals table schema — roadmap jsonb structure)
   READ ROADMAP.md §6 (GET /api/goals route spec)
   READ ROADMAP.md §2.4 (Active Goals — 4 seeded goals with exact statuses)

3. READ principles.md §10 Mistake 3 (Too much at once — one level per component file)
   READ principles.md §10 Mistake 7 (Mutating Objects — roadmap jsonb is immutable)
   READ principles.md §12 (Modularity — MacroGoal, MonthRow, WeekRow, DailyItem = 4 files)

4. READ MEMORY.md — confirm Phase Gate 3 CLOSED, Sprint 4 started
```

### COLD START VERIFICATION
- [ ] What are the 4 hierarchy levels and their component names?
- [ ] What is the expand/collapse arrow pattern (icons + animation)?
- [ ] What does the locked goal look like visually?
- [ ] What 3 stats appear in the goal card header?
- [ ] What does the Spivak goal show differently from other goals?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — compound component pattern for 4-level hierarchy
3. `nextjs-turbopack` — server component for goal data fetch
4. `frontend-patterns` — recursive expandable component architecture
5. `frontend-design-direction` — expand arrow: 12px --ink3, row-level click
6. `ui-design-system` — locked goal: reduced opacity + lock icon or indicator
7. `motion-patterns` — height transition: 200ms ease-in-out (var(--t-expand))
8. `make-interfaces-feel-better` — expand feels spatial: content slides in, not pops
9. `accessibility` — expandable: aria-expanded, aria-controls, keyboard Enter/Space
10. `frontend-a11y` — all rows: 44px min touch target height
11. `coding-standards` — 4 separate files: MacroGoalCard, MonthRow, WeekRow, DailyCheckItem
12. `senior-frontend` — expand state persists in session (not DB — too granular)
13. `postgres-patterns` — goals.roadmap jsonb traversal: months[idx].weeks[idx].daily_checklist
14. `react-performance` — each level memoized: only re-renders when its data changes
15. `coding-standards` — immutable: never mutate roadmap jsonb — always return new tree
16. `api-design` — GET /api/goals: returns full goal with nested roadmap jsonb
17. `backend-patterns` — /api/goals: build in this prompt (GET only, POST is P15)
18. `database-reviewer` (agent) — verify goals query returns roadmap jsonb correctly
19. `react-testing` — test: 4 goals render, Spivak shows locked state
20. `/tdd` — test: expand month row → week rows appear, week row expand → daily items
21. `tdd-guide` — test: locked goal has reduced opacity (CSS class applied)
22. `e2e-testing` — Playwright: click macro goal → expands, shows month rows
23. `pw:generate` — generate goal hierarchy E2E test
24. `senior-fullstack` — AI insight blurb: use partial context (goal-specific, lightweight)
25. `prompt-engineer-toolkit` — AI insight per goal: "1 sentence: pace vs plan"
26. `context-engine` — goal insight context: that goal's sessions + errors only
27. `token-budget-advisor` — goal insight: minimal context (1 goal + its sessions)
28. `error-handling` — goals load fail: show skeleton list (not error page)
29. `security-review` — GET /api/goals: auth check, return only this user's goals
30. `security-reviewer` (agent) — review goals route
31. `/code-review` — after all 4 hierarchy components
32. `code-reviewer` (agent) — review component tree
33. `typescript-reviewer` (agent) — Goal, Month, Week, DailyItem types from database.ts
34. `decision-logger` — log: expand state in React state not DB (too granular for DB)
35. `architecture-decision-records` — ADR-008: compound component vs recursive
36. `git-workflow` — commit: feat: add 4-level goal hierarchy with expand/collapse
37. `/verify` — Vercel: expand all 4 levels, Spivak shows locked, ML shows amber
38. `verify` — Phase Gate 4 goals criterion: all 4 levels expand/collapse with correct data
39. `quality-gate` — US-012 AC checked
40. `production-audit` — Phase Gate 4 goals criterion
41. `self-improving-agent:remember` — log: jsonb roadmap traversal patterns
42. `memory:memory-persist` — goal hierarchy operational
43. `checkpoint` — save
44. `save-session` — record state
45. `update-docs` — document goal hierarchy components
46. `hooks:post-task` — grep check after CSS
47. `tech-debt-tracker` — AI insight blurb: basic now, improve prompt in Sprint 6 polish
48. `agile-product-owner` — US-012 all AC: 4 levels ✓, expand ✓, locked ✓, AI blurb ✓
49. `sprint-health` — Sprint 4: P14 done, P15+P16+P17 remaining (can be parallel)
50. `project-management` — Phase Gate 4 goals sub-criterion: expand/collapse correct data

### SCOPE
**BUILD:**
- `/src/components/goals/MacroGoalCard.tsx` — level 1: title, category, stats, expand
- `/src/components/goals/MonthRow.tsx` — level 2: expandable month with progress %
- `/src/components/goals/WeekRow.tsx` — level 3: expandable week with topic list
- `/src/components/today/DailyCheckItem.tsx` (shared) — level 4: inline checkable
- `/src/app/(app)/goals/page.tsx` — update shell with real GoalList
- `/src/app/api/goals/route.ts` — GET /api/goals (POST is P15)
- AI insight blurb: one sentence per macro goal (lightweight call)

**DO NOT BUILD:**
- Goal progress auto-tracking (P15)
- Amber flag logic (P15)
- Spivak unlock logic (P15)

### EXECUTION STEPS
```
Step 1: /plan — component architecture, data flow, expand state management.
Step 2: Write GET /api/goals/route.ts — returns user's goals with full roadmap jsonb.
Step 3: Write Goal, Month, Week, DailyItem TypeScript interfaces in /src/types/goals.ts.
Step 4: Write MacroGoalCard.tsx:
        - Stat header: sessions completed / topics covered / % to milestone
        - Status chip: active/done/locked (locked = opacity 0.5 + "locked" label)
        - Expand ↓/↑: 12px arrow --ink3, row-level click, 200ms height transition
        - AI insight blurb: 1 sentence italic --ink3 (async load, skeleton while loading)
Step 5: Write MonthRow.tsx — title, topic summary, progress bar (1px --ink), week count, ↓/↑.
Step 6: Write WeekRow.tsx — topic list (pills), daily focus text, status, ↓/↑.
Step 7: Write DailyCheckItem.tsx — inline checkable (same circle checkbox pattern as TaskRow).
Step 8: Wire goals/page.tsx — fetch goals from /api/goals, render MacroGoalCard list.
Step 9: /tdd — test: 4 goals load, Spivak status is 'locked', ML shows amber in insight blurb.
Step 10: /verify — Vercel: expand Pure Maths → months → weeks → daily items visible.
Step 11: Verify: Spivak goal has locked appearance (reduced opacity).
Step 12: Commit: feat: add 4-level goal hierarchy UI
Step 13: Update MEMORY.md.
```

### EMBEDDED CONSTRAINTS
```css
/* Expandable sections — from ui-ux-principles.md §6.4 */
/* Arrow: ↓ closed, ↑ open — 12px --ink3 — same pattern ALL expandable sections */
/* Height transition: var(--t-expand) = 200ms ease-in-out */
/* Locked goal: opacity 0.5, pointer-events none on expand */
/* MacroGoalCard: card spec (11px radius, 1px --line border, no shadow) */
/* Progress bar in month row: 1px height (same rule as everywhere) */
/* NEVER: slide-in from left, fade-only expand, opacity-only show/hide */
```

### ACCEPTANCE CRITERIA (US-012)
- [ ] Level 1: title, category badge, months, hours, milestone, status
- [ ] Level 2: expandable month rows with progress %
- [ ] Level 3: expandable week rows with topics
- [ ] Level 4: inline checkable daily items
- [ ] ↓/↑ chevron same on all expandable sections
- [ ] Locked goals: reduced opacity + lock indicator
- [ ] AI insight blurb per goal

---

══════════════════════════════════════════════════════════════════════
## PROMPT P15 — GOAL PROGRESS TRACKING + BUSINESS LOGIC
**Sprint 4 | WBS 3.5–3.7 | US-013 | Phase Gate 4 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md US-013 (Goal progress auto-tracking — ALL acceptance criteria)
   READ ROADMAP.md §9 Phase Gate 4 (ML amber + Spivak unlock criteria)
   READ ROADMAP.md §2.4 (Mitchell ML: 5 days missed → amber, Spivak: locked until Pure M3)

2. READ principles.md §5 Law 13 (No Silent Failures — every goal state change must be logged)
   READ principles.md §10 Mistake 18 (Breaking Changes — Spivak unlock: DB status update)
   READ principles.md §23 (Rollback Covenant — goal status change needs down migration path)

3. READ ui-ux-principles.md §1.4 (Color Usage — amber: ML goal indicator)
   READ ui-ux-principles.md §4.1 (Cards — stat header bars: 1px height)

4. READ MEMORY.md — confirm P14 complete
```

### COLD START VERIFICATION
- [ ] What triggers the ML goal amber flag (exact condition)?
- [ ] What triggers Spivak to unlock (exact condition)?
- [ ] What 3 stats recalculate on every session post?
- [ ] What does "no page reload" mean for goal state updates?
- [ ] What is the amber color token?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `senior-backend` — POST /api/goals: recalculate progress from sessions
3. `senior-fullstack` — real-time update pattern: invalidate + refetch after session POST
4. `backend-patterns` — /api/goals POST: update goal progress, check unlock conditions
5. `postgres-patterns` — query: sessions grouped by goal_id, count per week
6. `senior-data-engineer` — ML amber algorithm: days since last session > 5 AND subject = ML
7. `database-migrations` — schema: if goals needs new field (e.g., last_session_date)
8. `database-reviewer` (agent) — verify goal progress update SQL
9. `react-patterns` — optimistic update: goal stats update before API confirms
10. `react-performance` — goal list: only re-renders affected goal on session POST
11. `context-engine` — goal state feeds into brief (drift detection) and confusion map
12. `observability-designer` — log: Spivak unlock event, ML amber transition
13. `decision-logger` — log: Spivak unlock algorithm (check Pure M3 completion in roadmap)
14. `algorithm-design` — Spivak unlock: goals.roadmap months[2] (M3 Integration) status = done
15. `error-handling` — goal update fail: revert optimistic update, show inline error
16. `react-testing` — test: 5 days no ML session → Mitchell card shows amber
17. `/tdd` — test: Pure M3 complete → Spivak status changes to active
18. `tdd-guide` — test: session POST → goal % increases
19. `e2e-testing` — Playwright: log session for ML → 6 days no session → verify amber
20. `pw:generate` — generate amber flag E2E test
21. `security-review` — POST /api/goals: auth, validate goal_id belongs to user
22. `security-reviewer` (agent) — review goals POST
23. `/code-review` — after goal progress logic
24. `code-reviewer` (agent) — review business logic
25. `typescript-reviewer` (agent) — GoalProgress type, unlock conditions
26. `git-workflow` — commit: feat: add goal progress auto-tracking, amber flag, Spivak unlock
27. `/verify` — Vercel: check Mitchell goal shows amber (seed has 5 days missed)
28. `verify` — Phase Gate 4: ML amber ✓, Spivak locked ✓
29. `quality-gate` — US-013 all AC checked
30. `production-audit` — Phase Gate 4 goal criteria
31. `self-improving-agent:remember` — log: Spivak unlock condition implementation
32. `memory:memory-persist` — goal tracking operational
33. `checkpoint` — save
34. `save-session` — record state
35. `update-docs` — document goal business logic
36. `tech-debt-tracker` — amber: currently based on session count, improve with date calc in v1.1
37. `agile-product-owner` — US-013 all AC: recalculation ✓, amber ✓, Spivak ✓
38. `sprint-health` — Sprint 4: P14+P15 done
39. `decision-logger` — log: why optimistic update (feels immediate for daily use)
40. `rollback-covenant` (§23) — goal status change: reversible (can manually set back)
41. `hooks:post-task` — grep check
42. `react-patterns` — week track bar: 1px progress bar (same rule as everywhere)
43. `senior-fullstack` — session POST chain: session → goal progress update → confusion map update
44. `coding-standards` — goal update logic in /src/lib/goalTracker.ts (not in route)
45. `hexagonal-architecture` — goal business rules in /lib, not in /api routes
46. `simplify` — amber flag: simple time comparison, not ML model
47. `product-analytics` — amber flag trigger rate: key health metric
48. `architecture-decision-records` — ADR-009: goal progress calculation on POST vs cron
49. `performance-optimizer` — goal stats: compute in DB query (not in JS)
50. `project-management` — Phase Gate 4: ML amber + Spivak confirmed = sub-criteria PASS

### SCOPE
**BUILD:**
- POST `/api/goals/route.ts` — progress recalculation after every session
- `/src/lib/goalTracker.ts` — business logic: amber algorithm, Spivak unlock check
- Goal stat header auto-update (no page reload — React state update)
- ML goal amber display: --amber color, "Attention needed" label in goal card
- Spivak lock/unlock: status field update in DB on Pure M3 completion

**DO NOT BUILD:**
- Goals UI changes (P14 handled all UI)
- Any new API routes beyond /api/goals POST

### EXECUTION STEPS
```
Step 1: /plan — amber algorithm, Spivak unlock condition, recalculation chain.
Step 2: Write /src/lib/goalTracker.ts:
        isAmber(goal, sessions[]): sessions.filter(Mitchell, last 5 days).length === 0
        shouldUnlock(goals[], sessions[]): Pure Maths goal M3 week all daily items checked
        recalculateProgress(goal, sessions[]): { sessionsDone, topicsCovered, percentComplete }
Step 3: Write POST /api/goals/route.ts:
        On POST (session complete or daily item check):
        - Recalculate progress for affected goal
        - Check amber condition for Mitchell
        - Check Spivak unlock condition
        - Update goals table if status changed
        - Return updated goal objects
Step 4: Wire to session POST chain:
        usePomodoroTimer.onComplete → POST /api/session → POST /api/goals (recalculate)
        TaskRow.onCheck → POST /api/session → POST /api/goals (recalculate)
Step 5: Update MacroGoalCard — show amber badge when goal.status = 'amber'.
        Amber badge: --amber text, 10px italic "attention needed"
Step 6: /tdd — test: Mitchell seed goal returns amber on first load (5 days missed).
Step 7: /verify — Vercel: Mitchell goal shows amber. Spivak shows locked.
Step 8: Phase Gate 4 check: ML amber ✓, Spivak locked ✓ — sub-criteria PASS.
Step 9: Commit: feat: add goal progress auto-tracking with amber flag and Spivak unlock
Step 10: Update MEMORY.md.
```

---

══════════════════════════════════════════════════════════════════════
## PROMPT P16 — INGEST PIPELINE (FULL)
**Sprint 4 | WBS 7.2 | US-021 | Sprint 4 parallel**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md US-021 (Auto-tagging ingest pipeline — ALL acceptance criteria)
   READ ROADMAP.md §6 (/api/ingest route — full spec)
   READ ROADMAP.md §12.3 (Prompt strategy — auto-tag ingest prompt)
   READ ROADMAP.md §5 (captures table schema — all fields needed)

2. READ principles.md §10 Mistake 16 (Hallucination — ingest tags must be from known schema)
   READ principles.md §5 Law 7 (Never add features — only text/audio/image, no new types)
   READ principles.md §8 (Token Economy — ingest prompt: lightweight, single purpose)

3. READ ui-ux-principles.md §7 (Capture Patterns — ingest is the backend of capture bar)
   READ ui-ux-principles.md §7.4 (Photo/Scan — AI text extraction on image)

4. READ MEMORY.md — confirm P06 (basic ingest stub) and P15 complete
```

### COLD START VERIFICATION
- [ ] What 5 content types does /api/ingest accept?
- [ ] What 4 fields does the AI auto-tagger assign?
- [ ] What happens if ingested content contains a flagged mistake?
- [ ] What does "source web recalculates" mean after ingest?
- [ ] What is the captures table source_type for voice input?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `prompt-engineer-toolkit` — auto-tag prompt: structured JSON output required
3. `prompt-optimizer` — ingest prompt: fast, lightweight, no full context needed
4. `rag-architect` — tagging: output must match known schema values (no hallucinated tags)
5. `regex-vs-llm-structured-text` — AI tagging wins over regex for diverse content
6. `ai-first-engineering` — structured output: force JSON with schema
7. `context-engine` — ingest uses lightweight context (subject list only, not full assembly)
8. `token-budget-advisor` — ingest: ~500 token context + ~200 token response
9. `backend-patterns` — /api/ingest: handle 5 content types, route to correct processor
10. `senior-backend` — multipart form data for image/audio uploads
11. `senior-fullstack` — photo: Supabase Storage for raw image, AI for text extraction
12. `database-designer` — sources table update after ingest (source health recalculation)
13. `postgres-patterns` — after captures insert, update sources table quality field
14. `error-handling` — ingest fail: content saved without tags, flagged for manual review
15. `coding-standards` — /api/ingest: separate processors for text/audio/image
16. `hexagonal-architecture` — ingest route orchestrates, processors handle content types
17. `react-testing` — N/A (backend only) — unit test processors
18. `/tdd` — test: text → captures row with correct subject_tag
19. `tdd-guide` — test: mistake keyword in content → errors table updated
20. `tdd-workflow` — test: image → Supabase Storage + AI extraction → captures row
21. `e2e-testing` — Playwright: capture a note via bar → check captures table
22. `pw:generate` — generate ingest E2E test
23. `security-review` — ingest: sanitize ALL content types before DB write
24. `security-reviewer` (agent) — review /api/ingest full implementation
25. `senior-security` — file upload: validate MIME type, size limit
26. `gateguard` — /api/ingest: auth required, user_id extracted from JWT
27. `eval-harness` — evaluate: auto-tag accuracy on sample captures
28. `ai-regression-testing` — baseline: math formula tagged as 'formula' not 'note'
29. `prompt-archaeology` (§20) — save ingest tag prompt to /docs/prompts/ingest-tag-prompt-v1.md
30. `/code-review` — after /api/ingest full implementation
31. `code-reviewer` (agent) — review all 3 content type processors
32. `typescript-reviewer` (agent) — IngestPayload, IngestResult, ContentType types
33. `decision-logger` — log: why JSON-mode output for tagging (reliable schema adherence)
34. `git-workflow` — commit: feat: complete ingest pipeline with AI auto-tagging
35. `/verify` — Vercel: capture a note, check captures table: subject_tag assigned
36. `verify` — test: capture with "wrong answer" keyword → errors table updated
37. `quality-gate` — US-021 all AC checked
38. `production-audit` — ingest pipeline production test
39. `self-improving-agent:remember` — log: ingest processing patterns
40. `memory:memory-persist` — full ingest operational
41. `checkpoint` — save
42. `save-session` — record state
43. `update-docs` — /docs/prompts/ingest-tag-prompt-v1.md
44. `hooks:post-task` — no CSS changes — skip grep check
45. `tech-debt-tracker` — image processing: basic Supabase storage now, OCR in Sprint 6
46. `agile-product-owner` — US-021 all AC: text ✓, audio ✓, image stub ✓, mistake detection ✓
47. `sprint-health` — Sprint 4: P16 done (parallel with P14/P15)
48. `performance-optimizer` — ingest: async (non-blocking UI) — return 202 Accepted
49. `cost-tracking` — ingest: 1 AI call per capture, track usage
50. `project-management` — US-021 complete = Phase Gate 4 ingest criterion met

### SCOPE
**BUILD:**
- Full `/api/ingest/route.ts` — replaces P06 stub
- Processors: `/src/lib/ingest/textProcessor.ts`, `audioProcessor.ts`, `imageProcessor.ts`
- Auto-tag prompt: returns `{ subject_tag, content_type, topic_tag, textbook_association }`
- Mistake detection: if content has "wrong", "mistake", "error" keywords → create errors row
- Source web update: after every ingest, recalculate sources table quality for affected topic
- `/docs/prompts/ingest-tag-prompt-v1.md`

**DO NOT BUILD:**
- Apple iCloud sync (P23)
- Full PDF processing
- Share extension

---

══════════════════════════════════════════════════════════════════════
## PROMPT P17 — ASK AI TUTOR CHAT
**Sprint 4 | WBS 5.1–5.3 | US-016 | Phase Gate 4 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §3 (Layout — Ask AI full-width, no right panel)
   READ ui-ux-principles.md §8.2 (Feedback — streaming: text appears word by word)
   READ ui-ux-principles.md §2.2 (Type — user messages right, AI left, different weights)

2. READ ROADMAP.md US-016 (Ask AI tutor chat — ALL acceptance criteria)
   READ ROADMAP.md §12.3 (Prompt strategy — Tutor row: streaming required)
   READ ROADMAP.md §6 (/api/tutor spec — streaming response)

3. READ principles.md §5 Law 15 (Provider never shown — context indicator shows DATA not provider)
   READ principles.md §8 Extended Thinking (disable for tutor — streaming + thinking don't mix)

4. READ MEMORY.md — confirm Phase Gate 3 CLOSED, Sprint 4 started
```

### COLD START VERIFICATION
- [ ] What does the context indicator bar show?
- [ ] What is the message thread layout (user vs AI alignment)?
- [ ] What is the tutor prompt directive?
- [ ] Is streaming required or optional?
- [ ] What does the provider NEVER appear as?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `nextjs-turbopack` — Next.js 14 streaming: ReadableStream in API route
3. `react-patterns` — chat thread: append messages, auto-scroll to latest
4. `frontend-patterns` — chat UI architecture: useChat hook
5. `frontend-design-direction` — user right / AI left, different background colors
6. `ui-design-system` — user: --cream3 bg; AI: --cream2 bg; both with 1px --line border
7. `motion-patterns` — streaming: text renders word by word (no animation, just incremental)
8. `make-interfaces-feel-better` — auto-scroll: smooth scroll to new message
9. `accessibility` — chat: aria-live="polite" on AI message area for screen readers
10. `claude-api` — streaming response patterns (applies to Gemini streaming too)
11. `prompt-engineer-toolkit` — tutor prompt per §12.3: patient tutor, own materials
12. `context-engine` — tutor injects FULL context (all 6 tables) — most context-heavy feature
13. `token-budget-advisor` — tutor: full context + conversation history = expensive
14. `cost-aware-llm-pipeline` — tutor: largest context call — monitor Gemini quota
15. `rag-architect` — context indicator shows: N goals, N errors, N captures loaded
16. `ai-first-engineering` — streaming: Server-Sent Events or ReadableStream
17. `senior-backend` — /api/tutor: streaming response, no timeout (long calls)
18. `latency-critical-systems` — first token latency: show "thinking..." skeleton until first word
19. `error-handling` — stream fail: show "Response interrupted. Try again." inline
20. `senior-frontend` — useChat hook: message state, streaming append
21. `react-testing` — test: send message → AI response appends to thread
22. `/tdd` — test: context indicator shows real counts (not zeros)
23. `tdd-guide` — test: user message appears right-aligned, AI appears left
24. `e2e-testing` — Playwright: send a question → streaming response appears
25. `pw:generate` — generate chat E2E test
26. `eval-harness` — evaluate: AI response references user's actual goal/error data
27. `security-review` — tutor: user message sanitized, no prompt injection
28. `security-reviewer` (agent) — review /api/tutor for injection vectors
29. `senior-security` — user input: no system prompt override possible
30. `/code-review` — after TutorChat + /api/tutor
31. `code-reviewer` (agent) — review streaming implementation
32. `typescript-reviewer` (agent) — Message type, ChatState interface
33. `decision-logger` — log: why Server-Sent Events vs WebSocket (SSE simpler for Next.js)
34. `architecture-decision-records` — ADR-010: streaming approach
35. `git-workflow` — commit: feat: add Ask AI chat with full context and streaming
36. `/verify` — Vercel: send message, verify streaming response with context indicator
37. `verify` — Phase Gate 4: chat streams with real context indicator showing counts
38. `quality-gate` — US-016 all AC checked
39. `production-audit` — Phase Gate 4 Ask AI criterion
40. `prompt-archaeology` (§20) — save tutor prompt to /docs/prompts/tutor-prompt-v1.md
41. `self-improving-agent:remember` — log: streaming pattern in Next.js 14 app router
42. `memory:memory-persist` — Ask AI operational
43. `checkpoint` — save
44. `save-session` — record state
45. `update-docs` — /docs/prompts/tutor-prompt-v1.md
46. `hooks:post-task` — grep check after CSS
47. `tech-debt-tracker` — conversation history: not persisted in v1 (fresh context per session)
48. `agile-product-owner` — US-016 all AC: context bar ✓, streaming ✓, provider hidden ✓
49. `react-performance` — message list: virtualize if > 50 messages (defer to v1.1)
50. `project-management` — Phase Gate 4 ALL criteria check after P17

### SCOPE
**BUILD:**
- `/src/components/ask-ai/TutorChat.tsx` — chat thread (user right / AI left)
- `/src/components/ask-ai/ContextIndicator.tsx` — bar showing goals/errors/captures/sessions counts
- `/src/hooks/useChat.ts` — message state, streaming append, submit handler
- `/src/app/api/tutor/route.ts` — POST streaming response with full context
- `/src/app/(app)/ask-ai/page.tsx` — update shell with TutorChat
- `/docs/prompts/tutor-prompt-v1.md`

### EXECUTION STEPS
```
Step 1: /plan — streaming architecture, context indicator data, chat layout.
Step 2: Write /api/tutor/route.ts:
        - Assemble full context via context-assembler
        - Build tutor prompt: "You are a patient study tutor. Context: [full context]. Answer using user's own materials."
        - Stream response via ReadableStream
        - Return: text/event-stream content type
Step 3: Write useChat hook — state: messages[], isStreaming, inputText
        onSubmit: append user message, POST to /api/tutor, stream response token by token.
Step 4: Write TutorChat.tsx — thread: user messages right (--cream3 bg), AI left (--cream2 bg).
        Auto-scroll to latest message. "thinking..." skeleton while first token loading.
Step 5: Write ContextIndicator.tsx — horizontal bar:
        "Context: 4 goals · 5 errors · 3 captures · 2 textbooks · 3 sessions"
        All numbers from real Supabase counts. 10px italic --ink4.
Step 6: Wire to ask-ai/page.tsx.
Step 7: /tdd — test: context indicator shows non-zero counts from seed data.
Step 8: /security-review — tutor prompt injection: user input appended after system prompt, not before.
Step 9: Deploy to Vercel. Test chat. Verify streaming visible.
Step 10: Phase Gate 4 Ask AI criterion: streams response with context indicator. PASS.
Step 11: Save prompt. Commit. Update MEMORY.md.
Step 12: Phase Gate 4 ALL criteria check:
         [ ] Goals: all 4 levels expand/collapse ✓ (P14)
         [ ] Spivak locked ✓ (P14)
         [ ] ML amber ✓ (P15)
         [ ] Ask AI: streams with context ✓ (P17)
         [ ] Ingest: voice/text auto-tags ✓ (P16)
         Phase Gate 4: PASS → GO → All views exist. Core AI loop complete.
```

### ACCEPTANCE CRITERIA (US-016)
- [ ] Context indicator bar shows real data counts (not "0")
- [ ] Thread: user right, AI left
- [ ] POST /api/tutor injects full unified context
- [ ] Streams AI response (text appears incrementally)
- [ ] Text input + send at bottom
- [ ] Provider name NEVER visible

---

══════════════════════════════════════════════════════════════════════
## PROMPT P18 — TOPIC GRID + DIFFICULTY SELECTOR
**Sprint 5 | WBS 4.1–4.2, 4.6 | US-014 partial | Phase Gate 5 target**
**Estimated: 1.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.2 (Buttons — selectable pills = button variant)
   READ ui-ux-principles.md §1.2 (Color — topic pills: ink/cream, no color coding)
   READ ui-ux-principles.md §4.1 (Cards — source health sidebar card)

2. READ ROADMAP.md US-014 (Topic selector + AI question gen — ALL AC)
   READ ROADMAP.md §9 Phase Gate 5 (source health sidebar requirement)
   READ ROADMAP.md §5 (sources table — quality: strong/partial/missing)

3. READ principles.md §10 Mistake 8 (No unrequested features — 3-col grid only, no fancy filters)
   READ principles.md §5 Law 12 (Scope Lock — no new topic types beyond what's in textbooks)

4. READ MEMORY.md — confirm Phase Gate 4 CLOSED, Sprint 5 started
```

### COLD START VERIFICATION
- [ ] What is the default difficulty distribution (Easy/Med/Hard)?
- [ ] What are the 3 source health states?
- [ ] How does the confusion map's danger zone affect topic display?
- [ ] What does a "selected" topic pill look like?
- [ ] What is the 3-column grid gap and pill spec?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — multi-select pill grid, controlled component
3. `frontend-patterns` — topic grid + difficulty slider + source sidebar layout
4. `frontend-design-direction` — selected pill: --ink bg white text, unselected: --cream3 bg --ink2 text
5. `ui-design-system` — source health states: strong=--ink, partial=--amber, missing=--red
6. `make-interfaces-feel-better` — selecting topics feels responsive (80ms toggle)
7. `accessibility` — pills: role="checkbox", aria-checked for multi-select
8. `frontend-a11y` — pills: 44×44px min touch target
9. `senior-frontend` — difficulty slider: 3 labeled positions (Easy/Medium/Hard)
10. `coding-standards` — TopicGrid, DifficultySlider, SourceHealthSidebar = 3 separate files
11. `context-engine` — topics sourced from: textbooks.topic_map + confusion_map danger zone
12. `postgres-patterns` — sources table query: quality per topic for sidebar
13. `react-testing` — test: danger zone topics shown first in grid (from confusion map)
14. `/tdd` — test: selecting 3 topics → selection state has 3 items
15. `tdd-guide` — test: difficulty slider default = {easy:30, medium:50, hard:20}
16. `e2e-testing` — Playwright: select 2 topics, set hard difficulty, click generate
17. `pw:generate` — generate topic selection E2E test
18. `senior-fullstack` — topics list: merge textbook topics + confusion map topics
19. `database-reviewer` (agent) — verify sources table has data from P16 ingest
20. `error-handling` — no topics available: show "Register a textbook to unlock topics"
21. `/code-review` — after all 3 test sim setup components
22. `code-reviewer` (agent) — review state management
23. `typescript-reviewer` (agent) — Topic, DifficultyConfig, SourceHealth types
24. `decision-logger` — log: danger zone topics shown first (confusion map integration)
25. `git-workflow` — commit: feat: add topic grid, difficulty selector, source health sidebar
26. `/verify` — Vercel: topic grid shows topics from seeded textbooks
27. `verify` — source health sidebar shows quality states from sources table
28. `quality-gate` — US-014 partial AC checked
29. `self-improving-agent:remember` — log: multi-select pill pattern
30. `memory:memory-persist` — topic grid operational
31. `checkpoint` — save
32. `save-session` — record state
33. `update-docs` — document test sim components
34. `hooks:post-task` — grep check
35. `tech-debt-tracker` — topic list: manually curated for v1, auto-extracted in v1.1
36. `agile-product-owner` — topic grid scope: topics from textbooks + confusion map
37. `sprint-health` — Sprint 5: P18 done, P19/P20/P21/P22 remaining
38. `react-performance` — topic grid: memoized, no re-render on difficulty change
39. `accessibility` — difficulty slider: aria-valuemin, aria-valuemax, aria-valuenow
40. `product-analytics` — most selected topics: track for study pattern analysis
41. `coding-standards` — difficulty config in /src/utils/difficultyDefaults.ts
42. `frontend-design-direction` — danger zone pills: subtle indicator (not loud color)
43. `simplify` — difficulty: 3 buttons, not a real slider (simpler, clearer)
44. `agile-product-owner` — US-014 grid + difficulty + source health in scope
45. `tech-debt-tracker` — source health: basic calculation now, improve with AI in v1.1
46. `security-review` — topic names: sanitize before passing to AI question gen
47. `decision-logger` — log: 3 buttons for difficulty (not slider) — clearer for casual use
48. `architecture-decision-records` — ADR-011: topic sourcing strategy
49. `performance-optimizer` — topics list: cache per session
50. `project-management` — Sprint 5 start: confirm Phase Gate 4 CLOSED first

### SCOPE
**BUILD:**
- `/src/components/test-sim/TopicGrid.tsx` — 3-col selectable topic pills
- `/src/components/test-sim/DifficultySelector.tsx` — 3 labeled buttons (30/50/20 default)
- `/src/components/test-sim/SourceHealthSidebar.tsx` — strong/partial/missing per topic
- `/src/app/(app)/test-sim/page.tsx` — update shell with these 3 components
- Topic list sourced from textbooks.topic_map + confusion map danger zone topics

**DO NOT BUILD:**
- Question generation (P19)
- Timed test (P20)
- Exam countdown widget (already in P13 — reuse component)

---

══════════════════════════════════════════════════════════════════════
## PROMPT P19 — AI QUESTION GENERATION
**Sprint 5 | WBS 4.3 | US-014 complete | Phase Gate 5 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md US-014 (Topic selector + AI gen — remaining AC after P18)
   READ ROADMAP.md §12.3 (Prompt strategy — Test Gen row: weighted, source-anchored)
   READ ROADMAP.md §6 (/api/test route spec)

2. READ principles.md §10 Mistake 16 (Hallucination — questions MUST come from real materials)
   READ principles.md §8 (Token Economy — test gen: large context, questions from captures/textbooks)

3. READ ui-ux-principles.md §4.2 (Buttons — Generate button: primary CTA, one per screen)
   READ ui-ux-principles.md §5.3 (Loading States — question gen skeleton)

4. READ MEMORY.md — confirm P18 complete
```

### COLD START VERIFICATION
- [ ] What does "weighted toward danger zone" mean in the test gen prompt?
- [ ] What does the source health sidebar warn about?
- [ ] What format do generated questions return in?
- [ ] What does "source-anchored questions only" mean?
- [ ] How many questions generated per test?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `prompt-engineer-toolkit` — test gen prompt per §12.3: weighted danger zone
3. `prompt-optimizer` — structured output: force JSON array of questions
4. `ai-first-engineering` — structured JSON output for question set
5. `context-engine` — test gen context: selected topics + danger zone + textbook chapters + captures
6. `token-budget-advisor` — test gen: larger context (materials) but structured output
7. `rag-architect` — retrieval: textbook pages for selected topics + user captures on those topics
8. `eval-harness` — evaluate: at least 1 question references actual textbook content
9. `ai-regression-testing` — baseline: questions are not generic math problems
10. `backend-patterns` — /api/test: accepts topics[], difficulty config, returns Question[]
11. `senior-backend` — question generation: 5-10 questions per test (configurable)
12. `react-patterns` — QuestionCard: receives question object, renders options
13. `frontend-design-direction` — question card: cream bg, 1px border, no highlight before answer
14. `ui-design-system` — option buttons: default state (transparent), selected (cream3)
15. `motion-patterns` — question transition: 150ms on option select
16. `make-interfaces-feel-better` — question card feels like a clean exam, not a game
17. `accessibility` — options: role="radio" group, keyboard navigation
18. `coding-standards` — QuestionCard.tsx < 80 lines, question parsing in utils
19. `react-testing` — test: 5 questions returned → 5 QuestionCards rendered
20. `/tdd` — test: each question has text + 4 options + correct_answer field
21. `tdd-guide` — test: generate button triggers POST /api/test
22. `e2e-testing` — Playwright: select topic → generate → verify question cards appear
23. `pw:generate` — generate question gen E2E test
24. `security-review` — question content: sanitize before render (no XSS via AI output)
25. `security-reviewer` (agent) — review /api/test
26. `/code-review` — after QuestionCard + /api/test
27. `code-reviewer` (agent) — review question rendering
28. `typescript-reviewer` (agent) — Question type: { id, text, options, correct_answer, topic }
29. `decision-logger` — log: questions per test = 5 default (configurable per session)
30. `prompt-archaeology` (§20) — save test gen prompt to /docs/prompts/test-gen-prompt-v1.md
31. `git-workflow` — commit: feat: add AI question generation for test simulator
32. `/verify` — Vercel: select topics → generate → questions appear with options
33. `verify` — verify: at least one question mentions a topic from seeded textbook
34. `quality-gate` — US-014 full AC checked
35. `production-audit` — Phase Gate 5 test sim criterion partial
36. `self-improving-agent:remember` — log: structured output pattern for questions
37. `memory:memory-persist` — question gen operational
38. `checkpoint` — save
39. `save-session` — record state
40. `update-docs` — /docs/prompts/test-gen-prompt-v1.md
41. `tech-debt-tracker` — question count: 5 in v1, adaptive in v1.1
42. `agile-product-owner` — US-014 source health + weighted gen + question cards = DONE
43. `cost-tracking` — test gen: ~2k tokens per test, track usage
44. `token-budget-advisor` — question context: cap at 20k tokens (selected topic materials only)
45. `react-performance` — question list: rendered once, no re-render on selection
46. `product-analytics` — most generated topics: study pattern signal
47. `simplify` — question format: 4 options only (A/B/C/D) — no multi-select questions
48. `coding-standards` — question type definitions in /src/types/test.ts
49. `hooks:post-task` — grep check
50. `project-management` — Phase Gate 5 test sim criterion: ≥5 questions from real materials

### SCOPE
**BUILD:**
- Full `/src/app/api/test/route.ts` — POST: accepts topics + difficulty → returns Question[]
- `/src/components/test-sim/QuestionCard.tsx` — question text + 4 options
- `/src/types/test.ts` — Question, TestSession, DifficultyConfig types
- `/docs/prompts/test-gen-prompt-v1.md`
- Wire test-sim/page.tsx: generate button → questions appear below topic grid

---

══════════════════════════════════════════════════════════════════════
## PROMPT P20 — TIMED TEST + ERROR AUTO-LOGGING
**Sprint 5 | WBS 4.4–4.5, 4.7 | US-015 | Phase Gate 5 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §5.1 (Motion — countdown timer: 1s linear like Pomodoro)
   READ ui-ux-principles.md §8.2 (Feedback — wrong answer: row highlight #FDF0EF)
   READ ui-ux-principles.md §1.4 (Color — green: correct answer in test sim ONLY)

2. READ ROADMAP.md US-015 (Timed test + error logging — ALL AC)
   READ ROADMAP.md §9 Phase Gate 5 (error auto-logging criterion)
   READ ROADMAP.md §5 (test_results table — wrong_ids[], errors.id references)

3. READ principles.md §10 Mistake 18 (Breaking Changes — wrong_ids: uuid[] must match errors.id)
   READ principles.md §17 LAW-002 (Provider never user-facing — even in test result message)

4. READ MEMORY.md — confirm P19 complete
```

### COLD START VERIFICATION
- [ ] What color is a correct answer in test sim? (Only place --green is used)
- [ ] What happens to wrong answers after test submit (3 things)?
- [ ] What fields go into test_results on submit?
- [ ] When does the confusion map recalculate?
- [ ] What does the past history panel show?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — test state machine: setup → active → submitted → review
3. `frontend-patterns` — TestRunner manages full test lifecycle
4. `frontend-design-direction` — correct: --green text, wrong: --red text (test sim ONLY)
5. `ui-design-system` — result: correct=--green, wrong=--red (5% rule: only in test sim)
6. `motion-patterns` — answer reveal: 150ms (var(--t-task))
7. `make-interfaces-feel-better` — timer: same countdown feel as Pomodoro ring
8. `accessibility` — timer: aria-live="assertive" for time warnings
9. `senior-frontend` — countdown timer: reuse usePomodoroTimer pattern (configurable duration)
10. `coding-standards` — TestRunner.tsx < 100 lines, TestHistory.tsx < 60 lines
11. `backend-patterns` — /api/error route: already exists (P08 stub), now used for wrong answers
12. `postgres-patterns` — test_results insert: wrong_ids = array of errors.id created
13. `senior-data-engineer` — wrong answer → create error row → add id to wrong_ids[]
14. `database-reviewer` (agent) — verify test_results.wrong_ids references errors.id
15. `context-engine` — after test submit: confusion map recalculates (reads new errors)
16. `react-testing` — test: wrong answer → POST /api/error called, errors table updated
17. `/tdd` — test: test submit → test_results row → wrong_ids contain error ids
18. `tdd-guide` — test: confusion map recalculates after wrong answer submission
19. `e2e-testing` — Playwright: complete test with 1 wrong → errors table has new row
20. `pw:generate` — generate timed test E2E test
21. `error-handling` — test submit fail: preserve answers, allow retry
22. `security-review` — /api/error: auth check, validate session_id belongs to user
23. `security-reviewer` (agent) — review test submission chain
24. `/code-review` — after TestRunner + TestHistory + submission logic
25. `code-reviewer` (agent) — review error auto-logging chain
26. `typescript-reviewer` (agent) — TestResult, AnswerState, WrongAnswer types
27. `decision-logger` — log: wrong_ids: create error rows immediately on submit (not async)
28. `git-workflow` — commit: feat: add timed test mode with auto error logging
29. `/verify` — Vercel: run test, answer wrong, verify errors + test_results + confusion map update
30. `verify` — Phase Gate 5: wrong answer in errors table after test ✓
31. `quality-gate` — US-015 all AC checked
32. `production-audit` — Phase Gate 5 error logging criterion
33. `self-improving-agent:remember` — log: test state machine pattern
34. `memory:memory-persist` — timed test + error logging operational
35. `checkpoint` — save
36. `save-session` — record state
37. `update-docs` — document test state machine
38. `hooks:post-task` — grep check: --green ONLY in test sim components
39. `tech-debt-tracker` — test duration: fixed 20min in v1, configurable in v1.1
40. `agile-product-owner` — US-015 all AC: timer ✓, error log ✓, history ✓
41. `product-analytics` — test completion rate, average score
42. `react-performance` — TestHistory: paginate if > 10 past tests
43. `coding-standards` — test state machine in /src/lib/testStateMachine.ts
44. `decision-logger` — log: confusion map recalculates synchronously after submit (UX reason)
45. `simplify` — test history: score, date, topics only (no answer review in v1)
46. `prompt-archaeology` (§20) — test result summary: note for future prompt improvement
47. `benchmark` — test submit: end-to-end time (error creation + test_results + map recalc)
48. `latency-critical-systems` — submit: < 1s (all 3 DB writes)
49. `tech-debt-tracker` — test review mode: show correct answers after submit in v1.1
50. `project-management` — Phase Gate 5: test sim ≥5 questions + error logging confirmed

### SCOPE
**BUILD:**
- `/src/components/test-sim/TestRunner.tsx` — active test: timer + questions + submit
- `/src/components/test-sim/TestHistory.tsx` — past tests: score, date, topics, duration
- Full `/src/app/api/error/route.ts` — POST: creates error row, returns id
- Submit chain: wrong answers → create errors → test_results row with wrong_ids[] → confusion map recalc

---

══════════════════════════════════════════════════════════════════════
## PROMPT P21 — TEXTBOOKS VIEW
**Sprint 5 | WBS 6.1–6.4 | US-017 | Phase Gate 5 target**
**Estimated: 1.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §4.4 (Progress Bars — 1px, spine marker)
   READ ui-ux-principles.md §4.2 (Buttons — register form buttons)
   READ ui-ux-principles.md §8.2 (Feedback — page update: bar animates 300ms)

2. READ ROADMAP.md US-017 (Textbook registration + progress — ALL AC)
   READ ROADMAP.md §5 (textbooks table — topic_map jsonb)
   READ ROADMAP.md §6 (GET/POST /api/textbooks)

3. READ principles.md §10 Mistake 10 (No hardcoded hex — subject accent still the exception)
   READ principles.md §5 Law 8 (Never rename — topic_map field name is frozen)

4. READ MEMORY.md — confirm P20 complete
```

### COLD START VERIFICATION
- [ ] What fields does the register form need?
- [ ] What is the topic_map structure?
- [ ] What does source health recalculate after?
- [ ] What is the source web (what does it show)?
- [ ] What does the spine marker look like?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `react-patterns` — TextbookList + RegisterForm + SourceWeb components
3. `frontend-design-direction` — spine marker: 2px colored left border (book spine metaphor)
4. `ui-design-system` — registration form: input styling (border --line2, focus --ink2)
5. `make-interfaces-feel-better` — book list: reads like a library shelf
6. `accessibility` — form: labels associated with inputs, required field indicators
7. `frontend-a11y` — form inputs: 44px min height touch target
8. `backend-patterns` — GET /api/textbooks: all books for user, POST: register new book
9. `postgres-patterns` — INSERT textbook, UPDATE sources table after registration
10. `senior-backend` — topic_map: generated by AI from book title + subject + chapter count
11. `prompt-engineer-toolkit` — topic_map generation prompt: "list topics per chapter for [book]"
12. `context-engine` — source web: topic → textbooks + captures that cover it
13. `database-reviewer` (agent) — verify textbooks insert + sources update transaction
14. `react-testing` — test: register form submit → new book appears in list
15. `/tdd` — test: after registration, sources table has new entries
16. `tdd-guide` — test: source web shows correct quality for seeded textbooks
17. `e2e-testing` — Playwright: register a book → verify in list + progress bar visible
18. `pw:generate` — generate textbooks E2E test
19. `error-handling` — duplicate title: show "Book already registered" inline
20. `security-review` — POST /api/textbooks: auth, sanitize all string fields
21. `security-reviewer` (agent) — review textbooks route
22. `/code-review` — after all textbooks components
23. `code-reviewer` (agent) — review TextbookList + RegisterForm
24. `typescript-reviewer` (agent) — Textbook type, TopicMap type, SourceQuality enum
25. `decision-logger` — log: topic_map AI-generated on registration (not manual)
26. `git-workflow` — commit: feat: add Textbooks view with registration and source web
27. `/verify` — Vercel: register book → appears in list, source web shows topics
28. `verify` — Phase Gate 5: textbook registerable, progress trackable
29. `quality-gate` — US-017 all AC checked
30. `production-audit` — Phase Gate 5 textbooks criterion
31. `self-improving-agent:remember` — log: topic_map generation quality varies by book
32. `memory:memory-persist` — textbooks operational
33. `checkpoint` — save
34. `save-session` — record state
35. `update-docs` — document source web algorithm
36. `hooks:post-task` — grep check
37. `tech-debt-tracker` — topic_map manual override: v1.1 feature
38. `agile-product-owner` — US-017 all AC: list ✓, register ✓, source web ✓
39. `react-performance` — TextbookList: static after load, no re-renders needed
40. `product-analytics` — most read books: engagement signal
41. `coding-standards` — source web in /src/components/textbooks/SourceWeb.tsx
42. `simplify` — source web: topic → list of books that cover it (no visual graph in v1)
43. `senior-fullstack` — page update: tap page count → inline number input → POST /api/textbooks
44. `decision-logger` — log: page updates are inline (no form page)
45. `react-patterns` — inline editing: page count tap → input → confirm
46. `tech-debt-tracker` — visual source map: drag-drop in v2.1 (ROADMAP §15)
47. `security-review` — topic_map: AI-generated → validate output structure before DB write
48. `benchmark` — topic_map generation: time for first registration
49. `agile-product-owner` — sprint 5 remaining: P22 retrospective after P21
50. `project-management` — Phase Gate 5 ALL criteria check after P22

---

══════════════════════════════════════════════════════════════════════
## PROMPT P22 — WEEKLY RETROSPECTIVE CRON
**Sprint 5 | WBS 7.4, 8.0 partial | US-019 | Phase Gate 5 final**
**Estimated: 1.5hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md US-019 (Weekly retrospective cron — ALL AC)
   READ ROADMAP.md §12.3 (Prompt strategy — Retrospective row)
   READ ROADMAP.md §9 Phase Gate 5 (retro criterion: manual trigger → stored in DB)
   READ ROADMAP.md §10 Risk R7+R8 (iCloud sync fail silent, retrospective rate-limited)

2. READ principles.md §15 MCP Principles §16 (Parallel Execution — retro is standalone cron)
   READ principles.md §10 Mistake 13 (No Learning Laws — log retro decisions as laws)

3. READ ui-ux-principles.md — no new UI components, just a scrollable history list

4. READ MEMORY.md — confirm P21 complete
```

### COLD START VERIFICATION
- [ ] What day and time does the retrospective cron fire?
- [ ] What 5 fields does the retrospective include?
- [ ] Where does the retro get displayed (which view)?
- [ ] What is the Vercel cron syntax for Sunday 8am?
- [ ] What does period_type 'monthly' produce (different from weekly)?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `deployment-patterns` — Vercel cron configuration (vercel.json)
3. `ci-cd-pipeline-builder` — cron job as serverless function endpoint
4. `prompt-engineer-toolkit` — retrospective prompt per §12.3: structured 5-field output
5. `prompt-optimizer` — retro prompt: factual, direct, 5 fields as JSON
6. `context-engine` — retro context: full week's sessions + goals + errors + captures
7. `token-budget-advisor` — retro: widest context window (7 days of data)
8. `ai-first-engineering` — structured output: 5 fields as JSON
9. `backend-patterns` — /api/retrospective: POST route, called by cron
10. `senior-backend` — Vercel cron: endpoint called with auth header check
11. `postgres-patterns` — retrospectives INSERT with all 5 fields
12. `database-reviewer` (agent) — verify retrospectives schema matches spec
13. `observability-designer` — cron runs: log to sync_log or dedicated cron_log table
14. `runbook-generator` — runbook: how to manually trigger retrospective
15. `react-testing` — test: POST /api/retrospective stores correct structure
16. `/tdd` — test: retrospective contains coverage_rate, consistency_rate fields
17. `tdd-guide` — test: manual trigger → retrospectives table has new row
18. `e2e-testing` — Playwright: POST /api/retrospective manually → verify DB row
19. `pw:generate` — generate retro trigger test
20. `risk-management-specialist` — R8: retro cron rate-limited → AI router fallback handles it
21. `error-handling` — cron fail: log error, next Sunday fires fresh (not retry-on-fail)
22. `security-review` — cron endpoint: CRON_SECRET header check (Vercel recommendation)
23. `security-reviewer` (agent) — review cron endpoint security
24. `senior-security` — cron: CRON_SECRET in env vars, checked in route handler
25. `senior-fullstack` — retro history UI: simple scrollable list in Today or Goals view
26. `react-patterns` — RetroHistoryList component: scrollable past retrospectives
27. `/code-review` — after /api/retrospective + RetroHistoryList
28. `code-reviewer` (agent) — review cron route
29. `typescript-reviewer` (agent) — Retrospective type, RetroPeriod union
30. `decision-logger` — log: retro stored as structured fields (coverage_rate etc.) not just text
31. `prompt-archaeology` (§20) — save retro prompt to /docs/prompts/retro-prompt-v1.md
32. `git-workflow` — commit: feat: add weekly retrospective cron with history view
33. `/verify` — manually POST /api/retrospective → verify row in retrospectives table
34. `verify` — Phase Gate 5: retro manually triggered → stored in DB. PASS.
35. `quality-gate` — Phase Gate 5 ALL criteria check
36. `production-audit` — Phase Gate 5 COMPLETE after this prompt
37. `self-improving-agent:remember` — log: Vercel cron configuration pattern
38. `memory:memory-persist` — retro cron operational, Phase Gate 5 closed
39. `checkpoint` — save
40. `save-session` — record state
41. `update-docs` — /docs/prompts/retro-prompt-v1.md
42. `hooks:post-task` — no CSS changes
43. `tech-debt-tracker` — monthly identity portrait: period_type 'monthly' deferred to v1.5
44. `agile-product-owner` — US-019 all AC: cron ✓, storage ✓, history ✓
45. `sprint-health` — Sprint 5 complete: all stories done
46. `runbook-generator` — document: how to trigger retro manually for testing
47. `project-management` — Phase Gate 5 ALL criteria:
    test sim ≥5 questions ✓, error logging ✓, confusion map updates ✓, textbooks ✓, retro ✓
    Phase Gate 5: PASS → GO → v1 feature complete. Sprint 6 polish begins.
48. `monitoring:status` — add retro cron status to /api/health endpoint
49. `canary-watch` — monitor: first real Sunday cron execution
50. `update-config` — add CRON_SECRET to env vars list

### SCOPE
**BUILD:**
- `/src/app/api/retrospective/route.ts` — POST handler + weekly data assembly + AI call
- `vercel.json` — cron configuration: `{"crons": [{"path": "/api/retrospective", "schedule": "0 8 * * 0"}]}`
- Retrospective prompt: coverage %, consistency %, velocity trend, risk goal, recommendation
- `/src/components/shared/RetroHistoryList.tsx` — scrollable past retros (add to Today or Goals)
- CRON_SECRET env var validation
- `/docs/prompts/retro-prompt-v1.md`

### MEMORY UPDATE PROTOCOL
```
Append to MEMORY.md:
---
# Phase Gate 5 — COMPLETE
Date: [today]
Result: GO — v1 Feature Complete. All 5 criteria PASS.
Retro cron: every Sunday 8am UTC via Vercel cron
# Sprint 6 — STARTED
Theme: Apple Sync + Polish + Ship
---
```

---

══════════════════════════════════════════════════════════════════════
## PROMPT P23 — APPLE iCLOUD SYNC
**Sprint 6 | WBS 8.1–8.2 | US-020 | Phase Gate 6 target**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md US-020 (Apple iCloud sync — ALL AC)
   READ ROADMAP.md §10 Risk R2 (iCloud inaccessible on Windows) + R7 (sync fails silently)
   READ ROADMAP.md §6 (/api/sync cron spec)

2. READ principles.md §3 Error Recovery — iCloud Sync Not Ingesting section
   READ principles.md §10 Mistake 13 (Log what goes wrong — sync_log table)

3. READ ui-ux-principles.md — no new components (sync is background, invisible to UI)
   But: last-sync time should show somewhere in Today view (small, --ink4 italic)

4. READ MEMORY.md — confirm Phase Gate 5 CLOSED, Sprint 6 started
```

### COLD START VERIFICATION
- [ ] What env var holds the iCloud Drive folder path?
- [ ] How does the dedup mechanism work?
- [ ] What happens with new .md files found in the folder?
- [ ] What is the cron schedule for /api/sync?
- [ ] How does R2 (Windows/iCloud accessibility) affect testing?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `deployment-patterns` — Vercel cron: /api/sync every 30min
3. `backend-patterns` — file watcher pattern in serverless (no fs.watch — use fs.readdir)
4. `senior-backend` — Node.js fs module: read directory, filter .md files, check dedup
5. `senior-fullstack` — iCloud Drive on Windows: path configuration in ICLOUD_WATCH_PATH
6. `risk-management-specialist` — R2: test with manual .md file drop first (Windows dev)
7. `error-handling` — sync fail: log to sync_log table, continue (don't crash)
8. `observability-designer` — sync_log: every run logged (files_found, files_ingested, errors)
9. `runbook-generator` — runbook: how to manually trigger sync, how to debug
10. `postgres-patterns` — dedup: SELECT filename_hash FROM captures WHERE source_type='apple_shortcuts'
11. `database-migrations` — add filename_hash column to captures (new migration)
12. `rollback-covenant` (§23) — write down() for filename_hash migration
13. `backend-patterns` — /api/sync: read dir → filter .md → check hash → call /api/ingest
14. `senior-data-engineer` — filename hash: MD5 of filename (not content) for dedup
15. `react-testing` — N/A — unit test sync logic directly
16. `/tdd` — test: file already in DB → not re-ingested (dedup works)
17. `tdd-guide` — test: new .md file → appears in captures table
18. `e2e-testing` — manual test: drop .md file in configured folder → verify ingest
19. `security-review` — ICLOUD_WATCH_PATH: validate path before fs operations (path traversal)
20. `security-reviewer` (agent) — review /api/sync for path traversal
21. `senior-security` — file reading: only .md files, MIME validation, size limit
22. `/code-review` — after /api/sync full implementation
23. `code-reviewer` (agent) — review sync + dedup logic
24. `typescript-reviewer` (agent) — SyncResult, SyncLog types
25. `decision-logger` — log: filename hash (not content hash) — faster, sufficient for dedup
26. `git-workflow` — commit: feat: add Apple iCloud sync cron with dedup
27. `/verify` — manually POST /api/sync, verify sync_log row created
28. `verify` — drop .md file, trigger sync, verify in captures table
29. `quality-gate` — US-020 AC: .md files ingested, dedup working
30. `production-audit` — Phase Gate 6 iCloud criterion
31. `self-improving-agent:remember` — log: Windows iCloud path handling
32. `memory:memory-persist` — iCloud sync operational (or stubbed if Windows inaccessible)
33. `checkpoint` — save
34. `save-session` — record state
35. `update-docs` — document sync configuration in README
36. `canary-watch` — first real sync run: monitor sync_log
37. `monitoring:status` — add last_sync_time to /api/health
38. `tech-debt-tracker` — Apple Shortcuts automation: manual for v1 (ROADMAP §15 v2.0)
39. `agile-product-owner` — US-020 AC: sync cron ✓, dedup ✓, ingest ✓
40. `risk-management-specialist` — R2: if iCloud path inaccessible on Vercel → document limitation
41. `senior-devops` — Vercel: file system is read-only on serverless — confirm iCloud approach
42. `decision-logger` — log: iCloud path via env var (ICLOUD_WATCH_PATH) — platform-specific
43. `architecture-decision-records` — ADR-012: iCloud sync approach and limitations
44. `deployment-patterns` — Vercel cron: add /api/sync to vercel.json alongside /api/retrospective
45. `performance-optimizer` — sync: process files in batches (max 10 per cron run)
46. `error-handling` — file parse fail: log, skip, continue with next file
47. `sprint-health` — Sprint 6: sync done, P24 design audit + P25 ship remaining
48. `coding-standards` — /src/lib/sync/fileProcessor.ts — sync logic in /lib not in route
49. `hexagonal-architecture` — sync route orchestrates, fileProcessor does work
50. `project-management` — Phase Gate 6 iCloud criterion: sync ingests .md files. PASS.

---

══════════════════════════════════════════════════════════════════════
## PROMPT P24 — DESIGN AUDIT + QUALITY GATES
**Sprint 6 | WBS polish | All US | Phase Gate 6 prereq**
**Estimated: 2hr session**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ui-ux-principles.md §12 (Anti-Pattern Blacklist — ALL 5 subsections)
   READ ui-ux-principles.md §14 (Phase Gate Design Checks — exact grep commands)
   READ ui-ux-principles.md §13 (Decision Framework — apply to every element found)

2. READ ROADMAP.md §11 (Quality Plan — ALL subsections: design gates, AI quality, code quality)
   READ ROADMAP.md §9 Phase Gate 6 (ALL criteria — this prompt verifies most of them)

3. READ principles.md §1 Review Gate (entire checklist — this prompt runs EVERY check)
   READ principles.md §10 Mistake 25 (Skipping Compression — do not compress yet, audit first)
   READ principles.md §24 (Compression Law — after P25, trigger first compression session)

4. READ MEMORY.md — confirm Phase Gate 5 CLOSED, P23 complete
```

### COLD START VERIFICATION
- [ ] What 4 grep commands check design compliance?
- [ ] What does Phase Gate 6 require for error handling?
- [ ] What does "no console.log" mean for the codebase at ship?
- [ ] What does the design audit find that MUST be zero?
- [ ] What is the performance requirement for Today view?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST
2. `refactor-clean` — dead code removal, unused imports, orphaned components
3. `simplify` — identify any components that can be simplified without behavior change
4. `tech-debt` — enumerate all tech debt items for v1.1 backlog
5. `tech-debt-tracker` — update ROADMAP §15 with all deferred items found
6. `plankton-code-quality` — run full code quality check
7. `code-reviewer` (agent) — full codebase review (spawn for /api, /components, /lib)
8. `typescript-reviewer` (agent) — full TypeScript strict mode check
9. `security-reviewer` (agent) — final security audit before ship
10. `security-scan` — automated vulnerability scan
11. `dependency-auditor` — npm audit — fix any HIGH/CRITICAL vulnerabilities
12. `senior-security` — RLS: verify still enabled on all 8 tables (re-check)
13. `senior-secops` — final check: service key, console logs, error messages
14. `observability-designer` — server-side logs: verify no user data in logs
15. `performance-profiler` — Today view cold start: measure on Vercel
16. `latency-critical-systems` — Today view < 2s Phase Gate requirement
17. `performance-optimizer` — fix any slow queries or large bundles found
18. `react-performance` — bundle analysis: next build --analyze
19. `benchmark` — measure all 10 API route response times
20. `analysis:performance-bottlenecks` — identify slowest routes
21. `quality-gate` — run EVERY Phase Gate 6 design check
22. `production-audit` — full Phase Gate 6 checklist
23. `design-system` — design audit: box-shadow, hardcoded hex, progress bar height, white
24. `frontend-a11y` — accessibility audit: contrast, focus, touch targets
25. `browser-qa` — visual audit in Chrome + Safari + mobile viewport
26. `e2e-testing` — run ALL Playwright tests: verify all pass
27. `pw:report` — generate test coverage report
28. `test-coverage` — verify minimum 80% coverage (or document gaps)
29. `verification-loop` — iterate: fix → verify → fix → verify
30. `/verify` — run full app demo: login → today → check task → run pomodoro → capture → test
31. `verify` — Phase Gate 6 demo: real app, real data, real Vercel
32. `runbook-generator` — final runbook: daily use, weekly retro, monthly maintenance
33. `changelog` — generate CHANGELOG.md for v1.0 based on git log
34. `docs` — final documentation check: all README files updated
35. `update-docs` — update MEMORY.md with final state
36. `update-codemaps` — update any codemaps if present
37. `monitoring:status` — verify /api/health returns clean status
38. `canary-watch` — production monitoring setup
39. `incident-commander` — define incident response for production issues
40. `decision-logger` — log: all final architectural decisions
41. `self-improving-agent:remember` — log: anything learned in Sprint 6
42. `self-improving-agent:review` — review all 17 learning laws
43. `self-improving-agent:promote` — promote key laws to permanent memory
44. `memory:memory-persist` — final pre-ship state recorded
45. `checkpoint` — save
46. `save-session` — record state
47. `git-workflow` — commit: chore: remove all console.logs and debug statements
48. `github:release-manager` — prepare v1.0 release candidate tag
49. `github:code-review` — final PR review if using branch
50. `project-management` — Phase Gate 6 checklist: all items. GO decision coming in P25.

### SCOPE
**THIS PROMPT IS AUDIT + FIX ONLY. No new features.**
**BUILD (fixes only):**
```
Run these checks and fix every violation found:

GREP CHECKS (must all return 0):
  grep -r "box-shadow" ./src --include="*.css" --include="*.tsx" --include="*.ts"
  grep -r "#[0-9A-Fa-f]{3,6}" ./src/components --include="*.tsx" --include="*.css"
  grep -r "\"white\"\|#fff\b\|#FFF\b\|#ffffff\|#FFFFFF" ./src --include="*.tsx" --include="*.css"
  grep -r "console\.log\|console\.error\|console\.warn\|debugger" ./src

STRUCTURE CHECKS:
  All API routes return { success, data, error } envelope — verify ALL 10 routes
  No function > 50 lines — run wc check on key files
  No file > 800 lines — run wc check on all components
  All catch blocks log + return structured error

DESIGN CHECKS:
  All progress bars: height 1px
  All task checkboxes: border-radius 50%
  Pomodoro ring: SVG (not CSS border-radius)
  Navigation: no icons, text only

PERFORMANCE:
  Today view cold start: < 2s on Vercel (measure with browser DevTools)
  Run: npm run build — zero warnings
```

### EXECUTION STEPS
```
Step 1: /plan — audit plan: grep → struct check → design → perf → test run.
Step 2: Run all 4 grep checks. Document findings.
Step 3: Fix ALL grep violations (box-shadow, hardcoded hex, white, console.log).
Step 4: Verify ALL 10 API routes return { success, data, error } envelope.
        Routes: /api/brief, /api/tutor, /api/test, /api/ingest, /api/session,
                /api/error, /api/goals, /api/textbooks, /api/retrospective, /api/sync
Step 5: Run wc on all components — fix any > 800 lines by extracting.
Step 6: Design check: DevTools on Vercel — progress bars 1px, checkbox 50% radius.
Step 7: Run npm run build — zero errors, zero warnings.
Step 8: Run all Playwright tests: npx playwright test. Fix any failures.
Step 9: Measure Today view cold start. If > 2s: identify bottleneck, fix.
Step 10: Security: re-run /security-review on final codebase.
Step 11: Accessibility: check contrast, focus states, touch targets.
Step 12: Update ROADMAP §15 with all tech debt items found during sprint.
Step 13: Generate CHANGELOG.md.
Step 14: Commit: chore: design audit, remove console.logs, fix all grep violations
Step 15: Tag release candidate: git tag v1.0-rc1
Step 16: Update MEMORY.md — audit complete, P25 ship decision follows.
```

### PHASE GATE 6 CHECKLIST (from ROADMAP §9)
```
[ ] Apple sync: .md files from iCloud ingested ✓ (P23)
[ ] Clean code: zero console.log, zero debug statements ✓ (this prompt)
[ ] Error handling: all 10 routes return structured errors ✓ (this prompt)
[ ] Design audit: grep checks all return 0 ✓ (this prompt)
[ ] Performance: Today view < 2s on Vercel cold start ✓ (this prompt)
```

---

══════════════════════════════════════════════════════════════════════
## PROMPT P25 — PRODUCTION VERIFICATION + SHIP
**Sprint 6 | WBS final | All US | Phase Gate 6 = PROJECT CLOSE**
**Estimated: 2hr session — THE FINAL SESSION**
══════════════════════════════════════════════════════════════════════

### MANDATORY PRE-READ
```
1. READ ROADMAP.md §9 Phase Gate 6 (ALL criteria — verify every box is checked)
   READ ROADMAP.md §13 (Project Management Cadence — Definition of Done)
   READ ROADMAP.md §1 (Charter — Success Criteria: the final acceptance test)
   READ ROADMAP.md §15 (Future Roadmap — read all v1.1+ items, do NOT build any)

2. READ principles.md §21 (Living Demo Rule — real app, real data, real Vercel)
   READ principles.md §4 (Evolution Protocol — how v1 becomes v1.1)
   READ principles.md §24 (Compression Law — schedule first compression session)
   READ principles.md Appendix Quick Reference Card — read the HARD RULES one final time

3. READ ui-ux-principles.md §13 (Decision Framework — apply the 6-question test to any final UI fixes)
   READ ui-ux-principles.md §0 (Core Philosophy — confirm the interface disappears, the work remains)

4. READ MEMORY.md — confirm P24 complete, Phase Gate 6 checklist verified
```

### COLD START VERIFICATION
- [ ] What is the success criteria from the Project Charter (§1)?
- [ ] What does "real app, real data, real Vercel" mean for Phase Gate 6 demo?
- [ ] What 8 HARD RULES must hold at ship?
- [ ] What is the Definition of Done per story (5 criteria)?
- [ ] What is the first step of Evolution Protocol for v1.1?

### SKILLS TO INVOKE
1. `/plan` — MANDATORY FIRST (final plan: verify → demo → ship)
2. `production-audit` — final production audit: full app demo on Vercel
3. `/verify` — THE final verify: complete real study session on Vercel
4. `verify` — Phase Gate 6 Living Demo Rule compliance
5. `quality-gate` — ALL Phase Gate 6 criteria: final confirmation
6. `production-validator` — confirm all features functional in production
7. `monitoring:status` — /api/health: all providers up, sync last ran
8. `canary-watch` — deploy v1.0 tag, watch for errors in first hour
9. `observability-designer` — confirm server-side logging in place
10. `incident-commander` — production issue protocol briefed
11. `security-review` — final: no secrets in git, RLS on all tables, service key server-only
12. `security-reviewer` (agent) — final security pass
13. `security-scan` — final automated scan
14. `dependency-auditor` — npm audit: zero HIGH/CRITICAL
15. `senior-devops` — Vercel: confirm correct Node version, correct env vars set
16. `deployment-patterns` — confirm auto-deploy on main branch push is active
17. `e2e-testing` — run full Playwright E2E suite on Vercel URL (not localhost)
18. `pw:report` — final test report
19. `browser-qa` — cross-browser: Chrome, Safari, mobile viewport
20. `changelog` — finalize CHANGELOG.md for v1.0
21. `github:release-manager` — create GitHub Release v1.0 with CHANGELOG
22. `github:repo-analyze` — confirm repo is clean: no sensitive files, correct .gitignore
23. `git-workflow` — final tag: git tag v1.0, push tags
24. `docs` — confirm all documentation files are current
25. `update-docs` — final MEMORY.md update
26. `update-codemaps` — update any codemaps
27. `decision-logger` — log: v1.0 ship date, all final decisions
28. `architecture-decision-records` — ADR-013: v1.0 scope close decision
29. `self-improving-agent:remember` — log: all v1 learnings as laws
30. `self-improving-agent:review` — final review of all learning laws
31. `self-improving-agent:promote` — promote key laws to permanent memory
32. `self-improving-agent:extract` — extract learnings from all 25 sessions
33. `memory:memory-persist` — v1.0 shipped: record in MEMORY.md
34. `memory:memory-usage` — check: MEMORY.md not bloated, < 200 lines
35. `save-session` — final session save
36. `checkpoint` — final checkpoint
37. `retro` — Sprint 6 retrospective
38. `project-health` — final project health check
39. `sprint-health` — Sprint 6: all done
40. `evolve` — trigger v1 → v1.1 evolution protocol (read §4)
41. `tech-debt-tracker` — final tech debt list in ROADMAP §15
42. `refactor-clean` — any last dead code
43. `simplify` — final simplification pass
44. `agile-product-owner` — all 21 user stories: verify each DONE (5-criteria definition of done)
45. `scrum-master` — sprint 6 retrospective ceremony
46. `project-management` — PMBOK Closing Process Group: project formally closed
47. `roadmap-communicator` — communicate: what v1.0 includes vs what's in backlog
48. `product-strategist` — v1.1 planning: pick top 3 items from §15 backlog
49. `product-health` — product health metrics: all features functional
50. `project-management` — Phase Gate 6 CLOSED. Project CLOSED. v1.0 SHIPPED.

### SCOPE
**THIS IS VERIFICATION AND SHIP — NO NEW CODE.**
If any Phase Gate 6 criterion fails: fix it (max 1hr), then re-verify.
If not fixable in 1hr: document as known issue, tag v1.0 anyway with issue noted.

### THE FINAL DEMO (Living Demo Rule — §21)
```
Run this exact flow on Vercel production URL (not localhost):

1. OPEN APP
   → Login with email/password
   → Redirected to Today view
   → AI brief loads (italic text, no spinner)
   → Brief mentions A Level Pure Maths or Mitchell ML

2. TODAY VIEW COMPLETE
   → Skeleton → brief text
   → Task checklist visible (tasks from seed goals)
   → Two 1px progress bars (Physics + Pure Maths textbooks)
   → Pomodoro ring visible in right panel
   → Primer and confusion map in right panel
   → Calendar strip with current week dots
   → Exam countdown card
   → Quick capture bar at bottom

3. DAILY FLOW
   → Check a task → circle fills, strikethrough → session logged
   → Start Pomodoro → ring sweeps → primer appears
   → Type in capture bar → "Captured" feedback → appears in Supabase
   → Complete Pomodoro → session logged → dots update

4. GOALS VIEW
   → Navigate to Goals
   → Expand Pure Maths → months → weeks → daily items
   → Mitchell ML shows amber
   → Spivak shows locked

5. ASK AI
   → Navigate to Ask AI
   → Context indicator shows real counts
   → Type a question → streaming response appears

6. TEST SIM
   → Navigate to Test Sim
   → Select topics → generate → ≥5 questions appear
   → Answer wrong → error logged → confusion map updates

7. TEXTBOOKS
   → Navigate to Textbooks
   → 2 seed textbooks visible with progress bars
   → Source web shows topics covered

8. VERIFY AGAINST CHARTER
   Charter success criteria: "Builder opens app → sees today's AI brief →
   completes a Pomodoro → error auto-logged → confusion map updates.
   Zero manual scheduling required."
   → All of the above demonstrated on Vercel. Zero manual scheduling used.
```

### PHASE GATE 6 FINAL CHECKLIST
```
[ ] Apple sync: .md files from iCloud ingested ✓
[ ] Clean code: grep console.log = 0 results ✓
[ ] Error handling: all 10 routes return { success, data, error } ✓
[ ] Design: grep box-shadow = 0, grep hardcoded hex in components = 0 ✓
[ ] Performance: Today view < 2s Vercel cold start ✓
[ ] Living Demo: full flow above completed on Vercel ✓
[ ] Definition of Done: all 21 stories pass 5-criteria check ✓
[ ] No console.log, no debugger, no mock data anywhere ✓
```

### SHIP
```
git tag v1.0
git push origin v1.0
gh release create v1.0 --title "Second Brain v1.0" --notes-file CHANGELOG.md
```

### MEMORY UPDATE PROTOCOL — FINAL
```
Rewrite MEMORY.md project_secondbrain.md entry:
---
# Second Brain v1.0 — SHIPPED
Date: [today]
Vercel URL: [URL]
GitHub: [URL]
All 21 user stories: COMPLETE
All 6 Phase Gates: PASSED
All 6 sprints: COMPLETE
Design tokens frozen since Sprint 1
AI router: Gemini Flash → Groq → OpenRouter
Learning laws written: [count]
Next: v1.1 planning — read ROADMAP §15, run Evolution Protocol §4
---

Schedule compression session: ROADMAP §24
Compression due: first Sunday of next month
```

---

══════════════════════════════════════════════════════════════════════
## APPENDIX — CROSS-PROMPT REFERENCE
══════════════════════════════════════════════════════════════════════

### Memory File Locations
```
MEMORY.md index:   C:\Users\Richard Amadeus\.claude\projects\
                   C--Users-Richard-Amadeus-Documents-Everything-Code-Projects-Quikphic\
                   memory\MEMORY.md

Project context:   same dir\project_secondbrain.md
Skill feedback:    same dir\feedback_proactive_skills.md
```

### Core Document Paths
```
ROADMAP.md:          C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\ROADMAP.md
principles.md:       C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\principles.md
ui-ux-principles.md: C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\ui-ux-principles.md
```

### Universal Skills (Every Prompt)
```
MANDATORY FIRST:    /plan
BEFORE FEATURES:    /tdd
AFTER CODE:         /code-review
BEFORE COMMIT:      /security-review
AFTER UI:           /verify
END OF SESSION:     memory:memory-persist, save-session, checkpoint
AFTER CSS CHANGE:   hooks:post-task (grep checks)
```

### Phase Gate Map
```
Gate 1 → P04 complete (P05 auth is the final criterion)
Gate 2 → P10 complete (Pomodoro + session logging)
Gate 3 → P13 complete (calendar strip = Today View DONE)
Gate 4 → P17 complete (Ask AI = ALL views exist)
Gate 5 → P22 complete (retrospective cron = v1 feature complete)
Gate 6 → P25 complete (production demo = PROJECT CLOSE)
```

### Prompt Dependencies (Do Not Skip)
```
P01 → P02 → P03 → P04 → P05 → P06   (Sprint 1 sequential)
P07, P08, P09, P10                    (Sprint 2 parallel after P05)
P11, P12, P13                         (Sprint 3 parallel after P10)
P14, P15, P16, P17                    (Sprint 4 parallel after P13)
P18, P19, P20, P21, P22               (Sprint 5 parallel after P17)
P23, P24, P25                         (Sprint 6 sequential)
```

### Prompt Archaeology Files Created
```
/docs/prompts/brief-prompt-v1.md       → P07
/docs/prompts/primer-prompt-v1.md      → P11
/docs/prompts/tutor-prompt-v1.md       → P17
/docs/prompts/test-gen-prompt-v1.md    → P19
/docs/prompts/ingest-tag-prompt-v1.md  → P16
/docs/prompts/retro-prompt-v1.md       → P22
```

### Design Token Quick Reference
```css
/* Backgrounds */  --cream:#FAF8F4  --cream2:#F3F0EA  --cream3:#EAE6DD
/* Text */         --ink:#1A1917    --ink2:#4A4845    --ink3:#8A8784   --ink4:#B8B5B0
/* Borders */      --line:#E2DED6   --line2:#CBC7BF
/* Semantic */     --red:#C0392B    --amber:#8B5E00   --green:#2D6A4F
/* Transitions */  --t-fast:80ms    --t-task:150ms    --t-expand:200ms  --t-progress:300ms
/* BANNED */       box-shadow: ANY  |  hardcoded hex in /components  |  height > 1px on bars
```

*build-prompts.md — Second Brain v1.0 Build System*
*25 prompts · 1,250+ skill invocations · Full PMBOK + Apple HIG compliance*
*Source: ROADMAP.md + principles.md + ui-ux-principles.md + SecondBrain_Blueprint_v2.docx*
