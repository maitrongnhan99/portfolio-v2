"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, X, Calendar, Tag, User, Robot, SortAscending, SortDescending } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Conversation } from "@/hooks/use-conversation-history";

interface ConversationSearchProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  currentConversationId?: string;
  className?: string;
}

type SortBy = 'date' | 'title' | 'messageCount';
type SortOrder = 'asc' | 'desc';
type FilterBy = 'all' | 'recent' | 'long' | 'short';

export function ConversationSearch({
  conversations,
  onSelectConversation,
  currentConversationId,
  className = ""
}: ConversationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Get all unique topics from conversations
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    conversations.forEach(conv => {
      conv.topicsExplored.forEach(topic => topics.add(topic));
    });
    return Array.from(topics).sort();
  }, [conversations]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.title.toLowerCase().includes(query) ||
        conv.messages.some(msg => msg.text.toLowerCase().includes(query)) ||
        conv.topicsExplored.some(topic => topic.toLowerCase().includes(query))
      );
    }

    // Topic filter
    if (selectedTopic) {
      filtered = filtered.filter(conv => conv.topicsExplored.includes(selectedTopic));
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      const ranges = {
        'today': 1,
        'week': 7,
        'month': 30,
        'year': 365
      };
      
      const days = ranges[dateRange as keyof typeof ranges];
      if (days) {
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(conv => conv.updatedAt >= cutoffDate);
      }
    }

    // Additional filters
    if (filterBy !== 'all') {
      switch (filterBy) {
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
      
      switch (sortBy) {
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
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [conversations, searchQuery, selectedTopic, dateRange, sortBy, sortOrder, filterBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopic("");
    setDateRange("");
    setFilterBy('all');
  };

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedTopic) count++;
    if (dateRange) count++;
    if (filterBy !== 'all') count++;
    return count;
  }, [searchQuery, selectedTopic, dateRange, filterBy]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`bg-navy-light border border-navy-lighter rounded-lg ${className}`}>
      <div className="p-4 border-b border-navy-lighter">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-lighter">Conversation History</h3>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-lighter hover:bg-navy"
            >
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate/50" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-navy border-navy-lighter text-slate-lighter placeholder:text-slate/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate/50 hover:text-slate-lighter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Topic Filter */}
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="bg-navy border-navy-lighter text-slate-lighter">
                    <SelectValue placeholder="Filter by topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-light border-navy-lighter">
                    <SelectItem value="">All topics</SelectItem>
                    {allTopics.map(topic => (
                      <SelectItem key={topic} value={topic} className="text-slate-lighter hover:bg-navy">
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Date Range Filter */}
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-navy border-navy-lighter text-slate-lighter">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-light border-navy-lighter">
                    <SelectItem value="">All dates</SelectItem>
                    <SelectItem value="today" className="text-slate-lighter hover:bg-navy">Today</SelectItem>
                    <SelectItem value="week" className="text-slate-lighter hover:bg-navy">This week</SelectItem>
                    <SelectItem value="month" className="text-slate-lighter hover:bg-navy">This month</SelectItem>
                    <SelectItem value="year" className="text-slate-lighter hover:bg-navy">This year</SelectItem>
                  </SelectContent>
                </Select>

                {/* Additional Filter */}
                <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterBy)}>
                  <SelectTrigger className="bg-navy border-navy-lighter text-slate-lighter">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-light border-navy-lighter">
                    <SelectItem value="all" className="text-slate-lighter hover:bg-navy">All conversations</SelectItem>
                    <SelectItem value="recent" className="text-slate-lighter hover:bg-navy">Recent (7 days)</SelectItem>
                    <SelectItem value="long" className="text-slate-lighter hover:bg-navy">Long (10+ messages)</SelectItem>
                    <SelectItem value="short" className="text-slate-lighter hover:bg-navy">Short (&lt;5 messages)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate/70">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                  <SelectTrigger className="w-32 bg-navy border-navy-lighter text-slate-lighter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-light border-navy-lighter">
                    <SelectItem value="date" className="text-slate-lighter hover:bg-navy">Date</SelectItem>
                    <SelectItem value="title" className="text-slate-lighter hover:bg-navy">Title</SelectItem>
                    <SelectItem value="messageCount" className="text-slate-lighter hover:bg-navy">Messages</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="text-slate-lighter hover:bg-navy"
                >
                  {sortOrder === 'asc' ? <SortAscending className="w-4 h-4" /> : <SortDescending className="w-4 h-4" />}
                </Button>
                
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-400 hover:bg-red-500/10"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-slate/50">
            <MagnifyingGlass className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No conversations found</p>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="mt-2 text-primary hover:bg-primary/10"
              >
                Clear filters to see all
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 cursor-pointer transition-colors ${
                  conversation.id === currentConversationId
                    ? 'bg-primary/10 border-l-2 border-primary'
                    : 'hover:bg-navy/50'
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-lighter truncate">{conversation.title}</h4>
                    <p className="text-sm text-slate/70 mt-1">
                      {conversation.messageCount} messages • {formatDate(conversation.updatedAt)}
                    </p>
                    {conversation.topicsExplored.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {conversation.topicsExplored.slice(0, 3).map(topic => (
                          <Badge key={topic} variant="secondary" className="text-xs bg-navy/50 text-slate/70">
                            {topic}
                          </Badge>
                        ))}
                        {conversation.topicsExplored.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-navy/50 text-slate/70">
                            +{conversation.topicsExplored.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  {conversation.id === currentConversationId && (
                    <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-2"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationSearch;