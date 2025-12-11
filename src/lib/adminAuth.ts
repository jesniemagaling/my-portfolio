import { NextResponse } from 'next/server';

export function requireAdmin(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD not set in env');

  // Check cookie first
  const cookiePassword = req.headers
    .get('cookie')
    ?.match(/adminToken=([^;]+)/)?.[1];
  if (cookiePassword === password) return null; // authorized

  // Check header for API requests
  const header =
    req.headers.get('x-admin-password') || req.headers.get('authorization');
  if (!header) {
    return NextResponse.json(
      { error: 'Missing admin password' },
      { status: 401 }
    );
  }

  const provided = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (provided !== password) {
    return NextResponse.json(
      { error: 'Invalid admin password' },
      { status: 401 }
    );
  }

  return null;
}
