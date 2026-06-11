# UI/UX PRINCIPLES — SECOND BRAIN
## Applied Apple HIG · Humanistic Tool Design · v1.0
**Source:** Apple Human Interface Guidelines · hosseini-rtr/apple-design-principles · Blueprint v2  
**Philosophy:** The interface disappears. The work remains.

---

## THE ONE RULE

> *"We try to develop products that seem somehow inevitable — that leave you with the sense that that's the only possible solution that makes sense."*  
> — Jonathan Ive

Every element in this UI must pass the **Inevitability Test**:  
**"Is this the only possible solution that makes sense here?"**  
If you can imagine removing it without losing meaning → remove it.  
If you can imagine a simpler version → build the simpler version.  
This is not minimalism for aesthetics. This is precision.

---

## 0. CORE PHILOSOPHY

### The Tool That Disappears
Second Brain is a **tool**, not a product. It should feel like a well-made instrument — a good pen, a clean notebook — where the interface has no personality of its own. The user's study content is the personality.

- UI recedes. Content leads. Always.
- No element exists to impress. Every element exists to communicate.
- The measure of good UI here: user opens app, sees what to do, does it, closes app. No friction at any step.
- "Humanistic" means: warm materials (cream, not white), readable type (serif, not sans), natural rhythm (breathing whitespace, not packed grids).

### The Three HIG Pillars (Applied)

| Pillar | Apple Definition | Second Brain Application |
|--------|-----------------|--------------------------|
| **Clarity** | Text legible at all sizes. Icons unambiguous. Interface helps users understand and interact. | Every label names the thing directly. No icon without a label. No state without a visible indicator. |
| **Deference** | UI supports user's content and activities. Never competes with them. | Cream palette recedes. Newsreader serif reads like paper. Study content — tasks, notes, formulas — is always the visual hero. |
| **Depth** | Visual layers establish hierarchy without literal depth effects. | Hierarchy through border + background contrast only. No shadows. No gradients. No blur. No glass morphism. |

---

## 1. COLOR

### 1.1 The Semantic-Only Rule
Color communicates **state**. Color never communicates **decoration**.

Ask before adding any color: *"What state does this communicate?"*  
If the answer is "nothing — it just looks nice" → use `--ink` on `--cream`. Always.

### 1.2 Full Token Palette

```css
:root {
  /* Backgrounds — warm off-white base. Never pure white. */
  --cream:  #FAF8F4;  /* Page background */
  --cream2: #F3F0EA;  /* Card bg, hover states, secondary surfaces */
  --cream3: #EAE6DD;  /* Active/pressed states, primer formula bg */

  /* Ink — one color, four opacities. All text. All UI. */
  --ink:    #1A1917;  /* Primary text, active elements, Pomodoro ring progress */
  --ink2:   #4A4845;  /* Secondary text, completed-but-recent items */
  --ink3:   #8A8784;  /* Tertiary text, subtitles, placeholders */
  --ink4:   #B8B5B0;  /* Disabled states, timestamps, section labels */

  /* Lines — for borders and dividers only */
  --line:   #E2DED6;  /* Card borders, row dividers — 1px only */
  --line2:  #CBC7BF;  /* Emphasized borders, hover borders, checkbox default */

  /* Semantic — used sparingly, state-only */
  --red:    #C0392B;  /* Danger-zone topics, missing sources, flagged errors */
  --amber:  #8B5E00;  /* Attention-required: missed goals, watch-zone topics */
  --green:  #2D6A4F;  /* Correct answers in test simulator ONLY */
}
```

### 1.3 The 5% Rule
Red, amber, green appear on **fewer than 5 elements per screen**.  
If more than 5 elements need semantic color → the design has too many alerts. Reduce alerts first.

### 1.4 Color Usage Contract

