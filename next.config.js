/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled for development
  typescript: {
    ignoreBuildErrors: true, // Always ignore TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Always ignore ESLint errors
  },
  experimental: {
    forceSwcTransforms: true,
  },
  // Disable static optimization for development
  generateEtags: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'indiantrademart.com',
      },
      {
        protocol: 'https',
        hostname: '*.indiantrademart.com',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  // Add rewrites for subdomain handling in development
  async rewrites() {
    return {
      beforeFiles: [
        // API routes - proxy to backend
        {
          source: '/api/auth/:path*',
          destination: 'https://indiantradebackend.onrender.com/auth/:path*',
        },
        {
          source: '/api/:path*', 
          destination: 'https://indiantradebackend.onrender.com/api/:path*',
        },
        // Handle subdomain routing for development
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'dir.indiantrademart.com',
            },
          ],
          destination: '/directory/:path*',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'vendor.indiantrademart.com',
            },
          ],
          destination: '/dashboard/vendor-panel/:path*',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'admin.indiantrademart.com',
            },
          ],
          destination: '/dashboard/admin/:path*',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'support.indiantrademart.com',
            },
          ],
          destination: '/dashboard/support/:path*',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'customer.indiantrademart.com',
            },
          ],
          destination: '/dashboard/user/:path*',
        },
      ],
    };
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
