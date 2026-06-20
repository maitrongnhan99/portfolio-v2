"use client";

import { motion } from "framer-motion";
import { 
  CodeIcon, 
  BriefcaseIcon, 
  FolderOpenIcon, 
  PhoneIcon, 
  DownloadIcon, 
  ArrowRightIcon,
  SparkleIcon,
  UserIcon,
  RobotIcon
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
  message: string;
  category: 'info' | 'action' | 'contact';
}

export const QuickActions = ({ onSendMessage, isVisible }: QuickActionsProps) => {
  const quickActions: QuickAction[] = [
    {
      id: "skills-overview",
      title: "Skills Overview",
      description: "Get a comprehensive overview of technical skills",
      icon: CodeIcon,
      message: "Give me a comprehensive overview of your technical skills and expertise",
      category: "info"
    },
    {
      id: "recent-projects",
      title: "Recent Projects",
      description: "Show latest projects and achievements",
      icon: FolderOpenIcon,
      message: "Show me your most recent and notable projects",
      category: "info"
    },
    {
      id: "experience-summary",
      title: "Experience Summary",
      description: "Professional background and career journey",
      icon: BriefcaseIcon,
      message: "Tell me about your professional experience and career journey",
      category: "info"
    },
    {
      id: "personal-story",
      title: "Personal Story",
      description: "Learn about background and interests",
      icon: UserIcon,
      message: "Tell me about yourself, your background, and what drives you",
      category: "info"
    },
    {
      id: "contact-info",
      title: "Get in Touch",
      description: "Contact information and availability",
      icon: PhoneIcon,
      message: "How can I contact you and what's the best way to reach out?",
      category: "contact"
    },
    {
      id: "resume-info",
      title: "Resume & CV",
      description: "Download resume or get career summary",
      icon: DownloadIcon,
      message: "Can I get a copy of your resume or a detailed career summary?",
      category: "action"
    }
  ];

  const categories = [
    { id: 'info', title: 'Learn About Me', icon: SparkleIcon },
    { id: 'contact', title: 'Get Connected', icon: PhoneIcon },
    { id: 'action', title: 'Quick Actions', icon: DownloadIcon }
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
      <div className="shrink-0 w-8 h-8 rounded-full bg-canvas-warm border border-borderSubtle shadow-inset-border flex items-center justify-center">
        <RobotIcon className="w-4 h-4 text-text-muted" />
      </div>
      
      {/* Content Container */}
      <div className="flex-1">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRightIcon className="w-4 h-4 text-text-muted" />
            <h3 className="text-sm font-medium text-text-primary">Quick Actions</h3>
          </div>
          <p className="text-xs text-text-secondary">
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
                  return <IconComponent className="w-4 h-4 text-text-muted" />;
                })()}
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wide">
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
                    className="p-3 rounded-comfortable border border-borderSubtle bg-canvas-near text-left transition-all duration-200 group hover:bg-canvas-light hover:border-borderLight hover:shadow-outline-ring"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-base bg-canvas-warm border border-borderSubtle flex items-center justify-center shadow-inset-border">
                        {(() => {
                          const IconComponent = action.icon;
                          return <IconComponent className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />;
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-sm font-medium text-text-primary mb-1 transition-colors">
                          {action.title}
                        </h5>
                        <p className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRightIcon className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-4 p-3 bg-canvas-near border border-borderSubtle rounded-comfortable shadow-inset-border">
          <div className="flex items-center gap-2 mb-1">
            <SparkleIcon className="w-3 h-3 text-text-muted" />
            <span className="text-xs font-medium text-text-primary">Pro Tip</span>
          </div>
          <p className="text-xs text-text-secondary">
            You can also ask me anything specific about Mai&apos;s background, skills, or experience in your own words.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