| Token | Allowed uses | Forbidden uses |
|-------|-------------|----------------|
| `--red` | Danger-zone topic pills, missing source warning, flagged error text, destructive button border | Filled button background, decorative accent, more than 5 uses per screen |
| `--amber` | ML goal missed indicator, Watch-zone topic pills, behind-pace flag | Any use that isn't genuinely attention-required |
| `--green` | Test sim correct answer indicator only | Navigation, progress bars, success toasts, anything outside test sim |
| `--ink` | Primary text, active states, Pomodoro ring fill | Background fills, decorative borders |
| `--cream` | Page background only | Text, icon fills |

### 1.5 Background Hierarchy

```
Page background:     --cream   (#FAF8F4)
Card background:     --cream   (same — cards separated by border only)
Card hover state:    --cream2  (#F3F0EA)
Active/pressed:      --cream3  (#EAE6DD)
Never:               pure white (#FFFFFF) — too clinical, not humanistic
```

---

## 2. TYPOGRAPHY

### 2.1 The Single Typeface Rule
**Newsreader only.** (Google Fonts, optical-size serif)

Weight and opacity modulate hierarchy. **No font switching** between elements. No Inter. No Roboto. No SF Pro. No system sans-serif stack.

> Rationale: A single editorial serif typeface signals craftsmanship. Two fonts signal indecision. Sans-serifs signal generic SaaS. This product should feel like a premium notebook, not a dashboard.

### 2.2 Full Type Scale

| Use | Size | Weight | Style | Color | Notes |
|-----|------|--------|-------|-------|-------|
| Body / task text | 14px | 300 | normal | `--ink` | Primary reading weight |
| UI labels | 13px | 400 | normal | `--ink2` | Buttons, nav items |
| Secondary labels | 12–13px | 400 | italic | `--ink3` | Context, subtitles |
| Section headers | 10px | 400 | uppercase | `--ink4` | Letter-spacing: 0.07em. Never bold. |
| Subject/type tags | 10px | 400 | italic | `--ink4` | Right-aligned, never colored badge |
| Timestamps / meta | 10px | 400 | normal | `--ink4` | System mono for numbers |
| Stat numbers | 18–40px | 300 | normal | `--ink` | Negative letter-spacing. Reads as data. |
| AI brief | 14px | 300 | italic | `--ink` | Italic signals AI-generated content |
| Primer formula | 13px | 400 | normal | `--ink` | Monospace, `--cream3` background |
| Primer error | 13px | 300 | italic | `--red` | User's last error — weight 300, not bold |
| Pomodoro timer | 22px | 300 | normal | `--ink` | `letter-spacing: -1px` — reads as clock |
| Phase label | 10px | 400 | italic | `--ink4` | "focus" or "break" — always lowercase |
| Nav brand | 15px | 400 | italic | `--ink` | "second brain" — lowercase, no logo |

### 2.3 Monospace Rule
System mono **only** for: times, durations, percentages, dates, code/formulas.  
Never for body copy. Never for labels.

### 2.4 Italic = Secondary Context
Italic signals: AI-generated content, secondary information, phase labels, context clues.  
Italic never signals emphasis (use weight 400 vs 300 for that).

---

## 3. LAYOUT & WHITESPACE

### 3.1 Whitespace Is Structure
> Apple HIG: "Whitespace is not empty space — it is visual structure."

Sections separated by **space**, not dividers or horizontal rules.  
Cards separated by **borders**, not background color differences.  
Hierarchy established by **space + weight**, not lines and boxes.

### 3.2 Today View Grid

```
┌─────────────────────────────────────┬──────────────┐
│                                     │              │
│  LEFT COLUMN (fluid)                │  RIGHT PANEL │
│  AI brief                           │  272px fixed │
│  Task checklist                     │              │
│  Textbook progress bars             │  Pomodoro    │
│  Calendar strip                     │  Primer      │
│                                     │  Confusion   │
│                                     │  Countdown   │
│                                     │              │
└─────────────────────────────────────┴──────────────┘
│  QUICK CAPTURE BAR — full width, always visible     │
└─────────────────────────────────────────────────────┘
```

