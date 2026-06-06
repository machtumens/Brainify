import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Client component auth — uses cookies (not localStorage).
// Coordinates with middleware.ts cookie-based session management.
// Use this in client components (login page, etc.). Never in /api/* routes.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
