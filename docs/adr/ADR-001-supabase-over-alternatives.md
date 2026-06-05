# ADR-001: Supabase over Alternatives

**Status:** Accepted
**Date:** 2026-06-05

## Context

Second Brain requires:
- PostgreSQL relational database (goals, sessions, errors, captures, textbooks — 8 tables with foreign keys)
- Single-user authentication with row-level security
- File storage for uploaded PDFs, voice recordings, scanned notes
- Free tier sufficient for prototype (single user, low traffic)
- Zero-config deployment compatible with Vercel serverless functions
- No separate backend server needed

Alternatives considered: PlanetScale (MySQL, no RLS), Firebase (NoSQL — doesn't fit relational data model), Railway + Postgres (requires managed server), Neon (Postgres, no built-in auth or storage), self-hosted Postgres on Fly.io (operational overhead).

## Decision

Use **Supabase** (free tier) for:
- PostgreSQL database with row-level security on all 8 tables
- Supabase Auth — email/password, JWT auto-managed, no custom session logic
- Supabase Storage — 1GB free, bucket per content type (notes, PDFs, voice)
- Direct client via `@supabase/supabase-js` — works in Next.js API routes and server components

## Consequences

**Positive:**
- Single service covers DB + auth + storage — no service coordination overhead
- RLS enforced at the database level — service role key only used server-side
- Free tier: 500MB DB, 1GB storage, 50,000 monthly active users — sufficient for prototype
- Supabase SQL editor allows direct schema inspection and migration testing
- Real-time subscriptions available for future confusion map live updates (v1.1)

**Negative:**
- Supabase free tier pauses after 1 week of inactivity — acceptable for prototype, must re-activate if unused
- PostgreSQL JSONB for `goals.roadmap` requires careful querying — documented in data model (ROADMAP §5)
- Service role key must never leave server — enforced via §1 Review Gate and LAW-14 in principles.md

**Migration path:**
If prototype grows beyond free tier: upgrade to Supabase Pro ($25/month) — same SDK, same schema, zero migration needed.
