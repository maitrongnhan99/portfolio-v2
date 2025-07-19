"use client";

import { useState, useMemo, useCallback } from 'react';
import type { Conversation } from './use-conversation-history';

export interface SearchResult {
  conversation: Conversation;
  matchType: 'title' | 'message' | 'topic';
  matchingMessages: Array<{
    id: string;
    text: string;
    isUser: boolean;
  }>;
  relevance: number;
}

export const useSidebarSearch = (conversations: Conversation[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: (SearchResult | null)[] = conversations.map(conv => {
      // Search in title
      const titleMatch = conv.title.toLowerCase().includes(query);
      
      // Search in messages
      const matchingMessages = conv.messages.filter(msg => 
        msg.text.toLowerCase().includes(query)
      );
      
      // Search in topics
      const topicMatch = conv.topicsExplored?.some(topic => 
        topic.toLowerCase().includes(query)
      );
      
      if (titleMatch || matchingMessages.length > 0 || topicMatch) {
        return {
          conversation: conv,
          matchType: titleMatch ? 'title' as const : matchingMessages.length > 0 ? 'message' as const : 'topic' as const,
          matchingMessages: matchingMessages.map(msg => ({
            id: msg.id,
            text: msg.text,
            isUser: msg.isUser,
          })),
          relevance: titleMatch ? 3 : matchingMessages.length > 0 ? 2 : 1
        };
      }
      return null;
    });

    return results
      .filter((result): result is SearchResult => result !== null)
      .sort((a, b) => b.relevance - a.relevance);
  }, [conversations, searchQuery]);

  const handleKeyNavigation = useCallback((key: string) => {
    switch (key) {
      case 'ArrowUp':
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
        setSelectedIndex(prev => Math.min(searchResults.length - 1, prev + 1));
        break;
      case 'Home':
        setSelectedIndex(0);
        break;
      case 'End':
        setSelectedIndex(searchResults.length - 1);
        break;
    }
  }, [searchResults.length]);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedIndex,
    setSelectedIndex,
    handleKeyNavigation,
    resetSearch,
  };
};