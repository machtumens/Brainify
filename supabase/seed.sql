-- ================================================================
-- Seed: Second Brain initial data
-- Sprint 1 | WBS 1.6 | US-002
-- Source: ROADMAP.md §2.4 — Active Goals (exact values)
--
-- BEFORE RUNNING:
-- 1. Create your auth user in Supabase Dashboard > Authentication > Users
--    (email/password login — use your real email)
-- 2. Copy your User UUID from the Auth dashboard
-- 3. Replace the UUID value for v_user_id below (line ~21)
-- 4. Run this entire file in Supabase SQL Editor
--    (use the service role — Dashboard > SQL Editor)
-- ================================================================

DO $$
DECLARE
  -- !! REPLACE THIS with your actual Supabase Auth user UUID !!
  -- Find it: Dashboard > Authentication > Users > copy the "User UID" column
  v_user_id uuid := 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::uuid;

  -- Goal IDs (stable — used by errors/sessions to reference subjects)
  v_goal_pure_maths uuid;
  v_goal_physics    uuid;
  v_goal_ml         uuid;
  v_goal_spivak     uuid;

  -- Session IDs
  v_session_maths_1   uuid;
  v_session_physics_1 uuid;
  v_session_ml_1      uuid;

  -- Textbook IDs
  v_textbook_maths   uuid;
  v_textbook_physics uuid;

BEGIN

-- Validate user exists in auth.users before seeding
IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN
  RAISE EXCEPTION 'Auth user % not found. Create the user in Supabase Auth first.', v_user_id;
END IF;

-- Ensure public.users row exists (trigger may have already created it)
INSERT INTO public.users (id, email)
SELECT v_user_id, email FROM auth.users WHERE id = v_user_id
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------
-- GOALS (4) — ROADMAP §2.4 exact values
-- ----------------------------------------------------------------
v_goal_pure_maths := gen_random_uuid();
v_goal_physics    := gen_random_uuid();
v_goal_ml         := gen_random_uuid();
v_goal_spivak     := gen_random_uuid();

