"use client";

import { RobotIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AIChatbotWidgetProps {
  autoShow?: boolean;
  showDelay?: number;
}

export const AIChatbotWidget = ({
  autoShow = true,
  showDelay = 2000,
}: AIChatbotWidgetProps) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const tips = [
    "Ask me about Mai's technical skills and expertise",
    "Learn about recent projects and achievements",
    "Get information about professional experience",
    "Discover background and interests",
    "Find out about education and certifications",
    "Explore development tools and technologies",
  ];

  // Auto-show widget after delay
  useEffect(() => {
    if (autoShow && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Show tooltip after widget appears
        setTimeout(() => setShowTooltip(true), 500);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, showDelay, isDismissed]);

  // Rotate tips every 4 seconds
  useEffect(() => {
    if (showTooltip && isVisible) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [showTooltip, isVisible, tips.length]);

  const handleClick = () => {
    router.push("/ask-me");
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0, x: 100, y: 100 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
          className="fixed bottom-10 right-8 z-50 flex flex-col items-end gap-3"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-xs"
              >
                <div className="bg-navy-light/95 backdrop-blur-md border border-primary/20 rounded-lg p-4 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <RobotIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <motion.p
                        key={currentTipIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-slate-lighter leading-relaxed"
                      >
                        {tips[currentTipIndex]}
                      </motion.p>
                      <div className="flex items-center gap-1 mt-2">
                        <SparkleIcon className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-mono">
                          Click to start chatting
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="flex-shrink-0 w-5 h-5 rounded-full bg-slate/10 hover:bg-slate/20 flex items-center justify-center transition-colors"
                      aria-label="Dismiss"
                    >
                      <XIcon className="w-3 h-3 text-slate" />
                    </button>
                  </div>
                </div>
                {/* Arrow pointing to widget */}
                <div className="absolute -bottom-2 right-8 w-4 h-4 bg-navy-light/95 border-r border-b border-primary/20 transform rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Widget Button */}
          <motion.button
            onClick={handleClick}
            className="relative w-14 h-14 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            aria-label="Open AI Assistant Chat"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:bg-primary/30 transition-colors" />

            {/* Icon container */}
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <RobotIcon className="w-7 h-7 text-primary" />
              </motion.div>

              {/* Online indicator */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-navy"
              />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/40 rounded-full"
                  animate={{
                    x: [0, Math.random() * 20 - 10],
                    y: [0, Math.random() * 20 - 10],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + Math.random(),
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
