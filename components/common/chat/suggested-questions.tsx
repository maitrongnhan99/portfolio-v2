"use client";

import { motion } from "framer-motion";
import { Robot } from "@phosphor-icons/react";

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
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Robot className="w-4 h-4 text-primary" />
      </div>
      
      <div className="max-w-[70%] rounded-lg px-4 py-3 bg-navy-light border border-navy-lighter text-slate-lighter">
        <div className="mb-3">
          <p className="text-sm text-slate-light">
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
              className="px-3 py-2 text-xs bg-navy/50 border border-navy-lighter text-slate-light hover:text-slate-lighter hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 rounded-full"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
        
        <div className="text-xs mt-3 opacity-60 text-slate">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};