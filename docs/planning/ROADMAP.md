# SECOND BRAIN — PERSONAL LEARNING OS
## Master Project Roadmap · PMBOK-Structured · v1.0
**Date:** June 2026 | **Scope:** Prototype v1 | **Builder:** Richard Amadeus  
**Source blueprint:** SecondBrain_Blueprint_v2.docx

---

## CORE DOCUMENTS (read in this order every session)
1. [`ROADMAP.md`](./ROADMAP.md) — full project spec, user stories, WBS, sprint plan
2. [`principles.md`](./principles.md) — operating rules, 250 skill index, learning laws, agent playbook
3. [`ui-ux-principles.md`](./ui-ux-principles.md) — every component, color, motion, anti-pattern rule

---

## TABLE OF CONTENTS
1. [Project Charter](#1-project-charter)
2. [Vision & Problem](#2-vision--problem)
3. [Tech Stack](#3-tech-stack)
4. [Design System](#4-design-system)
5. [Data Model](#5-data-model)
6. [API Routes](#6-api-routes)
7. [Work Breakdown Structure (WBS)](#7-work-breakdown-structure-wbs)
8. [User Stories — Full Catalogue](#8-user-stories--full-catalogue)
9. [Sprint Plan + Phase Gates](#9-sprint-plan--phase-gates)
10. [Risk Register](#10-risk-register)
11. [Quality Plan](#11-quality-plan)
12. [AI Architecture](#12-ai-architecture)
13. [Project Management Cadence](#13-project-management-cadence)
14. [Environment Variables](#14-environment-variables)
15. [Future Roadmap (Post-v1)](#15-future-roadmap-post-v1)
16. [Dependency Map](#16-dependency-map)

---

## 1. PROJECT CHARTER
*(PMBOK Initiating Process Group)*

| Field | Value |
|-------|-------|
| **Project name** | Second Brain — Personal Learning OS |
| **Version** | Prototype v1 |
| **Project purpose** | Replace passive study logbooks with a proactive AI that manages learning on the builder's behalf — detecting drift, adjusting workloads, simulating exams, surfacing insights |
| **Core philosophy** | The system comes to you. You never fill in a planner. You open the app, see what needs to happen today, execute, close it. |
| **Primary deliverable** | Deployed Next.js 14 web app on Vercel, single-user, fully functional v1 prototype |
| **Success criteria** | Builder opens app → sees today's AI brief → completes a Pomodoro → error auto-logged → confusion map updates. Zero manual scheduling required. |
| **Constraints** | Free-tier only (Vercel, Supabase, Gemini, Groq, OpenRouter). Solo builder. 2hr/day coding. |
| **Assumptions** | iCloud Drive accessible. Google AI Studio key obtainable. Supabase free tier (500MB) sufficient for prototype. |
| **In scope (v1)** | All 8 WBS work packages, all 21 user stories, 6 sprints |
| **Out of scope (v1)** | Native iOS app, multi-user, paid tiers, Anki integration, PWA mobile mode, Teaching mode (Feynman), Monthly identity portrait, drag-and-drop source web UI |
| **Project manager** | Richard Amadeus (sole) |
| **Phase 1 milestone** | Today View live on Vercel with real AI brief |
| **Phase 2 milestone** | All 5 views live, confusion map running, test sim generating questions |
| **Project close** | Weekly retrospective cron running; Apple iCloud sync auto-ingesting notes |
| **Scope change protocol** | Any new feature request goes to v1.1+ backlog. Nothing added mid-sprint without explicit charter amendment. |

---

## 2. VISION & PROBLEM
*(PMBOK Scope Management — Project Context)*

### 2.1 Vision
Second Brain is a personal operating system for an ambitious, practice-heavy learner managing multiple concurrent study tracks. Its defining characteristic is a **proactive AI that manages learning on the user's behalf** — detecting drift, adjusting daily workloads, simulating exams, and surfacing insights — so the user can focus entirely on studying, not managing a system.

### 2.2 Problems Solved

| Problem | Current State | Second Brain Solution |
|---------|--------------|----------------------|
| Fragmented notes | Apple Notes, Freeform (iPad), physical notebook, laptop | Unified ingest pipeline — all sources auto-tagged |
| No atomic task engine | No reliable macro → daily breakdown | AI generates daily tasks from weekly plan |
| Passive tools | Existing tools are passive logbooks | Proactive AI detects drift, adjusts schedule |
| Disconnected materials | Teacher PDFs across multiple sources | Auto-tags, maps to syllabus, source health |
| No exam simulation | No test engine tied to personal notes | AI synthesizes questions from own materials |
| Context switching | Multiple AI tools, no shared context | One system, one unified context, all providers |

### 2.3 User Profile

| Attribute | Value |
|-----------|-------|
| User type | Single user — the builder (prototype scope) |
| Study type | Practice-heavy: mathematics, physics, applied maths, ML theory |
| Current tools | Apple Notes, Freeform (iPad), physical notebook, laptop |
| Curriculum | College + A Level Pure Mathematics (Cambridge International) |
| Personal goals | Machine Learning (Mitchell), Applied Mathematics, Calculus (Spivak) |
| Work pattern | 2 hrs/day structured study, Pomodoro sessions, weekend review |
| Existing structure | 6-month A Level roadmap in Notion: monthly → weekly → daily; 60/40/20 split |

### 2.4 Active Goals (Seeded Data)

| Goal | Status | Current Position |
|------|--------|-----------------|
| A Level Pure Mathematics (Cambridge Intl) | Active | M1 W3: Coordinate Geometry. Tracks: Pure M1, M2/3, Stats, Mechanics. 6 months, 360 hrs |
| Physics — Serway Vol.1 | Active | Ch.3: Forces & Newton's Laws. 12 chapters, practice-heavy |
| Machine Learning — Mitchell | Active — FLAGGED AMBER | Ch.2: Decision Trees. 5 days missed → amber alert |
| Calculus — Spivak | Locked | Activates when Pure Maths M3 (Integration) completes |

---

## 3. TECH STACK
*(PMBOK Integration Management — Technical Environment)*

### 3.1 Full Stack

| Layer | Technology | Role | Notes |
|-------|-----------|------|-------|
| Browser | Next.js 14 (React) | Renders all 5 views; handles routing | Single-page app; no page reloads between views |
| Hosting | Vercel (free tier) | Deploys Next.js automatically from GitHub | Zero config; auto-deploys on every git push |
| API layer | Next.js API routes (`/api/*`) | Serverless functions for all AI calls and data ops | No separate backend needed |
| Database | Supabase (PostgreSQL) | Stores all persistent data; handles auth | Free tier: 500MB, 2 projects; real-time subscriptions available |
| File storage | Supabase Storage | Scanned notes, uploaded PDFs, voice recordings | Free tier: 1GB; bucket per content type |
| Authentication | Supabase Auth | Email/password login for single user | Row-level security; JWT tokens automatically handled |
| AI routing | `/lib/ai-router.js` | Provider fallback logic; context injection | Tries Gemini → Groq → OpenRouter; same context always |
| Primary AI | Gemini Flash (Google AI Studio) | Daily brief, tutor, test generation, auto-tagging | Free: 1,500 req/day, 1M token context |
| Fallback AI 1 | Groq + Llama 3.3 | Fast inference fallback when Gemini hits limit | Free: ~30 RPM; fastest free inference |
| Fallback AI 2 | OpenRouter (free pool) | Final fallback; routes to 30+ free models | OpenAI-compatible API; model-agnostic |
| Apple sync | iCloud Drive + Shortcuts | Exports Apple Notes folder as .md to iCloud Drive | Watched by Next.js cron endpoint |
| Share extension | iOS Share Sheet target | Pushes selected Notes/Freeform content | Calls `/api/ingest` with 2 taps |

### 3.2 Component Interaction Map

```
User opens browser
  └── Next.js serves app from Vercel
       └── User navigates to view (Today / Goals / Test Sim / Ask AI / Textbooks)
            └── Any AI action calls relevant API route
                 └── API route calls Context Assembler
                      └── Context Assembler reads Supabase:
                           goals + sessions + errors + captures + textbooks
                           └── Assembled context → AI Router
                                ├── Gemini Flash (primary)
                                ├── Groq + Llama 3.3 (fallback 1)
                                └── OpenRouter (fallback 2)
                                     └── AI response → API route
                                          └── API route writes to Supabase
                                               └── UI updates (no page reload)

Input sources:
  Voice → /api/ingest → auto-tag → Captures table
  Photo → /api/ingest → AI extracts text → Captures table
  Apple Shortcuts → iCloud Drive .md → /api/sync → /api/ingest
  Share extension → /api/ingest
  PDF upload → /api/ingest → topic mapping
```

### 3.3 AI Provider Cascade

| Provider | Free Tier | Role | Notes |
|----------|-----------|------|-------|
| Gemini Flash | 1,500 req/day | Primary | No credit card; 1M token context |
| Groq + Llama 3.3 | ~30 RPM | Fallback 1 | Fastest inference |
| OpenRouter (free) | ~20 RPM, 30+ models | Fallback 2 | OpenAI-compatible |
| Mistral (free) | 1B tokens/month | Fallback 3 | Privacy note: prompts may be used for training |

**Critical rule:** Identical context (goals, schedule, textbooks, error log, session notes) injected into every provider call. Provider is an infrastructure detail — never user-facing.

---

## 4. DESIGN SYSTEM
*(PMBOK Quality Management — Design Standards)*

> **Full tactical rules:** See [`ui-ux-principles.md`](./ui-ux-principles.md) — component specs, motion rules, anti-pattern blacklist, Phase Gate grep checks.  
> **Strategic philosophy:** `principles.md` — pending.

### 4.1 Philosophy
Inspired by Apple HIG + Anthropic product aesthetic. Minimal, warm, functional. Every element earns its visual weight by the information it carries. The interface disappears. The work remains.

**Directive:** No color for decoration. No animation for delight. No visual flourish that doesn't communicate state, action, or priority. If removing an element makes the screen cleaner without losing information, remove it.

### 4.2 Color Palette

```css
--cream:   #FAF8F4  /* Page background — warm off-white, never pure white */
--cream2:  #F3F0EA  /* Card backgrounds, hover states, secondary surfaces */
--cream3:  #EAE6DD  /* Active states, pressed states, tertiary surfaces */
--ink:     #1A1917  /* Primary text, active elements, Pomodoro ring progress */
--ink2:    #4A4845  /* Secondary text, completed-but-recent items */
--ink3:    #8A8784  /* Tertiary text, subtitles, placeholder content */
--ink4:    #B8B5B0  /* Disabled states, very secondary labels, timestamps */
--line:    #E2DED6  /* Card borders, row dividers — 1px only */
--line2:   #CBC7BF  /* Emphasized borders, hover borders */
--red:     #C0392B  /* Danger-zone topics, missing sources, flagged errors — sparingly */
--amber:   #8B5E00  /* Attention-required states: ML goal missed, watch-zone topics */
--green:   #2D6A4F  /* Correct answers in test simulator ONLY */
```

**Usage rule:** `--ink` + `--cream` covers 95% of interface. Red, amber, green appear on fewer than 5 elements per screen.

### 4.3 Typography

| Element | Spec |
|---------|------|
| Typeface | Newsreader (Google Fonts) — optical-size serif |
| Body text | 14px / weight 300 / line-height 1.5 |
| Labels + UI | 12–13px / weight 400 / italic for secondary context |
| Section labels | 10px / uppercase / letter-spacing 0.07em / `--ink4` — never bold |
| Large numbers | 18–40px / weight 300 / negative letter-spacing |
| Monospace | System mono for times, percentages, dates only |
| **Do NOT use** | Inter, Roboto, SF Pro, Arial — signal generic SaaS |

### 4.4 Component Specs

**Cards:**
- Background: `var(--cream)` — matches page, separated only by border
- Border: `1px solid var(--line)` — never 0.5px, never 2px
- Border-radius: `11px`
- Padding: `14px` vertical, `16px` horizontal
- Hover: background shifts to `var(--cream2)`
- **No shadows. Ever.**

**Buttons:**
- Default: transparent bg, `1px solid var(--line2)`, italic font, `--ink2` text
- Primary (CTA): `var(--ink)` bg, white text — one per screen max
- Destructive: `1px solid --red`, `--red` text — never filled red
- Shape: `border-radius: 99px` for standalone; `7px` for in-card
- Icon-only: 28px circle, 1px border, single Tabler outline icon at 14px

**Pomodoro Ring:**
- Outer ring: 2px stroke, `var(--line)` — the track
- Progress: 2px stroke, `var(--ink)` — fills clockwise from 12 o'clock
- Animation: `stroke-dashoffset` updates every 1s with `transition: stroke-dashoffset 1s linear`
- Timer text: 22px / weight 300 / `letter-spacing: -1px`
- Phase label: 10px italic `--ink4` — "focus" or "break", always lowercase
- Session dots: 5px circles — `--line2` empty / `--ink2` done / `--ink` current

**Task Rows:**
- Checkbox: 16px circle, `border-radius: 50%`, `1px solid var(--line2)`
- Done: fills `--ink`, white 5px inner dot, text → `--ink4` + `line-through`
- Animation: 150ms
- Tag: 10px italic `--ink4`, right-aligned — never a colored badge

**Progress Bars:**
- Height: `1px` — deliberate, not a constraint
- Track: `var(--line2)`
- Fill: `var(--ink)` — no color-coding by subject
- Label: 10px italic `--ink4`, right-aligned above bar

**Navigation:**
- Brand: 15px italic Newsreader — "second brain" lowercase, no logo
- Nav items: 13px, pill-shaped, transparent border by default
- Active: `var(--cream3)` bg, `var(--line2)` border
- **No icons. Text labels only.** (Apple HIG: icons without labels are a guessing game)

### 4.5 Apple HIG Principles Applied

| Principle | Implementation |
|-----------|---------------|
| Clarity | Every label names the thing directly. No clever metaphors. |
| Deference | Cream palette, 1px borders — study content is the hero, UI recedes |
| Depth | Card hierarchy via border + background contrast only. No gradients/shadows/blur. |
| Direct manipulation | Tap task → complete. Tap month row → expand. No confirmation dialogs for reversible actions. |
| Feedback | Task check: 150ms. Pomodoro ring: sweeps every second. AI brief: loading skeleton. |
| Consistency | All expandable sections: same ↓/↑ arrow. All progress bars: same height. |
| User control | AI suggests, never forces. User can override any AI-generated schedule adjustment. |

---

## 5. DATA MODEL
*(PMBOK Integration Management — Information Architecture)*

### 5.1 Supabase / PostgreSQL Schema

**`users`**
```sql
id          uuid PRIMARY KEY
email       text UNIQUE NOT NULL
created_at  timestamptz DEFAULT now()
preferences jsonb  -- peak_windows, daily_budget_limit, mode_defaults, provider_priority
```

**`goals`**
```sql
id              uuid PRIMARY KEY
title           text NOT NULL
category        text  -- 'curriculum' | 'personal'
status          text  -- 'active' | 'done' | 'locked'
total_months    int
current_month   int
started_at      date
roadmap         jsonb  -- nested: months → weeks → daily_checklist[]
```

**`textbooks`**
```sql
id            uuid PRIMARY KEY
title         text NOT NULL
author        text
subject       text
total_pages   int
current_page  int
active_from   date
topic_map     jsonb  -- { chapter_number: [topic_ids] }
```

**`sessions`**
```sql
id             uuid PRIMARY KEY
task_title     text
subject        text
pomodoros      int
pages_done     int
problems_done  int
difficulty     int   -- 1=light / 2=medium / 3=hard (cognitive load budget)
mode           text  -- 'struggle' | 'flow' | 'standard'
started_at     timestamptz
notes          text
```

**`errors`**
```sql
id                   uuid PRIMARY KEY
session_id           uuid REFERENCES sessions(id)
topic                text
subtopic             text
problem_type         text  -- 'algebraic'|'geometric'|'proof'|'application'|'recall'
mistake_description  text
flagged_at           timestamptz DEFAULT now()
```

**`captures`**
```sql
id           uuid PRIMARY KEY
content      text
type         text  -- 'note'|'formula'|'problem'|'explanation'|'idea'|'voice'|'photo'
subject_tag  text
topic_tag    text
source_type  text  -- 'quick_type'|'voice'|'photo'|'apple_shortcuts'|'share_extension'|'pdf'
confidence   int   -- 1-5
created_at   timestamptz DEFAULT now()
```

**`test_results`**
```sql
id          uuid PRIMARY KEY
test_type   text
subject     text
topics      text[]
score       int
total       int
duration    int   -- seconds
wrong_ids   uuid[]  -- references errors.id
created_at  timestamptz DEFAULT now()
```

**`sources`**
```sql
id             uuid PRIMARY KEY
resource_id    uuid   -- references goals.id or textbooks.id
resource_type  text   -- 'textbook' | 'capture' | 'note'
topic          text
quality        text   -- 'strong' | 'partial' | 'missing'
last_updated   timestamptz
```

**`retrospectives`**
```sql
id                uuid PRIMARY KEY
period_type       text   -- 'weekly' | 'monthly'
period_start      date
content           text
coverage_rate     decimal
consistency_rate  decimal
risk_topic        text
created_at        timestamptz DEFAULT now()
```

### 5.2 Row-Level Security Policy
All tables: `USING (auth.uid() = user_id)` — single user, full isolation.

---

## 6. API ROUTES
*(PMBOK Integration Management — Interface Specification)*

| Route | Method | Called From | What It Does |
|-------|--------|-------------|-------------|
| `/api/brief` | POST | Today view (on open) | Assembles full context; AI generates daily brief + task adjustments |
| `/api/tutor` | POST | Ask AI view | Receives user message; injects full context; streams AI response |
| `/api/test` | POST | Test Sim view | Receives topics + difficulty; AI generates questions weighted to danger-zone |
| `/api/ingest` | POST | All capture methods | Receives raw content (text/audio/image); AI auto-tags; writes to captures |
| `/api/session` | POST | Pomodoro complete | Logs: task, pages, problems, difficulty, duration, pomodoro count |
| `/api/error` | POST | Flag mistake button | Writes error: topic, subtopic, problem type, session ID |
| `/api/goals` | GET/POST | Goals view | Reads/writes goal hierarchy; updates progress; handles lock/unlock |
| `/api/textbooks` | GET/POST | Textbooks view | Reads/writes textbook progress; recalculates source health |
| `/api/retrospective` | POST | Cron — Sunday 8am | Assembles weekly data; AI generates retrospective; stores result |
| `/api/sync` | POST | Cron — every 30min | Watches iCloud Drive folder; ingests new .md files |

### 6.1 Context Assembler (runs before every AI call)
```
/lib/context-assembler.js
  Reads from Supabase:
    - goals (current week/month state, progress %)
    - sessions (last 7 days)
    - errors (all time, grouped by topic)
    - captures (last 30 days)
    - textbooks (current page, topic_map)
    - sources (quality per topic)
  Returns: unified context object injected into every AI prompt
  Token budget: trim to most recent/relevant if approaching 800k tokens
```

---

## 7. WORK BREAKDOWN STRUCTURE (WBS)
*(PMBOK Scope Management — Decomposition)*

```
SECOND BRAIN v1
│
├── 1.0 FOUNDATION                              [Sprint 1]
│   ├── 1.1 GitHub repo + Vercel deploy pipeline
│   ├── 1.2 Next.js 14 scaffold with Tailwind
│   ├── 1.3 Supabase project + 8-table schema (Section 5)
│   ├── 1.4 Single-user auth (email/password)
│   ├── 1.5 Row-level security on all tables
│   ├── 1.6 Seed data: 4 goals from Section 2.4 + sample errors
│   ├── 1.7 CSS custom properties (Section 4.2) + Newsreader font
│   └── 1.8 /lib/ai-router.js — Gemini→Groq→OpenRouter cascade
│
├── 2.0 TODAY VIEW                              [Sprint 2 + 3]
│   ├── 2.1 Two-column layout (wide left / 272px right) + capture bar
│   ├── 2.2 AI Daily Brief — POST /api/brief + loading skeleton
│   ├── 2.3 Task checklist — circle checkboxes + session log on check
│   ├── 2.4 Textbook progress bars (1px height, 2px subject accent)
│   ├── 2.5 Pomodoro SVG ring — POST /api/session on complete
│   ├── 2.6 Pre-session primer — inline, 3 elements, one AI call
│   ├── 2.7 Confusion map 2×2 (Safe/Danger/Watch/Upcoming)
│   ├── 2.8 Calendar strip (week, 3px dots) + exam countdown card
│   └── 2.9 Quick capture bar — pill shape, voice/camera/send
│
├── 3.0 GOALS VIEW                              [Sprint 4]
│   ├── 3.1 Macro goal cards (expandable, stat header)
│   ├── 3.2 Month rows (expandable, progress %)
│   ├── 3.3 Week rows (expandable, topic list)
│   ├── 3.4 Daily checklist (inline checkable)
│   ├── 3.5 Progress auto-recalculation — GET/POST /api/goals
│   ├── 3.6 ML goal amber flag (5+ days missed)
│   └── 3.7 Spivak lock/unlock logic (auto-activates on Pure M3)
│
├── 4.0 TEST SIMULATOR                          [Sprint 5]
│   ├── 4.1 Topic grid (3-col, selectable pills)
│   ├── 4.2 Difficulty slider (Easy/Medium/Hard — default 30/50/20)
│   ├── 4.3 AI question generation — POST /api/test
│   ├── 4.4 Timed test mode with countdown
│   ├── 4.5 Auto error logging on wrong answer
│   ├── 4.6 Source health sidebar (strong/partial/missing)
│   └── 4.7 Past test history panel
│
├── 5.0 ASK AI                                  [Sprint 4]
│   ├── 5.1 Context indicator bar (shows what AI sees)
│   ├── 5.2 Chat thread (user right / AI left)
│   └── 5.3 POST /api/tutor with full context, streaming response
│
├── 6.0 TEXTBOOKS                               [Sprint 5]
│   ├── 6.1 Registered book list (spine marker, progress bar)
│   ├── 6.2 Register form (title, author, subject, pages, active_from)
│   ├── 6.3 GET/POST /api/textbooks — progress tracking
│   └── 6.4 Source web by topic (topic → material mapping)
│
├── 7.0 AI ENGINE                               [Sprint 1 + 4]
│   ├── 7.1 /lib/context-assembler.js
│   ├── 7.2 POST /api/ingest — auto-tag pipeline
│   ├── 7.3 POST /api/error — flag mistake
│   └── 7.4 POST /api/retrospective — Sunday cron
│
└── 8.0 APPLE SYNC                              [Sprint 6]
    ├── 8.1 POST /api/sync cron (every 30min)
    └── 8.2 iCloud Drive .md watcher + dedup by filename hash
```

**Scope lock:** Nothing outside this WBS gets built in v1. New ideas → v1.1+ backlog.

---

## 8. USER STORIES — FULL CATALOGUE
*(PMBOK Scope Management — Requirements)*

### EPIC 0 — Foundation & Auth

---
#### US-001 · Single-user authentication · 3pts · P0
**As** the builder, **I want** to log in with email/password, **so that** my data is private and persists across sessions.

**Acceptance Criteria:**
- [ ] Supabase Auth with email/password
- [ ] JWT token handled automatically; no manual session management
- [ ] Row-level security enabled on all tables
- [ ] Redirect to Today view on successful login
- [ ] Redirect to login on expired session

---
#### US-002 · Database schema + seed data · 5pts · P0
**As** the builder, **I want** all 8 tables created with real seed data, **so that** the app has meaningful content from day one.

**Acceptance Criteria:**
- [ ] Tables: `users`, `goals`, `textbooks`, `sessions`, `errors`, `captures`, `test_results`, `retrospectives`
- [ ] Seed: 4 goals matching Section 2.4 (Maths active M1W3, Physics Ch.3, ML amber, Spivak locked)
- [ ] Seed: 5 sample errors across Pure Maths and Physics topics
- [ ] All foreign keys + indexes applied
- [ ] RLS policies on every table

---
#### US-003 · Design system global setup · 3pts · P0
**As** the builder, **I want** the full design system applied as CSS custom properties, **so that** every screen is consistent without hardcoded values.

**Acceptance Criteria:**
- [ ] Newsreader font loaded from Google Fonts, applied globally via `font-family`
- [ ] All CSS vars from Section 4.2 defined in `:root`
- [ ] Zero hardcoded hex values in any component file
- [ ] Zero `box-shadow` declarations anywhere in codebase
- [ ] Card spec verified: `1px solid var(--line)`, `border-radius: 11px`, `padding: 14px 16px`
- [ ] Progress bars globally: `height: 1px`

---

### EPIC 1 — Today View

---
#### US-004 · AI Daily Brief · 8pts · P0
**As** the builder, **I want** a 2–4 sentence AI brief generated every time I open the app, **so that** I know what needs to happen today without thinking.

**Acceptance Criteria:**
- [ ] Brief generated on every app open via `POST /api/brief`
- [ ] Context assembled from: goals, sessions (last 7 days), errors, captures
- [ ] Brief detects: missed sessions, off-pace goals, danger-zone topics, ML goal missed >5 days
- [ ] Brief shown in italic `--ink` at top of Today view
- [ ] Loading: skeleton text block (no spinner)
- [ ] Brief adjusts today's task list when drift detected; shows what changed and why
- [ ] Brief renders <2s on Gemini; falls back silently to Groq if rate-limited

---
#### US-005 · Daily task checklist · 5pts · P0
**As** the builder, **I want** today's tasks as checkable items, **so that** I can mark done with a single tap.

**Acceptance Criteria:**
- [ ] Tasks pulled from `goals.roadmap` for current week/day
- [ ] Each task: 16px circle checkbox (`border-radius: 50%`), title, right-aligned subject tag (10px italic `--ink4`)
- [ ] Check → fills `--ink`, white 5px inner dot, text → `--ink4` + `line-through`
- [ ] Check animation: 150ms
- [ ] Done state persists to `sessions` table on check
- [ ] Row hover: background → `--cream2`

---
#### US-006 · Textbook progress bars · 3pts · P0
**As** the builder, **I want** per-textbook progress bars on Today, **so that** I can track reading without opening Textbooks view.

**Acceptance Criteria:**
- [ ] One bar per active textbook
- [ ] `height: 1px`, track `--line2`, fill `--ink` — no subject color-coding
- [ ] Percentage: 10px italic `--ink4`, right-aligned above bar
- [ ] 2px vertical color accent left of each row (only per-subject color in the UI)
- [ ] Page count label: "p.47 / 120"
- [ ] Tap → navigates to Textbooks view

---
#### US-007 · Pomodoro SVG ring timer · 5pts · P0
**As** the builder, **I want** a Pomodoro timer as an SVG ring, **so that** I run focused sessions without leaving Today view.

**Acceptance Criteria:**
- [ ] SVG circle, 2px stroke, `--line` track, `--ink` fill clockwise from 12 o'clock
- [ ] `stroke-dashoffset` animates: `transition: stroke-dashoffset 1s linear`
- [ ] Default: 25min focus / 5min break
- [ ] Timer: 22px / weight 300 / `letter-spacing: -1px`
- [ ] Phase label: 10px italic `--ink4` — "focus" or "break" lowercase
- [ ] Session dots: 5px circles `--line2`/`--ink2`/`--ink`
- [ ] On complete: `POST /api/session` with task, pages, problems, difficulty, duration, pomodoros
- [ ] Struggle/Flow mode toggle visible before start

---
#### US-008 · Pre-session primer · 5pts · P0
**As** the builder, **I want** a primer before each Pomodoro with formula, last error, and own note, **so that** I enter sessions with primed working memory.

**Acceptance Criteria:**
- [ ] Inline in right column, never modal
- [ ] Element 1: key formula/concept — monospace, `--cream3` background
- [ ] Element 2: last error in this topic — `--red` italic weight 300
- [ ] Element 3: one line from own notes — `--ink3` italic
- [ ] Data: `textbooks.topic_map` + `errors` table + `captures` table
- [ ] One Gemini API call per session start
- [ ] Dismissible after 10s on repeat sessions; mandatory first occurrence
- [ ] If no errors exist: element 2 shows "No errors logged yet" in `--ink4`

---
#### US-009 · Confusion map 2×2 · 5pts · P0
**As** the builder, **I want** a 2×2 confusion map, **so that** I instantly see where my exam risk is.

**Acceptance Criteria:**
- [ ] Four cards, flat backgrounds (no shadows):
  - Safe: `--cream2` bg, `--ink4` label, pills in `--cream3`
  - Danger: `#FDF0EF` bg, `--red` label, pills in `#F5D9D7`
  - Watch: `#FDF8EF` bg, `--amber` label, pills in `#F5E8D0`
  - Upcoming: `--cream2` bg, `--ink4` label, reduced opacity
- [ ] Placement from: `sessions` (coverage) + `errors` (confidence proxy)
- [ ] Danger zone feeds test simulator weighting
- [ ] Recalculates after every session complete, error flag, or test submit

---
#### US-010 · Calendar strip + exam countdown · 3pts · P0
**As** the builder, **I want** a calendar strip and exam countdown, **so that** I always know my runway.

**Acceptance Criteria:**
- [ ] Calendar: current week, 3px dots per day (done/planned/rest)
- [ ] Countdown: "X days to mock. At current pace, Y topics unfinished. Adjusted daily load: Z pages."
- [ ] Calculated from exam date in `goals` + session velocity
- [ ] Updates after every session log

---
#### US-011 · Quick capture bar · 5pts · P0
**As** the builder, **I want** a pill-shaped capture bar always visible at every screen's bottom, **so that** I capture any thought in 2 taps.

**Acceptance Criteria:**
- [ ] `border-radius: 99px` pill, persistent on all 5 views
- [ ] Three icon buttons (28px circles, 1px border, Tabler outline icon): voice, camera, send
- [ ] Text input: single-line, pill-shaped
- [ ] Submit → `POST /api/ingest` → AI auto-tags
- [ ] Success: input clears, inline "Captured" fades in 150ms — no modal
- [ ] Voice: opens mic, transcribes on release, shows transcription before send

---

### EPIC 2 — Goals View

---
#### US-012 · 4-level goal hierarchy · 8pts · P0
**As** the builder, **I want** expandable Macro → Month → Week → Daily cards, **so that** I have one source of truth for my study roadmap.

**Acceptance Criteria:**
- [ ] Level 1 (Macro): title, category badge, total months, total hours, end milestone, status chip
- [ ] Level 2 (Month): expandable — title, topic summary, week count, progress %, status
- [ ] Level 3 (Week): expandable — topic list, daily focus, status
- [ ] Level 4 (Daily): inline checkable, AI-generated from week plan
- [ ] Expand/collapse: `↓`/`↑` chevron — same pattern across all expandable sections
- [ ] Locked goals: reduced opacity + lock indicator
- [ ] AI insight blurb per goal: behind-pace flag, risk surface

---
#### US-013 · Goal progress auto-tracking · 5pts · P0
**As** the builder, **I want** goal progress to update automatically from sessions, **so that** I never track manually.

**Acceptance Criteria:**
- [ ] 3-stat header: sessions completed / topics covered / % to milestone
- [ ] Week track bar (`1px`) below weekly rows
- [ ] `GET/POST /api/goals` recalculates on every session post
- [ ] ML (Mitchell) auto-flags amber at 5+ days missed
- [ ] Spivak auto-activates when Pure Maths M3 completes (status: locked → active)
- [ ] All changes immediate; no page reload

---

### EPIC 3 — Test Simulator

---
#### US-014 · Topic selector + AI question generation · 8pts · P0
**As** the builder, **I want** to select topics and get AI-generated questions weighted to my weak areas, **so that** I practice what I'm actually bad at.

**Acceptance Criteria:**
- [ ] Topic grid: 3-column, pills selectable by tap
- [ ] Difficulty slider: Easy/Medium/Hard — default 30/50/20
- [ ] `POST /api/test` synthesizes from: textbooks + captures + error log + session logs
- [ ] Questions weighted toward Danger-zone topics from confusion map
- [ ] Source health sidebar: warns when topic has no mapped source
- [ ] Source health states: strong / partial / missing

---
#### US-015 · Timed test + auto error logging · 5pts · P0
**As** the builder, **I want** a timed simulation with automatic error logging, **so that** every wrong answer feeds back into my confusion map.

**Acceptance Criteria:**
- [ ] Countdown timer visible during test; configurable duration
- [ ] Question card: question, 4 options, submit
- [ ] Wrong answers auto-logged to `errors` table (topic, subtopic, problem type)
- [ ] Confusion map recalculates on submit
- [ ] Result stored in `test_results` with score, topics, wrong_ids, duration
- [ ] Past history visible (score, date, topics)
- [ ] Exam countdown widget visible in sidebar

---

### EPIC 4 — Ask AI

---
#### US-016 · Full-context AI tutor chat · 5pts · P0
**As** the builder, **I want** a tutor chat with full context auto-injected, **so that** the AI already knows my goals, errors, and notes.

**Acceptance Criteria:**
- [ ] Context indicator bar: shows what AI sees (goals/errors/captures/textbooks/sessions/confusion map)
- [ ] Thread: user messages right, AI messages left
- [ ] `POST /api/tutor` injects full unified context before every message
- [ ] Streams AI response
- [ ] Text input + send at bottom
- [ ] Provider never shown to user

---

### EPIC 5 — Textbooks

---
#### US-017 · Textbook registration + progress · 5pts · P1
**As** the builder, **I want** to register books and log pages, **so that** the AI can map materials to topics and track coverage.

**Acceptance Criteria:**
- [ ] List: spine-color marker, title, author, progress bar (`1px`), page/chapter label
- [ ] Register form: title, author, subject, total pages, active_from
- [ ] `GET/POST /api/textbooks`
- [ ] `topic_map`: chapter → topic_ids
- [ ] Source web: books mapped to syllabus topics
- [ ] Source health (strong/partial/missing) recalculates on new registration or page log

---

### EPIC 6 — AI Engine

---
#### US-018 · AI provider cascade router · 5pts · P0
**As** the builder, **I want** seamless Gemini → Groq → OpenRouter fallback, **so that** rate limits never cause a hard stop.

**Acceptance Criteria:**
- [ ] `/lib/ai-router.js` handles all provider calls
- [ ] Order: Gemini Flash → Groq + Llama 3.3 → OpenRouter
- [ ] Identical context injected regardless of provider
- [ ] Fallback is silent — no provider name or error shown to user
- [ ] Context Assembler runs before every call
- [ ] Env vars: `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`

---
#### US-019 · Weekly retrospective cron · 5pts · P0
**As** the builder, **I want** an AI retrospective generated every Sunday at 8am, **so that** I have a weekly review with zero manual effort.

**Acceptance Criteria:**
- [ ] `POST /api/retrospective` cron fires Sunday 8am
- [ ] Content: topics covered vs planned (%), sessions vs scheduled (%), velocity trend, most-at-risk goal, one recommendation
- [ ] Stored in `retrospectives` table `period_type: weekly`
- [ ] Scrollable history viewable
- [ ] `period_type: monthly` = AI identity portrait (3–5 sentences about learning character)

---

### EPIC 7 — Knowledge Capture

---
#### US-020 · Apple iCloud sync · 8pts · P1
**As** the builder, **I want** Apple Notes auto-exported as .md and ingested automatically, **so that** my existing note workflow is unchanged.

**Acceptance Criteria:**
- [ ] `POST /api/sync` cron every 30 minutes
- [ ] Watches configured iCloud Drive folder for new `.md` files
- [ ] New files ingested via `/api/ingest`
- [ ] Dedup: skip files already in `captures` (by filename hash)
- [ ] Ingest: AI auto-tags subject, content type, topic, textbook association

---
#### US-021 · Auto-tagging ingest pipeline · 5pts · P0
**As** the builder, **I want** any captured content auto-tagged and stored, **so that** I never manually categorize a note.

**Acceptance Criteria:**
- [ ] `POST /api/ingest` accepts: text / audio / image / PDF / markdown
- [ ] AI assigns: `subject_tag`, `content_type`, `topic_tag`, associated textbook
- [ ] Written to `captures` with full metadata
- [ ] If content contains flagged mistake → `errors` updated, confusion map recalculated
- [ ] Source web recalculates after every ingest
- [ ] Photo/scan: AI extracts text from handwritten page or Freeform screenshot

---

## 9. SPRINT PLAN + PHASE GATES
*(PMBOK Schedule Management + Monitoring & Controlling)*

### Sprint Overview

| Sprint | Stories | Points | Theme | Estimated Duration |
|--------|---------|--------|-------|--------------------|
| Sprint 1 | US-001, 002, 003, 018 | 16 | Foundation: auth, schema, design system, AI router | ~1 week |
| Sprint 2 | US-004, 005, 006, 007 | 21 | Today View core: brief, tasks, textbooks, Pomodoro | ~1.5 weeks |
| Sprint 3 | US-008, 009, 010, 011 | 18 | Today View complete: primer, confusion map, calendar, capture | ~1 week |
| Sprint 4 | US-012, 013, 016, 021 | 23 | Goals hierarchy + Ask AI tutor + Ingest pipeline | ~1.5 weeks |
| Sprint 5 | US-014, 015, 017, 019 | 23 | Test Sim + Textbooks + Weekly Retrospective | ~1.5 weeks |
| Sprint 6 | US-020 + polish | 8+ | Apple sync + dead code clean + design polish | ~1 week |
| **TOTAL** | **21 stories** | **109 pts** | | **~8 weeks @ 2hr/day** |

---

### Phase Gates
*(PMBOK Phase Gate: compare progress to charter. Decision: continue / modify / stop.)*

---
#### PHASE GATE 1 — End of Sprint 1
**Theme:** Foundation locked. Nothing else built until this passes.

| Criterion | Pass condition |
|-----------|---------------|
| Deploy | App loads on Vercel URL with no errors |
| Auth | Email/password login redirects to Today view |
| Schema | All 8 tables visible in Supabase dashboard |
| Seed | 4 goals + 5 sample errors present in DB |
| Design | Newsreader loading, CSS vars in use, no hardcoded hex |
| AI Router | `/api/brief` returns any response (Gemini or fallback) |

**→ GO:** Proceed to Sprint 2
**→ NO-GO:** Fix infrastructure. Do not start any UI work.

---
#### PHASE GATE 2 — End of Sprint 2
**Theme:** Today View core usable as a daily driver.

| Criterion | Pass condition |
|-----------|---------------|
| Brief | Generates from real Supabase data, reflects seeded goals |
| Tasks | Checkable, session logged to DB on check |
| Progress bars | 1px height, no color-coding by subject |
| Pomodoro | SVG ring sweeps, session POSTed on complete |
| Design | No box-shadow anywhere in codebase (`grep -r "box-shadow"` = 0 results) |

**→ GO:** Proceed to Sprint 3

---
#### PHASE GATE 3 — End of Sprint 3
**Theme:** Today View complete. First fully usable daily session.

| Criterion | Pass condition |
|-----------|---------------|
| Primer | Pulls real last error + formula + own note from DB |
| Confusion map | Populates from session + error seed data (not placeholder) |
| Confusion map behavior | Recalculates after logging a new session |
| Capture bar | Submit sends to `/api/ingest`, content appears in Captures table |
| Calendar | Current week dots accurate |

**→ GO:** Core daily loop functional. Product is now a daily driver.

---
#### PHASE GATE 4 — End of Sprint 4
**Theme:** Full product skeleton — all 5 views navigable.

| Criterion | Pass condition |
|-----------|---------------|
| Goals | All 4 levels expand/collapse with correct data |
| Spivak | Locked goal shown correctly; unlock logic wired |
| ML flag | Mitchell goal shows amber after 5 missed days |
| Ask AI | Chat streams response with context indicator bar showing real data |
| Ingest | Voice/text capture auto-tags correctly in DB |

**→ GO:** All views exist. Core AI loop complete.

---
#### PHASE GATE 5 — End of Sprint 5
**Theme:** Feature complete v1.

| Criterion | Pass condition |
|-----------|---------------|
| Test Sim | AI generates ≥5 relevant questions from actual textbook/error data |
| Error logging | Wrong answers appear in `errors` table after test |
| Confusion map | Updates after test submission |
| Textbooks | Book registerable, progress trackable, source web visible |
| Retrospective | Sunday cron fires (or manual trigger); result stored in DB |

**→ GO:** v1 feature complete. Proceed to polish.

---
#### PHASE GATE 6 — End of Sprint 6 = PROJECT CLOSE
**Theme:** Shippable v1.0.

| Criterion | Pass condition |
|-----------|---------------|
| Apple sync | .md files from iCloud ingested on trigger or cron |
| Clean code | Zero `console.log`, zero debug statements |
| Error handling | All 10 API routes return structured errors (never crash 500) |
| Design audit | `grep -r "box-shadow"` = 0, `grep -r "px\" }" ` on bars = 1px only |
| Performance | Today view loads in <2s on Vercel cold start |

**→ SHIP:** v1.0 prototype deployed and operational.

---

## 10. RISK REGISTER
*(PMBOK Risk Management)*

| # | Risk | Probability | Impact | Score | Response Strategy |
|---|------|-------------|--------|-------|------------------|
| R1 | Gemini rate limit (1,500/day) hit during dev | High | Medium | **HIGH** | AI router built in Sprint 1. Dev uses Groq for testing. |
| R2 | iCloud Drive inaccessible on Windows dev machine | Medium | High | **HIGH** | Test with manual .md file drop first. Automate in Sprint 6. |
| R3 | Supabase free tier 500MB fills during dev | Low | Medium | **LOW** | Compress images at ingest. Monitor storage dashboard weekly. |
| R4 | Scope creep — adding features before v1 ships | High | High | **CRITICAL** | Charter scope lock. WBS frozen. New ideas → v1.1+ backlog only. |
| R5 | AI context exceeds Gemini 1M token window | Low | High | **MEDIUM** | Context Assembler trims to most recent 30 days + top errors. |
| R6 | Confusion map empty on first run (no error data) | High | Medium | **HIGH** | Seed 5 sample errors in Sprint 1. Graceful empty state required. |
| R7 | iCloud sync cron fails silently | Medium | Medium | **MEDIUM** | Log all sync runs to `sync_log` table. Surface last-sync time in UI. |
| R8 | Sunday retrospective cron Gemini rate-limited | Medium | Medium | **MEDIUM** | Retrospective uses same AI router fallback — already handled. |
| R9 | Pre-session primer hallucinates formula/error | Medium | High | **HIGH** | Primer prompt explicitly cites DB data. Add source citation to response. |
| R10 | Build breaks on Vercel (Windows dev / Linux prod mismatch) | Low | High | **MEDIUM** | Test deploy to Vercel after every sprint, not just at the end. |

### Risk Response Protocol
1. R4 (scope creep) — **Owner: Richard. Check: before every sprint start.** Any new idea gets a title and goes to Section 15. Nothing else.
2. R9 (hallucination) — Primer prompt must include: "Use only the following DB data: [error record], [capture record], [textbook chapter]. Do not invent."
3. R6 (empty confusion map) — Sprint 1 seed script includes 5 errors + 3 sessions minimum.

---

## 11. QUALITY PLAN
*(PMBOK Quality Management)*

### 11.1 Design Quality Gates (checked every Phase Gate)

| Check | Method | Pass condition |
|-------|--------|---------------|
| No box-shadows | `grep -r "box-shadow" ./` | 0 results |
| No hardcoded hex | `grep -r "#[0-9A-Fa-f]\{3,6\}" ./components` | 0 results |
| Progress bar height | `grep -r "height" ./components` review | All bars = `1px` |
| Task checkbox shape | Code review | `border-radius: 50%` not `border-radius: 4px` |
| Pomodoro is SVG | Code review | SVG `<circle>` element, not CSS border-radius ring |
| Newsreader loaded | Browser DevTools > Network | Font file from Google Fonts present |
| No icons in nav | Visual inspection | Nav items are text labels only |

### 11.2 AI Response Quality Gates (checked at Phase Gates 3–6)

| Check | Method | Pass condition |
|-------|--------|---------------|
| Brief detects drift | Manual test: miss 3 days then open app | Brief mentions missed sessions explicitly |
| Primer uses real data | Manual test: check primer against errors table | Formula + error match DB, not generic |
| Test questions from own materials | Manual test | At least 1 question references a textbook chapter or captured note |
| Tutor context indicator | Visual check | Context bar shows real goal/error/session counts, not "0" |
| Provider fallback | Manual test: exhaust Gemini quota | App continues working via Groq |

### 11.3 Code Quality Standards

- Functions: <50 lines
- Files: <800 lines; extract when approaching limit
- Error handling: every API route returns `{ success, data, error }` envelope
- No silent errors: every catch block logs + returns structured error
- RLS on every table: no direct Supabase client calls from browser with service key
- Context assembler: never exposes service role key to client

---

## 12. AI ARCHITECTURE
*(PMBOK Integration Management — AI Subsystem)*

### 12.1 /lib/ai-router.js — Cascade Logic

```
function callAI(prompt, context) {
  providers = [gemini, groq, openrouter]
  for provider in providers:
    try:
      return await provider.complete(buildPrompt(prompt, context))
    catch RateLimitError:
      continue
    catch Error:
      log(error)
      continue
  throw "All providers exhausted"
}
```

### 12.2 /lib/context-assembler.js — What Gets Injected

```
{
  goals: [{ title, category, status, current_month, current_week, roadmap_this_week }],
  sessions: [last 7 days: { task, subject, pomodoros, difficulty, notes }],
  errors: [all time, sorted by frequency: { topic, subtopic, problem_type, count }],
  captures: [last 30 days: { content, type, subject_tag, topic_tag }],
  textbooks: [{ title, subject, current_page, total_pages, current_chapter }],
  confusion_map: { danger: [topics], watch: [topics], safe: [topics] },
  exam_countdown: { days_remaining, topics_unfinished, adjusted_daily_load }
}
```

### 12.3 Per-Feature Prompt Strategy

| Feature | Prompt directive | Key constraint |
|---------|-----------------|----------------|
| Daily Brief | "In 2-4 sentences, plain language. Detect drift. Surface danger topics. Flag ML if >5 days missed. Adjust today's tasks if needed." | Must reference specific session + goal data |
| Pre-session Primer | "Return exactly 3 items: (1) key formula for [topic], (2) user's last error: [error record], (3) user's own note: [capture record]. Use only provided data." | No hallucination — cite DB data only |
| Test Gen | "Generate [N] questions for [topics]. Weight toward danger-zone: [topics]. Difficulty distribution: [30/50/20]. Use materials: [textbook chapters + captures]." | Source-anchored questions only |
| Tutor | "You are a patient study tutor. Full context provided. Answer the question using the user's own materials where possible." | Streaming required |
| Retrospective | "Weekly report. Tone: direct, factual. Cover: coverage rate, consistency rate, velocity trend, highest-risk goal, one actionable recommendation." | Store structured fields separately |

---

## 13. PROJECT MANAGEMENT CADENCE
*(PMBOK Monitoring & Controlling + Closing Process Groups)*

### 13.1 Solo Project Rhythm

| Cadence | Action |
|---------|--------|
| **Before each sprint** | Review Phase Gate checklist from prior sprint. Confirm all criteria met before writing new code. |
| **Each coding session (2hr)** | Pick one WBS work package. Complete it. Don't start the next until current is done. |
| **End of sprint** | Deploy to Vercel. Run Phase Gate checklist manually. Record Go/No-Go decision. |
| **Weekly (Sundays)** | AI retrospective fires automatically (Sprint 5+). Read it. Adjust next week's focus if needed. |
| **Scope change request** | Write the idea down in Section 15 future roadmap. Do not build. No exceptions during v1. |

### 13.2 Definition of Done (Per Story)
A user story is done when:
- [ ] Feature works end-to-end on Vercel (not just localhost)
- [ ] Supabase data reflects expected changes
- [ ] Design spec matched (no regressions: shadow, hardcoded hex, etc.)
- [ ] No `console.log` or `debugger` in committed code
- [ ] At least one happy-path manual test completed

### 13.3 Change Request Process
1. Idea identified during development
2. Write title + 1-sentence rationale in Section 15 backlog
3. Do not implement
4. Review backlog at Phase Gate 6
5. Scope v1.1 charter if worth building

---

## 14. ENVIRONMENT VARIABLES
*(PMBOK Resource Management — Infrastructure Config)*

```bash
# Supabase — from project settings > API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server-side only. Never expose to browser.

# AI Providers — all free tier, no credit card required for prototype
GEMINI_API_KEY=                  # aistudio.google.com — free, 1,500 req/day
GROQ_API_KEY=                    # console.groq.com — free, instant signup
OPENROUTER_API_KEY=              # openrouter.ai — free tier available

# Optional: iCloud sync path (server-side only)
ICLOUD_WATCH_PATH=               # Absolute path to watched iCloud Drive folder
```

**Security rules:**
- `SUPABASE_SERVICE_ROLE_KEY` used only in `/api/*` routes — never in client components
- All keys in `.env.local` — never committed to git
- Add `.env.local` to `.gitignore` before first commit (Sprint 1)
- Vercel env vars set via dashboard, not CLI

---

## 15. FUTURE ROADMAP (Post-v1)
*(PMBOK Scope Management — Out of Scope Backlog)*

Items below are **locked out of v1**. They exist here to park ideas without scope creep.

| Version | Feature | Description |
|---------|---------|-------------|
| v1.1 | Dead time mobile mode | PWA-optimized single-screen passive review for phone; AI-queued content |
| v1.2 | Weekly retrospective history UI | Full scrollable history with trend charts |
| v1.3 | Cognitive load budget | Difficulty weighting, peak window detection, late-night task warnings |
| v1.4 | Teaching mode (Feynman) | Voice-record explanation; AI evaluates accuracy; mastery note stored |
| v1.5 | Monthly identity portrait UI | Timeline of monthly AI portraits |
| v1.6 | Spaced repetition built-in | Problem-type SR; micro-sessions in Today view; no Anki required |
| v1.7 | Struggle/Flow mode full implementation | Session length + AI style adjustment |
| v2.0 | Full Apple sync | Automated iCloud Drive watcher + native iOS share extension |
| v2.1 | Source web full UI | Visual topic-to-material mapping with drag-and-drop |
| v2.2 | Exam calendar integration | Sync with college exam schedule; auto-set milestone dates |

---

## 16. DEPENDENCY MAP
*(PMBOK Schedule Management — Sequencing)*

```
US-001 (auth)
  └─ US-002 (schema + seed)
       └─ US-003 (design system)
            │
            ├─ US-018 (AI router) ◄──────────────── ALL AI stories depend on this
            │
            ├─ US-004 (daily brief) ──── requires US-018
            ├─ US-005 (tasks) ──── requires US-002
            ├─ US-006 (textbook bars) ──── requires US-017
            ├─ US-007 (Pomodoro) ──── requires US-002
            │    └─ US-008 (primer) ──── requires US-007 + US-018
            ├─ US-009 (confusion map) ──── requires US-005 + US-007 (session data)
            │    └─ US-014 (test topics) ──── requires US-009
            ├─ US-010 (countdown) ──── requires US-002
            ├─ US-011 (capture bar) ──── requires US-021
            │
            ├─ US-012 (goals hierarchy) ──── requires US-002
            │    └─ US-013 (goal tracking) ──── requires US-012 + US-007
            │
            ├─ US-016 (ask AI) ──── requires US-018
            │
            ├─ US-014 (test sim) ──── requires US-018 + US-009
            │    └─ US-015 (timed test) ──── requires US-014
            │
            ├─ US-017 (textbooks) ──── requires US-002
            │
            ├─ US-019 (retrospective cron) ──── requires US-018 + US-007 + US-012
            │
            ├─ US-021 (ingest pipeline) ──── requires US-018
            │    └─ US-020 (iCloud sync) ──── requires US-021
            │
            └─ US-015 (error logging) ──── feeds back into US-009 (confusion map)
```

---

## APPENDIX — QUICK REFERENCE

### 5 PMBOK Process Groups Applied

| Process Group | Second Brain Mapping |
|---------------|---------------------|
| **Initiating** | Section 1 (Charter) + Section 2 (Vision) |
| **Planning** | Sections 3–8 (tech stack, design, data, API, WBS, user stories) |
| **Executing** | Sprints 1–6 (Section 9) |
| **Monitoring & Controlling** | Phase Gates (Section 9) + Quality Plan (Section 11) + Risk Register (Section 10) |
| **Closing** | Phase Gate 6 = Project Close → v1.0 shipped |

### 10 PMBOK Knowledge Areas Applied

| Knowledge Area | Applied As |
|----------------|-----------|
| Integration | AI Router + Context Assembler — connects all data, all providers, all views |
| Scope | WBS (Section 7) + scope lock rule + v1.1+ backlog |
| Schedule | 6-sprint plan + phase gates |
| Cost | $0 (free tier) — monitored by Supabase storage + API quota dashboards |
| Quality | Section 11 — design gate checklists + AI response quality tests |
| Resource | Solo builder, 2hr/day — sprint capacity capped at 23 pts |
| Risk | Section 10 — 10 risks, responses defined |
| Procurement | N/A (no vendors, no contracts) |
| Communications | N/A (solo project) |
| Stakeholder | You (single stakeholder) — acceptance criteria per story = stakeholder sign-off |

---

*End of ROADMAP.md — Second Brain Personal OS v1.0*
*Generated: June 2026 | Source: SecondBrain_Blueprint_v2.docx + PMBOK 6th Edition*
