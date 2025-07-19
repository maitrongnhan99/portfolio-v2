"use client";

import { ChatInput, ChatMessage, TypingIndicator } from "@/components/common/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Suspense, lazy, useCallback, useEffect, useRef } from "react";
import { ConnectionStatus } from "@/components/common/chat/connection-status";
import { ChatHeader } from "@/components/common/chat/chat-header";
import { ChatControlsToggle } from "@/components/common/chat/chat-controls-toggle";
import { ChatControlsSidebar } from "@/components/common/chat/chat-controls-sidebar";
import { ChatSettings } from "@/components/common/chat/chat-settings";
import {
  WelcomeLoadingSkeleton,
  SuggestionsLoadingSkeleton,
  ProgressLoadingSkeleton,
} from "@/components/common/chat/loading-skeletons";
import { useConversationHistory, type Conversation } from "@/hooks/use-conversation-history";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { ChatProvider, useChatContext } from "@/contexts/chat-context";
import {
  getConversationHistory,
  createUpdatedConversation,
  shouldAutoSave,
} from "@/lib/chat-utils";
import { ArrowDown } from "@phosphor-icons/react";

// Lazy load heavy components
const AnimatedWelcome = lazy(() =>
  import("@/components/common/chat/animated-welcome").then((module) => ({
    default: module.AnimatedWelcome,
  }))
);
const EnhancedSuggestions = lazy(() =>
  import("@/components/common/chat/enhanced-suggestions").then((module) => ({
    default: module.EnhancedSuggestions,
  }))
);
const ConversationProgress = lazy(() =>
  import("@/components/common/chat/conversation-progress").then((module) => ({
    default: module.ConversationProgress,
  }))
);
const QuickActions = lazy(() =>
  import("@/components/common/chat/quick-actions").then((module) => ({
    default: module.QuickActions,
  }))
);


export default function AskMePage() {
  return (
    <ChatProvider>
      <AskMePageContent />
    </ChatProvider>
  );
}

