# Changelog

All notable changes to Second Brain are documented here.

## [1.0.0-rc1] — 2026-06-06

### Sprint 6 — Apple Sync + Polish + Ship

#### P24 — Design Audit + Quality Gates
- Removed all `console.*` calls from client-side components and hooks (ConfusionMap, TodayPage, SourceHealthSidebar, TopicGrid, usePomodoroTimer)
- Removed all `console.*` calls from all 10 API routes (brief, error, goals, goals/insight, ingest, primer, retrospective, session, sync, test, test-results, textbooks, tutor)
- Removed all `console.*` calls from lib files (ai-router.js, context-assembler.js)
- Build: zero errors, zero warnings
- grep: box-shadow=0, hardcoded-hex=0, pure-white=0, console.*=0

#### P23 — Apple iCloud Sync (US-020)
- `/api/sync` cron (every 30 min) — scans iCloud Drive, ingests new `.md` files
- `fileProcessor.ts` — reads, sanitises, deduplicates by MD5 filename hash
- `sync_log` table — records every run: files_found, files_ingested, errors, path
- `captures.filename_hash` — dedup column prevents re-ingestion of same file
- Today view sync label — shows last sync time
- ADR-012 — documents Vercel filesystem limitation (cron reads /tmp on each cold start)
- Unit tests + E2E tests — all pass

### Sprint 5 — Test Sim + Textbooks + Retrospective

#### P22 — Weekly Retrospective Cron
- POST `/api/retrospective` — AI-generated 5-field weekly retrospective
- Vercel cron `0 8 * * 0` (Sunday 08:00 UTC) with CRON_SECRET auth
- GET `/api/retrospective` — RetroHistoryList, last 20 entries
- `/api/health` updated with `retro_cron` status

#### P21 — Textbooks + Source Web
- BookItem, BookList, RegisterForm, SourceWeb components
- POST `/api/textbooks` (register + update_page actions)
- AI-generated `topic_map` on register
- Source health recalculation on page update (pageQuality metric)
- Inline page number edit

#### P20 — TestRunner + TestHistory + Error Logging
- useTestTimer — 4-phase state machine (setup → generating → active → submitted)
- TestHistory — last 10 results
- POST `/api/test-results` — scores + wrong answers logged to errors table
- Confusion map updates after test submission
- QuestionCard --green/--red CSS variables for reveal state

#### P19 — QuestionCard + Test Generation
- QuestionCard component — MCQ with reveal, A/B/C/D options
- POST `/api/test` — AI cascade (Gemini → Groq → OpenRouter), non-streaming JSON
- Danger-zone weighted prompt — errors table biases question selection
- Source-anchored questions — textbooks + captures as context
- `docs/prompts/test-gen-prompt-v1.md` — prompt archaeology

#### P18 — TopicGrid + DifficultySelector + SourceHealthSidebar
- TopicGrid — 3-col pills, danger-zone topics listed first
- DifficultySelector — easy/medium/hard with difficultyDefaults.ts
- SourceHealthSidebar — source quality by topic, updates with selection
- `difficultyDefaults.ts` utility

### Sprint 4 — Goals + Ask AI + Ingest

#### P17 — TutorChat + Ask AI Streaming
- TutorChat component, ContextIndicator
- useChat hook — SSE streaming, conversation history
- GET `/api/tutor` — context counts
- POST `/api/tutor` — Gemini/Groq/OpenRouter cascade streaming (SSE)
- User messages right-aligned, AI left; thinking skeleton during stream

#### P16 — Full Ingest Pipeline
- textProcessor, audioProcessor (stub), imageProcessor (storage + stub)
- Mistake detection → errors table (AI analysis)
- Source quality recalculation → sources table
- POST `/api/ingest` — multipart form support, 202 Accepted

#### P15 — Goal Tracker + Amber Flag + Spivak Unlock
- goalTracker.ts — amber flag when ML >5 days missed, Spivak unlock logic
- POST `/api/goals` — recalculate, apply patches, return sorted goals
- onItemCheck callback chain — session → goals recalc

#### P14 — 4-Level Goal Hierarchy
- MacroGoalCard, MonthRow, WeekRow, DailyCheckItem components
- GET `/api/goals` — full hierarchy with status ordering
- POST `/api/goals/insight` — AI goal insight generation
- jsonb roadmap structure (months → weeks → daily items)

### Sprint 3 — Pre-session + Context + Calendar

#### P13 — CalendarStrip + ExamCountdown
- CalendarStrip — current week dots (session days highlighted)
- ExamCountdown — days until next exam from goals
- `dates.ts`, `computeVelocity.ts` utilities

#### P12 — ConfusionMap
- ConfusionMap 2x2 grid (safe / danger / watch / upcoming)
- TopicPill component
- `computeConfusionMap.ts` — derives quadrant from session + error data
- `confusionMapColors.ts`
- Context assembler updated with confusion map output

#### P11 — PrimerPanel
- PrimerPanel component — last error + formula + note before session
- GET `/api/primer` — queries errors + sessions, anti-hallucination prompt
- onStart wiring — primer loads on Pomodoro start

### Sprint 2 — Daily Loop

#### P10 — PomodoroRing
- PomodoroRing — SVG circle (r=54, circumference=339.292), animates stroke-dashoffset
- usePomodoroTimer hook — focus/break phases, 25/5 min defaults
- Session POST on focus complete

#### P09 — TextbookBar
- TextbookBar + TextbookList — 1px progress bars, 2px subject accent
- `subjectColors.ts` — per-subject color mapping

#### P08 — TaskRow + TaskList
- TaskRow — checkbox (border-radius 50%), optimistic done-state
- TaskList — session task list
- GET/POST `/api/session` — session log

#### P07 — BriefPanel
- BriefPanel — sessionStorage cache, skeleton loading
- Prompt archaeology: brief prompt v1

#### P06 — CaptureBar
- CaptureBar — pill input, 44×44px touch targets, voice (Web Speech API), camera stub
- useCapture hook
- POST `/api/ingest` (initial stub → full pipeline P16)

### Sprint 1 — Foundation

#### P05 — Auth + App Layout
- Middleware (supabase/ssr), login page, Nav (5 text-only items)
- 5 view shells: today, goals, test-sim, ask-ai, textbooks

#### P04 — AI Infrastructure
- ai-router.js — Gemini → Groq → OpenRouter cascade
- context-assembler.js — 6-table context assembly
- POST `/api/brief`, GET `/api/health`
- ADR-004: AI provider cascade (Law 15: provider name never surfaces)

#### P03 — Design System
- 12 CSS tokens frozen in globals.css :root
- Newsreader font via Google Fonts CDN
- Tailwind extended with var(--token) refs
- ADR-003: design token approach

#### P02 — Schema + RLS + Seed
- 9 tables: users, goals, textbooks, sessions, errors, captures, test_results, sources, retrospectives
- RLS enabled all tables (auth.uid() = user_id)
- Auth trigger: handle_new_user()
- TypeScript types: src/types/database.ts
- ADR-002: schema design decisions

#### P01 — Project Scaffold
- Next.js 14 app router, Vercel deploy pipeline
- Playwright E2E setup
- Newsreader font initial integration
