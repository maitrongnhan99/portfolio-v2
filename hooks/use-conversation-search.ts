"use client";

import { useState, useEffect, useMemo } from 'react';
import { Conversation } from '@/hooks/use-conversation-history';

export interface SearchFilters {
  query: string;
  topic: string;
  dateRange: string;
  filterBy: 'all' | 'recent' | 'long' | 'short';
  sortBy: 'date' | 'title' | 'messageCount';
  sortOrder: 'asc' | 'desc';
}

export interface SearchResult {
  conversation: Conversation;
  matchedMessages: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    highlightedText: string;
  }>;
  relevanceScore: number;
}

export interface UseConversationSearchReturn {
  searchResults: SearchResult[];
  filteredConversations: Conversation[];
  filters: SearchFilters;
  activeFilterCount: number;
  isSearching: boolean;
  
  // Actions
  setQuery: (query: string) => void;
  setTopic: (topic: string) => void;
  setDateRange: (range: string) => void;
  setFilterBy: (filter: SearchFilters['filterBy']) => void;
  setSortBy: (sort: SearchFilters['sortBy']) => void;
  setSortOrder: (order: SearchFilters['sortOrder']) => void;
  clearFilters: () => void;
  clearSearch: () => void;
  
  // Utilities
  searchInConversation: (conversationId: string, query: string) => Array<{
    messageId: string;
    text: string;
    context: string;
    timestamp: Date;
  }>;
  getAllTopics: () => string[];
}

export const useConversationSearch = (
  conversations: Conversation[]
): UseConversationSearchReturn => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    topic: '',
    dateRange: '',
    filterBy: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  
  const [isSearching, setIsSearching] = useState(false);

  // Highlight text matches
  const highlightText = (text: string, query: string): string => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  // Calculate relevance score
  const calculateRelevanceScore = (conversation: Conversation, query: string): number => {
    if (!query.trim()) return 0;
    
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Title match (highest weight)
    if (conversation.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    // Topic match
    const topicMatches = conversation.topicsExplored.filter(topic => 
      topic.toLowerCase().includes(queryLower)
    ).length;
    score += topicMatches * 5;
    
    // Message content matches
    const messageMatches = conversation.messages.filter(msg => 
      msg.text.toLowerCase().includes(queryLower)
    ).length;
    score += messageMatches * 2;
    
    // Recency bonus
    const daysSinceUpdate = (Date.now() - conversation.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) score += 3;
    else if (daysSinceUpdate < 30) score += 1;
    
    return score;
  };

  // Get all unique topics
  const getAllTopics = (): string[] => {
    const topics = new Set<string>();
    conversations.forEach(conv => {
      conv.topicsExplored.forEach(topic => topics.add(topic));
    });
    return Array.from(topics).sort();
  };

  // Search within a specific conversation
  const searchInConversation = (conversationId: string, query: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation || !query.trim()) return [];
    
    const queryLower = query.toLowerCase();
    const matches = conversation.messages
      .filter(msg => msg.text.toLowerCase().includes(queryLower))
      .map(msg => {
        const index = msg.text.toLowerCase().indexOf(queryLower);
        const start = Math.max(0, index - 50);
        const end = Math.min(msg.text.length, index + query.length + 50);
        const context = msg.text.slice(start, end);
        
        return {
          messageId: msg.id,
          text: msg.text,
          context: start > 0 ? '...' + context : context,
          timestamp: msg.timestamp
        };
      });
    
    return matches;
  };

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.title.toLowerCase().includes(query) ||
        conv.messages.some(msg => msg.text.toLowerCase().includes(query)) ||
        conv.topicsExplored.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Topic filter
    if (filters.topic) {
      filtered = filtered.filter(conv => conv.topicsExplored.includes(filters.topic));
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      const ranges = {
        'today': 1,
        'week': 7,
        'month': 30,
        'year': 365
      };
      
      const days = ranges[filters.dateRange as keyof typeof ranges];
      if (days) {
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(conv => conv.updatedAt >= cutoffDate);
      }
    }

    // Additional filters
    if (filters.filterBy !== 'all') {
      switch (filters.filterBy) {
        case 'recent':
          const recentDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(conv => conv.updatedAt >= recentDate);
          break;
        case 'long':
          filtered = filtered.filter(conv => conv.messageCount >= 10);
          break;
        case 'short':
          filtered = filtered.filter(conv => conv.messageCount < 5);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'messageCount':
          comparison = a.messageCount - b.messageCount;
          break;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [conversations, filters]);

  // Generate search results with relevance scoring
  const searchResults = useMemo(() => {
    if (!filters.query.trim()) return [];
    
    const results: SearchResult[] = filteredConversations.map(conversation => {
      const relevanceScore = calculateRelevanceScore(conversation, filters.query);
      const matchedMessages = conversation.messages
        .filter(msg => msg.text.toLowerCase().includes(filters.query.toLowerCase()))
        .map(msg => ({
          id: msg.id,
          text: msg.text,
          isUser: msg.isUser,
          timestamp: msg.timestamp,
          highlightedText: highlightText(msg.text, filters.query)
        }));
      
      return {
        conversation,
        matchedMessages,
        relevanceScore
      };
    });

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [filteredConversations, filters.query]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query.trim()) count++;
    if (filters.topic) count++;
    if (filters.dateRange) count++;
    if (filters.filterBy !== 'all') count++;
    return count;
  }, [filters]);

  // Debounced search effect
  useEffect(() => {
    if (filters.query.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [filters.query]);

  // Action functions
  const setQuery = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const setTopic = (topic: string) => {
    setFilters(prev => ({ ...prev, topic }));
  };

  const setDateRange = (dateRange: string) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const setFilterBy = (filterBy: SearchFilters['filterBy']) => {
    setFilters(prev => ({ ...prev, filterBy }));
  };

  const setSortBy = (sortBy: SearchFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const setSortOrder = (sortOrder: SearchFilters['sortOrder']) => {
    setFilters(prev => ({ ...prev, sortOrder }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      topic: '',
      dateRange: '',
      filterBy: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, query: '' }));
  };

  return {
    searchResults,
    filteredConversations,
    filters,
    activeFilterCount,
    isSearching,
    setQuery,
    setTopic,
    setDateRange,
    setFilterBy,
    setSortBy,
    setSortOrder,
    clearFilters,
    clearSearch,
    searchInConversation,
    getAllTopics
  };
};