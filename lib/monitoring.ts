import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

// Types for monitoring data
interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  userAgent: string;
  userId?: string;
  context?: Record<string, any>;
}

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  url: string;
}

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

/**
 * Get performance rating based on metric value and thresholds
 */
function getPerformanceRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
  if (!thresholds) return 'good';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send performance data to analytics service
 */
async function sendPerformanceData(metric: PerformanceMetric) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Performance Metric:', metric);
    return;
  }

  try {
    // Send to your analytics service (Google Analytics, Mixpanel, etc.)
    await fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metric),
    });
  } catch (error) {
    console.error('Failed to send performance data:', error);
  }
}

/**
 * Send error data to monitoring service
 */
async function sendErrorData(error: ErrorReport) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error Report:', error);
    return;
  }

  try {
    // Send to your error monitoring service (Sentry, LogRocket, etc.)
    await fetch('/api/analytics/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    });
  } catch (err) {
    console.error('Failed to send error data:', err);
  }
}

/**
 * Send analytics event
 */
async function sendAnalyticsEvent(event: AnalyticsEvent) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics Event:', event);
    return;
  }

  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  const handleMetric = (metric: Metric) => {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: getPerformanceRating(metric.name, metric.value),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    sendPerformanceData(performanceMetric);
  };

  // Measure Core Web Vitals
  getCLS(handleMetric);
  getFID(handleMetric);
  getFCP(handleMetric);
  getLCP(handleMetric);
  getTTFB(handleMetric);
}

/**
 * Initialize error monitoring
 */
export function initErrorMonitoring() {
  if (typeof window === 'undefined') return;

  // Global error handler
  window.addEventListener('error', (event) => {
    const errorReport: ErrorReport = {
      message: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    };

    sendErrorData(errorReport);
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const errorReport: ErrorReport = {
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      context: {
        type: 'unhandledrejection',
        reason: event.reason,
      },
    };

    sendErrorData(errorReport);
  });
}

/**
 * Track custom events
 */
export function trackEvent(
  event: string,
  category: string,
  action: string,
  label?: string,
  value?: number
) {
  const analyticsEvent: AnalyticsEvent = {
    event,
    category,
    action,
    label,
    value,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  sendAnalyticsEvent(analyticsEvent);
}

/**
 * Track page views
 */
export function trackPageView(url: string, title?: string) {
  trackEvent('page_view', 'navigation', 'view', title || url);
}

/**
 * Track user interactions
 */
export function trackInteraction(element: string, action: string, context?: Record<string, any>) {
  trackEvent('user_interaction', 'engagement', action, element, context?.value);
}

/**
 * Track performance issues
 */
export function trackPerformanceIssue(issue: string, details: Record<string, any>) {
  trackEvent('performance_issue', 'performance', issue, JSON.stringify(details));
}

/**
 * Initialize all monitoring
 */
export function initMonitoring() {
  if (typeof window === 'undefined') return;

  initPerformanceMonitoring();
  initErrorMonitoring();

  // Track initial page view
  trackPageView(window.location.href, document.title);

  console.log('🔍 Monitoring initialized');
}

/**
 * Performance observer for additional metrics
 */
export function initPerformanceObserver() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // Observe navigation timing
  const navObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        
        // Track custom navigation metrics
        trackEvent('navigation_timing', 'performance', 'dom_content_loaded', '', 
          navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
        
        trackEvent('navigation_timing', 'performance', 'load_complete', '', 
          navEntry.loadEventEnd - navEntry.loadEventStart);
      }
    }
  });

  navObserver.observe({ entryTypes: ['navigation'] });

  // Observe resource timing for slow resources
  const resourceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const resourceEntry = entry as PerformanceResourceTiming;
      
      // Track slow resources (>2 seconds)
      if (resourceEntry.duration > 2000) {
        trackPerformanceIssue('slow_resource', {
          name: resourceEntry.name,
          duration: resourceEntry.duration,
          size: resourceEntry.transferSize,
        });
      }
    }
  });

  resourceObserver.observe({ entryTypes: ['resource'] });
}
