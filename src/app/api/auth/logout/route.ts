import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' });

  // Overwrite the cookie with empty value
  res.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict',
    maxAge: 0,
  });

  return res;
}
