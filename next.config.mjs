import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security: Enable proper linting and type checking
  // eslint: { ignoreDuringBuilds: true }, // REMOVED - was hiding potential issues
  // typescript: { ignoreBuildErrors: true }, // REMOVED - was hiding potential issues

  images: {
    // Enable image optimization for better performance
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  serverExternalPackages: ["@react-pdf/renderer"],

  env: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.sentry.io", // Added Sentry
              "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
              "img-src 'self' data: https: blob:", // Added blob for Sentry
              "font-src 'self' data:",
              "connect-src 'self' https: wss: *.sentry.io *.ingest.sentry.io", // Added Sentry endpoints
              "frame-ancestors 'none'",
              "worker-src 'self' blob:", // Added for Sentry replay
              "report-uri https://o4508760871337984.ingest.sentry.io/api/4508760872779776/security/?sentry_key=YOUR_KEY", // Add your Sentry key
            ].join("; "),
          },
        ],
      },
    ];
  },
};

// Sentry configuration wrapper
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps in production
  silent: !process.env.CI,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Disable automatic source map uploading in development
  disableServerWebpackPlugin: process.env.NODE_ENV === "development",
  disableClientWebpackPlugin: process.env.NODE_ENV === "development",

  // Automatically instrument your app (recommended)
  autoInstrumentServerFunctions: true,
  autoInstrumentAppDirectory: true,

  // Tunnel Sentry requests through Next.js to avoid ad blockers
  tunnelRoute: "/monitoring-tunnel",

  // Upload source maps to Sentry
  sourcemaps: {
    // Automatically delete source maps after uploading
    deleteSourcemapsAfterUpload: true,
  },
});
