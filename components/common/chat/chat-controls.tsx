"use client";

import React, { Suspense } from "react";
import { MagnifyingGlassIcon, FloppyDiskIcon, TrashSimpleIcon, SparkleIcon, HouseIcon } from "@phosphor-icons/react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConversationSearch } from "@/components/common/chat/search";
import { ExportButton } from "@/components/common/chat/export";
import { Conversation } from "@/hooks/use-conversation-history";

interface ChatControlsProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: any[];
  showSearchDialog: boolean;
  setShowSearchDialog: (show: boolean) => void;
  onSaveConversation: () => void;
  onClearConversation: () => void;
  onNewConversation: () => void;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ChatControls = React.memo(({
  conversations,
  currentConversation,
  messages,
  showSearchDialog,
  setShowSearchDialog,
  onSaveConversation,
  onClearConversation,
  onNewConversation,
  onSelectConversation,
}: ChatControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* Search Button */}
      <Dialog
        open={showSearchDialog}
        onOpenChange={setShowSearchDialog}
      >
        <DialogTrigger asChild>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-transparent border border-borderLight text-text-secondary hover:bg-canvas-warm hover:text-text-primary hover:border-text-muted transition-all duration-200 rounded-pill font-mono text-sm"
            title="Search conversations"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] bg-canvas-white border-borderLight shadow-outline-ring p-0">
          <DialogHeader className="px-6 py-4 border-b border-borderSubtle">
            <DialogTitle className="text-text-primary">
              Search Conversations
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <ConversationSearch
              conversations={conversations}
              onSelectConversation={onSelectConversation}
              currentConversationId={currentConversation?.id}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Button */}
      <button
        onClick={onSaveConversation}
        disabled={!currentConversation || messages.length === 0}
        className="flex items-center gap-2 px-3 py-2 bg-transparent border border-borderLight text-text-secondary hover:bg-canvas-warm hover:text-text-primary hover:border-text-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-pill font-mono text-sm"
        title="Save conversation"
      >
        <FloppyDiskIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Save</span>
      </button>

      {/* Export Button */}
      {currentConversation && (
        <Suspense
          fallback={
            <div className="flex items-center gap-2 px-3 py-2 bg-transparent border border-borderLight text-text-secondary rounded-pill font-mono text-sm animate-pulse">
              <div className="w-4 h-4 bg-canvas-warm rounded"></div>
              <span className="hidden sm:inline">Export</span>
            </div>
          }
        >
          <ExportButton
            conversation={currentConversation}
            disabled={!currentConversation || messages.length === 0}
            variant="outline"
            size="default"
          />
        </Suspense>
      )}

      {/* Clear Button */}
      <button
        onClick={onClearConversation}
        disabled={!currentConversation || messages.length === 0}
        className="flex items-center gap-2 px-3 py-2 bg-transparent border border-borderLight text-text-secondary hover:bg-canvas-warm hover:text-text-primary hover:border-text-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-pill font-mono text-sm"
        title="Clear conversation"
      >
        <TrashSimpleIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Clear</span>
      </button>

      {/* New Conversation Button */}
      <button
        onClick={onNewConversation}
        className="flex items-center gap-2 px-3 py-2 bg-canvas-warm border border-borderSubtle text-text-primary shadow-warm-lift hover:opacity-90 transition-all duration-200 rounded-pill font-mono text-sm"
        title="Start new conversation"
      >
        <SparkleIcon className="w-4 h-4" />
        <span className="hidden sm:inline">New</span>
      </button>

      {/* Back to Portfolio Button */}
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 bg-transparent border border-borderLight text-text-secondary hover:bg-canvas-warm hover:text-text-primary hover:border-text-muted transition-all duration-200 rounded-pill font-mono text-sm"
      >
        <HouseIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Portfolio</span>
      </Link>
    </div>
  );
});

ChatControls.displayName = "ChatControls";