- Right panel: `272px` fixed, never fluid. Content density fits exactly.
- Left column: `flex-1`, minimum `320px`.
- Gap between columns: `24px`.
- Page padding: `24px` horizontal, `20px` vertical.

### 3.3 Card Anatomy

```
border: 1px solid var(--line)      ← not 0.5px (too thin) not 2px (too heavy)
border-radius: 11px                ← not 8px (too sharp) not 16px (too bubbly)
padding: 14px 16px                 ← generous without wasting vertical space
background: var(--cream)           ← matches page — cards float by border only
box-shadow: none                   ← zero exceptions
```

Hover state: `background → var(--cream2)`. No border change. No shadow.

### 3.4 Spacing Rhythm

```
4px   — icon-to-label gap, tight inline elements
8px   — between related items in a list
12px  — between list items with more separation
14px  — card vertical padding
16px  — card horizontal padding, section gaps within a card
20px  — page vertical padding
24px  — section gaps, column gap
32px  — between major sections
```

No arbitrary values. Every spacing measurement chosen, not defaulted.

---

## 4. COMPONENT SPECIFICATIONS

### 4.1 Cards
```css
.card {
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 14px 16px;
  box-shadow: none;  /* enforced — never override */
}
.card:hover {
  background: var(--cream2);
  /* no border change, no shadow, no transform */
}
```

### 4.2 Buttons

**Default (secondary):**
```css
background: transparent;
border: 1px solid var(--line2);
color: var(--ink2);
font-style: italic;
border-radius: 99px;      /* pill for standalone */
padding: 6px 14px;
```

**Primary (one per screen max):**
```css
background: var(--ink);
color: white;
border: none;
border-radius: 99px;
```

**Destructive:**
```css
background: transparent;
border: 1px solid var(--red);
color: var(--red);
border-radius: 99px;
/* Never filled red. Border only. */
```

**Disabled:**
```css
color: var(--ink4);
border-color: var(--line);
cursor: not-allowed;
/* No opacity hack. Change properties directly. */
```

**In-card buttons:**
```css
border-radius: 7px;   /* not pill — pill is for standalone buttons only */
```

**Icon-only buttons:**
```css
width: 28px;
height: 28px;
border-radius: 50%;
border: 1px solid var(--line);
display: flex; align-items: center; justify-content: center;
/* Single Tabler outline icon at 14px. No label needed for: voice, camera, send */
```

### 4.3 Task Checkboxes

```css
.checkbox {
  width: 16px;
  height: 16px;
  border-radius: 50%;          /* circle — completion, not a form checkbox */
  border: 1px solid var(--line2);
  background: transparent;
  cursor: pointer;
  transition: all 150ms ease;
}
.checkbox.done {
  background: var(--ink);
  border-color: var(--ink);
  /* white 5px inner dot via ::after pseudo-element */
}
.task-row.done .task-label {
  color: var(--ink4);
  text-decoration: line-through;
  text-decoration-color: var(--line2);
}
.task-row:hover {
  background: var(--cream2);
  /* row-level hover, not checkbox-level */
}
```

Animation on check: `150ms`. No bounce, no scale pop. Binary state change.

### 4.4 Progress Bars

```css
.progress-track {
  height: 1px;                 /* deliberate precision — not a constraint */
  background: var(--line2);
  border-radius: 1px;
  width: 100%;
}
.progress-fill {
  height: 1px;
  background: var(--ink);      /* no subject color-coding — all bars are ink */
  border-radius: 1px;
  transition: width 300ms ease;
}
.progress-label {
  font-size: 10px;
  font-style: italic;
  color: var(--ink4);
  text-align: right;
  display: block;
  margin-bottom: 4px;          /* label above bar */
}
.subject-accent {
  width: 2px;                  /* only per-subject color in the entire UI */
  height: 100%;
  border-radius: 1px;
  /* color varies per subject — the single allowed color exception */
}
```

### 4.5 Pomodoro SVG Ring

