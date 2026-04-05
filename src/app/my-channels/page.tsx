// server component wrapper – include navigation to keep sidebar visible
import React from 'react';
import Navigation from '@/components/Navigation';
import MyChannelsClient from './MyChannelsClient';
import FooterNew from '@/components/FooterNew';

export default function MyChannels() {
  return (
    <main className="min-h-screen bg-[#030014]">
      <Navigation />
      <div className="md:ml-52 lg:ml-60 pt-16 md:pt-0">
        <div className="px-6 py-12 max-w-7xl mx-auto">
          <MyChannelsClient />
        </div>
        <FooterNew />
      </div>
    </main>
  );
}
