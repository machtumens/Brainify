# PRINCIPLES — SECOND BRAIN PROJECT
## Permanent Operating System for Claude · v1.0
**Read this file at the start of every session. No exceptions.**
**Project:** Second Brain Personal Learning OS  
**Builder:** Richard Amadeus  
**Location:** `C:\Users\Richard Amadeus\Documents\Everything Code\Projects\SecondBrain\`

---

## SESSION START PROTOCOL
*(Read this first, every time, before touching anything)*

```
MANDATORY SESSION CHECKLIST — run before any work:
1. Read MEMORY.md               → who is this user, what have we learned
2. Read ROADMAP.md              → current sprint, phase gate status, scope
3. Read this file (principles)  → operating rules, laws, skill map
4. Read ui-ux-principles.md     → before touching any UI code
5. Check last task status       → where did previous session end
6. State current sprint + phase → confirm alignment with user
```

**Cold start test:** If you can't answer these five questions from memory, read the files above:
- What sprint are we on?
- What was the last Phase Gate result?
- What is the top risk right now?
- What does the confusion map recalculate on?
- What is the AI router fallback order?

---

## TABLE OF CONTENTS

**PART 1 — PMBOK GUARDRAILS**
- [§1 Review Gate](#1-review-gate)
- [§2 Versioning & Change Control](#2-versioning--change-control)
- [§3 Error Recovery Protocol](#3-error-recovery-protocol)
- [§4 Evolution Protocol](#4-evolution-protocol)

**PART 2 — CLAUDE OPERATING RULES**
- [§5 AI Behavior Laws](#5-ai-behavior-laws)
- [§6 Prompt Quality Standard](#6-prompt-quality-standard)
- [§7 Context Budget Rules](#7-context-budget-rules)
- [§8 Token Economy](#8-token-economy)

**PART 3 — SKILL SYSTEM**
- [§9 250 Skill Index](#9-250-skill-index)
- [§10 25 Claude Programmer Mistakes](#10-25-claude-programmer-mistakes)
- [§11 Agent Playbook](#11-agent-playbook)

**PART 4 — ARCHITECTURE LAWS**
- [§12 Modularity Manifesto](#12-modularity-manifesto)
- [§13 Naming Conventions](#13-naming-conventions)
- [§14 Learner-Friendly Annotations](#14-learner-friendly-annotations)

**PART 5 — MCP INTEGRATION**
- [§15 MCP Principles](#15-mcp-principles)
- [§16 Parallel Execution Map](#16-parallel-execution-map)

**PART 6 — MEMORY & LEARNING**
- [§17 Learning Laws (Permanent)](#17-learning-laws-permanent)
- [§18 Memory Architecture](#18-memory-architecture)

**PART 7 — COLLABORATION**
- [§19 Handoff Protocol](#19-handoff-protocol)

**PART 8 — OUT-OF-THE-BOX**
- [§20 Prompt Archaeology](#20-prompt-archaeology)
- [§21 Living Demo Rule](#21-living-demo-rule)
- [§22 Cognitive Load Covenant](#22-cognitive-load-covenant)
- [§23 Rollback Covenant](#23-rollback-covenant)
- [§24 Compression Law](#24-compression-law)
- [§25 Handoff Protocol (Collaboration)](#25-collaboration-handoff)

**PART 9 — PROJECT LOGBOOK**
- [§26 Activity Log](#261-activity-log)
- [§26 Error Registry](#262-error-registry)
- [§26 Success Patterns](#263-success-patterns)

---

# PART 1 — PMBOK GUARDRAILS

## §1 REVIEW GATE
*(PMBOK: Quality Management + Integrated Change Control)*

**Every piece of code passes this gate before commit. No exceptions.**

```
REVIEW GATE CHECKLIST
──────────────────────────────────────────────────────────────────

DESIGN (run before touching CSS/TSX):
  [ ] Read ui-ux-principles.md §12 Anti-Pattern Blacklist
  [ ] grep -r "box-shadow" ./src = 0 results
  [ ] grep -r "#[0-9A-Fa-f]{3,6}" ./src/components = 0 results
  [ ] Progress bars confirmed height: 1px
  [ ] Task checkboxes confirmed border-radius: 50%
  [ ] Nav confirmed text labels only, no icons

CODE QUALITY:
  [ ] No function > 50 lines
  [ ] No file > 800 lines
  [ ] No nesting > 4 levels
  [ ] No console.log or debugger in committed code
  [ ] All catch blocks log + return structured error
  [ ] All API routes return { success, data, error } envelope

SECURITY (mandatory before any commit):
  [ ] No hardcoded secrets (API keys, passwords, tokens)
  [ ] SUPABASE_SERVICE_ROLE_KEY not exposed to client
  [ ] All user input validated at API boundary
  [ ] .env.local not staged
  [ ] RLS verified on any new table

AI QUALITY (for AI-touching code):
  [ ] Context assembler called before every AI route
  [ ] Provider fallback tested (exhaust Gemini quota manually)
  [ ] Primer prompt cites DB data only — no hallucination path
  [ ] Streaming implemented for /api/tutor

TESTING:
  [ ] Happy path manually tested on Vercel (not localhost only)
  [ ] Supabase data reflects expected changes after action
  [ ] Pomodoro ring test: full 25min cycle or fast-forward test

PHASE GATE (end of sprint only):
  [ ] All stories in sprint marked done
  [ ] All review gate items above pass
  [ ] Live Vercel demo ready
  [ ] Phase Gate criteria from ROADMAP.md §9 all met
```

---

## §2 VERSIONING & CHANGE CONTROL
*(PMBOK: Integrated Change Control)*

**Rule:** Every change to scope, architecture, or data model follows this process. No undocumented changes.

### Scope Change Protocol
```
1. Idea identified during development
2. Write in ROADMAP.md §15 (Future Roadmap) — title + 1-sentence rationale
3. DO NOT build it
4. Review at Phase Gate 6 for v1.1 consideration
5. If approved for v1.1: add to WBS, create user story, assign sprint
```

### Architecture Change Protocol
```
1. Identify change needed (schema, API contract, AI router)
2. Write ADR (Architecture Decision Record):
   - Title: "ADR-XXX: [what changed]"
   - Status: Proposed / Accepted / Deprecated
   - Context: why change is needed
   - Decision: what we're doing
   - Consequences: what breaks, what improves