```jsx
/* SVG structure */
<svg viewBox="0 0 120 120">
  {/* Track */}
  <circle cx="60" cy="60" r="54"
    fill="none"
    stroke="var(--line)"
    strokeWidth="2"
  />
  {/* Progress — starts at 12 o'clock, sweeps clockwise */}
  <circle cx="60" cy="60" r="54"
    fill="none"
    stroke="var(--ink)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeDasharray="339.292"    /* 2π × 54 */
    strokeDashoffset={offset}    /* calculated from time remaining */
    transform="rotate(-90 60 60)"
    style={{ transition: 'stroke-dashoffset 1s linear' }}
  />
</svg>
```

```css
.timer-text {
  font-size: 22px;
  font-weight: 300;
  letter-spacing: -1px;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.phase-label {
  font-size: 10px;
  font-style: italic;
  color: var(--ink4);
  /* "focus" or "break" — always lowercase */
}
.session-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.session-dot.empty   { background: var(--line2); }
.session-dot.done    { background: var(--ink2); }
.session-dot.current { background: var(--ink); }
```

### 4.6 Navigation Bar

```css
.nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--line);
  background: var(--cream);
}
.nav-brand {
  font-size: 15px;
  font-style: italic;
  color: var(--ink);
  margin-right: auto;
  /* "second brain" — lowercase, no logo, no icon */
}
.nav-item {
  font-size: 13px;
  color: var(--ink2);
  padding: 5px 12px;
  border-radius: 99px;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  /* No icons. Text labels only. */
  /* Apple HIG: icons without labels are a guessing game. */
}
.nav-item.active {
  background: var(--cream3);
  border-color: var(--line2);
  color: var(--ink);
  /* No underline. No bold. No color change. */
}
.nav-date {
  font-size: 12px;
  font-style: italic;
  color: var(--ink4);
  /* Right-aligned. Present tense context, not a page title. */
}
```

### 4.7 Quick Capture Bar

```css
.capture-bar {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 12px 24px 16px;
  background: var(--cream);
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 8px;
}
.capture-input {
  flex: 1;
  border: 1px solid var(--line2);
  border-radius: 99px;           /* pill — invitation, not a form field */
  padding: 8px 16px;
  font-size: 14px;
  font-family: 'Newsreader', serif;
  background: var(--cream);
  color: var(--ink);
  outline: none;
}
.capture-input:focus {
  border-color: var(--ink2);
}
.capture-btn {
  /* 28px icon button spec from 4.2 */
}
```

The capture bar is always mounted. It is a layout component, not a page component.  
It appears on all 5 views. No exceptions.

### 4.8 Confusion Map Quadrants

```css
/* No shadows. Flat fills. Border only. */
.quadrant-safe     { background: var(--cream2); }
.quadrant-danger   { background: #FDF0EF; }
.quadrant-watch    { background: #FDF8EF; }
.quadrant-upcoming { background: var(--cream2); opacity: 0.6; }

.quadrant-label-safe     { color: var(--ink4); font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; }
.quadrant-label-danger   { color: var(--red);   font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; }
.quadrant-label-watch    { color: var(--amber); font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; }
.quadrant-label-upcoming { color: var(--ink4); font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; }

.topic-pill-safe   { background: var(--cream3); color: var(--ink2); }
.topic-pill-danger { background: #F5D9D7;       color: var(--red); }
.topic-pill-watch  { background: #F5E8D0;       color: var(--amber); }

.topic-pill {
  font-size: 11px;
  font-style: italic;
  padding: 2px 8px;
  border-radius: 99px;
}
```

### 4.9 Pre-Session Primer

Always inline in right panel. Never modal. Never full-screen.

```
┌─────────────────────────────────────┐
│  PREPARING SESSION           10px ↑ │  ← dismiss after 10s (repeat sessions)
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │  f(x) = lim_{h→0}...       │    │  ← monospace, --cream3 bg
│  └─────────────────────────────┘    │
│                                     │
│  Last error: "confused sign of      │  ← --red, italic, weight 300
│  discriminant in completing square" │
│                                     │
│  Your note: "always expand before   │  ← --ink3, italic
│  factoring, don't shortcut"         │
└─────────────────────────────────────┘
```

