import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get('admin_token')?.value;
  const { pathname } = req.nextUrl;

  const isLoggedIn = adminCookie === 'authenticated';
  const isLoginPage = pathname === '/admin/login';
  const isAdminPath = pathname.startsWith('/admin');

  // Prevent logged-in users from visiting /admin/login
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Protect all /admin routes except /admin/login
  if (isAdminPath && !isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
