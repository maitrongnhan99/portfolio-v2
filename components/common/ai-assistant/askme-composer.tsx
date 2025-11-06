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
    <div className="border-t border-navy-lighter bg-navy/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-3">
          <TooltipProvider>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
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
                      {chatSettings.autoSave ? "Auto-save ON" : "Auto-save OFF"}
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
