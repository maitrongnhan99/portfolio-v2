"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatInputRef {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  onSendMessage,
  disabled = false,
  placeholder = "Ask me anything about Mai's background, skills, or experience...",
}, ref) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Expose focus method to parent components
  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "min-h-[45px] sm:min-h-[50px] max-h-32 resize-none pr-12 sm:pr-14",
            "bg-navy-light border-navy-lighter focus:ring-primary text-slate-lighter",
            "placeholder:text-slate/50",
            "transition-all duration-200",
            "scrollbar-none",
            "[&::-webkit-scrollbar]:hidden",
            "[-ms-overflow-style:none]",
            "[scrollbar-width:none]",
            "text-sm sm:text-base"
          )}
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2",
            "bg-transparent border border-primary text-primary hover:bg-primary/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "h-7 w-7 sm:h-8 sm:w-8 p-0",
            "transition-all duration-200"
          )}
        >
          <PaperPlaneTiltIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </div>
      <div className="text-[10px] sm:text-xs text-slate/50 mt-1 px-2">
        <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
        <span className="sm:hidden">Enter to send • Shift+Enter for new line</span>
      </div>
    </form>
  );
});

ChatInput.displayName = "ChatInput";
