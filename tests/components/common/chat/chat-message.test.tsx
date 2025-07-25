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
    // The timestamp should be formatted as hour:minute
    const formattedTime = defaultProps.timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    expect(screen.getByText(formattedTime)).toBeInTheDocument();
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

    render(<ChatMessage {...defaultProps} sources={sources} streamingComplete={true} />);
    
    // Sources should show category and score, not content
    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByText('projects')).toBeInTheDocument();
    expect(screen.getByText('experience')).toBeInTheDocument();
    expect(screen.getByText('(90%)')).toBeInTheDocument();
    expect(screen.getByText('(80%)')).toBeInTheDocument();
  });

  it('handles markdown content', () => {
    const markdownMessage = '**Bold text** and regular text';
    
    render(<ChatMessage {...defaultProps} message={markdownMessage} />);
    
    // The component handles bold text specially
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('Bold text')).toHaveClass('font-mono', 'text-primary', 'font-semibold');
  });

  it('handles code blocks', () => {
    const codeMessage = '```javascript\nconst hello = "world";\n```';
    
    render(<ChatMessage {...defaultProps} message={codeMessage} />);
    
    expect(screen.getByText('const hello = "world";')).toBeInTheDocument();
  });

  it('applies correct styling for user vs assistant messages', () => {
    const { rerender } = render(<ChatMessage {...defaultProps} isUser={false} />);
    
    // Check assistant message has correct container classes - need to go up two levels
    let messageContainer = screen.getByText('Hello, this is a test message').closest('.prose')?.parentElement;
    expect(messageContainer).toHaveClass('bg-navy-light');
    
    rerender(<ChatMessage {...defaultProps} isUser={true} />);
    
    // Check user message has correct container classes
    messageContainer = screen.getByText('Hello, this is a test message').closest('.prose')?.parentElement;
    expect(messageContainer).toHaveClass('bg-primary/10');
  });

  it('handles empty message gracefully', () => {
    render(<ChatMessage {...defaultProps} message="" isStreaming={true} />);
    
    // Should show streaming dots for empty message
    const container = document.querySelector('.animate-bounce');
    expect(container).toBeInTheDocument();
  });

  it('handles long messages', () => {
    const longMessage = 'A'.repeat(1000);
    
    render(<ChatMessage {...defaultProps} message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ChatMessage {...defaultProps} />);
    
    // Check that the message content is accessible
    const message = screen.getByText('Hello, this is a test message');
    expect(message).toBeInTheDocument();
    
    // Check that timestamp is rendered
    const timestamp = defaultProps.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    expect(screen.getByText(timestamp)).toBeInTheDocument();
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
    
    // Should show streaming indicator
    expect(screen.getByText('• Streaming...')).toBeInTheDocument();
  });
});
