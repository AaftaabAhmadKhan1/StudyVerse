import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, channelId } = await request.json();

    if (!accessToken || !channelId) {
      return NextResponse.json(
        { error: 'Missing accessToken or channelId' },
        { status: 400 }
      );
    }

    const response = await fetch(`${YT_API}/subscriptions?part=snippet`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snippet: {
          resourceId: {
            kind: 'youtube#channel',
            channelId,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const reason = data?.error?.errors?.[0]?.reason;

      if (reason === 'subscriptionDuplicate') {
        return NextResponse.json({ ok: true, alreadySubscribed: true });
      }

      if (
        reason === 'insufficientPermissions' ||
        reason === 'forbidden' ||
        response.status === 401 ||
        response.status === 403
      ) {
        return NextResponse.json(
          {
            error:
              'You need to sign in again and grant YouTube subscription permission before subscribing from PW StudyVerse.',
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: data?.error?.message || 'Failed to subscribe on YouTube' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      alreadySubscribed: false,
      subscriptionId: data?.id || null,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to subscribe on YouTube';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
