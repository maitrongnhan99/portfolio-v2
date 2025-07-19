import { Conversation, ConversationMessage } from '@/hooks/use-conversation-history';

export class ConversationStorage {
  private static instance: ConversationStorage;
  private readonly storageKey = 'chat-conversations';
  private readonly maxStorageSize = 50 * 1024 * 1024; // 50MB limit
  private readonly maxConversations = 100;

  private constructor() {}

  static getInstance(): ConversationStorage {
    if (!ConversationStorage.instance) {
      ConversationStorage.instance = new ConversationStorage();
    }
    return ConversationStorage.instance;
  }

  /**
   * Get all conversations from storage
   */
  async getAllConversations(): Promise<Conversation[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const conversations: Conversation[] = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      return conversations.map(conv => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      })).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      console.error('Failed to load conversations from storage:', error);
      return [];
    }
  }

  /**
   * Get a specific conversation by ID
   */
  async getConversation(id: string): Promise<Conversation | null> {
    const conversations = await this.getAllConversations();
    return conversations.find(conv => conv.id === id) || null;
  }

  /**
   * Save a conversation to storage
   */
  async saveConversation(conversation: Conversation): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const existingIndex = conversations.findIndex(conv => conv.id === conversation.id);
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.unshift(conversation);
      }

      // Limit the number of conversations
      if (conversations.length > this.maxConversations) {
        conversations.splice(this.maxConversations);
      }

      await this.saveToStorage(conversations);
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw new Error('Failed to save conversation to storage');
    }
  }

  /**
   * Delete a conversation from storage
   */
  async deleteConversation(id: string): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const filteredConversations = conversations.filter(conv => conv.id !== id);
      await this.saveToStorage(filteredConversations);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw new Error('Failed to delete conversation from storage');
    }
  }

  /**
   * Clear all conversations from storage
   */
  async clearAllConversations(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear conversations:', error);
      throw new Error('Failed to clear conversations from storage');
    }
  }

  /**
   * Export a conversation in different formats
   */
  async exportConversation(id: string, format: 'json' | 'markdown' | 'txt'): Promise<string> {
    const conversation = await this.getConversation(id);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    switch (format) {
      case 'json':
        return JSON.stringify(conversation, null, 2);
      
      case 'markdown':
        return this.exportToMarkdown(conversation);
      
      case 'txt':
        return this.exportToText(conversation);
      
      default:
        throw new Error('Unsupported export format');
    }
  }

  /**
   * Import a conversation from JSON data
   */
  async importConversation(data: string, format: 'json'): Promise<Conversation> {
    try {
      if (format !== 'json') {
        throw new Error('Only JSON import is currently supported');
      }

      const conversation: Conversation = JSON.parse(data);
      
      // Validate the conversation structure
      if (!conversation.id || !conversation.title || !Array.isArray(conversation.messages)) {
        throw new Error('Invalid conversation format');
      }

      // Generate new ID to avoid conflicts
      const importedConversation: Conversation = {
        ...conversation,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };

      await this.saveConversation(importedConversation);
      return importedConversation;
    } catch (error) {
      console.error('Failed to import conversation:', error);
      throw new Error('Failed to import conversation');
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    used: number;
    total: number;
    percentage: number;
    conversationCount: number;
  } {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const used = stored ? new Blob([stored]).size : 0;
      
      return {
        used,
        total: this.maxStorageSize,
        percentage: (used / this.maxStorageSize) * 100,
        conversationCount: stored ? JSON.parse(stored).length : 0
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        used: 0,
        total: this.maxStorageSize,
        percentage: 0,
        conversationCount: 0
      };
    }
  }

  /**
   * Check if storage is available
   */
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Private method to save conversations to storage
   */
  private async saveToStorage(conversations: Conversation[]): Promise<void> {
    try {
      const data = JSON.stringify(conversations);
      const size = new Blob([data]).size;
      
      if (size > this.maxStorageSize) {
        // Remove old conversations if storage is full
        const reducedConversations = conversations.slice(0, Math.floor(conversations.length * 0.8));
        const reducedData = JSON.stringify(reducedConversations);
        localStorage.setItem(this.storageKey, reducedData);
      } else {
        localStorage.setItem(this.storageKey, data);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        // Handle quota exceeded by removing older conversations
        const reducedConversations = conversations.slice(0, Math.floor(conversations.length * 0.5));
        const reducedData = JSON.stringify(reducedConversations);
        localStorage.setItem(this.storageKey, reducedData);
      } else {
        throw error;
      }
    }
  }

  /**
   * Export conversation to markdown format
   */
  private exportToMarkdown(conversation: Conversation): string {
    const lines = [
      `# ${conversation.title}`,
      '',
      `**Created:** ${conversation.createdAt.toLocaleString()}`,
      `**Updated:** ${conversation.updatedAt.toLocaleString()}`,
      `**Messages:** ${conversation.messageCount}`,
      '',
      '## Messages',
      ''
    ];

    conversation.messages.forEach((message, index) => {
      const sender = message.isUser ? 'You' : 'AI Assistant';
      const timestamp = message.timestamp.toLocaleString();
      
      lines.push(`### ${sender} (${timestamp})`);
      lines.push('');
      lines.push(message.text);
      lines.push('');
      
      if (message.sources && message.sources.length > 0) {
        lines.push('**Sources:**');
        message.sources.forEach(source => {
          lines.push(`- ${source.category} (${(source.score * 100).toFixed(0)}%)`);
        });
        lines.push('');
      }
    });

    if (conversation.topicsExplored.length > 0) {
      lines.push('## Topics Explored');
      lines.push('');
      conversation.topicsExplored.forEach(topic => {
        lines.push(`- ${topic}`);
      });
    }

    return lines.join('\n');
  }

  /**
   * Export conversation to plain text format
   */
  private exportToText(conversation: Conversation): string {
    const lines = [
      `${conversation.title}`,
      '='.repeat(conversation.title.length),
      '',
      `Created: ${conversation.createdAt.toLocaleString()}`,
      `Updated: ${conversation.updatedAt.toLocaleString()}`,
      `Messages: ${conversation.messageCount}`,
      '',
      'MESSAGES',
      '--------',
      ''
    ];

    conversation.messages.forEach((message, index) => {
      const sender = message.isUser ? 'You' : 'AI Assistant';
      const timestamp = message.timestamp.toLocaleString();
      
      lines.push(`${sender} (${timestamp})`);
      lines.push('-'.repeat(sender.length + timestamp.length + 3));
      lines.push(message.text);
      lines.push('');
      
      if (message.sources && message.sources.length > 0) {
        lines.push('Sources:');
        message.sources.forEach(source => {
          lines.push(`  - ${source.category} (${(source.score * 100).toFixed(0)}%)`);
        });
        lines.push('');
      }
    });

    if (conversation.topicsExplored.length > 0) {
      lines.push('TOPICS EXPLORED');
      lines.push('---------------');
      conversation.topicsExplored.forEach(topic => {
        lines.push(`- ${topic}`);
      });
    }

    return lines.join('\n');
  }
}

export default ConversationStorage;