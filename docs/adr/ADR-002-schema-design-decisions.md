# ADR-002: Schema Design Decisions
**Sprint 1 | WBS 1.3 | US-002**
**Date:** 2026-06-05
**Status:** Accepted

---

## Context

Sprint 1 requires creating the Supabase/PostgreSQL schema for all tables defined in ROADMAP §5. Several design decisions were made that are not immediately obvious from the table definitions.

---

## Decision 1: UUID primary keys via `gen_random_uuid()`

**Decision:** All PKs use `uuid DEFAULT gen_random_uuid()`.

**Rationale:**
- No sequential ID leakage (no way to enumerate records by incrementing an integer)
- Safe for client-side ID generation (optimistic UI updates)
- Consistent with Supabase's own `auth.users.id` type

**Trade-off:** UUIDs use more storage than integers and are slightly slower to index. Acceptable within Supabase 500MB free tier (Risk R3).

---

## Decision 2: `jsonb` for `goals.roadmap`, `users.preferences`, `textbooks.topic_map`

**Decision:** Three columns use `jsonb` instead of normalised relational tables.

**Rationale:**
- `goals.roadmap` — deeply nested (months → weeks → daily_checklist[]), evolves rapidly. Normalising to 3+ join tables adds sprint 1 complexity for no query benefit at single-user scale.
- `users.preferences` — small, infrequently read, shape unknown until Sprint 4+. `jsonb` defers schema commitment.
- `textbooks.topic_map` — keyed by chapter number, variable length per book. Storing as `{ chapter: [topic_ids] }` is the natural read pattern for the context assembler.

**Trade-off:** Cannot add FK constraints inside jsonb. Topic IDs are not enforced at DB level. Accepted for prototype scope.

---

## Decision 3: `user_id uuid REFERENCES auth.users(id)` on every non-users table

**Decision:** Every table except `users` has an explicit `user_id` FK to `auth.users`.

**Rationale:**
- ROADMAP §5.2 specifies `USING (auth.uid() = user_id)` for all RLS policies
- The schema in §5 omits `user_id` from individual table definitions — it was implied by the single-user auth model
- Adding `user_id` to every table is the standard Supabase RLS pattern
- `users.id` is already `= auth.uid()`, so that table uses `USING (auth.uid() = id)`

---

## Decision 4: `sources.resource_id` polymorphic reference (no FK constraint)

**Decision:** `sources.resource_id` references either `goals.id` or `textbooks.id` depending on `resource_type`. No database FK constraint applied.

**Rationale:**
- PostgreSQL cannot enforce FK constraints on polymorphic references
- `resource_type` column ('textbook', 'capture', 'note') disambiguates at application level
- WBS 6.4 (source web) is Sprint 5 — enforcement logic deferred

**Risk:** Orphaned `sources` rows if a goal or textbook is deleted. Mitigated by app-layer cascade logic in Sprint 5.

---

## Decision 5: `retrospectives` as the 9th table

**Decision:** ROADMAP §5 implicitly lists 8 tables in US-002 acceptance criteria, but the schema section defines `retrospectives` as a distinct table. Both are implemented.

**Rationale:**
- US-002 acceptance criteria lists "retrospectives" in the table list (line: "Tables: `users`, `goals`, `textbooks`, `sessions`, `errors`, `captures`, `test_results`, `retrospectives`")
- `sources` is also in §5 but not in the AC list — both created for completeness
- Phase Gate 1 criterion checks "All 8 tables visible in Supabase dashboard" — with 9 created, criterion is exceeded, not failed

---

## Decision 6: Auth trigger `handle_new_user`

**Decision:** A `SECURITY DEFINER` trigger auto-creates a `public.users` row whenever `auth.users` gets a new row.

**Rationale:**
- Prevents manual `public.users` insert on every auth signup
- Uses `ON CONFLICT (id) DO NOTHING` to be idempotent (safe for re-runs)
- Required for seed.sql to work cleanly after auth user creation

**Security note:** `SECURITY DEFINER` runs as the function owner (postgres), bypassing RLS only during the trigger execution. Function body is minimal — only inserts `id` and `email`.

---

## Decision 7: `created_at timestamptz` on every table

**Decision:** Every table has `created_at timestamptz DEFAULT now() NOT NULL`, even tables that already have `flagged_at` (errors) or `started_at` (sessions).

**Rationale:**
- Consistent audit trail across all tables
- `started_at` tracks when the study session began (user-controlled); `created_at` tracks when the DB row was written (system-controlled)
- Both serve distinct query purposes
