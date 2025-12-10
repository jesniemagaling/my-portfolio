export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: 'Stack API GET endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Optional: add POST, PUT, DELETE, etc.
export async function POST(request: Request) {
  return new Response(JSON.stringify({ message: 'POST received' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
