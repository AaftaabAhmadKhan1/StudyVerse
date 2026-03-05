'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Tv, BookOpen, Video, Megaphone, Settings,
  LogOut, Menu, X, Play, ChevronRight
} from 'lucide-react';
import { useYTWallah } from '@/contexts/YTWallahContext';

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { adminLogout, channels, batches, videos, announcements } = useYTWallah();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, count: undefined },
    { name: 'Channels', href: '/admin/channels', icon: Tv, count: channels.length },
    { name: 'Batches', href: '/admin/batches', icon: BookOpen, count: batches.length },
    { name: 'Videos', href: '/admin/videos', icon: Video, count: videos.length },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone, count: announcements.length },
    { name: 'Settings', href: '/admin/settings', icon: Settings, count: undefined },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-6 border-b border-purple-500/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YT Wallah
            </h1>
            <p className="text-[10px] text-white/30 font-medium tracking-wider uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/10 text-white border border-purple-500/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-white/30'}`} />
                <span className="flex-1">{item.name}</span>
                {item.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-md ${active ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white/30'}`}>
                    {item.count}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-purple-500/10 space-y-2">
        <Link href="/" onClick={() => setIsMobileOpen(false)}>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 text-sm transition-all">
            <Play className="w-4 h-4" />
            <span>View Website</span>
            <ChevronRight className="w-3 h-3 ml-auto" />
          </div>
        </Link>
        <button onClick={() => { adminLogout(); window.location.href = '/admin/login'; }} className="w-full">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 lg:w-64 bg-[#0a0520]/90 backdrop-blur-2xl border-r border-purple-500/10 z-50 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Header + Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0520]/95 backdrop-blur-2xl border-b border-purple-500/10 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-white/80 hover:bg-white/10 rounded-lg"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="md:hidden fixed inset-0 z-40 flex"
          >
            <div className="w-72 bg-[#0a0520] border-r border-purple-500/10 flex flex-col pt-16">
              <SidebarContent />
            </div>
            <div className="flex-1 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
