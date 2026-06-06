import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side: anon key only — safe for browser and client components.
// Respects RLS policies. Use this everywhere except /api/* routes.
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Server-side ONLY: service role bypasses RLS.
// Import ONLY from /api/* routes or server components.
// NEVER export or call from any client component.
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
