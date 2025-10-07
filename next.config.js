import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";

const __dirname = path.resolve();

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
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
    ],
  },

  experimental: {
    reactCompiler: false, // Required by Payload
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // serverExternalPackages: [
  //   "@react-pdf/renderer",
  //   "detect-libc",
  //   "payload",
  //   "@payloadcms/db-mongodb",
  //   "mongoose",
  //   "mongodb",
  //   "sharp",
  // ],

  // webpack: (config, { isServer }) => {
  //   // Handle Node.js built-in modules for client-side
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       child_process: false,
  //       fs: false,
  //       net: false,
  //       tls: false,
  //       crypto: false,
  //       stream: false,
  //       url: false,
  //       zlib: false,
  //       http: false,
  //       https: false,
  //       assert: false,
  //       os: false,
  //       path: false,
  //       querystring: false,
  //       util: false,
  //       'node:fs': false,
  //       'node:path': false,
  //       'node:url': false,
  //       'node:crypto': false,
  //     };

  //     // Exclude server-only packages from client bundle
  //     config.externals = config.externals || [];
  //     config.externals.push({
  //       'payload': '{}',
  //       '@payloadcms/db-mongodb': '{}',
  //       'mongoose': '{}',
  //       'mongodb': '{}',
  //       'detect-libc': '{}',
  //       'sharp': '{}'
  //     });
  //   }

  //   // Handle Payload CMS specific issues
  //   config.module = config.module || {};
  //   config.module.rules = config.module.rules || [];

  //   // Add rule to handle .node files
  //   config.module.rules.push({
  //     test: /\.node$/,
  //     use: 'raw-loader',
  //   });

  //   return config;
  // },

  env: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' blob: data:", // Allow PayloadCMS styles
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https: wss:",
              "frame-ancestors 'none'",
              "worker-src 'self' blob:",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
      // Relaxed headers for PayloadCMS admin routes
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Allow admin iframe functionality
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' blob: data: *", // Very permissive for admin
              "img-src 'self' data: https: blob: *",
              "font-src 'self' data: https: *",
              "connect-src 'self' https: wss: *",
              "frame-ancestors 'self'",
              "worker-src 'self' blob:",
              "object-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

// Wrap the nextConfig with Payload's withPayload function
export default withPayload(nextConfig, {
  configPath: path.resolve(__dirname, "./payload.config.ts"),
  cssPath: path.resolve(__dirname, "./app/(payload)/custom.scss"), // Fixed path to your CSS
  adminRoute: "/admin", // or wherever the admin page runs
});