INSERT INTO public.goals (id, user_id, title, category, status, total_months, current_month, started_at, roadmap)
VALUES
  -- Goal 1: A Level Pure Mathematics — Active, M1 W3: Coordinate Geometry
  (
    v_goal_pure_maths,
    v_user_id,
    'A Level Pure Mathematics (Cambridge Intl)',
    'curriculum',
    'active',
    6,
    1,
    CURRENT_DATE - INTERVAL '3 weeks',
    '{
      "tracks": ["Pure M1", "Pure M2/M3", "Statistics", "Mechanics"],
      "total_hours": 360,
      "months": [
        {
          "month": 1,
          "title": "Algebra & Coordinate Geometry",
          "weeks": [
            {
              "week": 1,
              "topics": ["Algebra Review", "Indices & Surds"],
              "status": "done",
              "daily_checklist": []
            },
            {
              "week": 2,
              "topics": ["Quadratics", "Simultaneous Equations", "Inequalities"],
              "status": "done",
              "daily_checklist": []
            },
            {
              "week": 3,
              "topics": ["Coordinate Geometry", "Circle Equations"],
              "status": "active",
              "daily_checklist": [
                {"day": 1, "task": "Read §2.1–2.3 Coordinate Geometry", "done": false},
                {"day": 2, "task": "Problems §2: Q1–Q15 (lines, gradients)", "done": false},
                {"day": 3, "task": "Circle equations — completing the square", "done": false},
                {"day": 4, "task": "Past paper: Coordinate Geometry section", "done": false}
              ]
            },
            {
              "week": 4,
              "topics": ["Functions", "Domain & Range", "Transformations"],
              "status": "pending",
              "daily_checklist": []
            }
          ]
        }
      ]
    }'::jsonb
  ),

  -- Goal 2: Physics — Serway Vol.1 — Active, Ch.3: Forces & Newton's Laws
  (
    v_goal_physics,
    v_user_id,
    'Physics — Serway Vol.1',
    'curriculum',
    'active',
    12,
    1,
    CURRENT_DATE - INTERVAL '2 weeks',
    '{
      "total_chapters": 12,
      "months": [
        {
          "month": 1,
          "title": "Mechanics",
          "weeks": [
            {
              "week": 1,
              "topics": ["Units & Measurement", "Motion in 1D", "Kinematics"],
              "status": "done",
              "daily_checklist": []
            },
            {
              "week": 2,
              "topics": ["Vectors", "Motion in 2D", "Projectile Motion"],
              "status": "done",
              "daily_checklist": []
            },
            {
              "week": 3,
              "topics": ["Forces", "Newton''s Laws", "Free Body Diagrams"],
              "status": "active",
              "daily_checklist": [
                {"day": 1, "task": "Read Ch.3: Forces intro + Newton 1st", "done": false},
                {"day": 2, "task": "Newton 2nd Law problems (F = ma)", "done": false},
                {"day": 3, "task": "Inclined plane + friction problems §3.4", "done": false},
                {"day": 4, "task": "Past paper mechanics section", "done": false}
              ]
            }
          ]
        }
      ]
    }'::jsonb
  ),

  -- Goal 3: Machine Learning (Mitchell) — Active, FLAGGED AMBER
  -- Ch.2: Decision Trees. 5 days missed → amber alert.
  -- Last ML session seeded as 7 days ago (see sessions below).
  (
    v_goal_ml,
    v_user_id,
    'Machine Learning — Mitchell',
    'personal',
    'active',
    4,
    1,
    CURRENT_DATE - INTERVAL '4 weeks',
    '{
      "amber_trigger": "No sessions logged in 5+ days",
      "months": [
        {
          "month": 1,
          "title": "Foundations",
          "weeks": [
            {
              "week": 1,
              "topics": ["Introduction to ML", "Concept Learning", "Version Spaces"],
              "status": "done",
              "daily_checklist": []
            },
            {
              "week": 2,
              "topics": ["Decision Trees", "ID3 Algorithm", "Information Gain"],
              "status": "active",
              "daily_checklist": [
                {"day": 1, "task": "Read Ch.2: Decision Trees", "done": false},
                {"day": 2, "task": "Implement ID3 in pseudocode", "done": false},
                {"day": 3, "task": "Entropy + information gain exercises", "done": false}
              ]
            }
          ]
        }
      ]
    }'::jsonb
  ),

  -- Goal 4: Calculus — Spivak — LOCKED
  -- Activates when Pure Maths M3 (Integration) completes
  (
    v_goal_spivak,
    v_user_id,
    'Calculus — Spivak',
    'personal',
    'locked',
    NULL,
    NULL,
    NULL,
    '{
      "unlock_condition": "Pure Maths M3 (Integration) complete",
      "unlock_goal_id_ref": "goals.title = A Level Pure Mathematics",
      "unlock_month": 3,
      "months": []
    }'::jsonb
  );

-- ----------------------------------------------------------------
-- TEXTBOOKS (2)
-- ----------------------------------------------------------------
v_textbook_maths   := gen_random_uuid();
v_textbook_physics := gen_random_uuid();

INSERT INTO public.textbooks (id, user_id, title, author, subject, total_pages, current_page, active_from, topic_map)
VALUES
  (
    v_textbook_maths,
    v_user_id,
    'A Level Pure Mathematics',
    'Hugh Neill & Douglas Quadling',
    'Pure Mathematics',
    500,
    47,
    CURRENT_DATE - INTERVAL '3 weeks',
    '{
      "1": ["algebra", "indices_surds"],
      "2": ["coordinate_geometry", "circles", "perpendicular_lines"],
      "3": ["functions", "domain_range", "transformations"],
      "4": ["binomial_expansion", "series"],
      "5": ["differentiation", "tangents_normals"],
      "6": ["integration", "area_under_curve"]
    }'::jsonb
  ),
  (
    v_textbook_physics,
    v_user_id,
    'Physics for Scientists and Engineers Vol.1',
    'Raymond A. Serway',
    'Physics',
    640,
    85,
    CURRENT_DATE - INTERVAL '2 weeks',
    '{
      "1": ["units", "measurement", "dimensional_analysis"],
      "2": ["motion_1d", "kinematics", "free_fall"],
      "3": ["forces", "newton_laws", "friction", "free_body_diagrams"],
      "4": ["motion_2d", "projectile", "circular_motion"],
      "5": ["work_energy", "conservation_energy"],
      "6": ["momentum", "impulse", "collisions"]
    }'::jsonb
  );

