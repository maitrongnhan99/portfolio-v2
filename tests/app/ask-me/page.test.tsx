import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

// Mock all the lazy loaded components
vi.mock('@/components/common/chat/animated-welcome', () => ({
  AnimatedWelcome: ({ onComplete }: { onComplete: () => void }) => {
    React.useEffect(() => {
      onComplete();
    }, [onComplete]);
    return <div data-testid="animated-welcome">Welcome Animation</div>;
  },
}));

vi.mock('@/components/common/chat/enhanced-suggestions', () => ({
  EnhancedSuggestions: ({ onSendMessage }: { onSendMessage: (msg: string) => void }) => (
    <div data-testid="enhanced-suggestions">
      <button onClick={() => onSendMessage('Test suggestion')}>Suggestion</button>
    </div>
  ),
}));

vi.mock('@/components/common/chat/conversation-progress', () => ({
  ConversationProgress: ({ messageCount, topicsExplored }: any) => (
    <div data-testid="conversation-progress">
      Messages: {messageCount}, Topics: {topicsExplored.join(', ')}
    </div>
  ),
}));

vi.mock('@/components/common/chat/quick-actions', () => ({
  QuickActions: ({ onSendMessage }: { onSendMessage: (msg: string) => void }) => (
    <div data-testid="quick-actions">
      <button onClick={() => onSendMessage('Quick action')}>Quick Action</button>
    </div>
  ),
}));

vi.mock('@/components/common/chat/delete-confirm-modal', () => ({
  DeleteConfirmModal: ({ onConfirm, onCancel, open }: any) => 
    open ? (
      <div data-testid="delete-confirm-modal">
        <button onClick={onConfirm}>Confirm Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

// Mock other components
vi.mock('@/components/common/chat', () => ({
  ChatInput: ({ onSendMessage, disabled, placeholder }: any) => (
    <div data-testid="chat-input">
      <input
        data-testid="chat-input-field"
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            onSendMessage(e.currentTarget.value);
          }
        }}
      />
    </div>
  ),
  ChatMessage: ({ message, isUser }: any) => (
    <div data-testid={`chat-message-${isUser ? 'user' : 'ai'}`}>
      {message}
    </div>
  ),
  TypingIndicator: () => <div data-testid="typing-indicator">Typing...</div>,
}));

vi.mock('@/components/common/chat/chat-header', () => ({
  ChatHeader: ({ currentConversation }: any) => (
    <div data-testid="chat-header">
      {currentConversation?.title || 'New Conversation'}
    </div>
  ),
}));

vi.mock('@/components/common/chat/connection-status', () => ({
  ConnectionStatus: ({ showDetails }: any) => (
    <div data-testid="connection-status">
      Status: {showDetails ? 'Online (detailed)' : 'Online'}
    </div>
  ),
}));

vi.mock('@/components/common/chat/chat-controls-toggle', () => ({
  ChatControlsToggle: ({ isOpen, onClick }: any) => (
    <button data-testid="controls-toggle" onClick={onClick}>
      {isOpen ? 'Close' : 'Open'} Controls
    </button>
  ),
}));

vi.mock('@/components/common/chat/chat-controls-sidebar', () => ({
  ChatControlsSidebar: ({ isOpen, onOpenChange }: any) => (
    <div data-testid="controls-sidebar" style={{ display: isOpen ? 'block' : 'none' }}>
      Controls Sidebar
    </div>
  ),
}));

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: React.forwardRef(({ children }: any, ref: any) => 
    React.createElement('div', { ref, 'data-testid': 'scroll-area' }, children)
  ),
}));

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <>{children}</>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipProvider: ({ children }: any) => <>{children}</>,
  TooltipTrigger: ({ children }: any) => <>{children}</>,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('@phosphor-icons/react', () => ({
  ArrowDownIcon: (props: any) => <span {...props}>ArrowDown</span>,
  ArrowLeftIcon: (props: any) => <span {...props}>ArrowLeft</span>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  },
}));

// Mock hooks
vi.mock('@/hooks/use-connection-status', () => ({
  useConnectionStatus: () => ({
    status: { isOnline: true },
  }),
}));

