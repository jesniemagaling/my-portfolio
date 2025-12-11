import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get('admin_token')?.value;
  const url = req.nextUrl.clone();

  // Only protect /admin routes except login itself
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    if (!adminCookie || adminCookie !== 'authenticated') {
      // Redirect to login page
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
