"use client";

import { motion } from "framer-motion";
import { User, Robot } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Robot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-3",
        isUser 
          ? "bg-primary/10 border border-primary/20 text-slate-lighter" 
          : "bg-navy-light border border-navy-lighter text-slate-lighter"
      )}>
        <div className="prose prose-sm max-w-none">
          {message.split('\n').map((line, index) => {
            // Handle bold text with **text**
            if (line.includes('**')) {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={index} className="mb-2 last:mb-0">
                  {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <span key={partIndex} className="font-mono text-primary font-semibold">
                          {part.slice(2, -2)}
                        </span>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            }
            
            // Handle bullet points
            if (line.startsWith('• ')) {
              return (
                <p key={index} className="mb-1 pl-4 relative">
                  <span className="absolute left-0 text-primary">•</span>
                  {line.slice(2)}
                </p>
              );
            }
            
            // Regular text
            return line.trim() && (
              <p key={index} className="mb-2 last:mb-0">
                {line}
              </p>
            );
          })}
        </div>
        
        <div className={cn(
          "text-xs mt-2 opacity-60",
          isUser ? "text-slate" : "text-slate-light"
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate/10 border border-slate/20 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-light" />
        </div>
      )}
    </motion.div>
  );
};