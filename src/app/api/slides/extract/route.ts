import { NextRequest } from 'next/server';

export async function POST(_req: NextRequest) {
  return new Response(
    JSON.stringify({
      error:
        'This URL-based notes extractor is disabled in compliance mode. Use official YouTube playback inside the app and create notes manually or with metadata-based study tools.',
    }),
    {
      status: 410,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
