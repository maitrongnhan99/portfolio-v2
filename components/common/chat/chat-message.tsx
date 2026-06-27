"use client";

import { NoSSR } from "@/components/ui/no-ssr";
import { cn } from "@/lib/utils";
import { RobotIcon, UserIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import React, { FC } from "react";

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

const ChatMessageComponent: FC<ChatMessageProps> = ({
  message,
  isUser,
  timestamp,
  isStreaming = false,
  streamingComplete = false,
  sources = [],
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle flex items-center justify-center">
          <RobotIcon
            className={cn(
              "w-4 h-4 text-text-muted",
              isStreaming && "animate-pulse"
            )}
          />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-4 font-body tracking-body",
          isUser
            ? "bg-canvas-warm border border-borderSubtle text-text-primary shadow-warm-lift rounded-tr-sm"
            : "bg-canvas-white border border-borderSubtle text-text-primary shadow-outline-ring rounded-tl-sm",
          isStreaming && "border-text-muted/40"
        )}
      >
        <div className="text-[15px] leading-[1.6]">
          {message.split("\n").map((line, index) => {
            // Handle bold text with **text**
            if (line.includes("**")) {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={index} className="mb-2 last:mb-0">
                  {parts.map((part, partIndex) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <span
                          key={partIndex}
                          className="font-display font-medium text-text-primary"
                        >
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
            if (line.startsWith("• ")) {
              return (
                <p key={index} className="mb-1 pl-4 relative">
                  <span className="absolute left-0 text-text-muted">•</span>
                  {line.slice(2)}
                </p>
              );
            }

            // Regular text
            return (
              line.trim() && (
                <p key={index} className="mb-2 last:mb-0">
                  {line}
                </p>
              )
            );
          })}

          {/* Streaming cursor effect */}
          {isStreaming && (
            <span
              className="inline-block w-0.5 h-5 bg-text-muted animate-pulse ml-1"
              style={{ verticalAlign: "text-bottom" }}
            />
          )}
        </div>

        {/* Sources display */}
        {sources.length > 0 && streamingComplete && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-text-muted mb-2 font-medium">Sources:</p>
            <div className="space-y-1.5">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="text-xs text-text-secondary bg-secondary/50 border border-border rounded px-2.5 py-1.5"
                >
                  <span className="font-mono text-text-primary">
                    {source.category}
                  </span>
                  <span className="ml-2 text-text-muted">
                    ({(source.score * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={cn(
            "text-xs mt-3 opacity-60 flex items-center gap-2",
            isUser ? "text-text-secondary" : "text-text-secondary"
          )}
        >
          <NoSSR>
            <span>
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </NoSSR>
          {!isUser && isStreaming && (
            <span className="text-text-muted">• Streaming...</span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle flex items-center justify-center shadow-xs">
          <UserIcon className="w-4 h-4 text-text-muted" />
        </div>
      )}
    </motion.div>
  );
};

export const ChatMessage = React.memo(
  ChatMessageComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.message === nextProps.message &&
      prevProps.isUser === nextProps.isUser &&
      prevProps.timestamp.getTime() === nextProps.timestamp.getTime() &&
      prevProps.isStreaming === nextProps.isStreaming &&
      prevProps.streamingComplete === nextProps.streamingComplete &&
      JSON.stringify(prevProps.sources) === JSON.stringify(nextProps.sources)
    );
  }
);
