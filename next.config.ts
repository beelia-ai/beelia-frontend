import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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
  // Headers configuration
  headers: async () => {
    const headers = [];
    
    // Disable caching in development
    if (process.env.NODE_ENV === 'development') {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      });
    }
    
    // Add font caching headers for better LCP and CORS for Safari
    headers.push({
      source: '/fonts/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET',
        },
      ],
    });
    
    return headers;
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

export default withNextIntl(nextConfig);
