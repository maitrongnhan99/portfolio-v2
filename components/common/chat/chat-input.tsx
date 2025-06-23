"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Ask me anything about Mai's background, skills, or experience...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="border-t border-navy-lighter bg-navy/50 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto"
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
              "min-h-[50px] max-h-32 resize-none pr-14",
              "bg-navy-light border-navy-lighter focus:ring-primary text-slate-lighter",
              "placeholder:text-slate/50",
              "transition-all duration-200",
              "scrollbar-none",
              "[&::-webkit-scrollbar]:hidden",
              "[-ms-overflow-style:none]",
              "[scrollbar-width:none]"
            )}
          />
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            className={cn(
              "absolute bottom-2 right-2",
              "bg-transparent border border-primary text-primary hover:bg-primary/10",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "h-8 w-8 p-0",
              "transition-all duration-200"
            )}
          >
            <PaperPlaneTilt className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-xs text-slate/50 mt-1 px-2">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};
