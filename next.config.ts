import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // ESLint is run in CI pipeline separately
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking is run in CI pipeline separately
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
};

export default nextConfig;
