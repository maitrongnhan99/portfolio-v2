import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adds request headers and IP for users
  sendDefaultPii: true,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0.5,
  replaysOnErrorSampleRate: 1.0,

  // Release tracking
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Environment
  environment: process.env.NODE_ENV,

  // Set tracePropagationTargets to control what URLs should have tracing headers attached
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/maitrongnhan\.com/,
    /^\/api\//,
  ],

  // Integrations
  integrations: [
    // Browser Tracing
    Sentry.browserTracingIntegration(),

    // Session Replay
    Sentry.replayIntegration({
      // Mask all text content, but keep media playback
      maskAllText: true,
      blockAllMedia: false,
      // Sample errors at 100%
      networkDetailAllowUrls: [
        window.location.origin,
        /^https:\/\/maitrongnhan\.com/,
      ],
    }),

    // User Feedback
    Sentry.feedbackIntegration({
      // The feedback widget will open a modal
      colorScheme: "system",
      autoInject: false, // We'll manually inject where needed
      showBranding: false,
      showName: true,
      showEmail: true,
      isNameRequired: false,
      isEmailRequired: false,
      successMessageText: "Thank you for your feedback!",
    }),
  ],

  // Before send callback for filtering
  beforeSend(event, hint) {
    // Filter out specific errors in production
    if (process.env.NODE_ENV === "production") {
      // Ignore browser extension errors
      if (
        event.exception?.values?.[0]?.type === "TypeError" &&
        event.exception?.values?.[0]?.value?.includes("chrome")
      ) {
        return null;
      }

      // Ignore network errors that are expected
      const error = hint.originalException as Error | undefined;
      if (error?.message?.includes("NetworkError")) {
        return null;
      }
    }

    // Add user context if available
    if (typeof window !== "undefined") {
      event.contexts = {
        ...event.contexts,
        browser: {
          ...event.contexts?.browser,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
      };
    }

    return event;
  },

  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "ResizeObserver loop completed with undelivered notifications",
    "ResizeObserver loop limit exceeded",
    // Network errors
    "NetworkError",
    "Failed to fetch",
    // React hydration (handled separately)
    "Hydration failed",
    "Text content does not match server-rendered HTML",
    "There was an error while hydrating",
  ],

  // Allow URLs for error reporting
  allowUrls: [/https:\/\/maitrongnhan\.com/, /http:\/\/localhost:3000/],

  // Deny URLs (3rd party scripts)
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
