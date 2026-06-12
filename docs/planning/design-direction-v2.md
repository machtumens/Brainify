# Design Direction v2 — Per-View Critique & Fix List

Companion to ADR-015. Audit run 2026-06-11 against ui-ux-pro-max guidelines (§1 Accessibility, §2 Touch, §4 Style, §5 Layout, §6 Typography, §7 Animation) + manual code review.

## Cross-cutting findings

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| C1 | Card spec duplicated inline in 19 files; section label in 16 | HIGH (maintainability) | `Card` + `SectionLabel` primitives |
| C2 | No view has a true display-size `<h1>` — heading hierarchy broken (Today: none; Goals: 10px micro-label as h1; Test-Sim/Ask-AI: h2 with no h1) | HIGH (a11y + hierarchy) | `PageShell` provides 28px `--fs-display` h1; micro-labels become SectionLabel `as="h2"` |
| C3 | Desktop-only grids `'1fr 272px'` (Today, Test-Sim) overflow at 1024px | HIGH (iPad) | `.layout-sidebar` media-query classes |
| C4 | Motion system exists (`lib/motion.ts`) but only Nav consumes it | MEDIUM | PageShell entrances + stagger; redesign group wiring |
| C5 | `color: 'white'` literal in test-sim CTA (line 187) | MEDIUM (token law) | `var(--text-inverse)` + extend grep invariant |
| C6 | Skeletons implemented 3 ways (`.skeleton` class, GoalSkeleton inline, SkeletonLine) | MEDIUM | `Skeleton` primitive |
| C7 | ink3/ink4 used for load-bearing copy in places (error text on Goals page uses ink3) | MEDIUM (contrast) | ADR-015 §4 usage policy sweep |
| C8 | Z-index ad hoc (Nav/CaptureBar) | LOW | `--z-*` scale |

## Today (`/today`)

- No `<h1>`; date lives in Nav. → PageShell h1 "Today" + date/sync status into header line.
- Right column fixed `width: 272` inline → breaks ≤1024. → `.layout-sidebar__aside`; at ≤1024 becomes 2-up band (Pomodoro + ConfusionMap / Primer + Countdown) below main column.
- Task check is instant class flip — no physical feedback. → check pop (scale 1→1.15→1) + animated strikethrough, 150ms budget kept.
- PomodoroRing mode toggle is plain buttons. → segmented control with shared layoutId pill (Nav pattern), `aria-pressed` preserved.
- Sync label `--ink4` italic carries job-failure signal (red dot). Dot is color-only. → add `title` (exists) + text "job failed" for non-color signal at `--ink2`.

## Goals (`/goals`)

- `<h1>` is 10px uppercase — visually invisible. → display h1; "Weekly retrospectives" h2 stays micro-style via SectionLabel `as="h2"`.
- MacroGoalCard expands via `maxHeight: 8000` hack — easing clips, can't spring. → AnimatePresence + `height: 'auto'` springGentle.
- Chevron is text glyph `↓` rotated. → `IconChevronDown` (@tabler, already dep), consistent 1.5 stroke.
- Insight blurb fetch causes layout shift on null. → reserve one line height.
- Error text uses `--ink3` (3.4:1, sole-source). → `--ink2`.

## Test-Sim (`/test-sim`)

- Local CARD/SECTION_LABEL constants → primitives.
- Generate CTA: `'white'` → `--text-inverse`; label gains topic count ("Generate test · 3 topics").
- Setup grid `'1fr 272px'` → `.layout-sidebar`.
- Submitted: score as StatNumber (22px stat + 10px label); post-mortem staggered entrance.
- Generating skeletons keep question-card shape via Skeleton primitive.

## Ask-AI (`/ask-ai`)

- Height `calc(100vh - 56px - 72px)` magic numbers — breaks if Nav/CaptureBar change. → `(app)/layout.tsx` becomes flex column, main `min-height: 0`, chat fills naturally.
- Messages appear instantly. → fade+rise entrance per message (springGentle), opacity/transform only.
- "Thinking" indicator → 3-dot pulse (loading-indicator exemption), reduced-motion safe.
- Textarea fixed height → autosize.

## Textbooks (`/textbooks`)

- Local CARD constant carries `marginBottom: 32` baked in → move to layout gap.
- RegisterForm inputs: ensure `--r-input` radius + focus-visible ring consistency.

## Memory / Review (v1.1 pages)

- Mechanical sweep only: primitives + semantic tokens. No redesign.

## Login

- `ambient-drift` stays (signature moment). No change.
