"use client";

import {
  ChatInput,
  ChatMessage,
  TypingIndicator,
  type ChatInputRef,
} from "@/components/common/chat";
import { ChatControlsSidebar } from "@/components/common/chat/chat-controls-sidebar";
import { ChatControlsToggle } from "@/components/common/chat/chat-controls-toggle";
import { ChatHeader } from "@/components/common/chat/chat-header";
import { ConnectionStatus } from "@/components/common/chat/connection-status";
import {
  ProgressLoadingSkeleton,
  SuggestionsLoadingSkeleton,
  WelcomeLoadingSkeleton,
} from "@/components/common/chat/loading-skeletons";
import { AskMeStructuredData } from "@/components/common/seo/ask-me-structured-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatProvider, useChatContext } from "@/contexts/chat-context";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import {
  useConversationHistory,
  type Conversation,
} from "@/hooks/use-conversation-history";
import {
  createUpdatedConversation,
  getConversationHistory,
} from "@/lib/chat-utils";
import { ArrowDownIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
const DeleteConfirmModal = lazy(() =>
  import("@/components/common/chat/delete-confirm-modal").then((module) => ({
    default: module.DeleteConfirmModal,
  }))
);

export default function AskMePage() {
  return (
    <>
      <AskMeStructuredData />
      <ChatProvider>
        <AskMePageContent />
      </ChatProvider>
    </>
  );
}

function AskMePageContent() {
  const chatInputRef = useRef<ChatInputRef>(null);
  
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

  // State for delete confirmation modal
  const [deleteConversationId, setDeleteConversationId] = useState<
    string | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (
      currentConversation &&
      loadedConversationRef.current !== currentConversation.id
    ) {
      loadedConversationRef.current = currentConversation.id;

      const conversationMessages = currentConversation.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      loadMessages(conversationMessages);
      setConversationMetadata({
        topicsExplored: currentConversation.topicsExplored || [],
        userMessageCount: conversationMessages.filter((msg) => msg.isUser)
          .length,
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
  }, [
    currentConversation,
    loadMessages,
    setConversationMetadata,
    setShowWelcome,
    setShowEnhancedSuggestions,
  ]);

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
  }, [
    currentConversation,
    saveConversation,
    messages,
    conversationMetadata.topicsExplored,
  ]);

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
  }, [
    currentConversation,
    messages.length,
    handleSaveConversation,
    createConversation,
    clearMessages,
    setConversationMetadata,
    setShowWelcome,
    setShowEnhancedSuggestions,
  ]);

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

  // Handle loading a conversation from the sidebar
  const handleLoadConversation = async (conversationId: string) => {
    try {
      // Save current conversation if it has messages
      if (
        currentConversation &&
        messages.length > 0 &&
        currentConversation.id !== conversationId
      ) {
        await handleSaveConversation();
      }

      // Load the selected conversation
      const loadedConversation = await loadConversation(conversationId);

      if (loadedConversation) {
        // Clear current messages and load new ones
        clearMessages();

        // Load messages from the conversation
        if (
          loadedConversation.messages &&
          loadedConversation.messages.length > 0
        ) {
          loadMessages(
            loadedConversation.messages.map((msg) => ({
              id: msg.id,
              text: msg.text,
              isUser: msg.isUser,
              timestamp: new Date(msg.timestamp),
              sources: msg.sources,
            }))
          );
        }

        // Update conversation metadata
        setConversationMetadata({
          conversationStartTime: new Date(loadedConversation.createdAt),
          topicsExplored: loadedConversation.topicsExplored || [],
          userMessageCount: loadedConversation.messageCount || 0,
        });

        // Hide welcome screens
        setShowWelcome(false);
        setShowEnhancedSuggestions(false);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  // Handle deleting a conversation - opens modal
  const handleDeleteConversation = async (conversationId: string) => {
    setDeleteConversationId(conversationId);
  };

  // Confirm and execute deletion
  const confirmDelete = async () => {
    if (!deleteConversationId) return;

    setIsDeleting(true);
    try {
      // Delete the conversation
      await deleteConversation(deleteConversationId);

      // If deleted conversation was current, clear messages
      if (currentConversation?.id === deleteConversationId) {
        handleClearConversation();
      }

      setDeleteConversationId(null);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    // Focus the input when a suggestion is clicked
    chatInputRef.current?.focus();
    
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchDialog(true);
      }
      // Cmd/Ctrl + S - Save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (messages.length > 0) {
          handleSaveConversation();
        }
      }
      // Cmd/Ctrl + N - New conversation
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        handleNewConversation();
      }
      // Cmd/Ctrl + / - Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowControlsSidebar(!showControlsSidebar);
      }
      // Escape - Close sidebar
      if (e.key === "Escape" && showControlsSidebar) {
        setShowControlsSidebar(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    messages.length,
    showControlsSidebar,
    setShowSearchDialog,
    setShowControlsSidebar,
    handleSaveConversation,
    handleNewConversation,
  ]);

  return (
    <main
      className="h-screen bg-navy flex flex-col"
      style={{ backgroundColor: "#0b192f" }}
    >
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Header with ChatHeader and Controls Toggle */}
      <div className="border-b border-navy-lighter bg-navy-light/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <ChatHeader currentConversation={currentConversation} />
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="relative p-2.5 rounded-lg bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Back to Portfolio"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <ChatControlsToggle
              isOpen={showControlsSidebar}
              onClick={() => setShowControlsSidebar(!showControlsSidebar)}
            />
          </div>
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
        onLoadConversation={handleLoadConversation}
        onDeleteConversation={handleDeleteConversation}
        chatSettings={chatSettings}
        isOnline={connectionStatus.isOnline}
      />

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <ScrollArea ref={scrollViewportRef} className="flex-1">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
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
            {conversationMetadata.conversationStartTime &&
              conversationMetadata.userMessageCount > 0 && (
                <Suspense fallback={<ProgressLoadingSkeleton />}>
                  <ConversationProgress
                    messageCount={conversationMetadata.userMessageCount}
                    conversationStartTime={
                      conversationMetadata.conversationStartTime
                    }
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
            <ArrowDownIcon className="w-5 h-5 text-primary" />
          </motion.button>
        )}

        {/* Chat Input */}
        <div className="border-t border-navy-lighter bg-navy/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-w-4xl mx-auto">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-3">
              <TooltipProvider>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  {/* Streaming toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleStreaming}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-mono transition-all ${
                          chatSettings.useStreaming
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-slate/10 text-slate border border-slate/20"
                        }`}
                      >
                        <span className="sm:hidden">
                          {chatSettings.useStreaming ? "Stream" : "No Stream"}
                        </span>
                        <span className="hidden sm:inline">
                          {chatSettings.useStreaming
                            ? "Streaming ON"
                            : "Streaming OFF"}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-navy-light border-navy-lighter">
                      <p className="text-xs text-slate-light">
                        {chatSettings.useStreaming
                          ? "Real-time responses"
                          : "Complete responses"}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Auto-save toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleAutoSave}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-mono transition-all ${
                          chatSettings.autoSave
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-slate/10 text-slate border border-slate/20"
                        }`}
                      >
                        <span className="sm:hidden">
                          {chatSettings.autoSave ? "Auto" : "Manual"}
                        </span>
                        <span className="hidden sm:inline">
                          {chatSettings.autoSave
                            ? "Auto-save ON"
                            : "Auto-save OFF"}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-navy-light border-navy-lighter">
                      <p className="text-xs text-slate-light">
                        {chatSettings.autoSave
                          ? "Saves automatically"
                          : "Manual save only"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <div className="flex flex-col items-center gap-2">
                <ConnectionStatus
                  showDetails={true}
                  defaultShowStatusBar={false}
                />
              </div>
            </div>

            <ChatInput
              ref={chatInputRef}
              onSendMessage={handleSendMessage}
              disabled={isTyping || streamingState.isStreaming}
              placeholder="Ask me about Mai's skills, experience, projects, or anything else..."
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConversationId && (
        <Suspense fallback={null}>
          <DeleteConfirmModal
            open={!!deleteConversationId}
            onOpenChange={(open) => !open && setDeleteConversationId(null)}
            conversationTitle={
              conversations.find((c) => c.id === deleteConversationId)?.title
            }
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConversationId(null)}
            isDeleting={isDeleting}
          />
        </Suspense>
      )}
    </main>
  );
}
