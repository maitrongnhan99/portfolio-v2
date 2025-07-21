"use client";

import { Input } from "@/components/ui/input";
import type { Conversation } from "@/hooks/use-conversation-history";
import {
  useSidebarSearch,
  type SearchResult,
} from "@/hooks/use-sidebar-search";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ChatTextIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface SidebarSearchProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
}

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  conversations,
  currentConversation,
  onLoadConversation,
  onDeleteConversation,
  onBack,
  onClose,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedIndex,
    handleKeyNavigation,
    resetSearch,
  } = useSidebarSearch(conversations);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBack();
      } else if (e.key === "Enter" && searchResults.length > 0) {
        const selectedResult = searchResults[selectedIndex];
        if (selectedResult) {
          onLoadConversation(selectedResult.conversation.id);
          onClose();
        }
      } else if (["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        handleKeyNavigation(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    searchResults,
    selectedIndex,
    handleKeyNavigation,
    onLoadConversation,
    onClose,
    onBack,
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              resetSearch();
              onBack();
            }}
            className="p-1 hover:bg-slate/10 rounded transition-colors"
            aria-label="Back to controls"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-light" />
          </button>
          <h2 className="text-slate-light font-mono text-lg">
            Search Conversations
          </h2>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-6 pt-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      {/* Search Results */}
      <div className="flex-1 px-6 overflow-hidden">
        <SearchResults
          results={searchResults}
          query={searchQuery}
          currentConversation={currentConversation}
          selectedIndex={selectedIndex}
          onSelect={(id) => {
            onLoadConversation(id);
            onClose();
          }}
          onDelete={onDeleteConversation}
        />
      </div>
    </div>
  );
};

// Search Input Component
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}> = ({ value, onChange, onClear }) => (
  <div className="relative mb-4">
    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/50" />
    <Input
      placeholder="Search messages, titles, or topics..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-10 pr-10 bg-navy border-navy-lighter text-slate-light placeholder:text-slate/50"
      autoFocus
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate/10 rounded transition-colors"
        aria-label="Clear search"
      >
        <XIcon className="w-4 h-4 text-slate/50" />
      </button>
    )}
  </div>
);

// Search Results Component
const SearchResults: React.FC<{
  results: SearchResult[];
  query: string;
  currentConversation: Conversation | null;
  selectedIndex: number;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({
  results,
  query,
  currentConversation,
  selectedIndex,
  onSelect,
  onDelete,
}) => {
  if (!query) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 text-slate/30" />
          <p className="text-sm text-slate/60">Start typing to search</p>
          <p className="text-xs text-slate/40 mt-2">
            Search in titles, messages, and topics
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate/60">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs text-slate/40 mt-2">Try different keywords</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <p className="text-xs text-slate/50 mb-3 flex-shrink-0">
        {results.length} result{results.length !== 1 ? "s" : ""}
      </p>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
        {results.map((result, index) => (
          <SearchResultItem
            key={result.conversation.id}
            result={result}
            query={query}
            isActive={currentConversation?.id === result.conversation.id}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(result.conversation.id)}
            onDelete={() => onDelete(result.conversation.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Search Result Item Component
const SearchResultItem: React.FC<{
  result: SearchResult;
  query: string;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}> = ({ result, query, isActive, isSelected, onClick, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);

  // Highlight matching text function
  const highlightText = (text: string) => {
    if (!query) return text;

    const parts = text.split(
      new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    );
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          className="bg-yellow-500/30 text-slate-light rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatMatchType = (type: SearchResult["matchType"]) => {
    switch (type) {
      case "title":
        return "in title";
      case "message":
        return "in messages";
      case "topic":
        return "in topics";
    }
  };

  return (
    <motion.div
      onHoverStart={() => setShowDelete(true)}
      onHoverEnd={() => setShowDelete(false)}
      className={cn(
        "relative px-3 py-3 rounded-md cursor-pointer transition-all",
        isActive && "bg-primary/10 border border-primary/30",
        isSelected && "ring-2 ring-primary/50",
        !isActive && "hover:bg-slate/5"
      )}
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-2">
        <ChatTextIcon className="w-4 h-4 mt-0.5 text-slate/50 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-mono text-slate-light">
            {highlightText(result.conversation.title)}
          </p>

          {result.matchType === "message" && result.matchingMessages[0] && (
            <p className="text-xs text-slate/60 mt-1 line-clamp-2">
              &ldquo;{highlightText(result.matchingMessages[0].text)}&rdquo;
            </p>
          )}

          {result.matchType === "topic" &&
            result.conversation.topicsExplored && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {result.conversation.topicsExplored
                  .slice(0, 3)
                  .map((topic, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-1.5 py-0.5 bg-navy-lighter rounded"
                    >
                      {highlightText(topic)}
                    </span>
                  ))}
              </div>
            )}

          <div className="flex items-center gap-2 text-xs text-slate/50 mt-1">
            <span>Found {formatMatchType(result.matchType)}</span>
            <span>•</span>
            <span>{result.conversation.messages.length} messages</span>
            {result.matchType === "message" &&
              result.matchingMessages.length > 1 && (
                <>
                  <span>•</span>
                  <span>{result.matchingMessages.length} matches</span>
                </>
              )}
          </div>
        </div>

        <AnimatePresence>
          {showDelete && !isActive && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute right-2 top-2 p-1 rounded hover:bg-red-500/10 transition-colors"
              aria-label="Delete conversation"
            >
              <TrashIcon className="w-3.5 h-3.5 text-red-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
