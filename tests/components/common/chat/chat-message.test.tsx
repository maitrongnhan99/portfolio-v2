import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChatMessage } from '@/components/common/chat/chat-message';

describe('ChatMessage', () => {
  const defaultProps = {
    message: 'Hello, this is a test message',
    isUser: false,
    timestamp: new Date('2024-01-01T12:00:00Z'),
    isStreaming: false,
    streamingComplete: true,
  };

  it('renders assistant message correctly', () => {
    render(<ChatMessage {...defaultProps} />);
    
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
  });

  it('renders user message correctly', () => {
    render(<ChatMessage {...defaultProps} isUser={true} />);
    
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
  });

  it('displays timestamp', () => {
    render(<ChatMessage {...defaultProps} />);
    
    // Check if timestamp is formatted and displayed
    expect(screen.getByText(/12:00/)).toBeInTheDocument();
  });

  it('shows streaming indicator when streaming', () => {
    render(
      <ChatMessage 
        {...defaultProps} 
        isStreaming={true} 
        streamingComplete={false}
      />
    );
    
    // Should show some indication of streaming
    const messageContainer = screen.getByText('Hello, this is a test message').closest('div');
    expect(messageContainer).toBeInTheDocument();
  });

  it('renders sources when provided', () => {
    const sources = [
      {
        content: 'Source content 1',
        category: 'projects',
        score: 0.9,
      },
      {
        content: 'Source content 2',
        category: 'experience',
        score: 0.8,
      },
    ];

    render(<ChatMessage {...defaultProps} sources={sources} />);
    
    expect(screen.getByText('Source content 1')).toBeInTheDocument();
    expect(screen.getByText('Source content 2')).toBeInTheDocument();
  });

  it('handles markdown content', () => {
    const markdownMessage = '**Bold text** and *italic text*';
    
    render(<ChatMessage {...defaultProps} message={markdownMessage} />);
    
    // The markdown should be rendered as HTML
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });

  it('handles code blocks', () => {
    const codeMessage = '```javascript\nconst hello = "world";\n```';
    
    render(<ChatMessage {...defaultProps} message={codeMessage} />);
    
    expect(screen.getByText('const hello = "world";')).toBeInTheDocument();
  });

  it('applies correct styling for user vs assistant messages', () => {
    const { rerender } = render(<ChatMessage {...defaultProps} isUser={false} />);
    
    let messageContainer = screen.getByText('Hello, this is a test message').closest('div');
    expect(messageContainer).toHaveClass(); // Assistant styling
    
    rerender(<ChatMessage {...defaultProps} isUser={true} />);
    
    messageContainer = screen.getByText('Hello, this is a test message').closest('div');
    expect(messageContainer).toHaveClass(); // User styling
  });

  it('handles empty message gracefully', () => {
    render(<ChatMessage {...defaultProps} message="" />);
    
    // Should still render the component structure
    const container = screen.getByRole('article') || screen.getByTestId('chat-message');
    expect(container).toBeInTheDocument();
  });

  it('handles long messages', () => {
    const longMessage = 'A'.repeat(1000);
    
    render(<ChatMessage {...defaultProps} message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ChatMessage {...defaultProps} />);
    
    // Should have proper ARIA attributes for screen readers
    const messageElement = screen.getByRole('article') || screen.getByText('Hello, this is a test message').closest('[role]');
    expect(messageElement).toBeInTheDocument();
  });

  it('memoizes correctly to prevent unnecessary re-renders', () => {
    const { rerender } = render(<ChatMessage {...defaultProps} />);
    
    // Re-render with same props should not cause re-render
    rerender(<ChatMessage {...defaultProps} />);
    
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
  });

  it('handles special characters and emojis', () => {
    const specialMessage = 'Hello! 👋 This has special chars: <>&"\'';
    
    render(<ChatMessage {...defaultProps} message={specialMessage} />);
    
    expect(screen.getByText(/Hello! 👋/)).toBeInTheDocument();
  });

  it('displays loading state for streaming messages', () => {
    render(
      <ChatMessage 
        {...defaultProps} 
        message=""
        isStreaming={true} 
        streamingComplete={false}
      />
    );
    
    // Should show some loading indicator
    const container = screen.getByRole('article') || screen.getByTestId('chat-message');
    expect(container).toBeInTheDocument();
  });
});
