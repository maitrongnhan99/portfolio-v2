"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, ChatInput, TypingIndicator } from "@/components/common/chat";
import { generateAIResponse } from "@/lib/ai-assistant-data";
import { Robot, Sparkle } from "@phosphor-icons/react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AskMePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      text: "Hello! I'm Mai Trọng Nhân's AI assistant. I can help you learn more about Mai's background, skills, experience, and projects. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
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
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <main className="min-h-screen bg-navy flex flex-col" style={{ backgroundColor: "#0b192f" }}>
      {/* Header */}
      <div className="border-b border-navy-lighter bg-navy-light/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
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

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="container mx-auto px-4 pb-4 max-w-4xl"
        >
          <div className="text-center text-slate/70 text-sm mb-4">
            Try asking:
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "What are your technical skills?",
              "Tell me about your experience",
              "What projects have you built?",
              "How can I contact you?",
              "What technologies do you use?"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className="px-3 py-2 text-xs bg-navy-light border border-navy-lighter text-slate-light hover:text-slate-lighter hover:border-primary/30 transition-colors rounded-full"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}