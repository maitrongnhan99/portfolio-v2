"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, ChatInput, TypingIndicator, SuggestedQuestions } from "@/components/common/chat";
import { generateAIResponse } from "@/lib/ai-assistant-data";
import { Robot, Sparkle, ArrowLeft, House } from "@phosphor-icons/react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'message' | 'suggestions';
}

export default function AskMePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message and suggestions
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Hello! I'm Mai Trọng Nhân's AI assistant. I can help you learn more about Mai's background, skills, experience, and projects. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
      type: 'message',
    };
    
    const suggestionsMessage: Message = {
      id: "suggestions",
      text: "",
      isUser: false,
      timestamp: new Date(),
      type: 'suggestions',
    };
    
    setMessages([welcomeMessage, suggestionsMessage]);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    // Remove suggestions after first user interaction
    setMessages(prev => prev.filter(msg => msg.type !== 'suggestions'));
    
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

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate AI response
    const aiResponse = generateAIResponse(text);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
      type: 'message',
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
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
            {messages.map((message) => {
              if (message.type === 'suggestions') {
                return (
                  <SuggestedQuestions
                    key={message.id}
                    onSendMessage={handleSendMessage}
                    timestamp={message.timestamp}
                  />
                );
              }
              
              return (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              );
            })}
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