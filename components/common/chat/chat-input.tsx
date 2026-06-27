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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={cn(
        "rounded-2xl border border-border bg-card transition-colors duration-200",
        "focus-within:border-border/80",
      )}>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          className={cn(
            "min-h-[56px] max-h-40 resize-none",
            "bg-transparent border-none shadow-none ring-0 outline-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "px-4 pt-4 pb-2",
            "placeholder:text-text-muted text-foreground",
            "text-sm sm:text-base leading-relaxed",
            "scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]",
          )}
        />

        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <span className="hidden sm:block text-[11px] text-text-muted font-mono select-none">
            Enter to send · Shift+Enter for new line
          </span>
          <span className="sm:hidden" />

          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            className={cn(
              "rounded-full h-8 w-8 p-0 shrink-0",
              "bg-foreground text-background",
              "hover:opacity-85 transition-opacity",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "shadow-none border-none",
            )}
          >
            <PaperPlaneTiltIcon weight="fill" className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </form>
  );
});

ChatInput.displayName = "ChatInput";
