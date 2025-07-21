"use client";

import React from "react";
import { motion } from "framer-motion";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ChatControlsToggleProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const ChatControlsToggle = ({ 
  isOpen, 
  onClick, 
  className 
}: ChatControlsToggleProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative p-2.5 rounded-lg",
        "bg-transparent border border-primary/30 text-primary",
        "hover:bg-primary/10 hover:border-primary/50",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative w-5 h-5">
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          className="absolute inset-0"
        >
          <ListIcon 
            className={cn(
              "w-5 h-5 text-primary absolute",
              "transition-opacity duration-200",
              isOpen ? "opacity-0" : "opacity-100"
            )}
          />
          <XIcon 
            className={cn(
              "w-5 h-5 text-primary absolute",
              "transition-opacity duration-200",
              isOpen ? "opacity-100" : "opacity-0"
            )}
          />
        </motion.div>
      </div>
    </motion.button>
  );
};