If no errors logged yet: element 2 shows `"No errors logged yet"` in `--ink4`.  
Data sources: `textbooks.topic_map` + `errors` table + `captures` table.  
One API call. Never blocking. Loads async.

---

## 5. MOTION & ANIMATION

### 5.1 The Motion Rule
**Animation = state change communication.** Never delight. Never performance.

| Animation | Duration | Easing | Why |
|-----------|----------|--------|-----|
| Task check | 150ms | `ease` | Binary state change — fast, clean |
| Pomodoro ring sweep | 1s per second | `linear` | Clock-like — must feel like time passing |
| Card hover bg | 80ms | `ease` | Immediate feedback, not a transition |
| Capture bar confirm | 150ms fade | `ease-out` | Quick acknowledgement |
| Nav active state | 80ms | `ease` | Instant, not animated |
| AI brief skeleton | pulse 1.5s | `ease-in-out` | Loading indication — not spinner |
| Section expand/collapse | 200ms | `ease-in-out` | Spatial orientation |
| Error flag | 150ms | `ease` | Same as task check |

### 5.2 Forbidden Animations
- No scroll-triggered animations
- No entrance animations on page load
- No hover scale/transform (no `transform: scale(1.02)`)
- No bounce easing
- No loading spinners for operations <500ms
- No confetti, particle effects, or celebration animations
- No parallax

### 5.3 Loading States
**AI Brief:** 2-line skeleton block at correct width. No spinner.
```css
.skeleton {
  background: linear-gradient(90deg, var(--cream2) 25%, var(--cream3) 50%, var(--cream2) 75%);
  background-size: 200% 100%;
  animation: skeleton-sweep 1.5s ease-in-out infinite;
  border-radius: 4px;
  height: 14px;
}
@keyframes skeleton-sweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Sub-500ms operations:** No loading state at all. Just update.

---

## 6. NAVIGATION PATTERNS

### 6.1 Structure
Five views. Persistent top nav. No sidebar. No hamburger menu. No bottom tab bar.

```
Today  |  Goals  |  Test Sim  |  Ask AI  |  Textbooks
```

Text labels only. **No icons.** (Apple HIG: icons without labels force the user to guess.)

### 6.2 Active State
- Background: `var(--cream3)`
- Border: `1px solid var(--line2)`
- Text: `var(--ink)` (was `--ink2` inactive)
- No underline. No bold. No indicator dot. No color change beyond above.

### 6.3 View Transitions
No page reload. SPA routing. No full-page fade. Navigation is instant.

### 6.4 Expandable Sections
All expandable sections use same pattern: `↓` closed / `↑` open.  
- Arrow: 12px, `--ink3`
- Toggle: row-level click, not icon-only
- Animation: 200ms ease-in-out height transition
- State persists within session (not to DB — not important enough)

---

## 7. INPUT & CAPTURE PATTERNS

### 7.1 The 2-Tap Rule
Any capture achievable in **≤2 taps** from any screen.  
Tap 1: open input method (voice / camera / text)  
Tap 2: send  
Never more. Never a multi-step flow for capture.

### 7.2 Voice Input
- Hold mic button → recording starts
- Release → AI transcribes
- Transcription shown in capture input field
- User reviews → tap send (or edit then send)
- **Never auto-send on voice release** — user confirms first

### 7.3 Text Capture
- Tap capture bar input field
- Type
- Tap send icon or press Enter
- Field clears. Inline "Captured" text fades in below bar, disappears after 1.5s
- No modal. No navigation change. No interruption.

### 7.4 Photo/Scan
- Tap camera icon → system camera opens
- Take photo → returns to app
- AI extracts text in background
- Confirmation: same inline fade pattern
- If AI extraction fails: "Couldn't read — saved as image" in `--ink4`

### 7.5 Study Flow Protection
The capture bar must **never interrupt a Pomodoro session**.  
During active Pomodoro: capture bar remains visible but input doesn't steal focus.  
Pomodoro ring stays in view at all times during a session.

---

## 8. FEEDBACK PATTERNS

### 8.1 The Feedback Rule (Apple HIG)
> "Every action has a response. The system acknowledges user input immediately."

**Immediate:** <150ms for interactive element response  
**Quiet:** Never modal for routine feedback. Inline only.  
**Binary:** State either changed or didn't. No ambiguity.

### 8.2 Feedback by Action Type

| Action | Feedback | Duration | Position |
|--------|---------|----------|----------|
| Task check | Circle fills, text strikes | 150ms | In-row |
| Pomodoro ring update | Stroke sweeps | 1s continuous | Ring |
| Capture submit | Input clears + "Captured" fade | 150ms + 1.5s | Below bar |
| Goal inline check | Same as task check | 150ms | In-row |
| Session logged | Pomodoro dots update | 150ms | Below ring |
| Error flagged | Row highlights `#FDF0EF` | 150ms | In-row |
| AI brief loading | Skeleton block | Until loaded | Brief area |
| Nav change | Active state update | 80ms | Nav item |
| Textbook page update | Progress bar animates | 300ms | Progress bar |

