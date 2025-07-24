import { ChatErrorBoundary, DefaultErrorFallback, ErrorBoundary, ProjectErrorBoundary } from '@/components/common/error-boundary';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders default error fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('🔄 Try Again')).toBeInTheDocument();
    expect(screen.getByText('🏠 Go Home')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
      <div>
        <p>Custom error: {error.message}</p>
        <button onClick={reset}>Custom Reset</button>
      </div>
    );

    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
    expect(screen.getByText('Custom Reset')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('resets error state when reset button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    const resetButton = screen.getByText('🔄 Try Again');
    fireEvent.click(resetButton);
    
    // Re-render with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});

describe('DefaultErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockReset = vi.fn();

  beforeEach(() => {
    mockReset.mockClear();
  });

  it('displays error information', () => {
    render(<DefaultErrorFallback error={mockError} reset={mockReset} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });

    render(<DefaultErrorFallback error={mockError} reset={mockReset} />);

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  it('hides error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });

    render(<DefaultErrorFallback error={mockError} reset={mockReset} />);

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();

    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  it('calls reset function when Try Again is clicked', () => {
    render(<DefaultErrorFallback error={mockError} reset={mockReset} />);
    
    const tryAgainButton = screen.getByText('🔄 Try Again');
    fireEvent.click(tryAgainButton);
    
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('has proper navigation link', () => {
    render(<DefaultErrorFallback error={mockError} reset={mockReset} />);
    
    const homeLink = screen.getByRole('link', { name: /go home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

describe('ChatErrorBoundary', () => {
  it('renders chat-specific error message', () => {
    render(
      <ChatErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ChatErrorBoundary>
    );
    
    expect(screen.getByText('Chat Error')).toBeInTheDocument();
    expect(screen.getByText(/There was an issue with the chat interface/)).toBeInTheDocument();
    expect(screen.getByText('🔄 Retry')).toBeInTheDocument();
  });
});

describe('ProjectErrorBoundary', () => {
  it('renders project-specific error message', () => {
    render(
      <ProjectErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ProjectErrorBoundary>
    );
    
    expect(screen.getByText('Unable to load project')).toBeInTheDocument();
    expect(screen.getByText(/There was an issue loading this project/)).toBeInTheDocument();
    expect(screen.getByText('🔄 Retry')).toBeInTheDocument();
  });
});
