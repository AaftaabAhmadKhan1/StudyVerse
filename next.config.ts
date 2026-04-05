import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // Tree-shake large client-side libraries — cuts framer-motion & lucide bundle by ~30%
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
