// src/app/api/about/route.ts
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  return new Response(JSON.stringify({ message: 'AI API GET endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<any> }
) {
  return new Response(JSON.stringify({ message: 'POST received' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
