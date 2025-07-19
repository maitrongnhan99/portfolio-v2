"use client";

import { motion } from "framer-motion";
import { Robot, Sparkle, House } from "@phosphor-icons/react";
import Link from "next/link";
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
      className="flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Robot className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-lighter flex items-center gap-2">
          Ask Me Anything
          <Sparkle className="w-5 h-5 text-primary" />
        </h1>
        <p className="text-sm text-slate font-mono">
          AI Assistant • Learn about Mai Trọng Nhân
          {currentConversation && (
            <span className="ml-2 text-slate/60">
              • {currentConversation.messages.length} messages
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
});

ChatHeader.displayName = "ChatHeader";