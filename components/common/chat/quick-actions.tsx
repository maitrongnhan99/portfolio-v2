"use client";

import { motion } from "framer-motion";
import { 
  Code, 
  Briefcase, 
  FolderOpen, 
  Phone, 
  Download, 
  LinkedinLogo,
  ArrowRight,
  Sparkle,
  User,
  Robot
} from "@phosphor-icons/react";

interface QuickActionsProps {
  onSendMessage: (message: string) => void;
  isVisible: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  message: string;
  category: 'info' | 'action' | 'contact';
}

export const QuickActions = ({ onSendMessage, isVisible }: QuickActionsProps) => {
  const quickActions: QuickAction[] = [
    {
      id: "skills-overview",
      title: "Skills Overview",
      description: "Get a comprehensive overview of technical skills",
      icon: Code,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20",
      message: "Give me a comprehensive overview of your technical skills and expertise",
      category: "info"
    },
    {
      id: "recent-projects",
      title: "Recent Projects",
      description: "Show latest projects and achievements",
      icon: FolderOpen,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10 border-purple-400/20 hover:bg-purple-400/20", 
      message: "Show me your most recent and notable projects",
      category: "info"
    },
    {
      id: "experience-summary",
      title: "Experience Summary",
      description: "Professional background and career journey",
      icon: Briefcase,
      color: "text-green-400",
      bgColor: "bg-green-400/10 border-green-400/20 hover:bg-green-400/20",
      message: "Tell me about your professional experience and career journey",
      category: "info"
    },
    {
      id: "personal-story",
      title: "Personal Story",
      description: "Learn about background and interests",
      icon: User,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10 border-orange-400/20 hover:bg-orange-400/20",
      message: "Tell me about yourself, your background, and what drives you",
      category: "info"
    },
    {
      id: "contact-info",
      title: "Get in Touch",
      description: "Contact information and availability",
      icon: Phone,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10 border-pink-400/20 hover:bg-pink-400/20",
      message: "How can I contact you and what's the best way to reach out?",
      category: "contact"
    },
    {
      id: "resume-info",
      title: "Resume & CV",
      description: "Download resume or get career summary",
      icon: Download,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10 border-cyan-400/20 hover:bg-cyan-400/20",
      message: "Can I get a copy of your resume or a detailed career summary?",
      category: "action"
    }
  ];

  const categories = [
    { id: 'info', title: 'Learn About Me', icon: Sparkle },
    { id: 'contact', title: 'Get Connected', icon: Phone },
    { id: 'action', title: 'Quick Actions', icon: Download }
  ] as const;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex gap-3"
    >
      {/* Robot Avatar - matching ChatMessage style */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Robot className="w-4 h-4 text-primary" />
      </div>
      
      {/* Content Container */}
      <div className="flex-1">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium text-slate-lighter">Quick Actions</h3>
          </div>
          <p className="text-xs text-slate/70">
            Get instant answers to common questions
          </p>
        </div>

        {categories.map((category) => {
          const categoryActions = quickActions.filter(action => action.category === category.id);
          
          if (categoryActions.length === 0) return null;

          return (
            <div key={category.id} className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                {(() => {
                  const IconComponent = category.icon;
                  return <IconComponent className="w-4 h-4 text-slate/70" />;
                })()}
                <h4 className="text-xs font-medium text-slate/70 uppercase tracking-wide">
                  {category.title}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    onClick={() => onSendMessage(action.message)}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 group ${action.bgColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-navy/50 flex items-center justify-center">
                        {(() => {
                          const IconComponent = action.icon;
                          return <IconComponent className={`w-4 h-4 ${action.color}`} />;
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-sm font-medium text-slate-lighter mb-1 group-hover:text-white transition-colors">
                          {action.title}
                        </h5>
                        <p className="text-xs text-slate/70 group-hover:text-slate/90 transition-colors">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate/50 group-hover:text-slate-lighter opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-4 p-3 bg-navy/20 border border-navy-lighter/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Sparkle className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-slate-lighter">Pro Tip</span>
          </div>
          <p className="text-xs text-slate/70">
            You can also ask me anything specific about Mai&apos;s background, skills, or experience in your own words.
          </p>
        </div>
      </div>
    </motion.div>
  );
};