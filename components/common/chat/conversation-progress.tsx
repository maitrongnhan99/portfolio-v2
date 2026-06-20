"use client";

import { motion } from "framer-motion";
import { ChatCircleIcon, ClockIcon, LightbulbIcon, TrophyIcon } from "@phosphor-icons/react";
import { NoSSR } from "@/components/ui/no-ssr";

interface ConversationProgressProps {
  messageCount: number;
  conversationStartTime: Date;
  topicsExplored: string[];
  isVisible: boolean;
}

export const ConversationProgress = ({ 
  messageCount, 
  conversationStartTime, 
  topicsExplored,
  isVisible 
}: ConversationProgressProps) => {
  const getDuration = () => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - conversationStartTime.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just started";
    if (diffInMinutes === 1) return "1 minute";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes`;
    
    const hours = Math.floor(diffInMinutes / 60);
    const remainingMinutes = diffInMinutes % 60;
    
    if (hours === 1 && remainingMinutes === 0) return "1 hour";
    if (hours === 1) return `1 hour ${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours} hours`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getProgressLevel = () => {
    if (messageCount >= 10) return { level: "Expert Explorer", color: "text-text-primary", bgColor: "bg-canvas-warm" };
    if (messageCount >= 5) return { level: "Active Learner", color: "text-text-primary", bgColor: "bg-canvas-warm" };
    if (messageCount >= 2) return { level: "Getting Started", color: "text-text-primary", bgColor: "bg-canvas-warm" };
    return { level: "New Visitor", color: "text-text-secondary", bgColor: "bg-canvas-near" };
  };

  const progressLevel = getProgressLevel();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-4 bg-canvas-white border border-borderSubtle rounded-card shadow-outline-ring"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-4 h-4 text-text-muted" />
          <span className="text-sm font-medium text-text-primary">
            Conversation Progress
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border border-borderSubtle ${progressLevel.bgColor} ${progressLevel.color}`}>
          {progressLevel.level}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Messages Count */}
        <div className="flex items-center gap-3 p-3 bg-canvas-warm rounded-card">
          <div className="w-8 h-8 rounded-full bg-canvas-white border border-borderSubtle flex items-center justify-center">
            <ChatCircleIcon className="w-4 h-4 text-text-muted" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">{messageCount}</div>
            <div className="text-xs text-text-secondary">Questions Asked</div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 p-3 bg-canvas-warm rounded-card">
          <div className="w-8 h-8 rounded-full bg-canvas-white border border-borderSubtle flex items-center justify-center">
            <ClockIcon className="w-4 h-4 text-text-muted" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">
              <NoSSR fallback="Calculating...">  
                {getDuration()}
              </NoSSR>
            </div>
            <div className="text-xs text-text-secondary">Time Exploring</div>
          </div>
        </div>

        {/* Topics Explored */}
        <div className="flex items-center gap-3 p-3 bg-canvas-warm rounded-card">
          <div className="w-8 h-8 rounded-full bg-canvas-white border border-borderSubtle flex items-center justify-center">
            <LightbulbIcon className="w-4 h-4 text-text-muted" />
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">{topicsExplored.length}</div>
            <div className="text-xs text-text-secondary">Topics Explored</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-text-secondary">Progress to Expert Explorer</span>
          <span className="text-xs text-text-secondary">{Math.min(messageCount, 10)}/10</span>
        </div>
        <div className="w-full bg-canvas-near rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((messageCount / 10) * 100, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-text-muted rounded-full"
          />
        </div>
      </div>

      {/* Topics Preview */}
      {topicsExplored.length > 0 && (
        <div className="mt-3 pt-3 border-t border-borderSubtle">
          <div className="text-xs text-text-secondary mb-2">Topics you&apos;ve explored:</div>
          <div className="flex flex-wrap gap-1">
            {topicsExplored.slice(0, 5).map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-canvas-warm text-text-secondary text-xs rounded-full border border-borderSubtle"
              >
                {topic}
              </span>
            ))}
            {topicsExplored.length > 5 && (
              <span className="px-2 py-1 bg-canvas-near text-text-muted text-xs rounded-full">
                +{topicsExplored.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
