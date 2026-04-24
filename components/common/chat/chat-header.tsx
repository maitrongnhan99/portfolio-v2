"use client";

import { motion } from "framer-motion";
import { RobotIcon, SparkleIcon } from "@phosphor-icons/react";
import { Conversation } from "@/hooks/use-conversation-history";
import React from "react";

interface ChatHeaderProps {
  currentConversation: Conversation | null;
}

export const ChatHeader = React.memo(({ currentConversation }: ChatHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 sm:gap-3"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent border border-border flex items-center justify-center flex-shrink-0">
        <RobotIcon className="w-5 h-5 sm:w-6 sm:h-6 text-text-secondary" />
      </div>
      <div className="min-w-0">
        <h1 className="text-base sm:text-xl font-bold text-text-primary flex items-center gap-1 sm:gap-2">
          <span className="truncate">Ask Me Anything</span>
          <SparkleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary flex-shrink-0" />
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary font-mono truncate">
          <span className="hidden sm:inline">AI Assistant • Learn about Mai Trọng Nhân</span>
          <span className="sm:hidden">AI Assistant</span>
          {currentConversation && (
            <span className="ml-1 sm:ml-2 text-text-muted">
              • {currentConversation.messages.length} msgs
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
});

ChatHeader.displayName = "ChatHeader";
