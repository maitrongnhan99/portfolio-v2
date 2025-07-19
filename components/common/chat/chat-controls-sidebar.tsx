"use client";

import React, { lazy, Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FloppyDiskIcon,
  DownloadIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PlusIcon,
  CommandIcon,
  ChatsCircleIcon,
  ChatTextIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Message, ChatSettings } from "@/types/chat";
import type { Conversation } from "@/hooks/use-conversation-history";
import { SidebarSearch } from "./sidebar-search";

const ExportDialog = lazy(() =>
  import("@/components/common/chat/export/export-dialog").then((module) => ({
    default: module.ExportDialog,
  }))
);

// Utility function to format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

interface ChatControlsSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  showSearchDialog: boolean;
  setShowSearchDialog: (show: boolean) => void;
  onSaveConversation: () => void;
  onNewConversation: () => void;
  onClearMessages: () => void;
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  chatSettings: ChatSettings;
  isOnline: boolean;
}

interface SidebarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger" | "success" | "primary";
  icon: React.ReactNode;
  label: string;
  description?: string;
  shortcut?: string;
}

const SidebarButton = ({
  onClick,
  disabled = false,
  variant = "default",
  icon,
  label,
  description,
  shortcut,
}: SidebarButtonProps) => {
  const variantStyles = {
    default: "border-slate/30 text-slate-light hover:bg-slate/10 hover:border-slate/50",
    danger: "border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50",
    success: "border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500/50",
    primary: "border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 bg-transparent border rounded-lg",
        "transition-all duration-200 text-left group",
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed"
      )}
      whileHover={!disabled ? { x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-medium">{label}</span>
          {shortcut && (
            <span className="text-xs font-mono opacity-50 flex items-center gap-1">
              <CommandIcon className="w-3 h-3" />
              {shortcut}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs opacity-60 mt-1">{description}</p>
        )}
      </div>
    </motion.button>
  );
};

const SectionDivider = ({ title }: { title: string }) => (
  <div className="px-4 py-2">
    <h3 className="text-xs font-mono text-slate/50 uppercase tracking-wider">
      {title}
    </h3>
  </div>
);

