import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Release tracking
  release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Environment
  environment: process.env.NODE_ENV,

  // Edge-specific configuration
  // Edge runtime has limitations, so we use a minimal configuration

  // Before send callback for filtering
  beforeSend(event, hint) {
    // Filter out specific errors in production
    if (process.env.NODE_ENV === "production") {
      // Remove sensitive headers
      if (event.request?.headers) {
        const sensitiveHeaders = ["authorization", "cookie", "x-api-key"];
        sensitiveHeaders.forEach((header) => {
          if (event.request!.headers![header]) {
            event.request!.headers![header] = "[Redacted]";
          }
        });
      }
    }

    // Add edge runtime context
    event.contexts = {
      ...event.contexts,
      runtime: {
        name: "edge",
      },
    };

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Edge runtime specific errors
    "EdgeRuntimeError",
    // Middleware errors
    "NEXT_NOT_FOUND",
    "NEXT_REDIRECT",
  ],
});
