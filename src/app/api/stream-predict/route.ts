// deprecated route; What's Next ? no longer uses AI endpoints
export async function POST(req: Request) {
  return new Response(JSON.stringify({ error: 'Not implemented' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
}
