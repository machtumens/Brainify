import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // E2E-only auth bypass — double-gated: requires explicit env opt-in AND a
  // non-production build. Production (next build / Vercel) always has
  // NODE_ENV=production, so this branch is dead code there.
  if (
    process.env.E2E_AUTH_BYPASS === '1' &&
    process.env.NODE_ENV !== 'production'
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() validates JWT with Supabase Auth server — not just local cookie.
  // Required per @supabase/ssr docs — do not swap for getSession().
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === '/login';
  const isApiRoute = pathname.startsWith('/api');
  const isStaticRoute =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  if (isStaticRoute || isApiRoute) {
    return supabaseResponse;
  }

  // Unauthenticated + not on login → redirect to login
  if (!user && !isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Authenticated + on login → redirect to today
  if (user && isLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/today';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
