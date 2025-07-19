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
      <AlertDialogContent className="bg-navy-light border-navy-lighter">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-light font-mono">
            Delete Conversation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate/70">
            Are you sure you want to delete &ldquo;{conversationTitle || 'this conversation'}&rdquo;? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="bg-transparent border-slate/30 text-slate-light hover:bg-slate/10 hover:border-slate/50 hover:text-slate-lighter"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white border-0 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};