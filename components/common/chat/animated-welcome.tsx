"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Robot, Sparkle, Code, Briefcase, FolderOpen, ChatCircle } from "@phosphor-icons/react";

interface AnimatedWelcomeProps {
  onComplete?: () => void;
}

export const AnimatedWelcome = ({ onComplete }: AnimatedWelcomeProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const phases = useMemo(() => [
    {
      text: "Hello! I'm Mai Trọng Nhân's AI Assistant",
      icon: Robot,
      delay: 0
    },
    {
      text: "I can help you learn about...",
      icon: Sparkle,
      delay: 1500
    }
  ], []);

  const topics = [
    { text: "Technical Skills & Expertise", icon: Code, color: "text-blue-400" },
    { text: "Professional Experience", icon: Briefcase, color: "text-green-400" },
    { text: "Projects & Portfolio", icon: FolderOpen, color: "text-purple-400" },
    { text: "Background & Interests", icon: ChatCircle, color: "text-pink-400" }
  ];

  const [currentTopic, setCurrentTopic] = useState(0);

  // Typing effect for main phases
  useEffect(() => {
    if (currentPhase < phases.length) {
      const text = phases[currentPhase].text;
      let index = 0;
      setDisplayedText("");

      const timer = setTimeout(() => {
        const typingInterval = setInterval(() => {
          if (index < text.length) {
            setDisplayedText(text.slice(0, index + 1));
            index++;
          } else {
            clearInterval(typingInterval);
            setTimeout(() => {
              setCurrentPhase(prev => prev + 1);
            }, 800);
          }
        }, 50);

        return () => clearInterval(typingInterval);
      }, phases[currentPhase].delay);

      return () => clearTimeout(timer);
    } else {
      // Start topic rotation
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentPhase, onComplete, phases]);

  // Topic rotation effect
  useEffect(() => {
    if (isComplete) {
      const rotationInterval = setInterval(() => {
        setCurrentTopic(prev => (prev + 1) % topics.length);
      }, 2000);

      return () => clearInterval(rotationInterval);
    }
  }, [isComplete, topics.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      {/* Main Welcome Section */}
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {currentPhase < phases.length && (
              <motion.div
                key={currentPhase}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {phases[currentPhase] && (() => {
                  const IconComponent = phases[currentPhase].icon;
                  return <IconComponent className="w-8 h-8 text-primary" />;
                })()}
              </motion.div>
            )}
            {isComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <Robot className="w-8 h-8 text-primary" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Text Display */}
        <div className="h-16 flex items-center justify-center">
          {currentPhase < phases.length ? (
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-slate-lighter"
              layout
            >
              {displayedText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="ml-1 text-primary"
              >
                |
              </motion.span>
            </motion.h1>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-slate-lighter mb-2">
                Ask me about...
              </h1>
            </motion.div>
          )}
        </div>
      </div>

      {/* Rotating Topics */}
      <AnimatePresence mode="wait">
        {isComplete && (
          <motion.div
            key={currentTopic}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 px-6 py-3 bg-navy-light/50 border border-navy-lighter rounded-full backdrop-blur-sm"
          >
            {(() => {
              const IconComponent = topics[currentTopic].icon;
              return <IconComponent className={`w-5 h-5 ${topics[currentTopic].color}`} />;
            })()}
            <span className="text-slate-lighter font-medium">
              {topics[currentTopic].text}
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <Sparkle className="w-4 h-4 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <motion.p 
              className="text-slate/80 text-sm md:text-base"
              animate={{ 
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut"
              }}
            >
              Start a conversation below ↓
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};