### 8.3 Confirmation Dialogs
**Never** show a confirmation dialog for reversible actions.  
Reversible actions: task check, flag error, page log, session start.  
**Only** show confirmation for: account deletion (out of scope for v1).

### 8.4 Error States
```css
/* Inline error — no boxes, no icons, text only */
.error-message {
  color: var(--red);
  font-size: 12px;
  font-style: italic;
  margin-top: 4px;
}
/* Never: red background, alert box, modal error, toast with icon */
```

---

## 9. MODALITY RULES

### 9.1 Apple HIG on Modality
> "Use modality only when it's critical to focus the user's attention."

Modal = user cannot proceed without responding. Use this power sparingly.

### 9.2 Rules for Second Brain

| Pattern | Modal? | Why |
|---------|--------|-----|
| Pre-session primer | No — inline panel | Not critical, not irreversible |
| Capture confirmation | No — inline fade | Trivial, reversible |
| Session complete | No — auto-log + dots update | Background action |
| Pomodoro start | No — ring starts | Immediate, reversible |
| Flag error | No — inline highlight | Reversible |
| Test result | No — inline result card | Informational |
| Account delete | Yes — if ever needed | Irreversible |

**No bottom sheets.** No overlay cards. No drawers.  
Everything is inline or navigated to a full view.

---

## 10. EMPTY & LOADING STATES

### 10.1 First Run (Never Empty)
Seed data in Sprint 1 ensures the user never opens an empty app:
- 4 goals seeded from Notion roadmap
- 5 sample errors across Pure Maths + Physics
- Current textbook progress at realistic starting points

### 10.2 Empty State Patterns

| Screen | Empty state text | Tone |
|--------|-----------------|------|
| Task checklist (no tasks today) | "Nothing scheduled yet. Add a task or check your weekly goals." | Directive, calm |
| Captures (nothing ingested) | "Captures appear here after your first note or voice memo." | Informational |
| Test history (no tests run) | "Run a test to see your history here." | Direct |
| Errors log (no errors) | "No errors logged yet. Flag a mistake after a session." | Positive framing |
| Confusion map (no session data) | Show empty quadrant shells with `--ink4` topic placeholder text | Visual, not text-only |
| Past retrospectives | "Your first retrospective generates this Sunday." | Time-anchored |

Empty state text: 12–13px, `--ink3`, centered in the component area. No illustration. No icon. No button unless an action is available.

