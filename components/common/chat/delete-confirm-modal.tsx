"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onOpenChange,
  conversationTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border shadow-card rounded-section">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground font-display font-light text-2xl">
            Delete Conversation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-text-secondary font-body tracking-body">
            Are you sure you want to delete &ldquo;{conversationTitle || 'this conversation'}&rdquo;? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="bg-transparent border-border text-text-secondary hover:bg-secondary hover:text-foreground rounded-pill transition-all"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0 disabled:opacity-50 rounded-pill transition-all"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};