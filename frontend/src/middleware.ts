import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Enforce lowercase URLs
  if (req.nextUrl.pathname !== req.nextUrl.pathname.toLowerCase()) {
    const url = new URL(`${req.nextUrl.origin}${req.nextUrl.pathname.toLowerCase()}`);
    return NextResponse.redirect(url);
  }

  // Authentication check using JWT token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute = !isAuthPage; // Protect all routes except /auth

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/learn/:path*','/practice/:path*', '/', '/dashboard', '/profile', '/auth'],
};
