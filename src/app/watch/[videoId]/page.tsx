'use client';

import { use, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { useAuth } from '@/contexts/AuthContext';
import { Video } from '@/data/types';

export default function WatchPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = use(params);
  const { videos } = useYTWallah();
  const { addWatchHistory } = useAuth();

  // Try to find video in local store — first by id, then by youtubeVideoId
  let video = videos.find((v) => v.id === videoId);
  if (!video) video = videos.find((v) => v.youtubeVideoId === videoId);

  // If not in local store, create a minimal video object from the YouTube video ID
  // This allows playing any YouTube video directly from channel pages
  const videoData: Video = video || {
    id: videoId,
    title: '',
    youtubeVideoId: videoId,
    channelId: '',
    batchId: '',
    subject: '',
    description: '',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: '',
    type: 'video',
    isLive: false,
    publishedAt: '',
    createdAt: '',
  };

  useEffect(() => {
    addWatchHistory({
      id: videoData.id,
      youtubeVideoId: videoData.youtubeVideoId,
      title: videoData.title || 'Untitled Video',
      thumbnailUrl: videoData.thumbnailUrl,
      channelName: '',
    });
  }, [addWatchHistory, videoData.id, videoData.youtubeVideoId, videoData.title, videoData.thumbnailUrl]);

  return (
    <main className="min-h-screen bg-[#030014]">
      <div>
        <div className="px-4 md:px-6 py-6 max-w-[1800px] mx-auto">
          <VideoPlayer video={videoData} />
        </div>
      </div>
    </main>
  );
}
