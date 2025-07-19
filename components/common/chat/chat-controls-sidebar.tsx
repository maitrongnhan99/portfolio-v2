"use client";

import React, { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  FloppyDisk,
  Download,
  MagnifyingGlass,
  Trash,
  Plus,
  ArrowLeft,
  Command,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Message, ChatSettings } from "@/types/chat";

const ExportDialog = lazy(() =>
  import("@/components/common/chat/export/export-dialog").then((module) => ({
    default: module.ExportDialog,
  }))
);

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  topics?: string[];
}

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
              <Command className="w-3 h-3" />
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
  chatSettings,
  isOnline,
}: ChatControlsSidebarProps) => {
  const [showExportDialog, setShowExportDialog] = React.useState(false);

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
                  onClick={() => {
                    setShowSearchDialog(true);
                    onOpenChange(false);
                  }}
                  icon={<MagnifyingGlass className="w-5 h-5" />}
                  label="Search Conversations"
                  description="Find messages across all conversations"
                  shortcut="K"
                  variant="primary"
                />
                <SidebarButton
                  onClick={() => handleAction(onSaveConversation)}
                  disabled={messages.length === 0}
                  icon={<FloppyDisk className="w-5 h-5" />}
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
                  icon={<Download className="w-5 h-5" />}
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
                  icon={<Plus className="w-5 h-5" />}
                  label="New Conversation"
                  description="Start a fresh chat"
                  shortcut="N"
                  variant="success"
                />
                <SidebarButton
                  onClick={() => handleAction(onClearMessages)}
                  disabled={messages.length === 0}
                  icon={<Trash className="w-5 h-5" />}
                  label="Clear Current Chat"
                  description="Remove all messages"
                  variant="danger"
                />
              </div>
            </div>

            {/* Navigation Section */}
            <div>
              <SectionDivider title="Navigation" />
              <Link href="/" onClick={() => onOpenChange(false)}>
                <SidebarButton
                  onClick={() => {}}
                  icon={<ArrowLeft className="w-5 h-5" />}
                  label="Back to Portfolio"
                  description="Return to main site"
                  variant="primary"
                />
              </Link>
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