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
      allowedOrigins: ['localhost:3000'],
    },
  },
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
