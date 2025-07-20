import { describe, it, expect } from 'vitest';
import {
  getConversationHistory,
  createUpdatedConversation,
  shouldAutoSave,
  generateConversationTitle,
} from '@/lib/chat-utils';
import { Message } from '@/types/chat';
import { Conversation } from '@/hooks/use-conversation-history';

describe('chat-utils', () => {
  describe('getConversationHistory', () => {
    it('should return empty array when messages is empty', () => {
      const result = getConversationHistory([]);
      expect(result).toEqual([]);
    });

    it('should convert messages to conversation history format', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Hello',
          isUser: true,
          timestamp: new Date(),
          type: 'message',
        },
        {
          id: '2',
          text: 'Hi there!',
          isUser: false,
          timestamp: new Date(),
          type: 'message',
        },
      ];

      const result = getConversationHistory(messages);
      expect(result).toEqual([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
      ]);
    });

    it('should limit conversation history to specified number', () => {
      const messages: Message[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        text: `Message ${i}`,
        isUser: i % 2 === 0,
        timestamp: new Date(),
        type: 'message',
      }));

      const result = getConversationHistory(messages, 3);
      expect(result).toHaveLength(3);
      expect(result[0].content).toBe('Message 7');
      expect(result[1].content).toBe('Message 8');
      expect(result[2].content).toBe('Message 9');
    });

    it('should use default limit of 6 when not specified', () => {
      const messages: Message[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        text: `Message ${i}`,
        isUser: i % 2 === 0,
        timestamp: new Date(),
        type: 'message',
      }));

      const result = getConversationHistory(messages);
      expect(result).toHaveLength(6);
      expect(result[0].content).toBe('Message 4');
      expect(result[5].content).toBe('Message 9');
    });
  });

  describe('createUpdatedConversation', () => {
    it('should create updated conversation with new messages and metadata', () => {
      const now = new Date('2024-01-01');
      const originalConversation: Conversation = {
        id: '123',
        title: 'Test Conversation',
        messages: [],
        createdAt: now,
        updatedAt: now,
        messageCount: 0,
        topicsExplored: [],
      };

      const newMessages: Message[] = [
        {
          id: '1',
          text: 'Hello',
          isUser: true,
          timestamp: new Date('2024-01-01T10:00:00'),
          type: 'message',
        },
        {
          id: '2',
          text: 'Hi there!',
          isUser: false,
          timestamp: new Date('2024-01-01T10:01:00'),
          type: 'message',
        },
      ];

      const newTopics = ['greeting', 'introduction'];

      const result = createUpdatedConversation(originalConversation, newMessages, newTopics);

      expect(result.id).toBe('123');
      expect(result.title).toBe('Test Conversation');
      expect(result.messages).toHaveLength(2);
      expect(result.messages[0].text).toBe('Hello');
      expect(result.messages[1].text).toBe('Hi there!');
      expect(result.topicsExplored).toEqual(['greeting', 'introduction']);
      expect(result.messageCount).toBe(2);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.updatedAt.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should preserve message timestamps', () => {
      const originalConversation: Conversation = {
        id: '123',
        title: 'Test',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
        topicsExplored: [],
      };

      const messageTimestamp = new Date('2024-01-01T12:00:00');
      const messages: Message[] = [
        {
          id: '1',
          text: 'Test message',
          isUser: true,
          timestamp: messageTimestamp,
          type: 'message',
        },
      ];

      const result = createUpdatedConversation(originalConversation, messages, []);
      expect(result.messages[0].timestamp).toEqual(messageTimestamp);
    });
  });

  describe('shouldAutoSave', () => {
    const mockConversation: Conversation = {
      id: '123',
      title: 'Test',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
      topicsExplored: [],
    };

    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Test',
        isUser: true,
        timestamp: new Date(),
        type: 'message',
      },
    ];

    it('should return true when all conditions are met', () => {
      expect(shouldAutoSave(true, mockConversation, mockMessages)).toBe(true);
    });

    it('should return false when autoSave is false', () => {
      expect(shouldAutoSave(false, mockConversation, mockMessages)).toBe(false);
    });

    it('should return false when currentConversation is null', () => {
      expect(shouldAutoSave(true, null, mockMessages)).toBe(false);
    });

    it('should return false when messages array is empty', () => {
      expect(shouldAutoSave(true, mockConversation, [])).toBe(false);
    });

    it('should return false when all conditions fail', () => {
      expect(shouldAutoSave(false, null, [])).toBe(false);
    });
  });

  describe('generateConversationTitle', () => {
    it('should return "New Conversation" when messages array is empty', () => {
      expect(generateConversationTitle([])).toBe('New Conversation');
    });

    it('should return "New Conversation" when no user messages exist', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'AI response only',
          isUser: false,
          timestamp: new Date(),
          type: 'message',
        },
      ];
      expect(generateConversationTitle(messages)).toBe('New Conversation');
    });

    it('should use first user message as title when it is short', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Hello, how are you?',
          isUser: true,
          timestamp: new Date(),
          type: 'message',
        },
      ];
      expect(generateConversationTitle(messages)).toBe('Hello, how are you?');
    });

    it('should truncate long titles and add ellipsis', () => {
      const longText = 'This is a very long message that exceeds the maximum length limit for conversation titles';
      const messages: Message[] = [
        {
          id: '1',
          text: longText,
          isUser: true,
          timestamp: new Date(),
          type: 'message',
        },
      ];
      const result = generateConversationTitle(messages);
      expect(result).toHaveLength(53); // 50 chars + '...'
      expect(result).toBe(longText.substring(0, 50) + '...');
      expect(result.endsWith('...')).toBe(true);
    });

    it('should find first user message even if not at index 0', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'AI greeting',
          isUser: false,
          timestamp: new Date(),
          type: 'message',
        },
        {
          id: '2',
          text: 'User response',
          isUser: true,
          timestamp: new Date(),
          type: 'message',
        },
      ];
      expect(generateConversationTitle(messages)).toBe('User response');
    });

    it('should handle exactly 50 character titles without truncation', () => {
      const exactLengthText = 'a'.repeat(50); // Exactly 50 characters
      const messages: Message[] = [
        {
          id: '1',
          text: exactLengthText,
          isUser: true,
          timestamp: new Date(),
          type: 'message',
        },
      ];
      expect(generateConversationTitle(messages)).toBe(exactLengthText);
      expect(generateConversationTitle(messages)).toHaveLength(50);
    });
  });
});