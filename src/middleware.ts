import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be public (no auth required)
const publicPaths = ['/auth/signin', '/auth/signup', '/api/auth/'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.next();
  }

  // Check if the path is public or an auth-related API route
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isAuthRoute = pathname.startsWith('/api/auth/');

  // Allow all auth-related API routes to pass through
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Check for admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || token.accountType !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  // Redirect authenticated users away from auth pages
  if (token && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login page
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
