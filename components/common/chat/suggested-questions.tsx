"use client";

import { motion } from "framer-motion";
import { RobotIcon } from "@phosphor-icons/react";
import { NoSSR } from "@/components/ui/no-ssr";

interface SuggestedQuestionsProps {
  onSendMessage: (message: string) => void;
  timestamp: Date;
}

export const SuggestedQuestions = ({ onSendMessage, timestamp }: SuggestedQuestionsProps) => {
  const suggestions = [
    "What are your technical skills?",
    "Tell me about your experience",
    "What projects have you built?",
    "How can I contact you?",
    "What technologies do you use?"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3 mb-6"
    >
      <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle flex items-center justify-center">
        <RobotIcon className="w-4 h-4 text-text-muted" />
      </div>
      
      <div className="max-w-[70%] rounded-card px-4 py-3 bg-canvas-white border border-borderSubtle text-text-primary shadow-outline-ring">
        <div className="mb-3">
          <p className="text-sm text-text-secondary">
            Here are some questions you can ask me:
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              onClick={() => onSendMessage(suggestion)}
              className="px-3 py-2 text-xs bg-canvas-warm border border-borderSubtle text-text-secondary hover:text-text-primary hover:border-text-muted transition-all duration-200 rounded-pill"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
        
        <div className="text-xs mt-3 opacity-70 text-text-muted">
          <NoSSR>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </NoSSR>
        </div>
      </div>
    </motion.div>
  );
};
