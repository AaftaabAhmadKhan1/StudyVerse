'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Terminal,
  Settings,
  Activity,
  Youtube,
  Search,
  Shield,
  Cpu,
  RefreshCw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<
    { time: string; text: string; type: 'info' | 'error' | 'success' }[]
  >([]);
  const [query, setQuery] = useState('lofi hip hop radio');
  const [proxy, setProxy] = useState('');
  const [headless, setHeadless] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [workerCount, setWorkerCount] = useState(10);
  const [status, setStatus] = useState('Idle');

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time, text, type }].slice(-100));
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const startBot = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setStatus('Launching Swarm');
    addLog(`Initiating swarm of ${workerCount} workers for: ${targetUrl || query}`, 'info');

    try {
      const response = await fetch('/api/run-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, proxy, headless, targetUrl, workerCount }),
      });

      const data = await response.json();

      if (response.ok) {
        addLog('Automation completed successfully!', 'success');
      } else {
        addLog(`Error: ${data.message || 'Verification failed'}`, 'error');
      }
    } catch (error) {
      addLog(`Crashed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsRunning(false);
      setStatus('Idle');
    }
  };

  // Function to trigger Docker-based bot swarm
  const startDockerSwarm = async () => {
    setStatus('Starting Docker Swarm');
    addLog('Triggering Docker Compose for bot swarm...', 'info');
    try {
      const response = await fetch('/api/docker-bot', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        addLog(data.message, 'success');
        setStatus('Docker Swarm Running');
      } else {
        addLog(`Error: ${data.message || 'Failed to start Docker swarm'}`, 'error');
        setStatus('Idle');
      }
    } catch (error) {
      addLog(`Crashed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setStatus('Idle');
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">YT Bot Dashboard</h1>
          </div>
          <p className="text-white/50">
            Simulate engagement, proxies, and automation flows at scale.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div
              className={clsx(
                'w-2 h-2 rounded-full animate-pulse',
                isRunning ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-white/20'
              )}
            ></div>
            <span className="text-sm font-medium">{status}</span>
          </div>
          <button
            onClick={startBot}
            disabled={isRunning}
            className={clsx(
              'flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50',
              isRunning
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            )}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                Stop Session
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Start Session
              </>
            )}
          </button>
          <button
            onClick={startDockerSwarm}
            className="flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all shadow-lg active:scale-95 bg-green-600 hover:bg-green-500 text-white shadow-green-600/20"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Docker Swarm
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Settings */}
        <div className="lg:col-span-4 space-y-8">
          {/* Settings card */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-2 text-white/80">
              <Settings className="w-5 h-5" />
              <h2 className="font-semibold">Configuration</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/40 font-bold">
                  Target URL (Recommended)
                </label>
                <div className="relative group">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all text-xs"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/40 font-bold">
                  Search Query (Fallback)
                </label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter keywords..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-white/40 font-bold">
                  Proxy (Optional)
                </label>
                <div className="relative group">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={proxy}
                    onChange={(e) => setProxy(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono text-xs"
                    placeholder="http://user:pass@ip:port"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Headless Mode</p>
                  <p className="text-xs text-white/40">Run browser in background</p>
                </div>
                <button
                  onClick={() => setHeadless(!headless)}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                    headless ? 'bg-blue-600' : 'bg-white/10'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      headless ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-wider text-white/40 font-bold">
                    Worker Swarm Scale
                  </label>
                  <span className="text-blue-500 font-bold tabular-nums">
                    {workerCount} Threads
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={workerCount}
                  onChange={(e) => setWorkerCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-white/20 uppercase font-bold">
                  <span>Eco</span>
                  <span>Aggressive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-2">
              <div className="p-2 w-fit bg-blue-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold italic tracking-tighter">0</p>
              <p className="text-[10px] uppercase font-bold text-white/30">Total sessions</p>
            </div>
            <div className="glass-card p-4 space-y-2">
              <div className="p-2 w-fit bg-purple-500/10 rounded-lg">
                <Cpu className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold italic tracking-tighter">0.0mb</p>
              <p className="text-[10px] uppercase font-bold text-white/30">Data saved</p>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Logs */}
        <div className="lg:col-span-8 flex flex-col h-[600px]">
          <div className="glass-card flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
                  Live Automation Logs
                </h2>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-white/20 uppercase tracking-tighter">
                <span>System: Active</span>
                <span>Node: 18.x</span>
              </div>
            </div>

            <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2 custom-scrollbar bg-black/20">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
                  <Terminal className="w-12 h-12" />
                  <p>Awaiting session start...</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className="flex gap-4 group"
                  >
                    <span className="text-white/20 shrink-0 select-none">[{log.time}]</span>
                    <span
                      className={clsx(
                        'break-all',
                        log.type === 'error'
                          ? 'text-red-400'
                          : log.type === 'success'
                            ? 'text-green-400'
                            : 'text-white/80'
                      )}
                    >
                      {log.text}
                    </span>
                  </motion.div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <footer className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/20 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Auto-restart enabled
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Uptime: 24/7 Monitoring
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
            Documentation <ExternalLink className="w-3 h-3" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Safety Guidelines
          </a>
          <span>v1.0.0 Stable</span>
        </div>
      </footer>
    </main>
  );
}
