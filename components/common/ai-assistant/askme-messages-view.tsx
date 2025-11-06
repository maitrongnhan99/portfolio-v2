"use client";

import { ChatMessage, TypingIndicator } from "@/components/common/chat";
import {
  ProgressLoadingSkeleton,
  SuggestionsLoadingSkeleton,
  WelcomeLoadingSkeleton,
} from "@/components/common/chat/loading-skeletons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { ArrowDownIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { FC, Suspense, lazy, useEffect } from "react";

const AnimatedWelcome = lazy(() =>
  import("@/components/common/chat/animated-welcome").then((m) => ({
    default: m.AnimatedWelcome,
  }))
);
const EnhancedSuggestions = lazy(() =>
  import("@/components/common/chat/enhanced-suggestions").then((m) => ({
    default: m.EnhancedSuggestions,
  }))
);
const ConversationProgress = lazy(() =>
  import("@/components/common/chat/conversation-progress").then((m) => ({
    default: m.ConversationProgress,
  }))
);
const QuickActions = lazy(() =>
  import("@/components/common/chat/quick-actions").then((m) => ({
    default: m.QuickActions,
  }))
);
const ProjectShowcase = lazy(() =>
  import("@/components/common/chat/project-showcase").then((m) => ({
    default: m.ProjectShowcase,
  }))
);

type StreamingState = { isStreaming: boolean };

type ConversationMetadata = {
  topicsExplored: string[];
  userMessageCount: number;
  conversationStartTime: Date | null;
};

type ScrollState = {
  showScrollButton: boolean;
};

type AskMeMessagesViewProps = {
  showWelcome: boolean;
  showEnhancedSuggestions: boolean;
  conversationMetadata: ConversationMetadata;
  messages: Message[];
  isTyping: boolean;
  streamingState: StreamingState;
  onSendMessage: (text: string) => Promise<void> | void;
  scrollViewportRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollState: ScrollState;
  scrollToBottom: () => void;
  onWelcomeComplete: () => void;
};

const AskMeMessagesView: FC<AskMeMessagesViewProps> = ({
  showWelcome,
  showEnhancedSuggestions,
  conversationMetadata,
  messages,
  isTyping,
  streamingState,
  onSendMessage,
  scrollViewportRef,
  messagesEndRef,
  scrollState,
  scrollToBottom,
  onWelcomeComplete,
}) => {
  // Ensure we scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <ScrollArea ref={scrollViewportRef} className="flex-1">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          {showWelcome && (
            <Suspense fallback={<WelcomeLoadingSkeleton />}>
              <AnimatedWelcome onComplete={onWelcomeComplete} />
            </Suspense>
          )}

          {showEnhancedSuggestions && (
            <Suspense fallback={<SuggestionsLoadingSkeleton />}>
              <EnhancedSuggestions
                onSendMessage={onSendMessage}
                timestamp={new Date()}
              />
              <QuickActions onSendMessage={onSendMessage} isVisible={true} />
              <ProjectShowcase onSendMessage={onSendMessage} isVisible={true} />
            </Suspense>
          )}

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
    </div>
  );
};

export { AskMeMessagesView };
