# Second Brain (Brainify)

Personal learning OS for a practice-heavy student: proactive AI brief, task engine,
Pomodoro + primer, confusion map, test simulator, textbook source web, weekly
retrospectives, capture pipeline, and a **permanent AI memory** shared by every feature.

Stack: Next.js 15 · React 19 · Supabase (Postgres + RLS) · Tailwind · AI cascade
(Gemini → Groq → OpenRouter) · Playwright + Jest.

## Run

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase + AI keys
npm run dev
```

Apply SQL in `supabase/migrations/` (001 → 005) in the Supabase SQL editor, in order.

## Scripts

| Command | What |
|---------|------|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run test:unit` | Jest unit tests (algorithms, processors, router) |
| `npm run test:e2e` | Playwright E2E |

## Memory architecture (v1.1)

One **main memory** (`ai_memory.scope='main'`) — a markdown document every AI call
reads first. Every platform use (session logged, test submitted, chat, capture)
triggers an AI distill that rewrites the whole document (`memory_log` keeps history).
Scoped memories (`tutor`, `test_gen`, `brief`, `retro`) layer on top.
View/edit at `/memory`.

Read order in every prompt: **main memory → scope memory → live context**
(`src/lib/memory/memoryManager.ts`, `src/lib/context-assembler.js`).

## MCP server

`mcp-server/` exposes the learning OS to MCP clients (Claude Code / Claude Desktop)
over stdio. Tools:

`memory_read` · `memory_write` · `quiz_generate` · `quiz_history` · `textbook_list` ·
`textbook_pull` · `captures_search` · `confusion_map_get` · `session_log`

Setup:

```bash
cd mcp-server && npm install && npm run smoke   # protocol smoke test
```

The repo's `.mcp.json` registers the server for Claude Code automatically (it reads
env from `.env.local`). For Claude Desktop, add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "second-brain": {
      "command": "npx",
      "args": ["tsx", "<repo-path>/mcp-server/src/index.ts"]
    }
  }
}
```

## Docs

- `docs/planning/` — ROADMAP, principles, design laws, all 25 build prompts
- `docs/adr/` — architecture decision records
- `docs/prompts/` — prompt archaeology (brief, primer, tutor, test-gen, retro, memory distill)
