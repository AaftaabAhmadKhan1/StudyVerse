'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';
import { Announcement } from '@/data/types';

const announcementDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const priorityStyles = {
  urgent: 'bg-red-500/10 border-red-500/30 text-red-300',
  high: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
  medium: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  low: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
};

const priorityIcons = {
  urgent: AlertCircle,
  high: AlertTriangle,
  medium: Bell,
  low: Info,
};

export default function AnnouncementBanner({ announcements }: { announcements: Announcement[] }) {
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  if (activeAnnouncements.length === 0) return null;

  return (
    <div className="space-y-3">
      {activeAnnouncements.map((ann, index) => {
        const Icon = priorityIcons[ann.priority];
        return (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${priorityStyles[ann.priority]}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{ann.title}</h4>
              <p className="text-xs opacity-70 mt-0.5 line-clamp-2">{ann.content}</p>
            </div>
            <span className="text-[10px] opacity-50 flex-shrink-0">
              {announcementDateFormatter.format(new Date(ann.createdAt))}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
