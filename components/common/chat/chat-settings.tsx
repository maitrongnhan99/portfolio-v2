"use client";

import { ConnectionStatus } from "@/components/common/chat/connection-status";
import { ChatSettings as ChatSettingsType } from "@/types/chat";
import React from "react";

interface ChatSettingsProps {
  settings: ChatSettingsType;
  onToggleStreaming: () => void;
  onToggleAutoSave: () => void;
}

export const ChatSettings = React.memo(
  ({ settings, onToggleStreaming, onToggleAutoSave }: ChatSettingsProps) => {
    return (
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-center gap-4">
          {/* Streaming toggle */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onToggleStreaming}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                settings.useStreaming
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-slate/10 text-slate border border-slate/20"
              }`}
            >
              {settings.useStreaming ? "Streaming ON" : "Streaming OFF"}
            </button>
            <span className="text-xs text-slate/50">
              {settings.useStreaming
                ? "Real-time responses"
                : "Complete responses"}
            </span>
          </div>

          {/* Auto-save toggle */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onToggleAutoSave}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                settings.autoSave
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-slate/10 text-slate border border-slate/20"
              }`}
            >
              {settings.autoSave ? "Auto-save ON" : "Auto-save OFF"}
            </button>
            <span className="text-xs text-slate/50">
              {settings.autoSave ? "Saves automatically" : "Manual save only"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ConnectionStatus showDetails={true} defaultShowStatusBar={false} />
        </div>
      </div>
    );
  }
);

ChatSettings.displayName = "ChatSettings";
