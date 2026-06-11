# ADR-014 — Design Law Amendment v2: Apple-restrained depth

**Date:** 2026-06-11
**Status:** Accepted (user-approved during v1.1 planning)
**Supersedes:** the "no depth effects, no exceptions" clause of the v1.0 design laws (ADR-003 / ui-ux-principles.md Law 9). All other laws stand.

## Context

v1.0 froze a deliberately flat design: depth via border + background contrast only, `box-shadow` grep-audited to zero. After shipping, the user judged the result "bland" and explicitly requested an "Anthropic × Apple" feel — dimensionality and motion — while keeping the cream/ink palette and Newsreader.

Token changes require explicit user approval per Law 9; that approval was given 2026-06-11 (plan question "Design law", answer "Apple-restrained depth"; motion stack "Framer Motion only").

## Decision

1. **Three elevation tokens, warm-tinted:** `--shadow-1/2/3` use `rgba(26,25,23,…)` (ink-tinted, never neutral gray). Resting cards sit at `--shadow-1`; focus/hover at `--shadow-2`; modal/login at `--shadow-3`.
2. **Glass:** `--blur-glass` (saturate + 14px blur) for sticky surfaces (CaptureBar) only.
3. **Motion:** Framer Motion with exactly two springs (`lib/motion.ts`: gentle 320/32, snappy 500/34). Page entrances via `(app)/template.tsx`; nav active pill morphs with `layoutId`. CSS spring approximations exposed as `--spring-gentle/--spring-snappy`.
4. **Reduced motion:** global `prefers-reduced-motion` collapse in `globals.css`; framer paths check `useReducedMotion`.
5. **Amended grep invariant:** hardcoded `box-shadow` *values* remain forbidden in components; only `boxShadow: 'var(--shadow-*)'` (or `'none'`) is legal. The audit changes from "box-shadow = 0" to "box-shadow not using var(--shadow-*) = 0". SVG `drop-shadow` filters for the Pomodoro ring glow are the one sanctioned exception (no var() syntax exists for filter shadows).

## Consequences

- Design system gains 8 tokens (3 shadows, 1 blur, 1 gradient, 2 springs + ambient-drift keyframe); palette and typography untouched.
- Bundle grows ~32kb gzip (framer-motion).
- `tests/e2e/design-system.spec.ts` extended with depth-token assertions; the body-level no-shadow check stays (page background remains flat).
- Future shadows MUST reference tokens — adding a fourth elevation requires a new ADR.
