"use client";

import { ChatMessage, TypingIndicator } from "@/components/common/chat";
import {
  SuggestionsLoadingSkeleton,
  WelcomeLoadingSkeleton,
} from "@/components/common/chat/loading-skeletons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { ArrowDownIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { FC, Suspense, lazy, useEffect } from "react";
import { Container } from "@/components/ui/container";

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

type ScrollState = {
  showScrollButton: boolean;
};

type AskMeMessagesViewProps = {
  showWelcome: boolean;
  showEnhancedSuggestions: boolean;
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
        <Container size="narrow" className="py-4 sm:py-6">
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

          <div ref={messagesEndRef} />
        </Container>
      </ScrollArea>

      {scrollState.showScrollButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 w-10 h-10 bg-background/80 hover:bg-secondary border border-border rounded-full flex items-center justify-center transition-all duration-200 shadow-card"
          title="Scroll to bottom"
        >
          <ArrowDownIcon className="w-5 h-5 text-foreground" />
        </motion.button>
      )}
    </div>
  );
};

export { AskMeMessagesView };
