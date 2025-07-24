/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security: Enable proper linting and type checking
  // eslint: { ignoreDuringBuilds: true }, // REMOVED - was hiding potential issues
  // typescript: { ignoreBuildErrors: true }, // REMOVED - was hiding potential issues

  images: {
    unoptimized: true, // TODO: Enable optimization for better performance
  },

  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  // Security: Removed client-side environment variable exposure
  // env: { TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN }, // REMOVED - security risk

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
              "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
