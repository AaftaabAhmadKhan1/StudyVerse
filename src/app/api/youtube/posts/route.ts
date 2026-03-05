import { NextRequest, NextResponse } from 'next/server';

/**
 * Fetch REAL YouTube Community Posts using InnerTube API.
 * The YouTube Data API v3 does NOT have an endpoint for community posts,
 * so we use the same internal browse API that YouTube's website uses.
 */

// ---------- Types ----------
interface CommunityPost {
  id: string;
  type: 'text' | 'image' | 'multi_image' | 'poll' | 'video' | 'quiz';
  text: string;
  publishedAt: string;
  likeCount: string;
  commentCount: string;
  channelTitle: string;
  channelThumbnail: string;
  images: string[];
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  videoDuration: string;
  videoViewCount: string;
  pollChoices: { text: string; imageUrl: string; votes: string }[];
  pollTotalVotes: string;
}

// InnerTube client context
const INNERTUBE_CONTEXT = {
  client: {
    clientName: 'WEB',
    clientVersion: '2.20250301.00.00',
    hl: 'en',
    gl: 'US',
  },
};

// ---- Helpers to parse InnerTube response ----

function extractText(obj: Record<string, unknown> | undefined): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.simpleText) return obj.simpleText as string;
  if (obj.runs && Array.isArray(obj.runs)) {
    return (obj.runs as { text: string; navigationEndpoint?: unknown }[])
      .map(r => r.text)
      .join('');
  }
  return '';
}

function extractThumbnail(thumbs: { url: string; width?: number }[] | undefined): string {
  if (!thumbs || !thumbs.length) return '';
  // Pick highest resolution
  const sorted = [...thumbs].sort((a, b) => (b.width || 0) - (a.width || 0));
  let url = sorted[0].url;
  // Fix protocol-relative URLs
  if (url.startsWith('//')) url = 'https:' + url;
  return url;
}