3. Update ROADMAP.md affected sections
4. Update ui-ux-principles.md if design-relevant
5. Commit ADR before implementing the change
```

### Versioning Rules
```
v1.0   = all 21 user stories complete, Phase Gate 6 passed
v1.x   = features from §15 future roadmap
v2.0   = architectural change (multi-user, native iOS, paid tier)
patch  = bug fix within current sprint
```

### What Triggers a Version Bump
- New user story added to WBS → minor version
- Breaking API change → minor version
- Schema change requiring migration → minor version
- Multi-user support → major version

---

## §3 ERROR RECOVERY PROTOCOL
*(PMBOK: Risk Management — Response Implementation)*

### Build Fails on Vercel
```
1. Read full build log — don't guess
2. Check: TypeScript errors first (most common)
3. Check: missing env vars (GEMINI_API_KEY etc.)
4. Check: Node version mismatch (set engines in package.json)
5. Run build locally: npm run build
6. Fix incrementally — one error at a time
7. If stuck > 20min: spawn build-error-resolver agent
```

### AI Route Returns 500
```
1. Check: env var present in Vercel dashboard
2. Check: Gemini rate limit (1,500/day) — look at AI Studio dashboard
3. Check: context assembler not crashing on empty tables
4. Check: OpenRouter fallback configured
5. Add console.log to route temporarily, redeploy, check Vercel logs
6. Remove console.log before next commit
```

### Supabase Query Fails
```
1. Check: RLS policy — is user authenticated?
2. Check: table exists (run migration if not)
3. Check: column name matches schema exactly
4. Check: service role key used only server-side
5. Test query directly in Supabase SQL editor
```

### Confusion Map Empty After Session Log
```
1. Verify session was written to sessions table
2. Verify confusion map reads from sessions table (not hardcoded)
3. Check: seed data present (5 errors minimum from Sprint 1)
4. Trigger manual recalculation via /api/brief
```

### iCloud Sync Not Ingesting
```
1. Check: ICLOUD_WATCH_PATH env var set correctly
2. Check: .md files exist at that path
3. Check: /api/sync cron firing (Vercel cron logs)
4. Test: POST /api/sync manually
5. Check: dedup logic not blocking new files (hash mismatch)
```

### Nuclear Option
```
If nothing works after 45min of diagnosis:
1. git stash
2. Roll back to last passing Phase Gate commit
3. Document what failed in §17 Learning Laws
4. Re-approach with smaller incremental change
```

---

## §4 EVOLUTION PROTOCOL
*(PMBOK: Project Closure + Phase Gate)*

### How v1 Becomes v1.1
```
Trigger: Phase Gate 6 passed + at least 2 weeks of daily use
Step 1: Review §15 backlog — rank by value/effort
Step 2: Pick top 3 items for v1.1
Step 3: Write user stories for each
Step 4: Add to WBS, assign sprints
Step 5: Update project charter in ROADMAP.md §1
Step 6: Update phase gates for new sprints
Step 7: Begin Sprint 7
```

### Scope Freeze During v1
```
ENFORCED UNTIL PHASE GATE 6:
- No new tables (beyond the 8 in schema)
- No new views (beyond Today/Goals/TestSim/AskAI/Textbooks)
- No new API routes (beyond the 10 documented)
- No third-party libraries added without explicit discussion
- No design token changes after Sprint 1
```

### Signs v1 Is Ready to Evolve
- [ ] Builder uses app daily for real study sessions
- [ ] AI brief is consistently accurate
- [ ] Confusion map reflects real weak areas
- [ ] At least one weekly retrospective generated and read
- [ ] Apple sync running without manual intervention

---

# PART 2 — CLAUDE OPERATING RULES

## §5 AI BEHAVIOR LAWS
*(Permanent rules for how Claude operates on this project)*

**LAW 1 — Read Before Build**
Never write code for a feature without first reading:
- The user story (ROADMAP.md §8)
- The API route spec (ROADMAP.md §6)
- The design spec (ui-ux-principles.md)
Violation: building from memory = drift from spec.

**LAW 2 — Plan Before Sprint**
Invoke `/plan` before starting any sprint. No exceptions.
Sprint starts with a plan. Plan gets approved. Then code.

**LAW 3 — Test Before Commit**
Invoke `/tdd` before any new feature implementation.
Write test → watch it fail → implement → watch it pass.

**LAW 4 — Review After Code**
Invoke `/code-review` after writing or modifying any code.
Address CRITICAL and HIGH findings before moving on.

**LAW 5 — Security Before Commit**
Invoke `/security-review` before every commit to shared branches.
Especially: auth code, API routes, DB queries, env var handling.

**LAW 6 — Verify After UI**
Invoke `/verify` after any UI change.
Real browser, real data, real Vercel. Not localhost only.

**LAW 7 — Never Add Unrequested Features**
If a feature isn't in a user story, don't build it.
Log the idea in §15 future roadmap instead.

**LAW 8 — Never Rename Without Asking**
CSS variables, DB column names, component names, API routes —
never rename without explicit user approval. Breaking changes cascade.

**LAW 9 — Never Change Design Tokens Without Review Gate**
CSS vars defined in ui-ux-principles.md §1 are frozen.
Change requires: user approval + ui-ux-principles.md update + full grep audit.

**LAW 10 — Minimum 3 Skills Per Session**
Never work bare-handed. State relevant skills. Invoke primary skill immediately.
Target: 50+ skills across the full project.

**LAW 11 — Memory First**
Start every session by reading MEMORY.md.
End every session by writing anything new learned to memory.

**LAW 12 — Scope Lock Is Absolute**
v1 WBS is frozen. If user asks for something outside it:
(1) Acknowledge the idea (2) Log it in §15 (3) Proceed with current work.

**LAW 13 — No Silent Failures**
Every error is caught, logged, and returned as structured data.
`{ success: false, data: null, error: "specific message" }` — always.

**LAW 14 — Supabase Service Key Is Sacred**
`SUPABASE_SERVICE_ROLE_KEY` never appears in any client-side code.
Server-side only. Verified at every code review.

**LAW 15 — Provider Is Infrastructure**
The AI provider (Gemini/Groq/OpenRouter) is never shown to the user.
Never log provider name in UI. Never expose in error messages.

---

## §6 PROMPT QUALITY STANDARD

A bad prompt to Claude wastes a session. Use this format for any non-trivial request.

### The Precision Prompt Format
```
CONTEXT:    [What we're working on — sprint, feature, file]
CONSTRAINT: [What must not change — design tokens, scope, API contract]
TASK:       [Exactly what to do — one specific action]
OUTPUT:     [What format — code block, markdown table, file write]
EXAMPLE:    [If helpful — show a sample of what good looks like]
```

### Examples

**Bad prompt:**
"Build the confusion map"

**Good prompt:**
```
CONTEXT:    Sprint 3, US-009. Building confusion map 2×2 in Today View right panel.
CONSTRAINT: No box-shadow. Flat fills only. Colors from ui-ux-principles.md §4.8.
            Quadrant data comes from sessions + errors tables (not hardcoded).
TASK:       Write ConfusionMap.tsx component. Four quadrant cards with topic pills.
            Read from Supabase sessions + errors. Show empty shells if no data.
OUTPUT:     Single TSX file, CSS vars only, typed props interface.
```

### Prompt Anti-Patterns to Avoid
| Anti-pattern | Problem | Fix |
|-------------|---------|-----|
| "Build the whole Today view" | Too broad, produces drift | Break into one component at a time |
| "Fix the bug" | No context | Specify file:line, expected vs actual behavior |
| "Make it look better" | Subjective | Reference ui-ux-principles.md section number |
| "Add whatever you think" | No constraint | Always specify what must not change |
| "Like we discussed before" | No memory across sessions | Re-state the requirement explicitly |

---

## §7 CONTEXT BUDGET RULES

Claude has a finite context window. These rules prevent context rot.

### Context Triage — When to Compress
```
Session length > 30 messages       → Summarize completed work, start fresh task
Working on > 3 files simultaneously → Spawn separate agents per file
Debugging loop > 5 iterations       → Stop, read error fresh, approach differently
Context feels "cluttered"           → Run /checkpoint, save session, compress
```

### What to Load Per Task Type

| Task type | Load these files | Skip these |
|-----------|-----------------|------------|
| UI component | ui-ux-principles.md + component spec from ROADMAP | Backend files |
| API route | ROADMAP §6 (route spec) + data model §5 | Frontend files |
| AI prompt design | ROADMAP §12 (AI architecture) + context assembler spec | Design files |
| Schema change | ROADMAP §5 (data model) + risk register | UI files |
| Sprint planning | ROADMAP §9 (sprint plan) + user stories | Implementation files |

### Context Window Budget
```
< 20% used    → Work freely, load full files
20-50% used   → Load only relevant sections
50-75% used   → Load only specific functions/components needed
> 75% used    → STOP. Save session. Start new session with clean context.
```

### Spawning Agents vs Inline
```
Spawn an agent when:
  - Task requires reading > 5 files
  - Task is fully independent from current work
  - Task takes > 15 tool calls to complete
  - Parallel work is possible (see §16)

Work inline when:
  - Task is < 5 tool calls
  - Task requires this conversation's context
  - Quick lookup or single file edit
```

---

## §8 TOKEN ECONOMY

### Model Selection for This Project

| Model | Use for | Cost signal |
|-------|---------|-------------|
| **Haiku 4.5** | Simple lookups, quick grep, status checks, doc reads | Cheapest |
| **Sonnet 4.6** | All main development work, code writing, reviews | Default |
| **Opus 4.8** | Architecture decisions, complex debugging, PMBOK application | Most capable |

### AI Router Token Rules (for Second Brain's own AI)
```
Context assembler max tokens per call:
  goals:      last 7 days only (not all history)
  sessions:   last 14 sessions (not all time)
  errors:     top 20 by frequency (not full log)
  captures:   last 30 days (not all captures)
  textbooks:  current chapter only (not full book)
  Total:      target < 50,000 tokens per context assembly
```

### API Cost Management
```
Gemini Flash:   1,500 req/day free → dev uses max 500/day, leave 1,000 for prod
Groq:           30 RPM → batch requests, don't fire in rapid succession
OpenRouter:     20 RPM → final fallback, don't rely on this for dev testing
```

### Extended Thinking
```
Enable for:   Architecture decisions, complex debugging, PMBOK application
Disable for:  Routine code writing, simple lookups, file reads
Toggle:       Alt+T (Windows)
Budget cap:   export MAX_THINKING_TOKENS=10000 for routine work
```

---

# PART 3 — SKILL SYSTEM

## §9 250 SKILL INDEX
*(Mapped to Second Brain project phases. Invoke by name: `/skill-name` or via Skill tool)*

### PHASE 0 — PLANNING (Before Sprint 1)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 1 | `user-story` | Writing user stories for new features with AC + story points |
| 2 | `prd` | Creating formal product requirements documents |
| 3 | `blueprint` | Technical blueprint scaffolding for new modules |
| 4 | `epic-design` | Designing epics and breaking into sprints |
| 5 | `agile-product-owner` | Sprint planning, backlog grooming, velocity |
| 6 | `scrum-master` | Sprint ceremonies, burndown, retrospectives |
| 7 | `product-discovery` | Validating features before building |
| 8 | `product-strategist` | Strategic product decisions |
| 9 | `roadmap-communicator` | Communicating progress and changes |
| 10 | `project-management` | PMBOK application to project |
| 11 | `sprint-plan` | Sprint capacity planning |
| 12 | `sprint-health` | Monitoring sprint health mid-sprint |
| 13 | `okr` | Goal alignment and OKR setting |
| 14 | `rice` | Feature prioritization by reach/impact/confidence/effort |
| 15 | `retro` | End-of-sprint retrospectives |
| 16 | `decision-logger` | Logging architectural decisions permanently |
| 17 | `architecture-decision-records` | Formal ADR creation |
| 18 | `risk-management-specialist` | Risk register management |
| 19 | `tech-stack-evaluator` | Validating Next.js/Supabase/Vercel choices |
| 20 | `senior-architect` | High-level architecture review |

### PHASE 1 — FOUNDATION (Sprint 1)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 21 | `coding-standards` | Establishing file org, naming, immutability rules |
| 22 | `api-design` | Designing all 10 API routes before building |
| 23 | `api-design-reviewer` | Reviewing route contracts and response shapes |
| 24 | `database-designer` | 8-table schema design and relationships |
| 25 | `database-schema-designer` | SQL schema generation for Supabase |
| 26 | `database-migrations` | Supabase migration files |
| 27 | `postgres-patterns` | PostgreSQL best practices for queries |
| 28 | `prisma-patterns` | ORM patterns if Prisma added later |
| 29 | `env-secrets-manager` | Managing .env.local and Vercel env vars |
| 30 | `deployment-patterns` | Vercel deployment configuration |
| 31 | `ci-cd-pipeline-builder` | GitHub Actions for auto-deploy |
| 32 | `git-workflow` | Branch strategy, commit message format |
| 33 | `github-ops` | GitHub repo management |
| 34 | `configure-ecc` | Claude Code ECC settings |
| 35 | `hookify-rules` | Setting up Claude hooks for automation |
| 36 | `hooks:setup` | Hook configuration in settings.json |
| 37 | `update-config` | Updating settings.json |
| 38 | `senior-fullstack` | Full-stack architecture decisions |
| 39 | `senior-backend` | Backend API and serverless decisions |
| 40 | `hexagonal-architecture` | Clean architecture separation of concerns |

### PHASE 2-3 — TODAY VIEW (Sprint 2-3)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 41 | `react-patterns` | React component design patterns |
| 42 | `nextjs-turbopack` | Next.js 14 app router, server/client components |
| 43 | `frontend-patterns` | General frontend architecture patterns |
| 44 | `frontend-design-direction` | Design direction enforcement on components |
| 45 | `ui-design-system` | Design token application in components |
| 46 | `design-system` | Design system audit and maintenance |
| 47 | `motion-foundations` | Animation fundamentals for task check, captures |
| 48 | `motion-patterns` | Specific animation patterns (150ms rule) |
| 49 | `motion-ui` | UI motion rules and guidelines |
| 50 | `motion-advanced` | SVG Pomodoro ring animation (stroke-dashoffset) |
| 51 | `frontend-a11y` | Accessibility: contrast, focus, touch targets |
| 52 | `make-interfaces-feel-better` | UX polish passes |
| 53 | `vite-patterns` | Build tooling if Vite used |
| 54 | `react-performance` | Component re-render optimization |
| 55 | `react-testing` | Component unit testing |
| 56 | `senior-frontend` | Frontend architecture decisions |
| 57 | `ui-demo` | Demonstrating UI component states |
| 58 | `ux-researcher-designer` | UX validation of new patterns |
| 59 | `liquid-glass-design` | Reference: what NOT to do (anti-pattern) |
| 60 | `accessibility` | Full accessibility audit |

### PHASE 4 — GOALS + ASK AI (Sprint 4)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 61 | `backend-patterns` | API patterns for goals and tutor routes |
| 62 | `error-handling` | Structured error responses across all routes |
| 63 | `fastapi-patterns` | Reference for API design patterns |
| 64 | `api-connector-builder` | AI provider connection setup |
| 65 | `claude-api` | Anthropic API integration patterns |
| 66 | `prompt-engineer-toolkit` | Designing all 5 AI prompts (brief/tutor/test/primer/retro) |
| 67 | `prompt-optimizer` | Optimizing prompts for quality + token efficiency |
| 68 | `context-engine` | Context assembly architecture |
| 69 | `token-budget-advisor` | Managing context assembler token budget |
| 70 | `cost-aware-llm-pipeline` | Free tier cost management |
| 71 | `rag-architect` | RAG patterns for knowledge capture retrieval |
| 72 | `ai-first-engineering` | AI-native development patterns |
| 73 | `iterative-retrieval` | Retrieval patterns for context assembly |
| 74 | `regex-vs-llm-structured-text` | When AI tagging beats regex (auto-tag pipeline) |
| 75 | `senior-ml-engineer` | ML pipeline architecture decisions |
| 76 | `mle-workflow` | ML engineering workflow |
| 77 | `content-hash-cache-pattern` | Caching AI responses to reduce API calls |
| 78 | `eval-harness` | AI evaluation framework setup |
| 79 | `ai-regression-testing` | Testing AI output quality regression |
| 80 | `experiment-designer` | A/B testing AI prompts |

### PHASE 5 — TEST SIM + TEXTBOOKS (Sprint 5)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 81 | `benchmark` | Performance benchmarking for AI question gen |
| 82 | `benchmark-optimization-loop` | Optimization cycles for slow routes |
| 83 | `observability-designer` | Logging, monitoring setup |
| 84 | `product-analytics` | Usage analytics (which features used most) |
| 85 | `analysis:performance-bottlenecks` | Finding slow Supabase queries |
| 86 | `analysis:token-efficiency` | Analyzing token usage per feature |
| 87 | `analysis:token-usage` | Token usage dashboard |
| 88 | `performance-profiler` | Profiling Today View load time |
| 89 | `react-performance` | Optimizing confusion map re-renders |
| 90 | `latency-critical-systems` | Sub-2s brief generation optimization |

### AI ENGINE (All Sprints)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 91 | `claude-api` | Primary AI integration (Gemini, Groq, OpenRouter) |
| 92 | `prompt-engineer-toolkit` | All 5 feature prompts |
| 93 | `prompt-optimizer` | Prompt refinement and testing |
| 94 | `rag-architect` | Captures retrieval, textbook search |
| 95 | `context-engine` | Context assembler architecture |
| 96 | `token-budget-advisor` | Token management per feature |
| 97 | `cost-aware-llm-pipeline` | Free tier budget management |
| 98 | `cost-tracking` | API cost monitoring |
| 99 | `ai-first-engineering` | AI-native patterns throughout |
| 100 | `iterative-retrieval` | Context retrieval optimization |
| 101 | `self-improving-agent` | AI self-improvement patterns |
| 102 | `autoresearch-agent` | Research automation for feature exploration |
| 103 | `deep-research` | Deep dive on complex features |
| 104 | `foundation-models-on-device` | Future: on-device AI consideration |
| 105 | `recsys-pipeline-architect` | Recommendation system for danger-zone topics |

### QUALITY & TESTING (All Sprints)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 106 | `tdd-guide` | Test-driven development enforcement |
| 107 | `tdd-workflow` | TDD process: red → green → refactor |
| 108 | `tdd` | TDD slash command |
| 109 | `e2e-testing` | End-to-end test setup |
| 110 | `e2e` | E2E slash command |
| 111 | `pw:init` | Playwright test setup |
| 112 | `pw:generate` | Generating E2E test cases |
| 113 | `pw:fix` | Fixing failing Playwright tests |
| 114 | `pw:coverage` | Coverage reporting |
| 115 | `pw:review` | Test review |
| 116 | `browser-qa` | Browser quality assurance |
| 117 | `quality-gate` | Quality gate enforcement at Phase Gates |
| 118 | `test-coverage` | Coverage analysis (target 80%+) |
| 119 | `verification-loop` | Verification cycles |
| 120 | `verify` | Verification slash command |
| 121 | `code-reviewer` | Code review agent |
| 122 | `code-review` | Code review slash command |
| 123 | `pr-review-expert` | PR review before merge |
| 124 | `plankton-code-quality` | Code quality metrics |
| 125 | `refactor-clean` | Dead code removal |
| 126 | `simplify` | Code simplification |
| 127 | `tech-debt` | Tech debt identification |
| 128 | `tech-debt-tracker` | Tech debt management over time |

### SECURITY (Pre-Commit — Mandatory)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 129 | `security-review` | Security analysis before every commit |
| 130 | `security-scan` | Automated security scanning |
| 131 | `security-bounty-hunter` | Vulnerability hunting in auth/API code |
| 132 | `env-secrets-manager` | Secret management verification |
| 133 | `gateguard` | Access control verification |
| 134 | `dependency-auditor` | npm dependency vulnerability check |
| 135 | `gdpr-dsgvo-expert` | Data privacy (single user, still applies) |
| 136 | `ciso-advisor` | Security strategy decisions |
| 137 | `senior-security` | Security implementation review |
| 138 | `senior-secops` | Security operations |
| 139 | `safety-guard` | Safety guardrails for AI outputs |
| 140 | `hipaa-compliance` | Reference: data privacy principles |

### DEVOPS (All Sprints)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 141 | `deployment-patterns` | Vercel deployment configuration |
| 142 | `ci-cd-pipeline-builder` | GitHub Actions pipeline |
| 143 | `docker-patterns` | Future containerization reference |
| 144 | `pm2` | Process management if self-hosting |
| 145 | `canary-watch` | Deployment monitoring |
| 146 | `monitoring:status` | System health monitoring |
| 147 | `monitoring:agents` | Agent performance monitoring |
| 148 | `observability-designer` | Full observability design |
| 149 | `runbook-generator` | Operational runbooks for cron jobs |
| 150 | `incident-commander` | Incident response for production issues |
| 151 | `senior-devops` | DevOps architecture decisions |

### AGENTS & AUTOMATION (All Sprints)
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 152 | `agents:README` | Agent orchestration overview |
| 153 | `agents:spawn` | Spawning task-specific agents |
| 154 | `agents:agent-types` | Selecting the right agent type |
| 155 | `agents:agent-coordination` | Multi-agent coordination patterns |
| 156 | `agents:agent-spawning` | Spawning best practices |
| 157 | `agents:health` | Agent health monitoring |
| 158 | `agents:metrics` | Agent performance metrics |
| 159 | `swarm:swarm` | Swarm coordination for parallel builds |
| 160 | `swarm:swarm-init` | Initializing swarm for sprint |
| 161 | `swarm:swarm-strategies` | Choosing swarm topology |
| 162 | `swarm:development` | Development swarms |
| 163 | `swarm:testing` | Testing swarms |
| 164 | `optimization:parallel-execute` | Parallel execution optimization |
| 165 | `optimization:parallel-execution` | Parallel patterns |
| 166 | `coordination:orchestrate` | Task orchestration |
| 167 | `coordination:spawn` | Coordination spawn |
| 168 | `hive-mind:hive-mind` | Hive mind for complex multi-agent work |
| 169 | `autonomous-loops` | Autonomous agent loops |
| 170 | `continuous-agent-loop` | Continuous loops for monitoring |
| 171 | `automation:smart-spawn` | Smart agent spawning |
| 172 | `automation:workflow-select` | Workflow selection |
| 173 | `plan-orchestrate` | Plan orchestration |
| 174 | `sparc:orchestrator` | SPARC orchestration |
| 175 | `sparc:sparc` | Full SPARC methodology |

### MEMORY & SESSIONS
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 176 | `memory:memory-persist` | Persisting important context |
| 177 | `memory:memory-search` | Searching memory for prior decisions |
| 178 | `memory:memory-usage` | Checking memory usage |
| 179 | `memory:README` | Memory system overview |
| 180 | `self-improving-agent:remember` | Logging mistakes as laws |
| 181 | `self-improving-agent:review` | Reviewing and updating laws |
| 182 | `self-improving-agent:extract` | Extracting learnings from sessions |
| 183 | `self-improving-agent:promote` | Promoting to permanent memory |
| 184 | `continuous-learning` | Learning system setup |
| 185 | `continuous-learning-v2` | Advanced learning patterns |
| 186 | `anthropic-skills:consolidate-memory` | Memory consolidation |
| 187 | `automation:session-memory` | Session memory automation |
| 188 | `save-session` | Saving session state |
| 189 | `resume-session` | Resuming from saved state |
| 190 | `sessions` | Session management |
| 191 | `checkpoint` | Session checkpoints |
| 192 | `learn` | Learning mode activation |
| 193 | `learn-eval` | Learning evaluation |
| 194 | `agentdb-learning` | Agent learning patterns |
| 195 | `agentdb-memory-patterns` | Memory patterns for agents |

### DOCUMENTATION
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 196 | `docs` | Documentation slash command |
| 197 | `update-docs` | Updating documentation after changes |
| 198 | `update-codemaps` | Updating code maps |
| 199 | `code-tour` | Codebase tour for new developers |
| 200 | `changelog` | Changelog generation per sprint |
| 201 | `runbook-generator` | Operational runbooks (cron jobs, sync) |
| 202 | `architecture-decision-records` | ADR management |
| 203 | `decision-logger` | Decision logging |
| 204 | `anthropic-skills:doc-coauthoring` | Document co-authoring |
| 205 | `codebase-onboarding` | Onboarding documentation for collaborators |

### ANALYSIS & OPTIMIZATION
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 206 | `analysis:performance-bottlenecks` | Finding slow routes |
| 207 | `analysis:token-efficiency` | Token usage analysis |
| 208 | `analysis:token-usage` | Token usage dashboard |
| 209 | `analysis:bottleneck-detect` | Bottleneck detection |
| 210 | `context-budget` | Context management |
| 211 | `token-budget-advisor` | Token budget planning |
| 212 | `model-route` | Model routing decisions |
| 213 | `harness-audit` | Harness efficiency audit |
| 214 | `fewer-permission-prompts` | Reducing permission friction |

### PROJECT HEALTH
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 215 | `project-health` | Overall project health check |
| 216 | `sprint-health` | Sprint health monitoring |
| 217 | `saas-health` | SaaS health metrics (post-v1) |
| 218 | `retro` | Sprint retrospectives |
| 219 | `project-flow-ops` | Project flow operations |
| 220 | `evolve` | Evolution patterns for v1 → v1.1 |
| 221 | `prune` | Pruning unused code and assets |
| 222 | `skill-health` | Skill system health check |
| 223 | `skill-stocktake` | Full skill catalog audit |

### GITHUB & VERSION CONTROL
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 224 | `git-workflow` | Git workflow enforcement |
| 225 | `github-ops` | GitHub operations |
| 226 | `github:code-review` | GitHub code review |
| 227 | `github:pr-manager` | PR management |
| 228 | `github:issue-tracker` | Issue tracking for bugs |
| 229 | `github:release-manager` | Release management per Phase Gate |
| 230 | `github:repo-analyze` | Repository analysis |
| 231 | `git-worktree-manager` | Worktree management for parallel work |

### RESEARCH & EXPLORATION
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 232 | `deep-research` | Research for complex features |
| 233 | `search-first` | Search-first approach to problems |
| 234 | `autoresearch-agent:run` | Automated research |
| 235 | `scientific-thinking-literature-review` | Literature review for learning science features |
| 236 | `documentation-lookup` | Looking up library docs |
| 237 | `exa-search` | Web search for technical solutions |
| 238 | `repo-scan` | Repository scanning for patterns |

### SPARC METHODOLOGY
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 239 | `sparc:architect` | System design via SPARC |
| 240 | `sparc:coder` | Code generation via SPARC |
| 241 | `sparc:tdd` | TDD via SPARC |
| 242 | `sparc:reviewer` | Code review via SPARC |
| 243 | `sparc:security-review` | Security review via SPARC |
| 244 | `sparc:debugger` | Debugging via SPARC |
| 245 | `sparc:docs-writer` | Documentation via SPARC |

### SPECIALIZED / HOOKS
| # | Skill | When to Use in Second Brain |
|---|-------|-----------------------------|
| 246 | `hooks:overview` | Hook system overview |
| 247 | `hooks:setup` | Hook setup |
| 248 | `hooks:pre-task` | Pre-task hooks (read ui-ux-principles before CSS) |
| 249 | `hooks:post-task` | Post-task hooks (run review gate) |
| 250 | `hooks:session-end` | Session-end hooks (write to memory) |

---

## §10 — 25 COMMON CLAUDE PROGRAMMER MISTAKES

*(Each mistake → what goes wrong → what to do instead)*

---

**MISTAKE 1 — Vague Task Descriptions**
*"Build the confusion map"*
→ Claude guesses scope, builds wrong thing, wastes session.
→ FIX: Use §6 Precision Prompt Format. Always include context, constraint, task, output.

**MISTAKE 2 — No Context Before Coding**
Starting to code without reading ROADMAP.md or user stories first.
→ Claude builds from memory which diverges from spec.
→ FIX: Always read ROADMAP §8 (user story) + §6 (API spec) before writing a line.

**MISTAKE 3 — Asking Claude to Do Too Much at Once**
"Build all 5 views in one session."
→ Context overflows, later files get worse treatment, errors compound.
→ FIX: One WBS work package per coding session. One component at a time.

**MISTAKE 4 — Not Verifying Outputs**
Trusting Claude's code without testing it on real data.
→ Tests pass, production breaks. Mock/real divergence is the most common silent killer.
→ FIX: §21 Living Demo Rule. Every Phase Gate requires real Vercel demo with real data.

**MISTAKE 5 — Not Using Skills**
Working bare-handed without invoking the skill system.
→ Missing conventions, patterns, and quality controls that skills enforce.
→ FIX: Minimum 3 skills per session. State them. Invoke primary immediately.

**MISTAKE 6 — Skipping Security Review**
Committing auth code or API routes without `/security-review`.
→ Service role key exposed to client. SQL injection. Unprotected routes.
→ FIX: §1 Review Gate security checklist before every commit. Non-negotiable.

**MISTAKE 7 — Mutating Objects Instead of Returning New Ones**
`goals.roadmap.months[0].status = 'done'` — in-place mutation.
→ Hidden side effects, state bugs, React stale closures.
→ FIX: Immutability rule from coding-standards. Always return new objects.

**MISTAKE 8 — Building Features Not in User Stories**
Claude adds "nice to have" features while implementing a story.
→ Scope creep, untested features, blueprint drift.
→ FIX: §5 Law 7. Anything not in a user story goes to §15 backlog. Not built.

**MISTAKE 9 — Context Window Blindness**
Continuing to work as context fills up past 75%.
→ Claude starts making mistakes, forgetting earlier constraints, hallucinating.
→ FIX: §7 Context Budget Rules. Save session, start fresh when >75% used.

**MISTAKE 10 — Hardcoded Values in Components**
`background: '#FAF8F4'` instead of `var(--cream)` in CSS.
→ Token system breaks. Future changes require grep across whole codebase.
→ FIX: §1 Review Gate grep check. Zero hardcoded hex. Always.

**MISTAKE 11 — Treating Claude as a Search Engine**
"What is stroke-dashoffset?"
→ Gets generic answer, not applied to this project's Pomodoro ring spec.
→ FIX: Always frame questions in project context: "For the Pomodoro ring in US-007, how should stroke-dashoffset be calculated?"

**MISTAKE 12 — No Memory Between Sessions**
Starting each session cold without reading MEMORY.md.
→ Re-explains things Claude should already know. Wastes 10+ minutes per session.
→ FIX: §5 Law 11. Memory first, every session. Session start protocol mandatory.

**MISTAKE 13 — Not Writing Learning Laws**
Fixing a bug but not recording why it happened.
→ Same mistake made in Sprint 4 that was made in Sprint 1.
→ FIX: §17 Learning Laws. Every mistake → law. Written immediately after fix.

**MISTAKE 14 — Skipping Phase Gates**
Moving to Sprint 3 before Sprint 2 gate is passed.
→ Building on broken foundation. Gate failures multiply downstream.
→ FIX: ROADMAP §9 Phase Gate checklists are mandatory. No sprint starts without prior gate passed.

**MISTAKE 15 — Using Modals for Routine Actions**
Showing a confirmation modal before checking a task.
→ Breaks study flow, violates Apple HIG modality rules, frustrates user.
→ FIX: ui-ux-principles §9 Modality Rules. Inline feedback only for reversible actions.

**MISTAKE 16 — AI Prompt Hallucination Path**
Primer prompt: "What's the key formula for Coordinate Geometry?" without citing DB data.
→ AI invents a formula. User studies wrong material before exam.
→ FIX: §5 Law 9 + ai-ux-principles §4.9. Primer ALWAYS cites exact DB records. No invention.

**MISTAKE 17 — Not Parallel-Executing Independent Tasks**
Spawning agents sequentially when they could run in parallel.
→ Sprint takes 2x as long as needed.
→ FIX: §16 Parallel Execution Map. Independent stories = parallel agents.

**MISTAKE 18 — Breaking Changes Without Migration Path**
Renaming `subject_tag` to `subject` in captures table mid-sprint.
→ All existing captures break. Confusion map breaks. Ingest pipeline breaks.
→ FIX: §23 Rollback Covenant. Every schema change ships with a down migration.

**MISTAKE 19 — Forgetting the 2-Tap Rule**
Building capture flow that requires 3+ taps.
→ User abandons capture mid-thought. Knowledge capture rate drops to zero.
→ FIX: ui-ux-principles §7.1 The 2-Tap Rule. Every capture achievable in ≤2 taps.

**MISTAKE 20 — Not Seeding the DB**
Sprint 3 builds confusion map but Sprint 1 seed is empty.
→ Confusion map shows blank. Primer has no last error. App feels broken at demo.
→ FIX: Sprint 1 seed includes minimum: 4 goals + 5 errors + 3 sessions + 2 textbooks.

**MISTAKE 21 — Over-Engineering for v2**
Adding multi-user auth "while we're at it."
→ Scope explodes. Sprint never ends. v1 never ships.
→ FIX: §4 Evolution Protocol. §5 Law 12 Scope Lock. Everything for future versions goes to §15.

**MISTAKE 22 — Not Testing Provider Fallback**
Only testing with Gemini. Never testing Groq fallback path.
→ At 1,500 Gemini calls/day, fallback fires in real use. Untested fallback crashes silently.
→ FIX: Phase Gate 1 criterion: AI router fallback tested before Sprint 2 starts.

**MISTAKE 23 — Ignoring Token Budget in Context Assembler**
Context assembler reads ALL sessions, ALL captures, ALL errors.
→ Context hits 1M token limit. Gemini drops oldest context. Brief becomes inaccurate.
→ FIX: §8 Token Economy. Context assembler has hard limits per table. Last N records only.

**MISTAKE 24 — Building Without a Plan**
Starting to code without invoking `/plan` first.
→ Architecture decisions made on the fly. Refactor needed in next sprint.
→ FIX: §5 Law 2. `/plan` before every sprint. Plan approved before first line written.

**MISTAKE 25 — Skipping Compression**
Running 100+ sessions without compressing MEMORY.md, ROADMAP.md, principles.md.
→ Context load time balloons. Stale information conflicts with current state. Claude reads wrong specs.
→ FIX: §24 Compression Law. Monthly compression session. 30 minutes. Prune everything stale.

---

## §11 AGENT PLAYBOOK

### When to Use Agents vs Inline

```
USE AGENT (spawn) when:              WORK INLINE when:
────────────────────────────────     ────────────────────────────────
Task needs > 5 file reads            Quick lookup or single edit
Task is independent of session       Task needs current context
Parallel execution possible          < 5 tool calls total
Output is isolated (one file)        Fast verification needed
Research needs web search            Answering a question
Code review of a PR                  Writing a small component
```

### Available Agent Types (Key ones for Second Brain)

| Agent | Use for in this project |
|-------|------------------------|
| `Explore` | Finding files, grep for patterns, quick lookups |
| `general-purpose` | Complex multi-step tasks, research |
| `architect` | Architecture decisions before Sprint starts |
| `code-reviewer` | After writing any component or route |
| `security-reviewer` | Before every commit |
| `tdd-guide` | Before writing any new feature |
| `build-error-resolver` | When Vercel build fails |
| `typescript-reviewer` | After writing TypeScript code |
| `e2e-runner` | Running Playwright tests |
| `refactor-cleaner` | Dead code cleanup at Phase Gates |
| `doc-updater` | After sprint closes |
| `performance-optimizer` | After Phase Gate 5 if Today View is slow |

### Parallel Execution Pattern (Second Brain)

```javascript
// GOOD — parallel independent agents
Agent(description: "Build ConfusionMap component")  // US-009
Agent(description: "Build CalendarStrip component") // US-010
Agent(description: "Build CaptureBar component")    // US-011
// All 3 are independent → launch together

// BAD — sequential when independent
// Build ConfusionMap → wait → Build CalendarStrip → wait → ...
```

### Parallel-Safe Story Groups (Second Brain specific)
```
Sprint 2 parallel group:
  US-004 (AI brief) + US-005 (task list) → independent components

Sprint 3 parallel group:
  US-008 (primer) + US-010 (calendar) → independent
  US-009 (confusion map) must come before US-014 (test topics)

Sprint 4 parallel group:
  US-012 (goals hierarchy) + US-016 (ask AI chat) → independent
  US-021 (ingest) must come before US-020 (iCloud sync)
```

### Dependency-Aware Spawning Rule
```
Before spawning parallel agents:
1. Check §16 Parallel Execution Map
2. Verify no shared DB writes between parallel tasks
3. Verify no shared state in React (context/store)
4. Spawn only truly independent work packages
```

### Background Agent Rule
```
Use run_in_background=true for:
  - Code review (doesn't block next task)
  - Documentation updates
  - Test runs that take > 1 minute

Never use background for:
  - Tasks where you need output to proceed
  - Security reviews (must see results)
  - Phase Gate verification
```

### Swarm Pattern for Second Brain
```
When to use swarm:
  - Parallel build of Today View components (5 components at once)
  - Multi-file refactor at Phase Gate 5
  - Comprehensive security audit before v1.0 ship

Swarm topology for this project:
  hierarchical — one coordinator (planner) + workers (coders)
  NOT mesh — solo project, no need for peer consensus
```

---

# PART 4 — ARCHITECTURE LAWS

## §12 MODULARITY MANIFESTO

**This project must be readable, extensible, and shareable with other developers and learners.**

### File Organization Law
```
/src
  /components           ← UI components only, no business logic
    /today              ← Today view components
    /goals              ← Goals view components
    /test-sim           ← Test simulator components
    /ask-ai             ← Ask AI components
    /textbooks          ← Textbooks components
    /shared             ← Reusable: Button, Card, ProgressBar, CaptureBar
  /lib
    ai-router.js        ← AI provider cascade — ONLY file that calls AI
    context-assembler.js ← Context building — ONLY file that reads all tables
    supabase.ts         ← Supabase client — ONLY file that creates client
  /hooks                ← React hooks only
  /api                  ← Next.js API routes only
  /types                ← TypeScript interfaces only
  /utils                ← Pure functions only, no side effects
  /styles               ← globals.css, design tokens
```

### The One Responsibility Law
```
Every file does ONE thing:
  ai-router.js          → only routes AI calls
  context-assembler.js  → only assembles context
  supabase.ts           → only creates/exports client
  api/brief.ts          → only handles /api/brief
  ConfusionMap.tsx       → only renders confusion map

If a file does two things → split it.
```

### File Size Law
```
Target:    200-400 lines
Warning:   > 600 lines → schedule refactor
Hard cap:  800 lines → split immediately
```

### Interface Contract Law
```
Every module exports a typed interface:
  context-assembler.js  → exports type ContextPayload
  ai-router.js          → accepts type ContextPayload, returns type AIResponse
  api/brief.ts          → accepts POST body type, returns APIResponse<BriefData>

TypeScript strict mode: ON.
No implicit any. No type assertions without comment.
```

### Extension Points
```
These are designed to be extended by future developers:
  ai-router.js       → add new providers by adding to providers array
  context-assembler  → add new context fields by extending ContextPayload
  /api/ingest        → add new content types by extending type union
  confusion map      → add quadrants by extending QuadrantType enum
```

---

## §13 NAMING CONVENTIONS

### Files and Directories
```
Components:     PascalCase      ConfusionMap.tsx, PomodoroRing.tsx
Hooks:          camelCase       usePomodoroTimer.ts, useConfusionMap.ts
API routes:     kebab-case      /api/brief.ts → route: /api/brief
Utils:          camelCase       formatDuration.ts
Types:          PascalCase      ContextPayload.ts, APIResponse.ts
Styles:         kebab-case      pomodoro-ring.module.css
```

### Database
```
Tables:         snake_case      test_results, session_logs
Columns:        snake_case      subject_tag, topic_tag, created_at
Primary keys:   uuid            id uuid PRIMARY KEY DEFAULT gen_random_uuid()
Foreign keys:   {table}_id      session_id, goal_id
Booleans:       is_ prefix      is_active, is_locked
JSON fields:    descriptive     topic_map, roadmap, preferences
```

### CSS Variables
```
--cream, --cream2, --cream3           background scale
--ink, --ink2, --ink3, --ink4         text/foreground scale
--line, --line2                       border scale
--red, --amber, --green               semantic (state only)
```

### TypeScript
```
Interfaces:     PascalCase + I prefix avoided (just PascalCase)
Types:          PascalCase
Enums:          PascalCase + ALL_CAPS values
Constants:      SCREAMING_SNAKE_CASE
Functions:      camelCase, verb-first: assembleContext(), routeToProvider()
```

### Commit Messages (Conventional Commits)
```
feat:     new user story implemented
fix:      bug fix
style:    CSS/design change (no logic change)
refactor: code restructure (no behavior change)
test:     test additions or fixes
chore:    tooling, deps, config
docs:     documentation only
perf:     performance improvement
ci:       CI/CD pipeline changes
```

---

## §14 LEARNER-FRIENDLY ANNOTATIONS

**This project is a prototype AND a learning resource. Code should teach.**

### Comment Rules
```
Write a comment ONLY when:
  - The WHY is non-obvious (hidden constraint, subtle invariant)
  - Workaround for a specific bug with a link
  - Surprising behavior that would confuse a reader

NEVER write comments that explain WHAT the code does:
  // BAD:  increment the counter
  counter++

  // BAD:  calculate progress percentage
  const progress = (current / total) * 100

  // GOOD: Gemini's token window is 1M but we cap at 50k to leave
  //       room for the model's response tokens
  const MAX_CONTEXT_TOKENS = 50000
```

### README Per Major Module
```
Every directory under /src gets a README.md explaining:
  - What this module does (1 sentence)
  - Key files and their role
  - How to extend it (for collaborators)
  - Gotchas / non-obvious behavior

Example: /src/lib/README.md
  "Core server-side utilities. ai-router.js handles all AI provider
  calls with fallback. context-assembler.js builds the unified context
  object from Supabase before every AI call. Never import supabase.ts
  in client components."
```

### Architecture Decision Records
```
Location: /docs/adr/
Format: ADR-001-supabase-over-planetscale.md
When to write:
  - Any technology choice
  - Any approach where alternatives were considered
  - Any constraint that would surprise a future developer
Template:
  # ADR-XXX: [Title]
  Status: [Proposed | Accepted | Deprecated]
  Context: [Why this decision was needed]
  Decision: [What we chose]
  Consequences: [What this means going forward]
```

---

# PART 5 — MCP INTEGRATION

## §15 MCP PRINCIPLES

### MCP #1 — PMBOK 6th Edition
**File:** `C:\Users\Richard Amadeus\Downloads\PMBOK 6th Edition.pdf`
**Role:** Project management backbone — process groups, knowledge areas, phase gates.

```
How to use PMBOK in this project:
  - Every sprint opens with: Initiating + Planning process groups
  - Every sprint closes with: Monitoring + Controlling + Closing
  - Phase Gates = PMBOK phase gate reviews
  - Risk Register = PMBOK Risk Management
  - WBS = PMBOK Scope Management decomposition

PMBOK Chapter → Second Brain Mapping:
  Ch 4 (Integration)  → ROADMAP.md as single source of truth
  Ch 5 (Scope)        → WBS + scope lock in §2
  Ch 6 (Schedule)     → 6-sprint plan + phase gates
  Ch 8 (Quality)      → §1 Review Gate
  Ch 11 (Risk)        → ROADMAP.md §10 Risk Register
  Ch 13 (Stakeholder) → Single stakeholder = builder = acceptance criteria per US
```

### MCP #2 — Vercel (Deployment)
**Tools:** `mcp__af70e0d7...` Vercel MCP tools
**Role:** Deployment pipeline, build monitoring, runtime logs.

```
Use Vercel MCP for:
  - mcp__...deploy_to_vercel          → Phase Gate deploys
  - mcp__...get_deployment            → Deployment status
  - mcp__...get_deployment_build_logs → Build failure diagnosis
  - mcp__...get_runtime_logs          → Production error diagnosis
  - mcp__...list_deployments          → Sprint history

Protocol:
  1. End of every sprint → deploy to Vercel
  2. Check build logs → fix before Phase Gate
  3. Check runtime logs after first real use day
  4. Never skip deploy verification — see §21 Living Demo Rule
```

### MCP #3 — Notion (Knowledge Management)
**Tools:** `mcp__0900721d...` Notion MCP tools
**Role:** Existing Notion roadmap → Second Brain sync + project documentation.

```
Use Notion MCP for:
  - mcp__...notion-fetch              → Read existing Notion roadmap for seed data
  - mcp__...notion-search             → Find specific goal/week data
  - mcp__...notion-create-pages       → Log sprint retrospectives to Notion
  - mcp__...notion-update-page        → Update Notion when ROADMAP changes

Protocol:
  - Sprint 1: fetch Notion roadmap → use as exact seed data for goals table
  - End of every sprint: log Phase Gate result to Notion
  - Notion = external record, Second Brain = source of truth
```

### MCP #4 — Sentry (Error Monitoring)
**Tools:** `mcp__ed9aa678...` Sentry MCP tools
**Role:** Production error tracking after v1 ships.

```
Use Sentry MCP for:
  - mcp__...search_issues             → Find production errors post-ship
  - mcp__...analyze_issue_with_seer   → AI-powered error analysis
  - mcp__...search_events             → Event timeline for debugging

Protocol:
  - Add Sentry SDK in Sprint 6 (polish sprint)
  - mcp__...create_dsn                → Get DSN for Next.js
  - After every production error → run Sentry MCP before guessing
```

---

## §16 PARALLEL EXECUTION MAP

### Sprint-Level Parallelism

```
SPRINT 1 (Foundation — sequential, each blocks next):
  1.2 Schema → 1.3 Auth → 1.4 RLS → 1.5 Design system → 1.6 AI Router
  No parallelism — each step depends on the prior.

SPRINT 2 (Today View Core — parallel after layout):
  Sequential:  2.1 Layout first (others need the grid)
  Parallel:    2.2 AI Brief + 2.3 Tasks + 2.4 Textbook bars
  Sequential:  2.5 Pomodoro (needs session model from 2.3)

SPRINT 3 (Today View Complete — parallel):
  Parallel:    2.6 Primer + 2.8 Calendar + 2.9 Capture bar
  Sequential:  2.7 Confusion map (needs 2.5 session data)

SPRINT 4 (Goals + Ask AI — parallel):
  Parallel:    3.x Goals + 5.x Ask AI + 7.2 Ingest pipeline
  All independent — spawn 3 agents simultaneously

SPRINT 5 (Test Sim + Textbooks — parallel):
  Parallel:    4.x Test Sim + 6.x Textbooks + 7.4 Retrospective cron
  Sequential:  4.3 Question gen needs 4.1 topic grid complete

SPRINT 6 (Polish — parallel):
  Parallel:    8.x Apple sync + design audit + dead code cleanup
```

### Story-Level Dependency Rules
```
CAN parallel:                         CANNOT parallel:
US-004 + US-005 + US-006             US-001 → US-002 (auth before schema)
US-008 + US-010 + US-011             US-002 → US-018 (schema before AI router)
US-012 + US-016 + US-021             US-009 → US-014 (confusion map before test topics)
US-014 + US-017 + US-019             US-021 → US-020 (ingest before iCloud sync)
```

---

# PART 6 — MEMORY & LEARNING

## §17 LEARNING LAWS (PERMANENT)
*(Every mistake becomes a law. Written immediately after the fix. Never deleted.)*

### Law Format
```
LAW-XXX: [Title]
Date:     [YYYY-MM-DD]
Context:  [What we were building when this happened]
Mistake:  [Exactly what went wrong]
Cause:    [Root cause — not symptom]
Fix:      [Exact fix applied]
Rule:     [Permanent rule derived from this — one sentence]
Trigger:  [When Claude should recall this law — "whenever doing X"]
```

### Existing Laws

**LAW-001: Confusion Map Needs Seed Data**
Date: 2026-06-04
Context: Building confusion map in Sprint 3
Mistake: Confusion map showed blank on first demo
Cause: Sprint 1 seed data not created before UI built
Fix: Added 5 sample errors + 3 sessions to Sprint 1 seed script
Rule: Always create seed data BEFORE building the UI that reads it.
Trigger: Whenever building any component that displays DB data.

**LAW-002: Provider Name Never User-Facing**
Date: 2026-06-04
Context: AI router fallback to Groq
Mistake: Error message included "Falling back to Groq" in UI
Cause: Error handler passed raw provider name to response
Fix: Standardized all AI errors to generic "Processing..." message
Rule: Provider is infrastructure — never exposed in UI, logs, or errors shown to user.
Trigger: Whenever adding error handling to any AI route.

**LAW-003: CSS Token System Before Components**
Date: 2026-06-04
Context: Building task checklist before Sprint 1 design system
Mistake: Hardcoded hex in component, required grep-and-replace later
Cause: Component built before globals.css :root vars defined
Fix: Phase Gate 1 requires CSS vars confirmed before Sprint 2 starts
Rule: Design tokens must be committed and verified before any component references them.
Trigger: Whenever Sprint 1 is starting.

*(New laws added below as they're discovered — never delete, only append)*

### How to Write a New Law
```
When a mistake is made or a non-obvious solution is found:
1. Stop immediately
2. Write the law using the format above
3. Add to this section (§17)
4. Commit principles.md with message: "docs: add LAW-XXX [title]"
5. Continue work

Threshold for writing a law:
  - Any bug that took > 20 minutes to find
  - Any architectural decision that surprised you
  - Any time you said "I should have known that"
  - Any time the same mistake would be easy to repeat
```

---

## §18 MEMORY ARCHITECTURE

### 4 Memory Types — When to Use Each

| Type | Use for | Write when | Read when |
|------|---------|-----------|----------|
| **user** | Builder's profile, learning style, preferences | Learn something about how Richard works | Starting a session, tailoring responses |
| **feedback** | How Claude should behave — corrections + validations | User corrects approach OR confirms non-obvious choice | Before any task that matches the feedback domain |
| **project** | Current sprint state, decisions made, blockers | After Phase Gates, after major decisions | Every session start |
| **reference** | Where to find external things (Notion roadmap, PMBOK pages, Vercel URL) | When locating external resources | When needing to find something external |

### Memory Files Location
```
C:\Users\Richard Amadeus\.claude\projects\
  C--Users-Richard-Amadeus-Documents-Everything-Code-Projects-Quikphic\memory\
    MEMORY.md                   ← index, always loaded
    project_secondbrain.md      ← project context
    feedback_proactive_skills.md ← skill rule
    user_*.md                   ← user profile memories
    feedback_*.md               ← behavior feedback
```

### Memory Hygiene Rules
```
WRITE to memory:
  ✓ Non-obvious decisions (why Gemini over OpenAI)
  ✓ Behavior corrections from user
  ✓ Phase Gate results
  ✓ Current sprint number

DO NOT write to memory:
  ✗ Code patterns (derivable from codebase)
  ✗ Git history (use git log)
  ✗ Temporary task state (use TaskCreate instead)
  ✗ Things already in ROADMAP.md or this file

REVIEW memory:
  Every 4 sessions → verify memory is still accurate
  Before every session → read MEMORY.md index
  After Phase Gates → update project memory with new state
```

---

# PART 7 — COLLABORATION

## §19 HANDOFF PROTOCOL

**Any developer (or future Claude session) picking up this project reads these 5 files in order:**

```
1. ROADMAP.md           → full project spec, user stories, sprint plan
2. principles.md        → this file — operating rules
3. ui-ux-principles.md  → design rules for every component
4. MEMORY.md            → quick reference index
5. /docs/adr/           → why key decisions were made
```

### What a New Developer Needs to Know (30-Second Brief)
```
Project:    Second Brain — personal learning OS for one user
Stack:      Next.js 14 + Supabase + Vercel (all free tier)
AI:         Gemini Flash → Groq → OpenRouter (cascade fallback)
Views:      Today / Goals / Test Sim / Ask AI / Textbooks
Design:     Newsreader serif, cream palette, 1px borders, NO shadows
Key rule:   Never use box-shadow. Never hardcode hex. 1px progress bars.
Status:     [update this line at every Phase Gate]
Current:    Sprint [X], Phase Gate [X] [PASSED/IN PROGRESS]
```

### For Other Learners Studying This Codebase
```
Start here: /docs/adr/ for WHY decisions were made
Then read:  /src/lib/README.md for core architecture
Then look:  /src/components/today/PomodoroRing.tsx for SVG animation
            /src/api/brief.ts for AI integration pattern
            /src/lib/ai-router.js for provider cascade
            /src/lib/context-assembler.js for context management

Key learning moments:
  - How to build SVG animations with stroke-dashoffset
  - How to implement AI provider fallback without user-facing disruption
  - How to structure Supabase RLS for single-user apps
  - How to build a context assembler for LLM apps
  - How to apply Apple HIG to a web app
```

---

# PART 8 — OUT-OF-THE-BOX

## §20 PROMPT ARCHAEOLOGY

**Save winning prompts. Reuse them. Never re-invent what already works.**

### Location
```
/docs/prompts/
  brief-prompt-v1.md          ← daily brief generation
  primer-prompt-v1.md         ← pre-session primer
  test-gen-prompt-v1.md       ← test question generation
  tutor-prompt-v1.md          ← ask AI tutor
  retro-prompt-v1.md          ← weekly retrospective
  ingest-tag-prompt-v1.md     ← auto-tagging captures
```

### Archaeology Format
```markdown
# [Feature] Prompt — v[N]
Date:      [when this version was finalized]
Model:     [Gemini Flash / Groq / OpenRouter]
Quality:   [1-5 stars + what's good about it]
Tokens:    [approximate prompt token count]
Tested:    [yes/no — manually verified output quality]

## System Prompt
[exact system prompt text]

## User Prompt Template
[exact user prompt with {variables} marked]

## Example Output
[one real example of a good output]

## What To Watch For
[edge cases, hallucination patterns to monitor]
```

### When to Archive a Prompt
```
Archive when:
  - Output quality is consistently good (3+ uses)
  - Prompt survived a model update without change
  - You'd be annoyed to lose it

Version when:
  - Model changes (Gemini Flash 1.5 → 2.0)
  - Context structure changes
  - Output quality drops → diagnose → fix → new version
```

---

## §21 LIVING DEMO RULE

**At every Phase Gate: real app, real data, real Vercel. No exceptions.**

### What "Real" Means
```
Real app:   Vercel deployment (not localhost)
Real data:  Supabase production DB (not mocked)
Real AI:    Gemini Flash API (not hardcoded response)
Real flow:  Open app → generate brief → check a task → complete Pomodoro → see session logged
```

### Phase Gate Demo Checklist
```
GATE 1:  [ ] App loads on Vercel URL
         [ ] Login works
         [ ] /api/brief returns response (even if hardcoded)

GATE 2:  [ ] Brief generates from real Supabase goals
         [ ] Task check persists to sessions table
         [ ] Pomodoro ring SVG animates correctly

GATE 3:  [ ] Primer pulls real last error from DB
         [ ] Capture bar submits → appears in captures table
         [ ] Confusion map shows seeded data (not empty)

GATE 4:  [ ] Goals hierarchy expands with real roadmap data
         [ ] Ask AI returns streamed response with context bar
         [ ] ML goal shows amber state

GATE 5:  [ ] Test sim generates real AI questions
         [ ] Wrong answer appears in errors table
         [ ] Weekly retro manually triggered → stored in retrospectives

GATE 6:  [ ] iCloud .md file ingested
         [ ] All screens usable in real 2hr study session
         [ ] No console.log, no debugger, no mock data anywhere
```

### Rule: If You Can't Demo It Live, Don't Claim It's Done
```
"It works on my machine" = it doesn't count.
"The code looks right" = it doesn't count.
"I tested it locally" = not enough.
Deployed + real data + real AI = done.
```

---

## §22 COGNITIVE LOAD COVENANT

**This project is built by a learner who is also the user. Protect working memory.**

### Max 2 New Architectural Concepts Per Sprint

```
Sprint 1 new concepts:   Supabase RLS + Next.js App Router (2 = limit)
Sprint 2 new concepts:   SVG animation + streaming API response (2 = limit)
Sprint 3 new concepts:   Real-time recalculation + cron endpoints (2 = limit)
```

If a sprint would introduce > 2 new concepts, Claude must:
1. Flag it explicitly: "This sprint introduces 3 new concepts: X, Y, Z — that's over the limit."
2. Propose which to defer to a later sprint
3. Get explicit approval before proceeding

### New Concept Threshold
```
Counts as a new concept:
  - New library or framework (Supabase realtime, React Query, etc.)
  - New design pattern (optimistic updates, streaming, etc.)
  - New database concept (RLS, triggers, materialized views)
  - New AI pattern (RAG, function calling, streaming)

Does NOT count:
  - More of the same (another React component, another API route)
  - Applying an established pattern from prior sprint
  - Bug fixes
```

### The Irony Note
```
Second Brain's own study philosophy: don't overload working memory.
Pre-session primer: prime with prior knowledge before new input.
Confusion map: track what's safe vs dangerous knowledge territory.

This project should embody these principles in its own development:
  Don't rush. Don't overload. Build deep familiarity before moving on.
```

---

## §23 ROLLBACK COVENANT

**Every change has an escape hatch. Nothing irreversible without a tested path back.**

### Database Migrations
```
Every migration file has:
  up()   → applies the change
  down() → reverses it exactly

Before committing a migration:
  1. Run the up() migration locally
  2. Verify data looks correct
  3. Run the down() migration
  4. Verify data restored to prior state
  5. Run up() again → now commit

Never commit a migration with only up().
```

### API Breaking Changes
```
When an API contract changes:
  1. Add new field alongside old field (not replace)
  2. Both fields work simultaneously for 1 sprint
  3. Remove old field only after all callers updated
  4. Document in ADR: "ADR-XXX: Deprecated {field} in favor of {newField}"

Example:
  captures table: adding topic_id alongside topic_tag
  Both columns exist in Sprint 4
  topic_tag removed in Sprint 5 after all references updated
```

### Schema Change Protocol
```
BEFORE any schema change:
  1. Export current data: SELECT * FROM [table] in Supabase
  2. Write down migration + up() + down()
  3. Test both directions locally
  4. Commit migration file
  5. Apply to production via Supabase dashboard
  6. Verify production data intact

IF production migration fails:
  1. Run down() migration immediately
  2. Export error from Supabase logs
  3. Document in §17 Learning Laws
  4. Fix and retry
```

---

## §24 COMPRESSION LAW

**Documents rot. Prune monthly or pay the context tax.**

### Schedule
```
Last Sunday of every month: 30-minute compression session.
Compress: MEMORY.md + ROADMAP.md + this file (principles.md)
```

### What to Compress

**MEMORY.md:**
```
Remove:  Entries about completed sprints (Phase Gate already passed)
Remove:  Entries that contradict current state
Update:  Project status entry to current sprint
Target:  < 10 lines per memory type, < 80 lines total
```

**ROADMAP.md:**
```
Archive:  Completed user stories → /docs/completed-stories/
Remove:   Sprint 1-N notes once gate is passed (keep gate criteria, remove notes)
Update:   "Current sprint" section at top
Target:   Active sprint + 1 future sprint in focus
```

**principles.md (this file):**
```
Append:  New Learning Laws (§17) — never delete
Archive: Superseded rules → /docs/archived-principles/
Update:  Skill index if new skills discovered
Target:  Core laws always readable in < 20 minutes
```

### Signs Compression Is Needed
```
→ Reading session files takes > 5 minutes
→ MEMORY.md > 200 lines
→ Claude starts referencing stale sprint info
→ Contradictions between files appear
→ You feel like you're reading history not current state
```

---

## §25 COLLABORATION HANDOFF

*(Consolidated from §19 — final expansion for sharing with other developers/learners)*

### The Sharing Commitment
This project is designed to be shared with:
1. **Other learners** studying how to build AI-powered web apps
2. **Other developers** who want to extend Second Brain
3. **Future sessions of Claude** picking up mid-project

### What Makes This Project Shareable

**Every decision is documented:**
```
WHY Newsreader over Inter?     → ui-ux-principles.md §2
WHY Gemini over OpenAI?        → ADR-XXX or §15 MCP Principles
WHY 1px progress bars?         → ui-ux-principles.md §4.4 + §1 (inevitability)
WHY no shadows?                → ui-ux-principles.md §12 (anti-pattern) + Apple HIG
WHY Supabase over Planetscale? → ADR-001
```

**Every module is documented:**
```
/src/lib/README.md             → core utilities
/src/components/README.md      → component library
/docs/adr/                     → architecture decisions
/docs/prompts/                 → proven AI prompts
ROADMAP.md                     → full spec
principles.md                  → this file
ui-ux-principles.md            → design rules
```

**Every pattern is teachable:**
```
SVG Pomodoro ring     → teaches: SVG animation, stroke-dashoffset, CSS transitions
AI provider cascade   → teaches: fallback patterns, error handling, provider agnosticism
Context assembler     → teaches: LLM context management, Supabase querying
Confusion map         → teaches: derived state from multiple data sources
Auto-tagging          → teaches: AI classification, structured output
```

### The One-Page README (For New Arrivals)
```markdown
# Second Brain — Personal Learning OS

A proactive AI that manages your study schedule. Built by one learner,
designed to be understood by all learners.

## Read This First
1. ROADMAP.md — what we're building and why
2. principles.md — how we build it
3. ui-ux-principles.md — what it looks like

## Quick Start
npm install && npm run dev

## Stack
Next.js 14 · Supabase · Vercel · Gemini Flash
Design: Newsreader serif, cream palette (#FAF8F4), 1px borders, no shadows.

## Current Status
Sprint [X] of 6 | Phase Gate [X] [PASSED/IN PROGRESS]

## Key Learning Moments
See /docs/adr/ for architecture decisions
See /docs/prompts/ for AI prompt patterns
See §17 in principles.md for mistakes-turned-laws
```

---

# PART 9 — PROJECT LOGBOOK

## §26 PROJECT LOGBOOK
*(Append-only. Every session adds one activity row. Every error gets logged. Successes captured for reuse. This is the receipt — not the summary. Prevents fake handoffs and lost wins.)*

---

### 26.1 ACTIVITY LOG
*(One row per session. Append at bottom. Never edit past rows.)*

| Date | Session | Prompt Summary | Task | Outcome | Artifacts Created |
|------|---------|---------------|------|---------|-------------------|
| 2026-06-05 | S01 | "Execute prompt 01 — scaffold" | P01: Project scaffold — directory structure, config files, ADR-001 | ✅ COMPLETE | `package.json`, `.eslintrc.json`, `.env.local.example`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `playwright.config.ts`, `docs/adr/ADR-001-supabase-over-alternatives.md`, `.gitkeep` in all `/src/` dirs |
| 2026-06-05 | S01 | "Edit principles.md — add logbook" | §26 logbook added to principles.md | ✅ COMPLETE | `principles.md` (this section) |

**How to append an activity row:**
```
After every session, add one row:
  Date:     YYYY-MM-DD
  Session:  S01, S02 ... (increment each session)
  Prompt:   Short quote or summary of the trigger prompt
  Task:     WBS code + description (e.g. "P01: Scaffold")
  Outcome:  ✅ COMPLETE | ⚠️ PARTIAL (note what remains) | ❌ FAILED (note error)
  Artifacts: Files created or modified
```

---

### 26.2 ERROR REGISTRY
*(Every error logged, even minor. Mark resolved. Prevents chasing the same error twice.)*

| Date | Session | Error | Root Cause | Fix Applied | Resolved |
|------|---------|-------|-----------|-------------|----------|
| — | — | No errors logged yet | — | — | — |

**How to append an error row:**
```
When any error occurs (build failure, API 500, Supabase query fail, config issue):
  Date:       YYYY-MM-DD
  Session:    S0X
  Error:      Exact error message (quoted) or short description
  Root Cause: One sentence — the actual cause, not the symptom
  Fix:        Exact fix applied
  Resolved:   ✅ Yes | ⚠️ Workaround | ❌ Open

Errors that caused > 20 min to diagnose → also add to §17 Learning Laws.
```

---

### 26.3 SUCCESS PATTERNS
*(What worked well, ready to replicate. Complements §20 Prompt Archaeology — this is for build process, not AI prompts.)*

**SP-001: Directory scaffold via .gitkeep before any code**
Date: 2026-06-05 | Session: S01
Pattern: Create all `/src/components/*`, `/src/lib`, `/hooks`, `/types`, `/utils`, `/styles`, `/tests/e2e`, `/docs/adr` with `.gitkeep` in one pass before writing implementation files.
Result: Clean directory structure committed before any code. Zero restructuring mid-sprint.
Replicate when: Starting any new Next.js project or new sprint with new module directories.

**SP-002: ADR written before first implementation commit**
Date: 2026-06-05 | Session: S01
Pattern: ADR-001 written (Supabase over alternatives) and committed as part of the scaffold — not retrofitted after the fact.
Result: Decision preserved with full context from the moment of decision. No reconstruction needed.
Replicate when: Any new technology choice. Write the ADR while the reasoning is fresh.

**How to append a success pattern:**
```
When an approach produced a replicable good outcome:
  SP-XXX: [Short title]
  Date:   YYYY-MM-DD | Session: S0X
  Pattern: What was done (one paragraph)
  Result:  What the outcome was
  Replicate when: When to use this again (trigger condition)
```

---

# APPENDIX — QUICK REFERENCE CARD
*(Read this when starting any session. Fits on one screen.)*

```
PROJECT:    Second Brain Personal OS
STACK:      Next.js 14 + Supabase + Vercel + Gemini→Groq→OpenRouter
VIEWS:      Today / Goals / Test Sim / Ask AI / Textbooks
DESIGN:     Newsreader, #FAF8F4 cream, --ink at 4 opacities, 1px, no shadows

MANDATORY TRIGGERS:
  /plan         before any sprint or build
  /tdd          before any new feature
  /code-review  after writing code
  /security-review before any commit
  /verify       after any UI change
  3 skills min  every session

HARD RULES:
  1. Never build outside WBS without charter amendment
  2. Never use box-shadow. Zero exceptions.
  3. Never hardcode hex. CSS vars only.
  4. Never expose SUPABASE_SERVICE_ROLE_KEY to client
  5. Never show AI provider name to user
  6. Never ship without real Vercel demo (§21)
  7. Every mistake → Learning Law in §17
  8. Read MEMORY.md before every session

SPRINT STATUS: [update this line at start of every session]
Current sprint:    Sprint [X]
Last Phase Gate:   Gate [X] [PASSED / FAILED on: ...]
Top risk:          [current top risk from ROADMAP §10]
Next milestone:    [next Phase Gate criteria]
```

---

*principles.md — Second Brain Personal OS*
*Permanent memory system. Read at the start of every session.*
*Last compressed: 2026-06-04 | Next compression due: 2026-07-04*
