"use client";

import { motion } from "framer-motion";
import { User, Robot, Circle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  streamingComplete?: boolean;
  sources?: Array<{
    content: string;
    category: string;
    score: number;
  }>;
}

export const ChatMessage = ({ 
  message, 
  isUser, 
  timestamp, 
  isStreaming = false, 
  streamingComplete = false, 
  sources = [] 
}: ChatMessageProps) => {
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
          <Robot className={cn(
            "w-4 h-4 text-primary",
            isStreaming && "animate-pulse"
          )} />
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-3",
        isUser 
          ? "bg-primary/10 border border-primary/20 text-slate-lighter" 
          : "bg-navy-light border border-navy-lighter text-slate-lighter",
        isStreaming && "border-primary/40"
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
          
          {/* Streaming cursor effect */}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-1"></span>
          )}
          
          {/* Empty message placeholder for streaming */}
          {!isUser && message.trim() === '' && isStreaming && (
            <div className="flex items-center gap-2 text-slate/50">
              <Circle className="w-2 h-2 animate-bounce" />
              <Circle className="w-2 h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <Circle className="w-2 h-2 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          )}
        </div>
        
        {/* Sources display */}
        {sources.length > 0 && streamingComplete && (
          <div className="mt-3 pt-3 border-t border-navy-lighter/50">
            <p className="text-xs text-slate/60 mb-2">Sources:</p>
            <div className="space-y-1">
              {sources.map((source, index) => (
                <div key={index} className="text-xs text-slate/50 bg-navy/30 rounded px-2 py-1">
                  <span className="font-mono text-primary">{source.category}</span>
                  <span className="ml-2 text-slate/40">({(source.score * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className={cn(
          "text-xs mt-2 opacity-60 flex items-center gap-2",
          isUser ? "text-slate" : "text-slate-light"
        )}>
          <span>{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {!isUser && isStreaming && (
            <span className="text-primary/60">• Streaming...</span>
          )}
          {!isUser && streamingComplete && (
            <span className="text-green-400/60">• Complete</span>
          )}
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