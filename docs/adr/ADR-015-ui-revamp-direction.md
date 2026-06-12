# ADR-015 — UI Revamp Direction (v1.2 "Evolved Identity")

**Status:** Accepted (user-approved 2026-06-11)
**Supersedes:** Nothing. Extends ADR-003 (tokens) and ADR-014 (Apple-restrained depth).
**Scope:** Token architecture growth, shared primitives, motion policy, responsive policy, contrast usage policy.

## Context

v1.0/v1.1 shipped with 12 frozen color tokens, ADR-014 depth tokens, and 36 components styled via duplicated inline style objects (card spec copied in 19 files, section label in 16). The app is desktop-only (`1fr 272px` grids break below ~1100px), has heading-hierarchy gaps (Today has no `<h1>`; Goals' `<h1>` is a 10px micro-label), and motion is wired in only one component (Nav). User approved a full revamp under three constraints: **evolve identity** (cream/Newsreader/depth soul kept), **light mode only** (dark-ready architecture), **desktop + iPad Pro 13″ M2** (1366×1024 / 1024×1366 logical).

## Decision

### 1. Token values stay frozen; token architecture grows (additive only)

`tests/e2e/design-system.spec.ts` asserts existing token values byte-for-byte. New tokens are appended, never interleaved. New layers:

- **Spacing** `--sp-1..10` — 4pt scale. Existing values map directly (gap 24 = `--sp-6`, view padding `20px 24px` = `--sp-5 --sp-6`). Card padding `14px 16px` stays as documented exception (`--sp-card`).
- **Type scale** `--fs-micro(10)/caption(12)/body-s(13)/body(14)/title(15)/stat(22)/display(28)` + `--lh-tight/body`, `--ls-label(0.07em)/stat(-0.5px)`. `--fs-display` is NEW — view headers get a real visual anchor (28px, weight 300, italic Newsreader; calm, not loud).
- **Radius/width** `--r-card(11)/pill(99)/input(6)/sm(4)`, `--w-sidebar(272)/content-max(800)/chat-max(720)`.
- **Z-index** `--z-base(0)/raised(10)/capture(90)/nav(100)/overlay(200)`.
- **Semantic aliases** (dark-mode seam): `--surface-page/hover/pressed`, `--text-primary/secondary/tertiary/faint/inverse`, `--border-default/strong`, `--state-danger/warn/success` + `--state-warn-surface/danger-surface`. Aliases point at the frozen palette. New/refactored code consumes semantic names; raw palette becomes internal. Dark mode later = one `[data-theme="dark"]` block.
- `--text-inverse: var(--cream)` legitimizes ink-filled CTAs (fixes the `color: 'white'` violation in test-sim) without breaking the no-pure-white law.

### 2. Elevation policy

- `--shadow-1` — resting cards (default, everywhere).
- `--shadow-2` — raised: hover-lift on interactive cards, sticky chrome (Nav, CaptureBar).
- `--shadow-3` — overlays only (none currently shipped; reserved).
- Never skip a level; never use shadow without border.

### 3. Motion policy (extends ADR-014)

- Two springs only: `springGentle` (surfaces, pages, expand) / `springSnappy` (controls).
- Page entrance: rise 8px + fade. List/grid children stagger 40ms.
- Press feedback: scale **0.97** on all pill buttons and interactive cards.
- Expand/collapse: framer-motion `height: 'auto'` + AnimatePresence — `maxHeight` hacks retired.
- Entrances animate opacity/transform on **always-rendered DOM** — never conditional-render content for entrance purposes (E2E stability rule).
- `<MotionConfig reducedMotion="user">` app-wide; CSS reduced-motion block remains.
- Animation = state change or spatial continuity. No decorative loops (skeleton/thinking-dots exempt as loading indicators).

### 4. Contrast usage policy (values frozen → restrict usage)

- `--ink3` (≈3.4:1 on cream): **never sole-source body copy.** Allowed: subtitles/captions accompanying primary text, placeholders, ≥15px text.
- `--ink4` (≈2.0:1): **decorative or duplicated information only** — section labels (uppercase ≥10px tracking-wide), timestamps whose info exists elsewhere, disabled states.
- Errors and load-bearing status lines use `--ink2` minimum or `--state-danger`.

### 5. Responsive policy (iPad Pro 13″ M2)

- Layout classes in `globals.css` with `@media` — inline styles cannot express media queries; one auditable file, mirrors `.skeleton` precedent.
- `.layout-sidebar`: `minmax(320px, 1fr) var(--w-sidebar)`; at `≤1024px` → single column, aside reflows to a 2-up grid band below main content.
- Applies to Today and Test-Sim. Goals/Textbooks/Ask-AI are max-width single-column — already fine at 1024.
- Touch targets stay ≥44px (already enforced). Hover remains cosmetic-only (no information behind hover).
- Playwright gains `ipad-landscape` (1366×1024) and `ipad-portrait` (1024×1366) projects.

### 6. Shared primitives

`src/components/shared/primitives/`: `Card`, `SectionLabel` (polymorphic `as` for heading hierarchy), `StatNumber`, `Pill`, `PillButton`, `Skeleton`, `InlineMessage`, `PageShell`. All pass through `data-testid` and `style`. The 19 inline card-spec copies and 16 section-label copies migrate to these; behavior identical.

## Consequences

- Dark mode becomes a one-block change later.
- E2E selector contract preserved (roles/aria/testids untouched).
- design-system.spec.ts extended additively (new tokens asserted; old assertions stay green).
- Grep invariants extended: `'white'` literal now also forbidden in src.
