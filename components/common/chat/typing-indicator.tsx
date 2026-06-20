"use client";

import { motion } from "framer-motion";
import { RobotIcon } from "@phosphor-icons/react";

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex gap-3 mb-6"
    >
      <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle flex items-center justify-center">
        <RobotIcon className="w-4 h-4 text-text-muted" />
      </div>
      
      <div className="bg-canvas-white border border-borderSubtle rounded-card px-4 py-3 shadow-outline-ring">
        <div className="flex items-center gap-1">
          <div className="text-text-secondary text-sm">AI is thinking</div>
          <div className="flex gap-1 ml-2">
            <motion.div
              className="w-2 h-2 bg-text-muted rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-text-muted rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-text-muted rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
