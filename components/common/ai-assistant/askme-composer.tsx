"use client";

import { ChatInput, type ChatInputRef } from "@/components/common/chat";
import { Container } from "@/components/ui/container";
import { FC, RefObject } from "react";

type StreamingState = { isStreaming: boolean };

type AskMeComposerProps = {
  chatInputRef: RefObject<ChatInputRef | null>;
  onSendMessage: (text: string) => Promise<void> | void;
  isTyping: boolean;
  streamingState: StreamingState;
};

const AskMeComposer: FC<AskMeComposerProps> = ({
  chatInputRef,
  onSendMessage,
  isTyping,
  streamingState,
}) => {
  return (
    <div className="bg-background pb-4 pt-3 sm:pb-5">
      <Container size="narrow">
        <ChatInput
          ref={chatInputRef}
          onSendMessage={onSendMessage}
          disabled={isTyping || streamingState.isStreaming}
          placeholder="Ask me about Mai's skills, experience, projects, or anything else..."
        />
      </Container>
    </div>
  );
};

export { AskMeComposer };
