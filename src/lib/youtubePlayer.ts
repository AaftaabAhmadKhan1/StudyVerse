/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * YouTube IFrame Player API loader & helpers.
 * Loads the script once, resolves a shared Promise when the API is ready.
 */

let apiReadyPromise: Promise<void> | null = null;

export function loadYouTubeIFrameAPI(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (apiReadyPromise) return apiReadyPromise;

  apiReadyPromise = new Promise<void>((resolve) => {
    // Already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      resolve();
      return;
    }

    // Chain onto any existing callback
    const prev = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };

    // Only inject script once
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return apiReadyPromise;
}

/** Format seconds → "m:ss" or "h:mm:ss" */
export function formatPlayerTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
