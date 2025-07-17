"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, ChatInput, TypingIndicator, SuggestedQuestions, AnimatedWelcome, EnhancedSuggestions, ConversationProgress, QuickActions } from "@/components/common/chat";
// RAG-powered AI assistant - no longer using simple pattern matching
import { Robot, Sparkle, ArrowLeft, House } from "@phosphor-icons/react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'message' | 'suggestions';
  sources?: Array<{
    content: string;
    category: string;
    score: number;
  }>;
}

export default function AskMePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEnhancedSuggestions, setShowEnhancedSuggestions] = useState(false);
  const [conversationStartTime, setConversationStartTime] = useState<Date | null>(null);
  const [topicsExplored, setTopicsExplored] = useState<string[]>([]);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle welcome animation completion
  const handleWelcomeComplete = () => {
    setShowEnhancedSuggestions(true);
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Helper to detect topic from message
  const detectTopic = (message: string): string | null => {
    const topicKeywords = {
      'skills': ['skill', 'technology', 'programming', 'language', 'framework', 'tech', 'code', 'development'],
      'experience': ['experience', 'work', 'job', 'career', 'role', 'company', 'professional'],
      'projects': ['project', 'portfolio', 'build', 'created', 'developed', 'application', 'website'],
      'education': ['education', 'study', 'learn', 'course', 'university', 'degree', 'background'],
      'contact': ['contact', 'reach', 'email', 'phone', 'hire', 'available', 'connect'],
      'personal': ['personal', 'about', 'yourself', 'background', 'story', 'interests']
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return topic;
      }
    }
    return null;
  };

  const handleSendMessage = async (text: string) => {
    // Hide welcome elements after first user interaction
    setShowWelcome(false);
    setShowEnhancedSuggestions(false);
    
    // Track conversation start time
    if (!conversationStartTime) {
      setConversationStartTime(new Date());
    }
    
    // Detect and track topics
    const detectedTopic = detectTopic(text);
    if (detectedTopic && !topicsExplored.includes(detectedTopic)) {
      setTopicsExplored(prev => [...prev, detectedTopic]);
    }
    
    // Increment user message count
    setUserMessageCount(prev => prev + 1);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      type: 'message',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages
        .slice(-6) // Last 6 messages for context
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        }));

      // Call the new RAG-powered API
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Create AI message with RAG response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.",
        isUser: false,
        timestamp: new Date(),
        type: 'message',
        sources: data.sources || []
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment. In the meantime, you can browse Mai's portfolio or contact information directly.",
        isUser: false,
        timestamp: new Date(),
        type: 'message',
      };

      setIsTyping(false);
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <main className="h-screen bg-navy flex flex-col" style={{ backgroundColor: "#0b192f" }}>
      {/* Header */}
      <div className="border-b border-navy-lighter bg-navy-light/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Robot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-lighter flex items-center gap-2">
                  Ask Me Anything
                  <Sparkle className="w-5 h-5 text-primary" />
                </h1>
                <p className="text-sm text-slate font-mono">
                  AI Assistant • Learn about Mai Trọng Nhân
                </p>
              </div>
            </div>
            
            {/* Back to Portfolio Button */}
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-200 rounded-lg font-mono text-sm"
            >
              <House className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Portfolio</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Show welcome animation and enhanced suggestions when no conversation started */}
            {showWelcome && (
              <AnimatedWelcome onComplete={handleWelcomeComplete} />
            )}
            
            {showEnhancedSuggestions && (
              <>
                <EnhancedSuggestions
                  onSendMessage={handleSendMessage}
                  timestamp={new Date()}
                />
                <QuickActions
                  onSendMessage={handleSendMessage}
                  isVisible={true}
                />
              </>
            )}
            
            {/* Show conversation progress after first message */}
            {conversationStartTime && userMessageCount > 0 && (
              <ConversationProgress
                messageCount={userMessageCount}
                conversationStartTime={conversationStartTime}
                topicsExplored={topicsExplored}
                isVisible={true}
              />
            )}
            
            {/* Show conversation messages */}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder="Ask me about Mai's skills, experience, projects, or anything else..."
        />
      </div>

    </main>
  );
}