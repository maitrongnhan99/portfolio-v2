"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ChatSettings, ConversationMetadata } from "@/types/chat";

interface ChatContextValue {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  showEnhancedSuggestions: boolean;
  setShowEnhancedSuggestions: (show: boolean) => void;
  conversationMetadata: ConversationMetadata;
  setConversationMetadata: (metadata: ConversationMetadata) => void;
  updateTopicsExplored: (topic: string) => void;
  incrementUserMessageCount: () => void;
  chatSettings: ChatSettings;
  setChatSettings: (settings: ChatSettings) => void;
  toggleStreaming: () => void;
  toggleAutoSave: () => void;
  showSearchDialog: boolean;
  setShowSearchDialog: (show: boolean) => void;
  showControlsSidebar: boolean;
  setShowControlsSidebar: (show: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEnhancedSuggestions, setShowEnhancedSuggestions] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showControlsSidebar, setShowControlsSidebar] = useState(false);
  
  const [conversationMetadata, setConversationMetadata] = useState<ConversationMetadata>({
    conversationStartTime: null,
    topicsExplored: [],
    userMessageCount: 0,
  });

  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    useStreaming: true,
    autoSave: true,
  });

  const updateTopicsExplored = useCallback((topic: string) => {
    setConversationMetadata((prev) => {
      if (!prev.topicsExplored.includes(topic)) {
        return {
          ...prev,
          topicsExplored: [...prev.topicsExplored, topic],
        };
      }
      return prev;
    });
  }, []);

  const incrementUserMessageCount = useCallback(() => {
    setConversationMetadata((prev) => ({
      ...prev,
      userMessageCount: prev.userMessageCount + 1,
    }));
  }, []);

  const toggleStreaming = useCallback(() => {
    setChatSettings((prev) => ({
      ...prev,
      useStreaming: !prev.useStreaming,
    }));
  }, []);

  const toggleAutoSave = useCallback(() => {
    setChatSettings((prev) => ({
      ...prev,
      autoSave: !prev.autoSave,
    }));
  }, []);

  const value: ChatContextValue = {
    showWelcome,
    setShowWelcome,
    showEnhancedSuggestions,
    setShowEnhancedSuggestions,
    conversationMetadata,
    setConversationMetadata,
    updateTopicsExplored,
    incrementUserMessageCount,
    chatSettings,
    setChatSettings,
    toggleStreaming,
    toggleAutoSave,
    showSearchDialog,
    setShowSearchDialog,
    showControlsSidebar,
    setShowControlsSidebar,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}