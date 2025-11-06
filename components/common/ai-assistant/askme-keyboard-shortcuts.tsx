"use client";

import { FC, useEffect } from "react";

type AskMeKeyboardShortcutsProps = {
  messagesLength: number;
  isSidebarOpen: boolean;
  setShowSearchDialog: (open: boolean) => void;
  setShowControlsSidebar: (open: boolean) => void;
  onSaveConversation: () => void;
  onNewConversation: () => void;
};

const AskMeKeyboardShortcuts: FC<AskMeKeyboardShortcutsProps> = ({
  messagesLength,
  isSidebarOpen,
  setShowSearchDialog,
  setShowControlsSidebar,
  onSaveConversation,
  onNewConversation,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchDialog(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (messagesLength > 0) {
          onSaveConversation();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        onNewConversation();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setShowControlsSidebar(!isSidebarOpen);
      }
      if (e.key === "Escape" && isSidebarOpen) {
        setShowControlsSidebar(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [messagesLength, isSidebarOpen, setShowSearchDialog, setShowControlsSidebar, onSaveConversation, onNewConversation]);

  return null;
};

export { AskMeKeyboardShortcuts };
