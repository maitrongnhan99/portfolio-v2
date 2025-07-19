"use client";

import React, { Suspense } from "react";
import { MagnifyingGlass, FloppyDisk, TrashSimple, Sparkle, House } from "@phosphor-icons/react";
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
            className="flex items-center gap-2 px-3 py-2 bg-transparent border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-200 rounded-lg font-mono text-sm"
            title="Search conversations"
          >
            <MagnifyingGlass className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] bg-navy-light border-navy-lighter p-0">
          <DialogHeader className="px-6 py-4 border-b border-navy-lighter">
            <DialogTitle className="text-slate-lighter">
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
        className="flex items-center gap-2 px-3 py-2 bg-transparent border border-slate/30 text-slate hover:bg-slate/10 hover:border-slate/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg font-mono text-sm"
        title="Save conversation"
      >
        <FloppyDisk className="w-4 h-4" />
        <span className="hidden sm:inline">Save</span>
      </button>

      {/* Export Button */}
      {currentConversation && (
        <Suspense
          fallback={
            <div className="flex items-center gap-2 px-3 py-2 bg-transparent border border-slate/30 text-slate rounded-lg font-mono text-sm animate-pulse">
              <div className="w-4 h-4 bg-slate/30 rounded"></div>
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
        className="flex items-center gap-2 px-3 py-2 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg font-mono text-sm"
        title="Clear conversation"
      >
        <TrashSimple className="w-4 h-4" />
        <span className="hidden sm:inline">Clear</span>
      </button>

      {/* New Conversation Button */}
      <button
        onClick={onNewConversation}
        className="flex items-center gap-2 px-3 py-2 bg-transparent border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-200 rounded-lg font-mono text-sm"
        title="Start new conversation"
      >
        <Sparkle className="w-4 h-4" />
        <span className="hidden sm:inline">New</span>
      </button>

      {/* Back to Portfolio Button */}
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-200 rounded-lg font-mono text-sm"
      >
        <House className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Portfolio</span>
      </Link>
    </div>
  );
});

ChatControls.displayName = "ChatControls";