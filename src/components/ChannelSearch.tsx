'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useYTWallah } from '@/contexts/YTWallahContext';
import { Search, X, Loader2, Plus, Check } from 'lucide-react';

interface SearchResult {
  youtubeChannelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export default function ChannelSearch({
  onStatusMessage,
}: {
  onStatusMessage?: (message: string) => void;
}) {
  const {
    addChannelToMyChannels,
    channels,
    myChannels,
    saveChannelToMyChannels,
    siteSettings,
  } = useYTWallah();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [addingIds, setAddingIds] = useState<Record<string, boolean>>({});
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
      const res = await fetch(`/api/youtube/search-channels?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setResults(data);
      setOpen(true);
      setActiveIndex(-1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchDebounced = (q: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => fetchResults(q), 300);
  };

  const handleAdd = useCallback(
    async (result: SearchResult) => {
      const existingChannel = channels.find(
        (channel) => channel.youtubeChannelId === result.youtubeChannelId
      );

      if (existingChannel) {
        const status = saveChannelToMyChannels(existingChannel.id);
        const message =
          status === 'added'
            ? `"${existingChannel.name}" has been added to My Channels.`
            : `"${existingChannel.name}" is already in My Channels.`;

        onStatusMessage?.(message);
        setResults((prev) =>
          prev.filter((item) => item.youtubeChannelId !== result.youtubeChannelId)
        );
        setOpen(true);
        return;
      }

      setAddingIds((s) => ({ ...s, [result.youtubeChannelId]: true }));
      try {
        const res = await fetch('/api/youtube/channel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            youtubeChannelId: result.youtubeChannelId,
            apiKey: siteSettings.youtubeApiKey || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '',
          }),
        });
        const channelData = await res.json();
        if (!res.ok) {
          throw new Error(channelData.error || 'Failed to fetch channel details');
        }
        const added = addChannelToMyChannels({
          name: channelData.name,
          youtubeChannelId: channelData.youtubeChannelId,
          description: channelData.description,
          thumbnailUrl: channelData.thumbnailUrl,
          bannerUrl: channelData.bannerUrl,
          subscriberCount: channelData.subscriberCount,
          videoCount: channelData.videoCount,
          isActive: true,
        });
        onStatusMessage?.(
          added.status === 'added'
            ? `"${added.channel.name}" has been added to My Channels.`
            : `"${added.channel.name}" is already in My Channels.`
        );
        setResults((prev) =>
          prev.filter((item) => item.youtubeChannelId !== result.youtubeChannelId)
        );
        setAddingIds((s) => ({ ...s, [result.youtubeChannelId]: false }));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to add channel';
        setError(message);
        setAddingIds((s) => ({ ...s, [result.youtubeChannelId]: false }));
      }
    },
    [
      addChannelToMyChannels,
      channels,
      onStatusMessage,
      saveChannelToMyChannels,
      siteSettings.youtubeApiKey,
    ]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && results[activeIndex]) {
          e.preventDefault();
          handleAdd(results[activeIndex]);
        } else {
          fetchResults(query);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIndex, fetchResults, handleAdd, query]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Search input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-11 pr-10 py-3 bg-[#0f0a1f] border border-purple-500/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all text-sm"
          placeholder="Search YouTube to add new channels..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearchDebounced(e.target.value);
          }}
          onFocus={() => {
            if (results.length) setOpen(true);
          }}
          aria-autocomplete="list"
          aria-controls="channel-suggestion-list"
          aria-expanded={open}
        />
        {query && (
          <button
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {open && (results.length > 0 || error) && (
        <div className="absolute left-0 right-0 mt-2 bg-[#0a0618] border border-purple-500/20 rounded-xl shadow-2xl shadow-purple-900/20 max-h-80 overflow-auto z-50">
          {error && (
            <div className="px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
              {error}
            </div>
          )}
          {!error && (
            <ul id="channel-suggestion-list" role="listbox" className="py-1">
              {results.map((r, idx) => {
                const added = myChannels.some(
                  (channel) => channel.youtubeChannelId === r.youtubeChannelId
                );
                const isAdding = !!addingIds[r.youtubeChannelId];
                const active = idx === activeIndex;
                return (
                  <li
                    key={r.youtubeChannelId}
                    role="option"
                    aria-selected={active}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => !added && handleAdd(r)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      added
                        ? 'opacity-50 cursor-default'
                        : 'cursor-pointer hover:bg-purple-500/10'
                    } ${active && !added ? 'bg-purple-500/10' : ''}`}
                  >
                    <img
                      src={r.thumbnailUrl}
                      alt={r.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{r.title}</p>
                      <p className="text-xs text-white/35 truncate">{r.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!added) handleAdd(r);
                      }}
                      disabled={added || isAdding}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                        added
                          ? 'bg-green-500/15 text-green-400 cursor-default'
                          : isAdding
                          ? 'bg-purple-500/15 text-purple-300'
                          : 'bg-purple-500/15 text-purple-300 hover:bg-purple-500/25'
                      }`}
                    >
                      {isAdding ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : added ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
