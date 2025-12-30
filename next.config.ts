import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable to catch performance issues and bugs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.beelia.ai',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:4000'],
    },
  },
  // Disable caching in development
  ...(process.env.NODE_ENV === 'development' && {
    headers: async () => {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            },
          ],
        },
      ];
    },
  }),
  // Optimize bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tree-shake unused Three.js exports
      config.resolve.alias = {
        ...config.resolve.alias,
      };
    }
    return config;
  },
}

export default nextConfig
