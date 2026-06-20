"use client";

import { ChatInput, type ChatInputRef } from "@/components/common/chat";
import { ConnectionStatus } from "@/components/common/chat/connection-status";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC, RefObject } from "react";

type ChatSettings = {
  useStreaming: boolean;
  autoSave: boolean;
};

type StreamingState = { isStreaming: boolean };

type AskMeComposerProps = {
  chatInputRef: RefObject<ChatInputRef | null>;
  onSendMessage: (text: string) => Promise<void> | void;
  isTyping: boolean;
  streamingState: StreamingState;
  chatSettings: ChatSettings;
  toggleStreaming: () => void;
  toggleAutoSave: () => void;
};

const AskMeComposer: FC<AskMeComposerProps> = ({
  chatInputRef,
  onSendMessage,
  isTyping,
  streamingState,
  chatSettings,
  toggleStreaming,
  toggleAutoSave,
}) => {
  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-3">
          <TooltipProvider>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleStreaming}
                    className={`px-3 sm:px-4 py-1.5 rounded-pill text-xs font-mono transition-all ${
                      chatSettings.useStreaming
                        ? "bg-canvas-warm text-text-primary border border-borderSubtle shadow-warm-lift"
                        : "bg-canvas-near text-text-secondary border border-borderSubtle"
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
                <TooltipContent className="bg-popover border-border shadow-outline-ring rounded-lg">
                  <p className="text-xs text-text-muted">
                    {chatSettings.useStreaming
                      ? "Real-time responses"
                      : "Complete responses"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleAutoSave}
                    className={`px-3 sm:px-4 py-1.5 rounded-pill text-xs font-mono transition-all ${
                      chatSettings.autoSave
                        ? "bg-canvas-warm text-text-primary border border-borderSubtle shadow-warm-lift"
                        : "bg-canvas-near text-text-secondary border border-borderSubtle"
                    }`}
                  >
                    <span className="sm:hidden">
                      {chatSettings.autoSave ? "Auto" : "Manual"}
                    </span>
                    <span className="hidden sm:inline">
                      {chatSettings.autoSave ? "Auto-save ON" : "Auto-save OFF"}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-popover border-border shadow-outline-ring rounded-lg">
                  <p className="text-xs text-text-muted">
                    {chatSettings.autoSave
                      ? "Saves automatically"
                      : "Manual save only"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <div className="flex flex-col items-center gap-2">
            <ConnectionStatus showDetails={true} defaultShowStatusBar={false} />
          </div>
        </div>

        <ChatInput
          ref={chatInputRef}
          onSendMessage={onSendMessage}
          disabled={isTyping || streamingState.isStreaming}
          placeholder="Ask me about Mai's skills, experience, projects, or anything else..."
        />
      </div>
    </div>
  );
};

export { AskMeComposer };
