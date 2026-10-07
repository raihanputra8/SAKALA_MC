import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

/**
 * Next.js 16 Server-Side Proxy Guard for /admin/* (SEC-007)
 * Intercepts every incoming request to /admin at the server level before any route or layout renders.
 * 
 * Flow:
 * - Unauthenticated -> Redirect to /login
 * - Authenticated Member -> Redirect to /account (Forbidden)
 * - Authenticated Admin -> ALLOW
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;

  // 1. Unauthenticated -> HTTP 307 Redirect to /login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'admin_auth_required');
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Decode JWT payload to verify expiry and subject UID
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'invalid_token');
      return NextResponse.redirect(loginUrl);
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    
    // Verify token expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'session_expired');
      return NextResponse.redirect(loginUrl);
    }

    const userId = payload.sub;
    if (!userId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    // 3. Verify authorized role against trusted database source (public.profiles)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-supabase-url')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'auth_service_unavailable');
      return NextResponse.redirect(loginUrl);
    }

    const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=role`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    // FAIL-CLOSED: If Supabase returns 401, 403, 500, or any non-OK status, deny immediately
    if (!profileRes.ok) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'session_verification_failed');
      return NextResponse.redirect(loginUrl);
    }

    const profiles = await profileRes.json();
    const role = profiles?.[0]?.role;

    // Positive verification: Only verified admin, artisan, or founder may proceed
    if (role === 'admin' || role === 'artisan' || role === 'founder') {
      return NextResponse.next();
    }

    // Authenticated user lacks administrative privileges -> Redirect to member account
    const accountUrl = new URL('/account', request.url);
    accountUrl.searchParams.set('error', 'admin_access_denied');
    return NextResponse.redirect(accountUrl);
  } catch (err) {
    console.error('Server proxy admin auth check error:', err);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session_verification_failed');
    return NextResponse.redirect(loginUrl);
  }
}
