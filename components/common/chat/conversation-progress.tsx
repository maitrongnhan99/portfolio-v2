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
    if (messageCount >= 10) return { level: "Expert Explorer", color: "text-purple-400", bgColor: "bg-purple-400/10" };
    if (messageCount >= 5) return { level: "Active Learner", color: "text-blue-400", bgColor: "bg-blue-400/10" };
    if (messageCount >= 2) return { level: "Getting Started", color: "text-green-400", bgColor: "bg-green-400/10" };
    return { level: "New Visitor", color: "text-slate-400", bgColor: "bg-slate-400/10" };
  };

  const progressLevel = getProgressLevel();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-4 bg-navy-light/50 border border-navy-lighter rounded-lg backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-slate-lighter">
            Conversation Progress
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${progressLevel.bgColor} ${progressLevel.color}`}>
          {progressLevel.level}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Messages Count */}
        <div className="flex items-center gap-3 p-3 bg-navy/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center">
            <ChatCircleIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-lighter">{messageCount}</div>
            <div className="text-xs text-slate/70">Questions Asked</div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 p-3 bg-navy/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-green-400/10 flex items-center justify-center">
            <ClockIcon className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-lighter">
              <NoSSR fallback="Calculating...">  
                {getDuration()}
              </NoSSR>
            </div>
            <div className="text-xs text-slate/70">Time Exploring</div>
          </div>
        </div>

        {/* Topics Explored */}
        <div className="flex items-center gap-3 p-3 bg-navy/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-purple-400/10 flex items-center justify-center">
            <LightbulbIcon className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-lighter">{topicsExplored.length}</div>
            <div className="text-xs text-slate/70">Topics Explored</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate/70">Progress to Expert Explorer</span>
          <span className="text-xs text-slate/70">{Math.min(messageCount, 10)}/10</span>
        </div>
        <div className="w-full bg-navy/50 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((messageCount / 10) * 100, 100)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
          />
        </div>
      </div>

      {/* Topics Preview */}
      {topicsExplored.length > 0 && (
        <div className="mt-3 pt-3 border-t border-navy-lighter/30">
          <div className="text-xs text-slate/70 mb-2">Topics you&apos;ve explored:</div>
          <div className="flex flex-wrap gap-1">
            {topicsExplored.slice(0, 5).map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
              >
                {topic}
              </span>
            ))}
            {topicsExplored.length > 5 && (
              <span className="px-2 py-1 bg-slate/10 text-slate/70 text-xs rounded-full">
                +{topicsExplored.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};