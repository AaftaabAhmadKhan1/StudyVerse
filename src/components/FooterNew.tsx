'use client';

import Link from 'next/link';
import { Play, Youtube, Send, Instagram, Twitter, Heart } from 'lucide-react';
import { useYTWallah } from '@/contexts/YTWallahContext';

export default function FooterNew() {
  const { siteSettings } = useYTWallah();

  return (
    <footer className="bg-[#050210] border-t border-purple-500/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PW StudyVerse
              </h2>
            </div>
            <p className="text-sm text-white/40 max-w-md leading-relaxed mb-6">
              A focused study companion for official Physics Wallah YouTube content. Browse PW
              channels, lectures, and batches using YouTube embeds and API-backed organization.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {siteSettings.socialLinks.youtube && (
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks.telegram && (
                <a
                  href={siteSettings.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 transition-all"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks.instagram && (
                <a
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 hover:bg-pink-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-pink-400 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks.twitter && (
                <a
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 hover:bg-sky-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/40 hover:text-sky-400 transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Channels', href: '/channels' },
                { name: 'Shorts', href: '/shorts' },
                { name: 'Announcements', href: '/announcements' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-white/30 hover:text-purple-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Login', href: '/login' },
                { name: 'Sign Up', href: '/signup' },
                { name: 'Admin Panel', href: '/admin/login' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms & Compliance', href: '/terms' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-white/30 hover:text-purple-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">{siteSettings.footerText}</p>
          <p className="text-xs text-white/20 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
}
