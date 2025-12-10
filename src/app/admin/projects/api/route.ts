export async function GET(request: Request) {
  // Example response
  return new Response(
    JSON.stringify({ message: 'Projects API GET endpoint' }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Optional: other handlers
export async function POST(request: Request) {
  return new Response(JSON.stringify({ message: 'POST received' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
