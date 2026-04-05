import { NextRequest, NextResponse } from 'next/server';

const YT_API = 'https://www.googleapis.com/youtube/v3';
const OPENAI_API = 'https://api.openai.com/v1/chat/completions';

function formatCount(count: string): string {
  const n = parseInt(count, 10);
  if (isNaN(n)) return count;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return count;
}

async function fetchVideo(videoId: string, apiKey: string) {
  const res = await fetch(`${YT_API}/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${apiKey}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'YouTube API error');
  if (!data.items?.length) throw new Error('Video not found');
  const item = data.items[0];
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description || '',
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: formatCount(item.statistics?.viewCount || '0'),
    likeCount: formatCount(item.statistics?.likeCount || '0'),
    duration: item.contentDetails?.duration || '',
  };
}

async function fetchTopComments(videoId: string, apiKey: string) {
  try {
    const url = `${YT_API}/commentThreads?videoId=${videoId}&part=snippet&maxResults=5&order=relevance&textFormat=plainText&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) return [];
    return (data.items || []).map((it: any) => it.snippet.topLevelComment.snippet.textDisplay).slice(0, 5);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { videoId, openaiApiKey, youtubeApiKey } = await request.json();
    if (!videoId || !openaiApiKey) {
      return NextResponse.json({ error: 'Missing videoId or openaiApiKey' }, { status: 400 });
    }

    // Try to use provided YouTube key if available, else skip extra context
    let videoInfo: any = { title: '', description: '' };
    let comments: string[] = [];
    if (youtubeApiKey) {
      try {
        videoInfo = await fetchVideo(videoId, youtubeApiKey);
        comments = await fetchTopComments(videoId, youtubeApiKey);
      } catch {
        // ignore, we'll still call AI with minimal context
      }
    }

    const promptParts: string[] = [];
    promptParts.push(`Generate a clear, concise set of study notes for the following YouTube video. Output JSON with keys: \n\n{ "notes": [{ "time": "MM:SS or H:MM:SS (optional)", "text": "note text" }], "summary": "short summary" }\n\nUse timestamps where possible and keep each note short (one to two sentences).`);
    if (videoInfo.title) promptParts.push(`Title: ${videoInfo.title}`);
    if (videoInfo.description) promptParts.push(`Description:\n${videoInfo.description.slice(0, 4000)}`);
    if (comments && comments.length) promptParts.push(`Top comments (for additional cues):\n${comments.join('\n---\n')}`);

    const systemMessage = `You are a precise assistant that converts video metadata and context into accurate study notes. Always respond in clear English. Return strictly valid JSON as described.`;

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: promptParts.join('\n\n') },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    };

    const aiRes = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(body),
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) throw new Error(aiData?.error?.message || 'AI generation failed');

    const text = aiData.choices?.[0]?.message?.content || aiData?.choices?.[0]?.text || '';

    // Try to parse JSON from the model output
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to extract JSON substring
      const m = text.match(/\{[\s\S]*\}/m);
      if (m) {
        try { parsed = JSON.parse(m[0]); } catch { parsed = null; }
      }
    }

    if (!parsed) {
      // As fallback, return the raw text as a single summary
      return NextResponse.json({ notes: [], summary: text });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate notes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