### 10.3 Confusion Map Empty State
```
┌──────────────┬──────────────┐
│  SAFE        │  DANGER      │
│              │              │
│  (empty)     │  (empty)     │
│              │              │
├──────────────┼──────────────┤
│  WATCH       │  UPCOMING    │
│              │              │
│  (empty)     │  (empty)     │
│              │              │
└──────────────┴──────────────┘
```
Show label and quadrant shells. No text explanation. Let the structure communicate its own purpose.

---

## 11. ACCESSIBILITY BASELINE

### 11.1 Contrast Ratios (WCAG AA)

| Combination | Ratio | Standard |
|-------------|-------|---------|
| `--ink` (#1A1917) on `--cream` (#FAF8F4) | ~16:1 | Exceeds AAA |
| `--ink2` (#4A4845) on `--cream` | ~8:1 | Exceeds AA |
| `--ink3` (#8A8784) on `--cream` | ~4.1:1 | Meets AA for large text (14px+) |
| `--ink4` (#B8B5B0) on `--cream` | ~2.9:1 | Large text only (use sparingly) |
| `--red` (#C0392B) on `--cream` | ~5.5:1 | Meets AA |
| `--amber` (#8B5E00) on `--cream` | ~6.2:1 | Meets AA |

**Note:** `--ink4` does not meet AA for body text. Use only for 10px+ labels and secondary metadata where reduced contrast is intentional and non-critical.

### 11.2 Touch Targets (Apple HIG minimum: 44×44px)

| Element | Visible size | Touch target |
|---------|-------------|--------------|
| Checkbox circle | 16×16px | 44×44px (padding) |
| Icon button (capture) | 28×28px | 44×44px |
| Nav item | height ~32px | min 44×44px (padding) |
| Expand/collapse row | full row width | full row height ≥44px |
| Task row | full width, ~36px | full row |

### 11.3 Focus States
```css
:focus-visible {
  outline: 2px solid var(--ink2);
  outline-offset: 2px;
  border-radius: inherit;
}
/* Never: outline: none without a replacement focus indicator */
```

### 11.4 Color-Independent State Communication
No state communicated by color alone. Always pair with:
- Text label change (done → struck through)
- Shape change (checkbox empty → filled)
- Position change (ring progress advances)

---

## 12. ANTI-PATTERN BLACKLIST

These are **enforced rules**, not suggestions. Verified at every Phase Gate with grep/code review.

### 12.1 Visual Anti-Patterns

| Anti-pattern | Why forbidden | Enforcement |
|-------------|---------------|-------------|
| `box-shadow` | Violates depth principle — hierarchy via border only | `grep -r "box-shadow"` = 0 |
| Hardcoded hex (`#xxxxxx`) in components | Breaks token system — future changes break everywhere | `grep -r "#[0-9A-Fa-f]"` in `/components` = 0 |
| `border-radius > 12px` on data components | "Too bubbly for data-heavy content" per blueprint | Code review |
| Progress bar `height > 1px` | Reduces precision signal | `grep -r "height: [2-9]px"` on bars = 0 |
| Shadow-based card hover | Use background shift only | Code review |
| Pure white background (`#FFFFFF`, `#FFF`, `white`) | Too clinical — use `--cream` | `grep -r "#fff\|#FFF\|white"` in CSS = 0 |

### 12.2 Component Anti-Patterns

| Anti-pattern | Why forbidden |
|-------------|---------------|
| Square task checkboxes | Not completion UI — form input aesthetic |
| `border-radius: 9999px` on in-card buttons | Pill is for standalone only; 7px for in-card |
| Colored subject badges/chips | Use `--ink4` italic text tag only |
| Icons in navigation bar | HIG: icons without labels force guessing |
| Spinner for AI brief | Use skeleton block — spinner is disruptive |
| Modal for reversible actions | Interrupts flow without justification |
| Confirmation dialog for task check | Kills the speed of the daily loop |
| Alert box for error states | Use inline `--red` text only |

### 12.3 Typography Anti-Patterns

| Anti-pattern | Why forbidden |
|-------------|---------------|
| Inter / Roboto / SF Pro / system sans | Signals generic SaaS, not a designed product |
| Bold section headers | 10px uppercase letter-spaced `--ink4` — never bold |
| Colored text for emphasis | Use weight + opacity, not color |
| `font-size < 10px` | Below legibility threshold |
| Multiple typefaces | Single serif — weight + opacity = all hierarchy needed |

### 12.4 Motion Anti-Patterns

| Anti-pattern | Why forbidden |
|-------------|---------------|
| Loading spinner | Use skeleton for AI content, nothing for <500ms ops |
| `transform: scale()` on hover | Shifts layout, feels playful not precise |
| Bounce easing | Signals playfulness, not precision |
| Scroll animations | Distracts from content |
| Entrance animations on page load | Delays access to information |
| `transition-duration > 300ms` for UI feedback | Feels slow — UI should respond immediately |

### 12.5 Color Anti-Patterns

| Anti-pattern | Why forbidden |
|-------------|---------------|
| Filled red button | Alarming — border only for destructive |
| `--green` outside test sim | Green = correct answer ONLY |
| More than 5 semantic colors per screen | Too many alerts = no alerts |
| Gradient fills | Violates deference principle |
| Color-only state communication | Accessibility failure |
| Decorative color accents | Color = state, never decoration |

---

## 13. DECISION FRAMEWORK

When building any new UI element, answer these in order:

```
1. THE REMOVE TEST
   "If I remove this, does the user lose information or ability?"
   → No: remove it.
   → Yes: keep it and continue.

2. THE LABEL TEST
   "Does the user have to wonder what this does?"
   → Yes: rename or redesign it.
   → No: continue.

3. THE COLOR TEST
   "Is this color communicating a specific state?"
   → No: use --ink on --cream.
   → Yes: which semantic token? Is it one of the five states (danger/watch/safe/upcoming/correct)?

4. THE MODAL TEST
   "Is this action irreversible AND high-stakes?"
   → No: inline feedback only.
   → Yes: modal is permitted.

5. THE ANIMATION TEST
   "Does this animation communicate a state change?"
   → No: remove the animation.
   → Yes: is it ≤300ms (except Pomodoro ring which is 1s linear)?

6. THE TOOL TEST
   "Does this element make Second Brain feel more like a product or more like a tool?"
   → Product: simplify or remove.
   → Tool: keep.
```

---

## 14. IMPLEMENTATION REFERENCE

### CSS Variables Setup (globals.css)
```css
:root {
  --cream: #FAF8F4;
  --cream2: #F3F0EA;
  --cream3: #EAE6DD;
  --ink: #1A1917;
  --ink2: #4A4845;
  --ink3: #8A8784;
  --ink4: #B8B5B0;
  --line: #E2DED6;
  --line2: #CBC7BF;
  --red: #C0392B;
  --amber: #8B5E00;
  --green: #2D6A4F;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--cream);
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

### Font Import (layout.tsx or _document.tsx)
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&display=swap" rel="stylesheet" />
```

### Phase Gate Design Checks
Run before every Phase Gate sign-off:
```bash
# No box-shadows
grep -r "box-shadow" ./src ./components ./styles --include="*.css" --include="*.tsx" --include="*.ts"
# Expected: 0 results

# No hardcoded hex in components
grep -r "#[0-9A-Fa-f]\{3,6\}" ./src/components --include="*.tsx" --include="*.css"
# Expected: 0 results

# No pure white
grep -r "\"white\"\|#fff\b\|#FFF\b\|#ffffff\|#FFFFFF" ./src --include="*.tsx" --include="*.css"
# Expected: 0 results

# Progress bars at 1px
grep -r "height" ./src/components --include="*.css" | grep "px" | grep -v "1px"
# Review manually for progress bars
```

---

*ui-ux-principles.md — Second Brain Personal OS*  
*Source: Apple HIG · hosseini-rtr/apple-design-principles · Blueprint v2*  
*"The interface disappears. The work remains."*
