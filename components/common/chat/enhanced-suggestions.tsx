"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Robot, Code, Briefcase, FolderOpen, GraduationCap, Phone, Sparkle, ArrowRight } from "@phosphor-icons/react";
import { NoSSR } from "@/components/ui/no-ssr";
import { useState } from "react";

interface EnhancedSuggestionsProps {
  onSendMessage: (message: string) => void;
  timestamp: Date;
}

interface QuestionCategory {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  questions: string[];
  description: string;
}

export const EnhancedSuggestions = ({ onSendMessage, timestamp }: EnhancedSuggestionsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(true);

  const categories: QuestionCategory[] = [
    {
      id: "skills",
      title: "Technical Skills",
      icon: Code,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20",
      description: "Explore my technical expertise and programming skills",
      questions: [
        "What programming languages do you know?",
        "Tell me about your React experience",
        "What's your tech stack preference?",
        "Do you have experience with TypeScript?",
        "What about your Node.js skills?"
      ]
    },
    {
      id: "experience",
      title: "Work Experience",
      icon: Briefcase,
      color: "text-green-400",
      bgColor: "bg-green-400/10 border-green-400/20 hover:bg-green-400/20",
      description: "Learn about my professional journey and achievements",
      questions: [
        "What's your work experience?",
        "Tell me about your previous roles",
        "What companies have you worked for?",
        "How many years of experience do you have?",
        "What's your biggest professional achievement?"
      ]
    },
    {
      id: "projects",
      title: "Projects & Portfolio",
      icon: FolderOpen,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10 border-purple-400/20 hover:bg-purple-400/20",
      description: "Discover the projects I've built and technologies used",
      questions: [
        "What projects have you built?",
        "Show me your portfolio highlights",
        "What's your most complex project?",
        "Tell me about your recent work",
        "What technologies did you use in your projects?"
      ]
    },
    {
      id: "education",
      title: "Background & Learning",
      icon: GraduationCap,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10 border-orange-400/20 hover:bg-orange-400/20",
      description: "My educational background and continuous learning journey",
      questions: [
        "What's your educational background?",
        "How did you learn programming?",
        "Are you self-taught?",
        "What courses have you taken?",
        "How do you stay updated with technology?"
      ]
    },
    {
      id: "contact",
      title: "Contact & Opportunities",
      icon: Phone,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10 border-pink-400/20 hover:bg-pink-400/20",
      description: "Get in touch and explore collaboration opportunities",
      questions: [
        "How can I contact you?",
        "Are you available for hire?",
        "What type of projects interest you?",
        "Do you freelance?",
        "What's the best way to reach you?"
      ]
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowAllCategories(false);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
    setShowAllCategories(true);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

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
      
      <div className="max-w-full flex-1 rounded-lg px-4 py-3 bg-navy-light border border-navy-lighter text-slate-lighter">
        <AnimatePresence mode="wait">
          {showAllCategories ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkle className="w-4 h-4 text-primary" />
                  <p className="text-sm text-slate-light font-medium">
                    What would you like to know about?
                  </p>
                </div>
                <p className="text-xs text-slate/70">
                  Choose a category to explore specific topics
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left group ${category.bgColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {(() => {
                          const IconComponent = category.icon;
                          return <IconComponent className={`w-5 h-5 ${category.color}`} />;
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-slate-lighter mb-1 group-hover:text-white transition-colors">
                          {category.title}
                        </h4>
                        <p className="text-xs text-slate/70 group-hover:text-slate/90 transition-colors">
                          {category.description}
                        </p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate/50 group-hover:text-slate-lighter transition-all transform group-hover:translate-x-1" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Quick Start Options */}
              <div className="mt-4 pt-4 border-t border-navy-lighter/50">
                <p className="text-xs text-slate/60 mb-2">Or try these popular questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Tell me about yourself",
                    "What's your expertise?",
                    "How can I contact you?"
                  ].map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.5 + index * 0.1 }}
                      onClick={() => onSendMessage(question)}
                      className="px-3 py-1 text-xs bg-navy/50 border border-navy-lighter text-slate-light hover:text-slate-lighter hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 rounded-full"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : selectedCategoryData && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={handleBackClick}
                    className="text-slate/70 hover:text-slate-lighter transition-colors text-xs flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" />
                    Back to categories
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const IconComponent = selectedCategoryData.icon;
                    return <IconComponent className={`w-5 h-5 ${selectedCategoryData.color}`} />;
                  })()}
                  <h3 className="text-sm font-medium text-slate-lighter">
                    {selectedCategoryData.title}
                  </h3>
                </div>
                <p className="text-xs text-slate/70">
                  {selectedCategoryData.description}
                </p>
              </div>

              <div className="space-y-2">
                {selectedCategoryData.questions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    onClick={() => onSendMessage(question)}
                    className="w-full text-left px-3 py-2 text-sm bg-navy/30 border border-navy-lighter text-slate-light hover:text-slate-lighter hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 rounded-lg group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex-1">{question}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-navy-lighter/50">
                <button
                  onClick={handleBackClick}
                  className="text-xs text-slate/60 hover:text-slate-lighter transition-colors"
                >
                  ← Explore other categories
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="text-xs mt-3 opacity-60 text-slate flex items-center justify-between">
          <NoSSR>
            <span>{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </NoSSR>
          <span className="flex items-center gap-1">
            <Sparkle className="w-3 h-3" />
            AI-Powered
          </span>
        </div>
      </div>
    </motion.div>
  );
};