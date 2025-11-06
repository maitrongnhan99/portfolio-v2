"use client";

import Link from "next/link";
import { FC } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { ChatHeader } from "@/components/common/chat/chat-header";
import { ChatControlsToggle } from "@/components/common/chat/chat-controls-toggle";
import { type Conversation } from "@/hooks/use-conversation-history";

type AskMeHeaderBarProps = {
  currentConversation?: Conversation | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

const AskMeHeaderBar: FC<AskMeHeaderBarProps> = ({
  currentConversation,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  return (
    <div className="border-b border-navy-lighter bg-navy-light/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
        <ChatHeader currentConversation={currentConversation ?? null} />
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="relative p-2.5 rounded-lg bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Back to Portfolio"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <ChatControlsToggle isOpen={isSidebarOpen} onClick={onToggleSidebar} />
        </div>
      </div>
    </div>
  );
};

export { AskMeHeaderBar };
