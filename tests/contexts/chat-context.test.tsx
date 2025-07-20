import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ChatProvider, useChatContext } from '@/contexts/chat-context';
import { ChatSettings, ConversationMetadata } from '@/types/chat';

describe('ChatContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ChatProvider>{children}</ChatProvider>
  );

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      expect(result.current.showWelcome).toBe(true);
      expect(result.current.showEnhancedSuggestions).toBe(false);
      expect(result.current.showSearchDialog).toBe(false);
      expect(result.current.showControlsSidebar).toBe(false);
      expect(result.current.conversationMetadata).toEqual({
        conversationStartTime: null,
        topicsExplored: [],
        userMessageCount: 0,
      });
      expect(result.current.chatSettings).toEqual({
        useStreaming: true,
        autoSave: true,
      });
    });
  });

  describe('setShowWelcome', () => {
    it('should update showWelcome state', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.setShowWelcome(false);
      });

      expect(result.current.showWelcome).toBe(false);

      act(() => {
        result.current.setShowWelcome(true);
      });

      expect(result.current.showWelcome).toBe(true);
    });
  });

  describe('setShowEnhancedSuggestions', () => {
    it('should update showEnhancedSuggestions state', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.setShowEnhancedSuggestions(true);
      });

      expect(result.current.showEnhancedSuggestions).toBe(true);

      act(() => {
        result.current.setShowEnhancedSuggestions(false);
      });

      expect(result.current.showEnhancedSuggestions).toBe(false);
    });
  });

  describe('setShowSearchDialog', () => {
    it('should update showSearchDialog state', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.setShowSearchDialog(true);
      });

      expect(result.current.showSearchDialog).toBe(true);

      act(() => {
        result.current.setShowSearchDialog(false);
      });

      expect(result.current.showSearchDialog).toBe(false);
    });
  });

  describe('setShowControlsSidebar', () => {
    it('should update showControlsSidebar state', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.setShowControlsSidebar(true);
      });

      expect(result.current.showControlsSidebar).toBe(true);

      act(() => {
        result.current.setShowControlsSidebar(false);
      });

      expect(result.current.showControlsSidebar).toBe(false);
    });
  });

  describe('setConversationMetadata', () => {
    it('should update conversation metadata', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      const newMetadata: ConversationMetadata = {
        conversationStartTime: new Date('2024-01-01'),
        topicsExplored: ['tech', 'projects'],
        userMessageCount: 5,
      };

      act(() => {
        result.current.setConversationMetadata(newMetadata);
      });

      expect(result.current.conversationMetadata).toEqual(newMetadata);
    });
  });

  describe('updateTopicsExplored', () => {
    it('should add new topic to topicsExplored', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.updateTopicsExplored('technology');
      });

      expect(result.current.conversationMetadata.topicsExplored).toContain('technology');
    });

    it('should not add duplicate topics', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.updateTopicsExplored('technology');
      });

      act(() => {
        result.current.updateTopicsExplored('technology');
      });

      expect(result.current.conversationMetadata.topicsExplored).toEqual(['technology']);
    });

    it('should preserve existing topics when adding new ones', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.updateTopicsExplored('technology');
      });

      act(() => {
        result.current.updateTopicsExplored('projects');
      });

      expect(result.current.conversationMetadata.topicsExplored).toEqual(['technology', 'projects']);
    });
  });

  describe('incrementUserMessageCount', () => {
    it('should increment user message count by 1', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      act(() => {
        result.current.incrementUserMessageCount();
      });

      expect(result.current.conversationMetadata.userMessageCount).toBe(1);

      act(() => {
        result.current.incrementUserMessageCount();
      });

      expect(result.current.conversationMetadata.userMessageCount).toBe(2);
    });
  });

  describe('setChatSettings', () => {
    it('should update chat settings', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      const newSettings: ChatSettings = {
        useStreaming: false,
        autoSave: false,
      };

      act(() => {
        result.current.setChatSettings(newSettings);
      });

      expect(result.current.chatSettings).toEqual(newSettings);
    });
  });

  describe('toggleStreaming', () => {
    it('should toggle useStreaming setting', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      // Initial state is true
      expect(result.current.chatSettings.useStreaming).toBe(true);

      act(() => {
        result.current.toggleStreaming();
      });

      expect(result.current.chatSettings.useStreaming).toBe(false);

      act(() => {
        result.current.toggleStreaming();
      });

      expect(result.current.chatSettings.useStreaming).toBe(true);
    });
  });

  describe('toggleAutoSave', () => {
    it('should toggle autoSave setting', () => {
      const { result } = renderHook(() => useChatContext(), { wrapper });

      // Initial state is true
      expect(result.current.chatSettings.autoSave).toBe(true);

      act(() => {
        result.current.toggleAutoSave();
      });

      expect(result.current.chatSettings.autoSave).toBe(false);

      act(() => {
        result.current.toggleAutoSave();
      });

      expect(result.current.chatSettings.autoSave).toBe(true);
    });
  });

  describe('useChatContext error handling', () => {
    it('should throw error when used outside ChatProvider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useChatContext());
      }).toThrow('useChatContext must be used within a ChatProvider');

      consoleError.mockRestore();
    });
  });
});