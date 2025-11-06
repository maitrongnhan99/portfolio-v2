"use client";

import { AskMeComposer } from "@/components/common/ai-assistant/askme-composer";
import { AskMeDeleteModal } from "@/components/common/ai-assistant/askme-delete-modal";
import { AskMeHeaderBar } from "@/components/common/ai-assistant/askme-header-bar";
import { AskMeKeyboardShortcuts } from "@/components/common/ai-assistant/askme-keyboard-shortcuts";
import { AskMeMessagesView } from "@/components/common/ai-assistant/askme-messages-view";
import { type ChatInputRef } from "@/components/common/chat";
import { ChatControlsSidebar } from "@/components/common/chat/chat-controls-sidebar";
import { AskMeStructuredData } from "@/components/common/seo/ask-me-structured-data";
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
import { lazy, useCallback, useEffect, useRef, useState } from "react";

// Lazy load heavy components (kept for types/consumers still in this file)
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
const ProjectShowcase = lazy(() =>
  import("@/components/common/chat/project-showcase").then((module) => ({
    default: module.ProjectShowcase,
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
      <AskMeHeaderBar
        currentConversation={currentConversation}
        isSidebarOpen={showControlsSidebar}
        onToggleSidebar={() => setShowControlsSidebar(!showControlsSidebar)}
      />

      <AskMeKeyboardShortcuts
        messagesLength={messages.length}
        isSidebarOpen={showControlsSidebar}
        setShowSearchDialog={setShowSearchDialog}
        setShowControlsSidebar={setShowControlsSidebar}
        onSaveConversation={handleSaveConversation}
        onNewConversation={handleNewConversation}
      />

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

      <AskMeMessagesView
        showWelcome={showWelcome}
        showEnhancedSuggestions={showEnhancedSuggestions}
        conversationMetadata={conversationMetadata}
        messages={messages}
        isTyping={isTyping}
        streamingState={streamingState}
        onSendMessage={handleSendMessage}
        scrollViewportRef={scrollViewportRef}
        messagesEndRef={messagesEndRef}
        scrollState={scrollState}
        scrollToBottom={scrollToBottom}
        onWelcomeComplete={handleWelcomeComplete}
      />

      <AskMeComposer
        chatInputRef={chatInputRef}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        streamingState={streamingState}
        chatSettings={chatSettings}
        toggleStreaming={toggleStreaming}
        toggleAutoSave={toggleAutoSave}
      />

      {/* Delete Confirmation Modal */}
      {deleteConversationId && (
        <AskMeDeleteModal
          open={!!deleteConversationId}
          onOpenChange={(open) => !open && setDeleteConversationId(null)}
          conversationTitle={
            conversations.find((c) => c.id === deleteConversationId)?.title
          }
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConversationId(null)}
          isDeleting={isDeleting}
        />
      )}
    </main>
  );
}
