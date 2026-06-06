-- ================================================================
-- Migration DOWN: 001_initial_schema_down
-- Sprint 1 | WBS 1.3 | Rollback Covenant §23
-- Description: Drop all 9 tables, trigger, function.
-- WARNING: Destroys ALL data. Irreversible.
-- ================================================================

-- Drop trigger and function first (references auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop policies (dropped automatically with tables, listed for clarity)
-- DROP POLICY IF EXISTS "retrospectives_user_policy" ON public.retrospectives;
-- DROP POLICY IF EXISTS "sources_user_policy" ON public.sources;
-- DROP POLICY IF EXISTS "test_results_user_policy" ON public.test_results;
-- DROP POLICY IF EXISTS "captures_user_policy" ON public.captures;
-- DROP POLICY IF EXISTS "errors_user_policy" ON public.errors;
-- DROP POLICY IF EXISTS "sessions_user_policy" ON public.sessions;
-- DROP POLICY IF EXISTS "textbooks_user_policy" ON public.textbooks;
-- DROP POLICY IF EXISTS "goals_user_policy" ON public.goals;
-- DROP POLICY IF EXISTS "users_user_policy" ON public.users;

-- Drop tables in reverse dependency order
-- (errors → sessions, all others → auth.users via user_id → users)
DROP TABLE IF EXISTS public.retrospectives;
DROP TABLE IF EXISTS public.sources;
DROP TABLE IF EXISTS public.test_results;
DROP TABLE IF EXISTS public.captures;
DROP TABLE IF EXISTS public.errors;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.textbooks;
DROP TABLE IF EXISTS public.goals;
DROP TABLE IF EXISTS public.users;
