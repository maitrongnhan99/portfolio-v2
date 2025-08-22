import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Release tracking
  release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Environment
  environment: process.env.NODE_ENV,

  // Capture unhandled promise rejections
  onFatalError: (error) => {
    console.error("Fatal error occurred:", error);
  },

  // Integrations
  integrations: [
    // Prisma integration (if using Prisma)
    Sentry.prismaIntegration(),

    // MongoDB integration
    Sentry.mongoIntegration(),
    Sentry.captureConsoleIntegration({
      levels: ["error", "warn"],
    }),

    // Local variables integration for better debugging
    Sentry.localVariablesIntegration({
      captureAllExceptions: true,
    }),
  ],

  // Before send callback for filtering
  beforeSend(event, hint) {
    // Filter out specific errors in production
    if (process.env.NODE_ENV === "production") {
      // Don't send errors that contain sensitive data
      if (event.request?.cookies) {
        delete event.request.cookies;
      }

      // Remove any potential secrets from the event
      if (event.extra) {
        Object.keys(event.extra).forEach((key) => {
          if (
            key.toLowerCase().includes("token") ||
            key.toLowerCase().includes("secret") ||
            key.toLowerCase().includes("password")
          ) {
            delete event.extra![key];
          }
        });
      }
    }

    // Add server context
    event.contexts = {
      ...event.contexts,
      runtime: {
        name: "node",
        version: process.version,
      },
      app: {
        app_memory: process.memoryUsage().heapUsed,
      },
    };

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Telegram bot webhook errors (expected when in dev)
    "TELEGRAM_BOT_TOKEN",
    // MongoDB connection errors during development
    "MongoServerError",
    // Next.js specific errors
    "NEXT_NOT_FOUND",
    "NEXT_REDIRECT",
  ],

  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
});
