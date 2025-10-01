"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Log error for development
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", {
        error,
        componentStack: errorInfo.componentStack,
      });
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error!} reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

export function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-lighter mb-2">
            Something went wrong
          </h2>
          <p className="text-slate text-sm mb-4">
            We encountered an unexpected error. This has been logged and
            we&apos;ll look into it.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-4">
              <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-300">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                {error.message}
                {error.stack && (
                  <>
                    {"\n\nStack trace:\n"}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            🔄 Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">🏠 Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Specialized error boundaries for different contexts

export function ChatErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={ChatErrorFallback}
      onError={(error) => {
        console.error("Chat error:", error);
        // Could send to analytics here
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function ChatErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Chat Error
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            There was an issue with the chat interface. Please try refreshing or
            contact support if the problem persists.
          </p>
          <Button
            onClick={reset}
            variant="outline"
            size="sm"
            className="mt-3 text-red-700 border-red-300 hover:bg-red-100"
          >
            🔄 Retry
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={ProjectErrorFallback}
      onError={(error) => {
        console.error("Project display error:", error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function ProjectErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="p-6 text-center border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="w-8 h-8 bg-slate-400 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span className="text-white text-sm font-bold">!</span>
      </div>
      <h3 className="text-lg font-medium text-slate-lighter mb-2">
        Unable to load project
      </h3>
      <p className="text-slate text-sm mb-4">
        There was an issue loading this project. Please try again.
      </p>
      <Button onClick={reset} variant="outline" size="sm">
        🔄 Retry
      </Button>
    </div>
  );
}

// Hook for error reporting
export function useErrorHandler() {
  return React.useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || "component"}:`, error);

    // Log error for development
    if (process.env.NODE_ENV === "development") {
      console.error("Error handler details:", {
        error,
        context,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);
}
