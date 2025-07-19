"use client";

import { motion } from "framer-motion";
import { Robot } from "@phosphor-icons/react";

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex gap-3 mb-6"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Robot className="w-4 h-4 text-primary" />
      </div>
      
      <div className="bg-navy-light border border-navy-lighter rounded-lg px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="text-slate-light text-sm">AI is thinking</div>
          <div className="flex gap-1 ml-2">
            <motion.div
              className="w-2 h-2 bg-primary/60 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-primary/60 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-primary/60 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};