# ADR-003: Design System Token Approach

**Date:** 2026-06-05
**Status:** Accepted
**Deciders:** Richard Amadeus
**Tags:** design-system, css, tokens, p03

## Context

P03 requires establishing the design token system before any React components are built (principles.md LAW-003: "CSS Token System Before Components"). Token decisions freeze at this point — changes require Review Gate (principles.md Law 9: "Never Change Design Tokens Without Review Gate").

## Decisions

### 1. CSS Custom Properties as source of truth

All 12 design tokens defined in `:root` in `globals.css`. Tailwind config extends theme with `var(--token)` references — no hardcoded hex values anywhere except the `:root` definitions.

**Enforcement:**
```bash
grep -r "#[0-9A-Fa-f]\{3,6\}" ./src/components  # must = 0 results
grep -r "white\b\|#fff\|#FFF\|#ffffff\|#FFFFFF" ./src  # must = 0 results
grep -r "box-shadow" ./src  # must = 0 results
```

### 2. Google Fonts CDN `<link>` over `next/font/google`

`next/font/google` self-hosts fonts at build time — eliminates Google Fonts CDN request. US-003 Acceptance Criteria requires: "Newsreader font loading confirmed in Network tab (Google Fonts CDN request)". Therefore: `<link>` tags in `layout.tsx` as specified in ui-ux-principles.md §14.

**Trade-off accepted:** Loses Next.js font optimization (no FOUT prevention, no preload). Accepted for Sprint 1. Revisit in Sprint 2 if FOUT observed on Vercel.

### 3. Newsreader over any sans-serif

ui-ux-principles.md §2.1: "A single editorial serif typeface signals craftsmanship. Two fonts signal indecision. Sans-serifs signal generic SaaS." This product is a premium study notebook, not a dashboard.

Font spec: `'Newsreader', Georgia, serif` — optical size, weight 300 + 400, normal + italic.

### 4. No Tailwind purge risk on CSS vars

CSS custom properties defined in `:root` are global and never purged by Tailwind's content scanner. Safe to use in any component without adding the file to `content` array.

## Token Reference

| Token | Value | Use |
|-------|-------|-----|
| `--cream` | `#FAF8F4` | Page background only |
| `--cream2` | `#F3F0EA` | Card hover, secondary surfaces |
| `--cream3` | `#EAE6DD` | Active/pressed, primer formula bg |
| `--ink` | `#1A1917` | Primary text, active elements |
| `--ink2` | `#4A4845` | Secondary text |
| `--ink3` | `#8A8784` | Tertiary text, placeholders |
| `--ink4` | `#B8B5B0` | Disabled, timestamps (10px+ only) |
| `--line` | `#E2DED6` | Card borders, dividers (1px only) |
| `--line2` | `#CBC7BF` | Emphasized borders, checkbox |
| `--red` | `#C0392B` | Danger state only |
| `--amber` | `#8B5E00` | Attention state only |
| `--green` | `#2D6A4F` | Test sim correct answer ONLY |

## Consequences

- Design tokens FROZEN from this commit — Law 9 in effect
- Token changes require: user approval + full grep audit + ADR update
- Playwright tests verify all 12 tokens + 5 timing vars on every CI run
- Phase Gate 1 design criterion: PASS
