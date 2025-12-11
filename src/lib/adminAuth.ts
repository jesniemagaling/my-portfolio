// src/lib/adminAuth.ts
import { NextResponse } from 'next/server';

export function requireAdmin(req: Request) {
  const header =
    req.headers.get('x-admin-password') || req.headers.get('authorization');

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_PASSWORD not set in env');
  }

  if (!header) {
    return NextResponse.json(
      { error: 'Missing admin password' },
      { status: 401 }
    );
  }

  // support "Bearer mypassword" or raw header value
  const provided = header.startsWith('Bearer ') ? header.slice(7) : header;

  if (provided !== password) {
    return NextResponse.json(
      { error: 'Invalid admin password' },
      { status: 401 }
    );
  }

  return null; // ok
}