// Conversation History Item Component
interface ConversationHistoryItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const ConversationHistoryItem = ({ 
  conversation, 
  isActive, 
  onClick, 
  onDelete 
}: ConversationHistoryItemProps) => {
  const [showDelete, setShowDelete] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setShowDelete(true)}
      onHoverEnd={() => setShowDelete(false)}
      className={cn(
        "group relative px-3 py-2 rounded-md cursor-pointer transition-all",
        isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-slate/5"
      )}
      onClick={onClick}
      whileHover={!isActive ? { x: 4 } : {}}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-2">
        <ChatTextIcon className="w-4 h-4 mt-0.5 text-slate/50 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-mono text-slate-light truncate">
            {conversation.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate/50">
            <span>{conversation.messages.length} messages</span>
            <span>•</span>
            <span>{formatRelativeTime(conversation.updatedAt)}</span>
          </div>
          {conversation.topicsExplored && conversation.topicsExplored.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {conversation.topicsExplored.slice(0, 3).map((topic, index) => (
                <span 
                  key={index} 
                  className="text-xs px-1.5 py-0.5 bg-navy-lighter rounded text-slate/70"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
        <AnimatePresence>
          {showDelete && !isActive && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="absolute right-2 top-2 p-1 rounded hover:bg-red-500/10 transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5 text-red-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const ChatControlsSidebar = ({
  isOpen,
  onOpenChange,
  conversations,
  currentConversation,
  messages,
  showSearchDialog,
  setShowSearchDialog,
  onSaveConversation,
  onNewConversation,
  onClearMessages,
  onLoadConversation,
  onDeleteConversation,
  chatSettings,
  isOnline,
}: ChatControlsSidebarProps) => {
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchMode(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Reset search mode when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setIsSearchMode(false);
    }
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    // Auto-close sidebar after action (can be made configurable)
    setTimeout(() => onOpenChange(false), 300);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side="right" 
          className="w-full sm:w-[380px] bg-navy-light border-navy-lighter"
        >
          {isSearchMode ? (
            <SidebarSearch
              conversations={conversations}
              currentConversation={currentConversation}
              onLoadConversation={onLoadConversation}
              onDeleteConversation={onDeleteConversation}
              onBack={() => setIsSearchMode(false)}
              onClose={() => onOpenChange(false)}
            />
          ) : (
            <>
              <SheetHeader>
                <SheetTitle className="text-slate-light font-mono">
                  Chat Controls
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
            {/* Actions Section */}
            <div>
              <SectionDivider title="Actions" />
              <div className="space-y-2">
                <SidebarButton
                  onClick={() => setIsSearchMode(true)}
                  icon={<MagnifyingGlassIcon className="w-5 h-5" />}
                  label="Search Conversations"
                  description="Find messages across all conversations"
                  shortcut="K"
                  variant="primary"
                />
                <SidebarButton
                  onClick={() => handleAction(onSaveConversation)}
                  disabled={messages.length === 0}
                  icon={<FloppyDiskIcon className="w-5 h-5" />}
                  label="Save Conversation"
                  description="Save current chat to history"
                  shortcut="S"
                />
                <SidebarButton
                  onClick={() => {
                    setShowExportDialog(true);
                    onOpenChange(false);
                  }}
                  disabled={conversations.length === 0}
                  icon={<DownloadIcon className="w-5 h-5" />}
                  label="Export Conversations"
                  description="Download chat history as JSON"
                  shortcut="E"
                />
              </div>
            </div>

            {/* Conversation Section */}
            <div>
              <SectionDivider title="Conversation" />
              <div className="space-y-2">
                <SidebarButton
                  onClick={() => handleAction(onNewConversation)}
                  icon={<PlusIcon className="w-5 h-5" />}
                  label="New Conversation"
                  description="Start a fresh chat"
                  shortcut="N"
                  variant="success"
                />
                <SidebarButton
                  onClick={() => handleAction(onClearMessages)}
                  disabled={messages.length === 0}
                  icon={<TrashIcon className="w-5 h-5" />}
                  label="Clear Current Chat"
                  description="Remove all messages"
                  variant="danger"
                />
              </div>
            </div>

            {/* History Section */}
            <div>
              <SectionDivider title="History" />
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {conversations.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <ChatsCircleIcon className="w-12 h-12 mx-auto mb-2 text-slate/30" />
                    <p className="text-sm text-slate/60">No conversations yet</p>
                    <p className="text-xs text-slate/40 mt-1">Start chatting to build your history</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.slice(0, 10).map((conv) => (
                      <ConversationHistoryItem
                        key={conv.id}
                        conversation={conv}
                        isActive={currentConversation?.id === conv.id}
                        onClick={() => {
                          onLoadConversation(conv.id);
                          onOpenChange(false);
                        }}
                        onDelete={() => onDeleteConversation(conv.id)}
                      />
                    ))}
                    {conversations.length > 10 && (
                      <button 
                        onClick={() => setIsSearchMode(true)}
                        className="w-full px-4 py-2 text-xs text-slate/60 hover:text-slate-light transition-colors"
                      >
                        View all {conversations.length} conversations
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div className="mt-auto pt-6 px-4 border-t border-navy-lighter">
              <div className="flex items-center justify-between text-xs text-slate/60">
                <span>Connection Status</span>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isOnline ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                  <span>{isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>
              {chatSettings && (
                <div className="mt-2 flex items-center justify-between text-xs text-slate/60">
                  <span>Streaming</span>
                  <span>{chatSettings.useStreaming ? "Enabled" : "Disabled"}</span>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Export Dialog */}
      {showExportDialog && (
        <Suspense fallback={null}>
          <ExportDialog
            conversations={conversations}
            currentConversation={currentConversation}
            onClose={() => setShowExportDialog(false)}
          />
        </Suspense>
      )}
    </>
  );
};