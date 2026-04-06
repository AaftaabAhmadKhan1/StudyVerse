'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2, Play } from 'lucide-react';
import Link from 'next/link';

interface VideoSearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
}

interface VideoSearchProps {
  channelId?: string; // If provided, limits search to this channel
  placeholder?: string;
}

export default function VideoSearch({ channelId, placeholder = "Search videos..." }: VideoSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/youtube/search-videos', window.location.origin);
      url.searchParams.set('q', q);
      if (channelId) url.searchParams.set('channelId', channelId);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setResults(data);
      setOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchResults(query);
    }, 500);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-[#0a0520] border border-white/10 rounded-2xl py-3.5 pl-11 pr-12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-medium"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || loading || error) setOpen(true);
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {open && (query.trim() !== '') && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0a25] border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/20 overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center p-8 text-white/40 gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Searching videos...</span>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-400 font-medium mb-1">Search failed</p>
                <p className="text-sm text-white/30">{error}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-white/60 font-medium">No videos found</p>
                <p className="text-sm text-white/30 mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {results.map((video, index) => (
                  <Link
                    key={video.id}
                    href={`/watch/${video.id}`}
                    onClick={() => setOpen(false)}
                    className="flex p-3 rounded-xl hover:bg-white/5 transition-all gap-4 items-start group"
                  >
                    <div className="w-32 aspect-video bg-black/50 rounded-lg overflow-hidden flex-shrink-0 relative group">
                      <img
                        src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                          <Play className="w-4 h-4 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium line-clamp-2 text-sm mb-1 group-hover:text-purple-300 transition-colors" dangerouslySetInnerHTML={{ __html: video.title }} />
                      <p className="text-[11px] text-white/50 mb-1">{video.channelTitle}</p>
                      <p className="text-xs text-white/40 line-clamp-2" dangerouslySetInnerHTML={{ __html: video.description }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {results.length > 0 && !loading && (
              <div className="p-3 border-t border-white/5 bg-white/[0.02] text-center">
                <span className="text-xs text-white/30 font-medium">
                  Showing top {results.length} results
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