-- ----------------------------------------------------------------
-- SESSIONS (3)
-- Pure Maths: 1 day ago  (recent — no drift)
-- Physics:    2 days ago (recent — no drift)
-- ML:         7 days ago (>5 days → triggers amber alert on ML goal)
-- ----------------------------------------------------------------
v_session_maths_1   := gen_random_uuid();
v_session_physics_1 := gen_random_uuid();
v_session_ml_1      := gen_random_uuid();

INSERT INTO public.sessions (id, user_id, task_title, subject, pomodoros, pages_done, problems_done, difficulty, mode, started_at, notes)
VALUES
  (
    v_session_maths_1,
    v_user_id,
    'Coordinate Geometry — circle equations',
    'Pure Mathematics',
    2,
    8,
    12,
    2,
    'standard',
    now() - INTERVAL '1 day',
    'Struggled with deriving circle equation from 3 points. Centre-radius form clear now. Need more practice completing the square.'
  ),
  (
    v_session_physics_1,
    v_user_id,
    'Forces & Newton''s Laws Ch.3',
    'Physics',
    2,
    10,
    8,
    2,
    'standard',
    now() - INTERVAL '2 days',
    'Newton 2nd Law problems done. Confused on FBD for inclined planes — mixed up sin/cos components. Review friction next session.'
  ),
  (
    v_session_ml_1,
    v_user_id,
    'Decision Trees — ID3 Algorithm Ch.2',
    'Machine Learning',
    1,
    15,
    3,
    3,
    'struggle',
    now() - INTERVAL '7 days',
    'Information gain calculation — entropy formula confusing initially. ID3 logic understood. Need to revisit overfitting section.'
  );

-- ----------------------------------------------------------------
-- ERRORS (5) — across Pure Maths (3) and Physics (2)
-- References sessions above for valid foreign keys
-- ----------------------------------------------------------------
INSERT INTO public.errors (user_id, session_id, topic, subtopic, problem_type, mistake_description, flagged_at)
VALUES
  -- Error 1: Pure Maths — completing the square sign error
  (
    v_user_id,
    v_session_maths_1,
    'Coordinate Geometry',
    'Circle Equations',
    'algebraic',
    'Forgot to subtract h and k correctly in (x-h)² + (y-k)² = r². Applied addition instead of subtraction when completing the square.',
    now() - INTERVAL '1 day'
  ),
  -- Error 2: Pure Maths — distance formula missing squared term
  (
    v_user_id,
    v_session_maths_1,
    'Coordinate Geometry',
    'Distance Formula',
    'algebraic',
    'Computed √(Δy² + Δx) instead of √(Δy² + Δx²). Forgot to square the Δx term — missing exponent.',
    now() - INTERVAL '1 day'
  ),
  -- Error 3: Physics — inclined plane FBD sin/cos confusion
  (
    v_user_id,
    v_session_physics_1,
    'Forces',
    'Inclined Plane Free Body Diagrams',
    'application',
    'Resolved weight component along slope as mg·cos(θ) instead of mg·sin(θ). Mixed up which component is parallel vs perpendicular to the surface.',
    now() - INTERVAL '2 days'
  ),
  -- Error 4: Physics — static vs kinetic friction check missing
  (
    v_user_id,
    v_session_physics_1,
    'Forces',
    'Friction',
    'recall',
    'Applied F = μN without verifying whether static or kinetic friction applies. Did not check if object was on the verge of moving before using kinetic coefficient.',
    now() - INTERVAL '2 days'
  ),
  -- Error 5: Pure Maths — perpendicular gradient condition sign
  (
    v_user_id,
    v_session_maths_1,
    'Coordinate Geometry',
    'Perpendicular Lines',
    'geometric',
    'Applied m₁ × m₂ = +1 for perpendicular lines instead of m₁ × m₂ = -1. Sign error on gradient perpendicularity condition.',
    now() - INTERVAL '1 day'
  );

RAISE NOTICE 'Seed complete. Goals: 4, Textbooks: 2, Sessions: 3, Errors: 5.';
RAISE NOTICE 'ML goal last session: 7 days ago — amber alert will trigger in UI.';
RAISE NOTICE 'Spivak goal status: locked — unlocks when Pure Maths M3 complete.';

END $$;