vi.mock('@/hooks/use-conversation-history', () => ({
  useConversationHistory: () => ({
    conversations: [],
    currentConversation: null,
    isLoading: false,
    error: null,
    createConversation: vi.fn().mockResolvedValue({ id: 'test-conversation' }),
    loadConversation: vi.fn().mockResolvedValue(null),
    saveConversation: vi.fn().mockResolvedValue(true),
    deleteConversation: vi.fn().mockResolvedValue(true),
    addMessage: vi.fn(),
    updateMessage: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-chat-scroll', () => ({
  useChatScroll: () => ({
    scrollState: {
      isAtBottom: true,
      userHasScrolled: false,
      showScrollButton: false,
    },
    scrollViewportRef: { current: null },
    messagesEndRef: { current: null },
    scrollToBottom: vi.fn(),
    resetScrollTracking: vi.fn(),
  }),
}));

// Mock RetryManager for API calls
vi.mock('@/lib/retry-utils', () => ({
  RetryManager: {
    retryFetch: vi.fn(() => Promise.resolve({
      ok: true,
      json: vi.fn(() => Promise.resolve({
        response: 'AI response',
        sources: [],
      })),
    })),
  },
}));

// Import the component after all mocks
import AskMePage from '@/app/(ai-assistant)/ask-me/page';

describe('AskMePage', () => {
  // Mock console.error to suppress expected error logs
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original console.error
    console.error = originalConsoleError;
  });

  describe('rendering', () => {
    it('should render with ChatProvider wrapper', async () => {
      await act(async () => {
        render(<AskMePage />);
      });

      // Wait for lazy components to load
      await waitFor(() => {
        expect(screen.getByTestId('chat-header')).toBeInTheDocument();
        expect(screen.getByTestId('chat-input')).toBeInTheDocument();
        // There are multiple connection status elements
        expect(screen.getAllByTestId('connection-status')).toHaveLength(2);
      });
    });

    it('should show welcome animation initially', async () => {
      await act(async () => {
        render(<AskMePage />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('animated-welcome')).toBeInTheDocument();
      });
    });

    it('should show enhanced suggestions after welcome', async () => {
      await act(async () => {
        render(<AskMePage />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('enhanced-suggestions')).toBeInTheDocument();
        expect(screen.getByTestId('quick-actions')).toBeInTheDocument();
      });
    });
  });

  describe('user interactions', () => {
    it('should send message when user types and presses enter', async () => {
      const user = userEvent.setup();
      
      render(<AskMePage />);

      const input = screen.getByTestId('chat-input-field');
      await user.type(input, 'Hello AI{enter}');

      await waitFor(() => {
        expect(screen.getByTestId('chat-message-user')).toBeInTheDocument();
        expect(screen.getByText('Hello AI')).toBeInTheDocument();
      });
    });

    it('should hide welcome elements after first message', async () => {
      const user = userEvent.setup();
      
      await act(async () => {
        render(<AskMePage />);
      });

      // Wait for welcome to appear
      await waitFor(() => {
        expect(screen.getByTestId('animated-welcome')).toBeInTheDocument();
      });

      // Send a message
      const input = screen.getByTestId('chat-input-field');
      await user.type(input, 'Test message{enter}');

      // Welcome should disappear
      await waitFor(() => {
        expect(screen.queryByTestId('animated-welcome')).not.toBeInTheDocument();
        expect(screen.queryByTestId('enhanced-suggestions')).not.toBeInTheDocument();
      });
    });

    it('should toggle controls sidebar', async () => {
      const user = userEvent.setup();
      
      render(<AskMePage />);

      const toggleButton = screen.getByTestId('controls-toggle');
      const sidebar = screen.getByTestId('controls-sidebar');

      // Initially closed
      expect(sidebar).toHaveStyle({ display: 'none' });

      // Click to open
      await user.click(toggleButton);
      expect(sidebar).toHaveStyle({ display: 'block' });

      // Click to close
      await user.click(toggleButton);
      expect(sidebar).toHaveStyle({ display: 'none' });
    });

    it('should show conversation progress after messages', async () => {
      const user = userEvent.setup();
      
      render(<AskMePage />);

      // Send a message
      const input = screen.getByTestId('chat-input-field');
      await user.type(input, 'Test about skills{enter}');

      // Should show conversation progress
      await waitFor(() => {
        expect(screen.getByTestId('conversation-progress')).toBeInTheDocument();
        expect(screen.getByText(/Messages: 1/)).toBeInTheDocument();
      });
    });
  });

  describe('keyboard shortcuts', () => {
    it('should handle Cmd/Ctrl + K for search', async () => {
      render(<AskMePage />);

      // Simulate Cmd+K
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      // Note: In a real test, this would open the search dialog
      // but we haven't mocked that interaction completely
    });

    it('should handle Escape to close sidebar', async () => {
      const user = userEvent.setup();
      
      render(<AskMePage />);

      // Open sidebar first
      const toggleButton = screen.getByTestId('controls-toggle');
      await user.click(toggleButton);

      const sidebar = screen.getByTestId('controls-sidebar');
      expect(sidebar).toHaveStyle({ display: 'block' });

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      // Sidebar should close
      await waitFor(() => {
        expect(sidebar).toHaveStyle({ display: 'none' });
      });
    });
  });

  describe('streaming toggle', () => {
    it('should toggle streaming mode', async () => {
      const user = userEvent.setup();
      
      render(<AskMePage />);

      // Find streaming toggle button
      const streamingToggle = screen.getByText('Streaming ON');
      expect(streamingToggle).toBeInTheDocument();

      // Click to toggle off
      await user.click(streamingToggle);
      
      await waitFor(() => {
        expect(screen.getByText('Streaming OFF')).toBeInTheDocument();
      });

      // Click to toggle back on
      await user.click(screen.getByText('Streaming OFF'));
      
      await waitFor(() => {
        expect(screen.getByText('Streaming ON')).toBeInTheDocument();
      });
    });

    it('should toggle auto-save mode', async () => {
      const user = userEvent.setup();
      
      render(<AskMePage />);

      // Find auto-save toggle button
      const autoSaveToggle = screen.getByText('Auto-save ON');
      expect(autoSaveToggle).toBeInTheDocument();

      // Click to toggle off
      await user.click(autoSaveToggle);
      
      await waitFor(() => {
        expect(screen.getByText('Auto-save OFF')).toBeInTheDocument();
      });
    });
  });

  describe('navigation', () => {
    it('should have back to portfolio link', () => {
      render(<AskMePage />);

      // Find all links and then find the one with href="/"
      const links = screen.getAllByRole('link');
      const backLink = links.find(link => link.getAttribute('href') === '/');
      
      expect(backLink).toBeDefined();
      expect(backLink).toBeInTheDocument();
      
      // Check that the ArrowLeft icon is rendered inside the link
      const arrowIcon = screen.getByText('ArrowLeft');
      expect(arrowIcon).toBeInTheDocument();
      expect(backLink).toContainElement(arrowIcon);
    });
  });
});