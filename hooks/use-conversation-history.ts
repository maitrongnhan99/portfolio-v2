"use client";

import { useState, useEffect, useCallback } from 'react';
import { ConversationStorage } from '@/lib/conversation-storage';

export interface ConversationMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'message' | 'suggestions';
  sources?: Array<{
    content: string;
    category: string;
    score: number;
  }>;
  isStreaming?: boolean;
  streamingComplete?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
  topicsExplored: string[];
  messageCount: number;
}

export interface UseConversationHistoryReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  
  // Conversation management
  createConversation: (title?: string) => Promise<Conversation>;
  loadConversation: (id: string) => Promise<Conversation | null>;
  saveConversation: (conversation: Conversation) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
  
  // Message management
  addMessage: (conversationId: string, message: ConversationMessage) => Promise<void>;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<ConversationMessage>) => Promise<void>;
  
  // Search and filtering
  searchConversations: (query: string) => Conversation[];
  filterConversationsByTopic: (topic: string) => Conversation[];
  filterConversationsByDate: (startDate: Date, endDate: Date) => Conversation[];
  
  // Utilities
  clearAllConversations: () => Promise<void>;
  exportConversation: (id: string, format: 'json' | 'markdown' | 'txt') => Promise<string>;
  importConversation: (data: string, format: 'json') => Promise<Conversation>;
}

export const useConversationHistory = (): UseConversationHistoryReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize conversation storage
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true);
        const storage = ConversationStorage.getInstance();
        const loadedConversations = await storage.getAllConversations();
        setConversations(loadedConversations);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize conversation storage:', err);
        setError('Failed to load conversation history');
      } finally {
        setIsLoading(false);
      }
    };

    initializeStorage();
  }, []);

  // Create a new conversation
  const createConversation = useCallback(async (title?: string): Promise<Conversation> => {
    try {
      const storage = ConversationStorage.getInstance();
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: title || `Conversation ${conversations.length + 1}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        topicsExplored: [],
        messageCount: 0,
      };

      await storage.saveConversation(newConversation);
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setError(null);
      
      return newConversation;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create conversation');
      throw err;
    }
  }, [conversations.length]);

  // Load an existing conversation
  const loadConversation = useCallback(async (id: string): Promise<Conversation | null> => {
    try {
      const storage = ConversationStorage.getInstance();
      const conversation = await storage.getConversation(id);
      
      if (conversation) {
        setCurrentConversation(conversation);
        setError(null);
        return conversation;
      }
      
      setError('Conversation not found');
      return null;
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation');
      throw err;
    }
  }, []);

  // Save a conversation
  const saveConversation = useCallback(async (conversation: Conversation): Promise<void> => {
    try {
      const storage = ConversationStorage.getInstance();
      const updatedConversation = {
        ...conversation,
        updatedAt: new Date(),
        messageCount: conversation.messages.length,
      };

      await storage.saveConversation(updatedConversation);
      
      setConversations(prev => 
        prev.map(c => c.id === conversation.id ? updatedConversation : c)
      );
      
      if (currentConversation?.id === conversation.id) {
        setCurrentConversation(updatedConversation);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to save conversation:', err);
      setError('Failed to save conversation');
      throw err;
    }
  }, [currentConversation?.id]);

  // Delete a conversation
  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    try {
      const storage = ConversationStorage.getInstance();
      await storage.deleteConversation(id);
      
      setConversations(prev => prev.filter(c => c.id !== id));
      
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete conversation');
      throw err;
    }
  }, [currentConversation?.id]);

  // Update conversation title
  const updateConversationTitle = useCallback(async (id: string, title: string): Promise<void> => {
    try {
      const conversation = conversations.find(c => c.id === id);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const updatedConversation = {
        ...conversation,
        title,
        updatedAt: new Date(),
      };

      await saveConversation(updatedConversation);
    } catch (err) {
      console.error('Failed to update conversation title:', err);
      setError('Failed to update conversation title');
      throw err;
    }
  }, [conversations, saveConversation]);

  // Add a message to a conversation
  const addMessage = useCallback(async (conversationId: string, message: ConversationMessage): Promise<void> => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, message],
      };

      await saveConversation(updatedConversation);
    } catch (err) {
      console.error('Failed to add message:', err);
      setError('Failed to add message');
      throw err;
    }
  }, [conversations, saveConversation]);

  // Update a message in a conversation
  const updateMessage = useCallback(async (
    conversationId: string, 
    messageId: string, 
    updates: Partial<ConversationMessage>
  ): Promise<void> => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const updatedConversation = {
        ...conversation,
        messages: conversation.messages.map(msg =>
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
      };

      await saveConversation(updatedConversation);
    } catch (err) {
      console.error('Failed to update message:', err);
      setError('Failed to update message');
      throw err;
    }
  }, [conversations, saveConversation]);

  // Search conversations
  const searchConversations = useCallback((query: string): Conversation[] => {
    if (!query.trim()) return conversations;

    const lowercaseQuery = query.toLowerCase();
    return conversations.filter(conversation =>
      conversation.title.toLowerCase().includes(lowercaseQuery) ||
      conversation.messages.some(message =>
        message.text.toLowerCase().includes(lowercaseQuery)
      ) ||
      conversation.topicsExplored.some(topic =>
        topic.toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [conversations]);

  // Filter conversations by topic
  const filterConversationsByTopic = useCallback((topic: string): Conversation[] => {
    return conversations.filter(conversation =>
      conversation.topicsExplored.includes(topic)
    );
  }, [conversations]);

  // Filter conversations by date
  const filterConversationsByDate = useCallback((startDate: Date, endDate: Date): Conversation[] => {
    return conversations.filter(conversation =>
      conversation.createdAt >= startDate && conversation.createdAt <= endDate
    );
  }, [conversations]);

  // Clear all conversations
  const clearAllConversations = useCallback(async (): Promise<void> => {
    try {
      const storage = ConversationStorage.getInstance();
      await storage.clearAllConversations();
      setConversations([]);
      setCurrentConversation(null);
      setError(null);
    } catch (err) {
      console.error('Failed to clear conversations:', err);
      setError('Failed to clear conversations');
      throw err;
    }
  }, []);

  // Export conversation
  const exportConversation = useCallback(async (id: string, format: 'json' | 'markdown' | 'txt'): Promise<string> => {
    try {
      const storage = ConversationStorage.getInstance();
      return await storage.exportConversation(id, format);
    } catch (err) {
      console.error('Failed to export conversation:', err);
      setError('Failed to export conversation');
      throw err;
    }
  }, []);

  // Import conversation
  const importConversation = useCallback(async (data: string, format: 'json'): Promise<Conversation> => {
    try {
      const storage = ConversationStorage.getInstance();
      const conversation = await storage.importConversation(data, format);
      setConversations(prev => [conversation, ...prev]);
      setError(null);
      return conversation;
    } catch (err) {
      console.error('Failed to import conversation:', err);
      setError('Failed to import conversation');
      throw err;
    }
  }, []);

  return {
    conversations,
    currentConversation,
    isLoading,
    error,
    createConversation,
    loadConversation,
    saveConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage,
    updateMessage,
    searchConversations,
    filterConversationsByTopic,
    filterConversationsByDate,
    clearAllConversations,
    exportConversation,
    importConversation,
  };
};