function parseBackstagePost(renderer: Record<string, unknown>): CommunityPost | null {
  try {
    const postId = renderer.postId as string || '';
    const authorText = renderer.authorText as Record<string, unknown>;
    const authorThumbnail = renderer.authorThumbnail as { thumbnails: { url: string; width?: number }[] };
    const contentText = renderer.contentText as Record<string, unknown>;
    const publishedTimeText = renderer.publishedTimeText as Record<string, unknown>;
    const voteCount = renderer.voteCount as Record<string, unknown>;
    const actionButtons = renderer.actionButtons as Record<string, unknown>;

    const channelTitle = extractText(authorText);
    const channelThumbnail = extractThumbnail(authorThumbnail?.thumbnails);
    const text = extractText(contentText);
    const publishedAt = extractText(publishedTimeText);
    const likeCount = extractText(voteCount) || '0';

    // Extract comment count from action buttons
    let commentCount = '0';
    if (actionButtons) {
      const commentBtn = actionButtons.commentActionButtonsRenderer as Record<string, unknown>;
      if (commentBtn) {
        const replyBtn = commentBtn.replyButton as Record<string, unknown>;
        if (replyBtn) {
          const btnRenderer = replyBtn.buttonRenderer as Record<string, unknown>;
          if (btnRenderer) {
            commentCount = extractText(btnRenderer.text as Record<string, unknown>) || '0';
          }
        }
      }
    }

    // Default post
    const post: CommunityPost = {
      id: postId,
      type: 'text',
      text,
      publishedAt,
      likeCount,
      commentCount,
      channelTitle,
      channelThumbnail,
      images: [],
      videoId: '',
      videoTitle: '',
      videoThumbnail: '',
      videoDuration: '',
      videoViewCount: '',
      pollChoices: [],
      pollTotalVotes: '',
    };

    // Check for attachments
    const attachment = renderer.backstageAttachment as Record<string, unknown>;
    if (attachment) {
      // ---- Single image ----
      if (attachment.backstageImageRenderer) {
        const imgRenderer = attachment.backstageImageRenderer as Record<string, unknown>;
        const img = imgRenderer.image as { thumbnails: { url: string; width?: number }[] };
        if (img?.thumbnails) {
          post.type = 'image';
          post.images = [extractThumbnail(img.thumbnails)];
        }
      }

      // ---- Multiple images ----
      if (attachment.postMultiImageRenderer) {
        const multiImg = attachment.postMultiImageRenderer as { images: { backstageImageRenderer: { image: { thumbnails: { url: string; width?: number }[] } } }[] };
        if (multiImg.images) {
          post.type = 'multi_image';
          post.images = multiImg.images.map(img => {
            const thumbs = img?.backstageImageRenderer?.image?.thumbnails;
            return extractThumbnail(thumbs);
          }).filter(Boolean);
        }
      }

      // ---- Video attachment ----
      if (attachment.videoRenderer) {
        const vidRenderer = attachment.videoRenderer as Record<string, unknown>;
        post.type = 'video';
        post.videoId = (vidRenderer.videoId as string) || '';
        post.videoTitle = extractText(vidRenderer.title as Record<string, unknown>);
        const vidThumbs = vidRenderer.thumbnail as { thumbnails: { url: string; width?: number }[] };
        post.videoThumbnail = extractThumbnail(vidThumbs?.thumbnails);

        // Duration
        const lengthText = vidRenderer.lengthText as Record<string, unknown>;
        post.videoDuration = extractText(lengthText);

        // View count
        const viewCount = vidRenderer.viewCountText as Record<string, unknown>;
        post.videoViewCount = extractText(viewCount);
      }

      // ---- Poll ----
      if (attachment.pollRenderer) {
        const pollRenderer = attachment.pollRenderer as Record<string, unknown>;
        post.type = 'poll';
        const choices = pollRenderer.choices as { text: Record<string, unknown>; image?: { thumbnails: { url: string; width?: number }[] }; votePercentage?: Record<string, unknown>; numVotes?: string }[];
        if (choices) {
          post.pollChoices = choices.map(c => ({
            text: extractText(c.text),
            imageUrl: c.image ? extractThumbnail(c.image.thumbnails) : '',
            votes: extractText(c.votePercentage as Record<string, unknown>) || '',
          }));
        }
        const totalVotes = pollRenderer.totalVotes as Record<string, unknown>;
        post.pollTotalVotes = extractText(totalVotes);
      }

      // ---- Quiz / multiple choice with answers ----
      if (attachment.quizRenderer) {
        const quizRenderer = attachment.quizRenderer as Record<string, unknown>;
        post.type = 'quiz';
        const choices = quizRenderer.choices as { text: Record<string, unknown>; isCorrect?: boolean }[];
        if (choices) {
          post.pollChoices = choices.map(c => ({
            text: extractText(c.text),
            imageUrl: '',
            votes: c.isCorrect ? '✓' : '',
          }));
        }
        const totalVotes = quizRenderer.totalVotes as Record<string, unknown>;
        post.pollTotalVotes = extractText(totalVotes);
      }
    }

    return post;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { channelId } = await request.json();
    if (!channelId) {
      return NextResponse.json({ error: 'Missing channelId' }, { status: 400 });
    }

    const INNERTUBE_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    const BROWSE_URL = `https://www.youtube.com/youtubei/v1/browse?key=${INNERTUBE_KEY}&prettyPrint=false`;
    const HEADERS = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    // Step 1: Fetch channel homepage to discover the Posts tab params
    const homepageRes = await fetch(BROWSE_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ context: INNERTUBE_CONTEXT, browseId: channelId }),
    });

    if (!homepageRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch channel', status: homepageRes.status }, { status: homepageRes.status });
    }

    const homepageData = await homepageRes.json();

    // Check for errors (deleted/invalid channels)
    if (homepageData.alerts) {
      const alertText = homepageData.alerts?.[0]?.alertRenderer?.text?.simpleText || '';
      if (alertText.toLowerCase().includes('not exist') || alertText.toLowerCase().includes('not available')) {
        return NextResponse.json({ posts: [], message: alertText });
      }
    }

    const homeTabs = homepageData?.contents?.twoColumnBrowseResultsRenderer?.tabs;
    if (!homeTabs) {
      return NextResponse.json({ posts: [], message: 'Could not load channel tabs' });
    }

    // Find the Posts/Community tab and extract its browse params
    let postsParams = '';
    for (const tab of homeTabs) {
      const tr = tab.tabRenderer;
      if (!tr) continue;
      const title = (tr.title || '').toLowerCase();
      if (title === 'posts' || title === 'community') {
        postsParams = tr.endpoint?.browseEndpoint?.params || '';
        break;
      }
    }

    if (!postsParams) {
      return NextResponse.json({ posts: [], message: 'This channel does not have a Posts tab' });
    }

    // Step 2: Fetch the community/posts tab using the discovered params
    const browseRes = await fetch(BROWSE_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        context: INNERTUBE_CONTEXT,
        browseId: channelId,
        params: postsParams,
      }),
    });

    if (!browseRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch posts tab' }, { status: browseRes.status });
    }

    const browseData = await browseRes.json();

    // Navigate the deeply nested response to find community posts
    const posts: CommunityPost[] = [];

    const tabs = browseData?.contents?.twoColumnBrowseResultsRenderer?.tabs;
    if (!tabs) {
      return NextResponse.json({ posts: [] });
    }

    // Find the selected (community) tab
    let communityContent = null;
    for (const tab of tabs) {
      const tabRenderer = tab.tabRenderer;
      if (!tabRenderer) continue;
      if (tabRenderer.selected === true && tabRenderer.content) {
        communityContent = tabRenderer.content;
        break;
      }
    }

    if (!communityContent) {
      return NextResponse.json({ posts: [], message: 'Posts tab has no content' });
    }

    // Navigate to the section list
    const sectionList = communityContent.sectionListRenderer?.contents;
    if (!sectionList) {
      return NextResponse.json({ posts: [] });
    }

    for (const section of sectionList) {
      const itemSection = section.itemSectionRenderer?.contents;
      if (!itemSection) continue;

      for (const item of itemSection) {
        // backstagePostThreadRenderer contains the actual post
        const threadRenderer = item.backstagePostThreadRenderer;
        if (threadRenderer) {
          const postRenderer = threadRenderer.post?.backstagePostRenderer;
          if (postRenderer) {
            const parsed = parseBackstagePost(postRenderer);
            if (parsed) posts.push(parsed);
          }
        }

        // Some channels use sharedPostRenderer
        const sharedPost = item.sharedPostRenderer;
        if (sharedPost) {
          const postRenderer = sharedPost.originalPost?.backstagePostRenderer;
          if (postRenderer) {
            const parsed = parseBackstagePost(postRenderer);
            if (parsed) {
              parsed.text = extractText(sharedPost.content as Record<string, unknown>) + '\n\n' + parsed.text;
              posts.push(parsed);
            }
          }
        }
      }
    }

    return NextResponse.json({ posts });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to fetch community posts';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}