function AskMePageContent() {
  const {
    showWelcome,
    setShowWelcome,
    showEnhancedSuggestions,
    setShowEnhancedSuggestions,
    conversationMetadata,
    setConversationMetadata,
    updateTopicsExplored,
    incrementUserMessageCount,
    chatSettings,
    toggleStreaming,
    toggleAutoSave,
    showSearchDialog,
    setShowSearchDialog,
    showControlsSidebar,
    setShowControlsSidebar,
  } = useChatContext();

  const {
    messages,
    isTyping,
    streamingState,
    addUserMessage,
    handleStreamingMessage,
    handleNonStreamingMessage,
    detectTopic,
    clearMessages,
    loadMessages,
  } = useChatMessages();

  const {
    scrollState,
    scrollViewportRef,
    messagesEndRef,
    scrollToBottom,
    resetScrollTracking,
  } = useChatScroll(messages, isTyping);

  const { status: connectionStatus } = useConnectionStatus();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchDialog(true);
      }
      // Cmd/Ctrl + S - Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (messages.length > 0) {
          handleSaveConversation();
        }
      }
      // Cmd/Ctrl + N - New conversation
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleNewConversation();
      }
      // Cmd/Ctrl + / - Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowControlsSidebar(!showControlsSidebar);
      }
      // Escape - Close sidebar
      if (e.key === 'Escape' && showControlsSidebar) {
        setShowControlsSidebar(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [messages.length, showControlsSidebar, setShowSearchDialog, setShowControlsSidebar, handleSaveConversation, handleNewConversation]);

  // Conversation history integration
  const {
    conversations,
    currentConversation,
    isLoading: isHistoryLoading,
    error: historyError,
    createConversation,
    loadConversation,
    saveConversation,
    deleteConversation,
    addMessage,
    updateMessage,
  } = useConversationHistory();

  // Track loaded conversation to prevent duplicate loads
  const loadedConversationRef = useRef<string | null>(null);

  // Handle welcome animation completion
  const handleWelcomeComplete = () => {
    setShowEnhancedSuggestions(true);
  };

  // Initialize a new conversation when the page loads (optional)
  useEffect(() => {
    // Only create conversation if the history system is loaded
    if (!isHistoryLoading && !currentConversation && createConversation) {
      createConversation("New Conversation").catch(console.error);
    }
  }, [isHistoryLoading, currentConversation, createConversation]);

  // Load conversation messages into the current state
  useEffect(() => {
    if (currentConversation && loadedConversationRef.current !== currentConversation.id) {
      loadedConversationRef.current = currentConversation.id;
      
      const conversationMessages = currentConversation.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      loadMessages(conversationMessages);
      setConversationMetadata({
        topicsExplored: currentConversation.topicsExplored || [],
        userMessageCount: conversationMessages.filter((msg) => msg.isUser).length,
        conversationStartTime: currentConversation.createdAt,
      });

      // Show welcome only if no messages exist
      if (conversationMessages.length === 0) {
        setShowWelcome(true);
        setShowEnhancedSuggestions(false);
      } else {
        setShowWelcome(false);
        setShowEnhancedSuggestions(false);
      }
    }
  }, [currentConversation, loadMessages, setConversationMetadata, setShowWelcome, setShowEnhancedSuggestions]);

  // Removed auto-save useEffect to prevent circular dependency

  // Manual save function (optional - only if conversation system is available)
  const handleSaveConversation = useCallback(async () => {
    if (currentConversation && saveConversation) {
      try {
        const updatedConversation = createUpdatedConversation(
          currentConversation,
          messages,
          conversationMetadata.topicsExplored
        );
        await saveConversation(updatedConversation);
        console.log("Conversation saved successfully");
      } catch (error) {
        console.error("Failed to save conversation:", error);
      }
    }
  }, [currentConversation, saveConversation, messages, conversationMetadata.topicsExplored]);

  // Clear current conversation
  const handleClearConversation = async () => {
    try {
      // Clear messages and reset state regardless of conversation system
      clearMessages();
      setConversationMetadata({
        topicsExplored: [],
        userMessageCount: 0,
        conversationStartTime: null,
      });
      setShowWelcome(true);
      setShowEnhancedSuggestions(false);
      
      // Only delete from history if conversation system is available
      if (currentConversation && deleteConversation) {
        await deleteConversation(currentConversation.id);
        // Create a new conversation
        if (createConversation) {
          await createConversation("New Conversation");
        }
      }
    } catch (error) {
      console.error("Failed to clear conversation:", error);
    }
  };

  // Start new conversation
  const handleNewConversation = useCallback(async () => {
    try {
      // Save current conversation if it has messages
      if (currentConversation && messages.length > 0) {
        await handleSaveConversation();
      }

      // Create new conversation
      await createConversation("New Conversation");

      // Reset state
      clearMessages();
      setConversationMetadata({
        topicsExplored: [],
        userMessageCount: 0,
        conversationStartTime: null,
      });
      setShowWelcome(true);
      setShowEnhancedSuggestions(false);
    } catch (error) {
      console.error("Failed to start new conversation:", error);
    }
  }, [currentConversation, messages.length, handleSaveConversation, createConversation, clearMessages, setConversationMetadata, setShowWelcome, setShowEnhancedSuggestions]);

  // Handle conversation selection from search
  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      // Save current conversation if it has messages
      if (currentConversation && messages.length > 0) {
        await handleSaveConversation();
      }

      // Load the selected conversation
      await loadConversation(conversation.id);

      // Close search dialog
      setShowSearchDialog(false);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };


  const handleSendMessage = async (text: string) => {
    // Hide welcome elements after first user interaction
    setShowWelcome(false);
    setShowEnhancedSuggestions(false);

    // Reset scroll tracking when user sends a message
    resetScrollTracking();

    // Track conversation start time
    if (!conversationMetadata.conversationStartTime) {
      setConversationMetadata({
        ...conversationMetadata,
        conversationStartTime: new Date(),
      });
    }

    // Detect and track topics
    const detectedTopic = detectTopic(text);
    if (detectedTopic) {
      updateTopicsExplored(detectedTopic);
    }

    // Increment user message count
    incrementUserMessageCount();

    // Add user message
    addUserMessage(text);

    // Get conversation history for context
    const conversationHistory = getConversationHistory(messages);

    // Use streaming or non-streaming based on preference
    if (chatSettings.useStreaming) {
      await handleStreamingMessage(text, conversationHistory);
    } else {
      await handleNonStreamingMessage(text, conversationHistory);
    }
  };


  return (
    <main
      className="h-screen bg-navy flex flex-col"
      style={{ backgroundColor: "#0b192f" }}
    >
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Header with ChatHeader and Controls Toggle */}
      <div className="border-b border-navy-lighter bg-navy-light/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <ChatHeader currentConversation={currentConversation} />
          <ChatControlsToggle
            isOpen={showControlsSidebar}
            onClick={() => setShowControlsSidebar(!showControlsSidebar)}
          />
        </div>
      </div>

      {/* Controls Sidebar */}
      <ChatControlsSidebar
        isOpen={showControlsSidebar}
        onOpenChange={setShowControlsSidebar}
        conversations={conversations}
        currentConversation={currentConversation}
        messages={messages}
        showSearchDialog={showSearchDialog}
        setShowSearchDialog={setShowSearchDialog}
        onSaveConversation={handleSaveConversation}
        onNewConversation={handleNewConversation}
        onClearMessages={handleClearConversation}
        chatSettings={chatSettings}
        isOnline={connectionStatus.isOnline}
      />

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <ScrollArea ref={scrollViewportRef} className="flex-1">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Show welcome animation and enhanced suggestions when no conversation started */}
            {showWelcome && (
              <Suspense fallback={<WelcomeLoadingSkeleton />}>
                <AnimatedWelcome onComplete={handleWelcomeComplete} />
              </Suspense>
            )}

            {showEnhancedSuggestions && (
              <Suspense fallback={<SuggestionsLoadingSkeleton />}>
                <EnhancedSuggestions
                  onSendMessage={handleSendMessage}
                  timestamp={new Date()}
                />
                <QuickActions
                  onSendMessage={handleSendMessage}
                  isVisible={true}
                />
              </Suspense>
            )}

            {/* Show conversation progress after first message */}
            {conversationMetadata.conversationStartTime && conversationMetadata.userMessageCount > 0 && (
              <Suspense fallback={<ProgressLoadingSkeleton />}>
                <ConversationProgress
                  messageCount={conversationMetadata.userMessageCount}
                  conversationStartTime={conversationMetadata.conversationStartTime}
                  topicsExplored={conversationMetadata.topicsExplored}
                  isVisible={true}
                />
              </Suspense>
            )}

            {/* Show conversation messages */}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                isStreaming={message.isStreaming}
                streamingComplete={message.streamingComplete}
                sources={message.sources}
              />
            ))}

            {isTyping && <TypingIndicator />}
            {streamingState.isStreaming && !isTyping && (
              <div className="flex items-center gap-2 text-sm text-slate/70 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Streaming response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Scroll to bottom button */}
        {scrollState.showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 w-10 h-10 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
            title="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5 text-primary" />
          </motion.button>
        )}

        {/* Chat Input */}
        <div className="border-t border-navy-lighter bg-navy/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            {/* Controls */}
            <div className="flex items-end justify-between mb-3">
              <div className="flex items-center gap-4">
                {/* Streaming toggle */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleStreaming}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      chatSettings.useStreaming
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-slate/10 text-slate border border-slate/20"
                    }`}
                  >
                    {chatSettings.useStreaming ? "Streaming ON" : "Streaming OFF"}
                  </button>
                  <span className="text-xs text-slate/50">
                    {chatSettings.useStreaming
                      ? "Real-time responses"
                      : "Complete responses"}
                  </span>
                </div>

                {/* Auto-save toggle */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleAutoSave}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      chatSettings.autoSave
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-slate/10 text-slate border border-slate/20"
                    }`}
                  >
                    {chatSettings.autoSave ? "Auto-save ON" : "Auto-save OFF"}
                  </button>
                  <span className="text-xs text-slate/50">
                    {chatSettings.autoSave ? "Saves automatically" : "Manual save only"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <ConnectionStatus showDetails={true} />
              </div>
            </div>

            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isTyping || streamingState.isStreaming}
              placeholder="Ask me about Mai's skills, experience, projects, or anything else..."
            />
          </div>
        </div>
      </div>
    </main>
  );
}
