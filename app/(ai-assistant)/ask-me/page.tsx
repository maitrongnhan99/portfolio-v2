"use client";

import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, ChatInput, TypingIndicator } from "@/components/common/chat";
// RAG-powered AI assistant - no longer using simple pattern matching
import { Robot, Sparkle, ArrowLeft, House, FloppyDisk, TrashSimple, MagnifyingGlass } from "@phosphor-icons/react";
import Link from "next/link";
import { useConversationHistory, type Conversation } from "@/hooks/use-conversation-history";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConversationSearch } from "@/components/common/chat/search";
import { ConnectionStatus } from "@/components/common/chat/connection-status";
import { RetryManager } from "@/lib/retry-utils";

// Lazy load heavy components
const AnimatedWelcome = lazy(() => import("@/components/common/chat/animated-welcome").then(module => ({ default: module.AnimatedWelcome })));
const EnhancedSuggestions = lazy(() => import("@/components/common/chat/enhanced-suggestions").then(module => ({ default: module.EnhancedSuggestions })));
const ConversationProgress = lazy(() => import("@/components/common/chat/conversation-progress").then(module => ({ default: module.ConversationProgress })));
const QuickActions = lazy(() => import("@/components/common/chat/quick-actions").then(module => ({ default: module.QuickActions })));
const ExportButton = lazy(() => import("@/components/common/chat/export").then(module => ({ default: module.ExportButton })));

// Loading skeleton components
const WelcomeLoadingSkeleton = () => (
  <div className="text-center py-12">
    <div className="animate-pulse">
      <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6"></div>
      <div className="h-8 bg-navy-light rounded w-64 mx-auto mb-4"></div>
      <div className="h-4 bg-navy-light rounded w-48 mx-auto"></div>
    </div>
  </div>
);

const SuggestionsLoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-navy-light rounded-lg animate-pulse"></div>
      ))}
    </div>
  </div>
);

const ProgressLoadingSkeleton = () => (
  <div className="bg-navy-light rounded-lg p-4 mb-6">
    <div className="animate-pulse">
      <div className="h-4 bg-navy rounded w-32 mb-2"></div>
      <div className="h-2 bg-navy rounded w-full mb-2"></div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 bg-navy rounded w-16"></div>
        ))}
      </div>
    </div>
  </div>
);

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
  isStreaming?: boolean;
  streamingComplete?: boolean;
}

export default function AskMePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEnhancedSuggestions, setShowEnhancedSuggestions] = useState(false);
  const [conversationStartTime, setConversationStartTime] = useState<Date | null>(null);
  const [topicsExplored, setTopicsExplored] = useState<string[]>([]);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [useStreaming, setUseStreaming] = useState(true); // Toggle for streaming mode
  const [autoSave, setAutoSave] = useState(true); // Toggle for auto-save
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Conversation history integration
  const {
    conversations,
    currentConversation,
    isLoading: isHistoryLoading,
    error: historyError,
    createConversation,
    saveConversation,
    deleteConversation,
    addMessage,
    updateMessage,
  } = useConversationHistory();

  // Handle welcome animation completion
  const handleWelcomeComplete = () => {
    setShowEnhancedSuggestions(true);
  };

  // Initialize a new conversation when the page loads
  useEffect(() => {
    if (!isHistoryLoading && !currentConversation) {
      createConversation('New Conversation');
    }
  }, [isHistoryLoading, currentConversation, createConversation]);

  // Load conversation messages into the current state
  useEffect(() => {
    if (currentConversation) {
      const conversationMessages = currentConversation.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(conversationMessages);
      setTopicsExplored(currentConversation.topicsExplored || []);
      setUserMessageCount(conversationMessages.filter(msg => msg.isUser).length);
      setConversationStartTime(currentConversation.createdAt);
      
      // Show welcome only if no messages exist
      if (conversationMessages.length === 0) {
        setShowWelcome(true);
        setShowEnhancedSuggestions(false);
      } else {
        setShowWelcome(false);
        setShowEnhancedSuggestions(false);
      }
    }
  }, [currentConversation]);

  // Auto-save conversation when messages change
  useEffect(() => {
    if (autoSave && currentConversation && messages.length > 0) {
      const saveTimeout = setTimeout(() => {
        const updatedConversation: Conversation = {
          ...currentConversation,
          messages: messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp
          })),
          topicsExplored,
          messageCount: messages.length,
          updatedAt: new Date(),
        };
        
        saveConversation(updatedConversation);
      }, 1000); // Save after 1 second of inactivity

      return () => clearTimeout(saveTimeout);
    }
  }, [messages, topicsExplored, autoSave, currentConversation, saveConversation]);

  // Manual save function
  const handleSaveConversation = async () => {
    if (currentConversation) {
      try {
        const updatedConversation: Conversation = {
          ...currentConversation,
          messages: messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp
          })),
          topicsExplored,
          messageCount: messages.length,
          updatedAt: new Date(),
        };
        
        await saveConversation(updatedConversation);
        
        // Show success feedback
        console.log('Conversation saved successfully');
      } catch (error) {
        console.error('Failed to save conversation:', error);
      }
    }
  };

  // Clear current conversation
  const handleClearConversation = async () => {
    if (currentConversation) {
      try {
        await deleteConversation(currentConversation.id);
        
        // Reset state
        setMessages([]);
        setTopicsExplored([]);
        setUserMessageCount(0);
        setConversationStartTime(null);
        setShowWelcome(true);
        setShowEnhancedSuggestions(false);
        
        // Create a new conversation
        await createConversation('New Conversation');
      } catch (error) {
        console.error('Failed to clear conversation:', error);
      }
    }
  };

  // Start new conversation
  const handleNewConversation = async () => {
    try {
      // Save current conversation if it has messages
      if (currentConversation && messages.length > 0) {
        await handleSaveConversation();
      }
      
      // Create new conversation
      await createConversation('New Conversation');
      
      // Reset state
      setMessages([]);
      setTopicsExplored([]);
      setUserMessageCount(0);
      setConversationStartTime(null);
      setShowWelcome(true);
      setShowEnhancedSuggestions(false);
    } catch (error) {
      console.error('Failed to start new conversation:', error);
    }
  };

  // Handle conversation selection from search
  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      // Save current conversation if it has messages
      if (currentConversation && messages.length > 0) {
        await handleSaveConversation();
      }
      
      // Load the selected conversation
      await loadConversation(conversation.id);
      
      // Close search dialog
      setShowSearchDialog(false);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
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
    
    // Use streaming or non-streaming based on preference
    if (useStreaming) {
      await handleStreamingMessage(text);
    } else {
      await handleNonStreamingMessage(text);
    }
  };

  const handleStreamingMessage = async (text: string) => {
    setIsStreaming(true);
    setIsTyping(false);
    
    // Create AI message placeholder for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
      type: 'message',
      isStreaming: true,
      streamingComplete: false,
    };
    
    setMessages(prev => [...prev, initialAiMessage]);
    setStreamingMessageId(aiMessageId);

    try {
      // Get conversation history for context
      const conversationHistory = messages
        .slice(-6) // Last 6 messages for context
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        }));

      // Call the streaming API with retry logic
      const response = await RetryManager.retryFetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory,
          stream: true
        }),
      }, {
        maxAttempts: 3,
        initialDelay: 1000,
        onRetry: (error, attempt) => {
          console.log(`Retrying streaming request (attempt ${attempt}):`, error.message);
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';
      let sources: Array<{content: string; category: string; score: number}> = [];

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk' && data.content) {
                accumulatedText += data.content;
                
                // Update the message with accumulated text
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, text: accumulatedText }
                    : msg
                ));
              } else if (data.type === 'sources' && data.sources) {
                sources = data.sources;
              } else if (data.type === 'done') {
                // Mark streaming as complete
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { 
                        ...msg, 
                        text: accumulatedText || "I apologize, but I couldn't generate a proper response. Please try rephrasing your question.",
                        isStreaming: false,
                        streamingComplete: true,
                        sources: sources
                      }
                    : msg
                ));
                break;
              } else if (data.type === 'error') {
                throw new Error(data.error || 'Streaming error occurred');
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError);
              // Continue processing other lines
            }
          }
        }
      }

    } catch (error) {
      console.error('Error in streaming message:', error);
      
      // Update the message with error
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { 
              ...msg, 
              text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment. In the meantime, you can browse Mai's portfolio or contact information directly.",
              isStreaming: false,
              streamingComplete: true,
            }
          : msg
      ));
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
    }
  };

  const handleNonStreamingMessage = async (text: string) => {
    setIsTyping(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages
        .slice(-6) // Last 6 messages for context
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.text
        }));

      // Call the non-streaming API with retry logic
      const response = await RetryManager.retryFetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory,
          stream: false
        }),
      }, {
        maxAttempts: 3,
        initialDelay: 1000,
        onRetry: (error, attempt) => {
          console.log(`Retrying non-streaming request (attempt ${attempt}):`, error.message);
        }
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
      {/* Connection Status */}
      <ConnectionStatus />
      
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
                  {currentConversation && (
                    <span className="ml-2 text-slate/60">
                      • {currentConversation.messages.length} messages
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Conversation Controls */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-2 bg-transparent border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-200 rounded-lg font-mono text-sm"
                    title="Search conversations"
                  >
                    <MagnifyingGlass className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[80vh] bg-navy-light border-navy-lighter p-0">
                  <DialogHeader className="px-6 py-4 border-b border-navy-lighter">
                    <DialogTitle className="text-slate-lighter">Search Conversations</DialogTitle>
                  </DialogHeader>
                  <div className="px-6 py-4">
                    <ConversationSearch
                      conversations={conversations}
                      onSelectConversation={handleSelectConversation}
                      currentConversationId={currentConversation?.id}
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Save Button */}
              <button
                onClick={handleSaveConversation}
                disabled={!currentConversation || messages.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-transparent border border-slate/30 text-slate hover:bg-slate/10 hover:border-slate/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg font-mono text-sm"
                title="Save conversation"
              >
                <FloppyDisk className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
              
              {/* Export Button */}
              {currentConversation && (
                <Suspense fallback={
                  <div className="flex items-center gap-2 px-3 py-2 bg-transparent border border-slate/30 text-slate rounded-lg font-mono text-sm animate-pulse">
                    <div className="w-4 h-4 bg-slate/30 rounded"></div>
                    <span className="hidden sm:inline">Export</span>
                  </div>
                }>
                  <ExportButton 
                    conversation={currentConversation}
                    disabled={!currentConversation || messages.length === 0}
                    variant="outline"
                    size="default"
                  />
                </Suspense>
              )}
              
              {/* Clear Button */}
              <button
                onClick={handleClearConversation}
                disabled={!currentConversation || messages.length === 0}
                className="flex items-center gap-2 px-3 py-2 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg font-mono text-sm"
                title="Clear conversation"
              >
                <TrashSimple className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
              
              {/* New Conversation Button */}
              <button
                onClick={handleNewConversation}
                className="flex items-center gap-2 px-3 py-2 bg-transparent border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-200 rounded-lg font-mono text-sm"
                title="Start new conversation"
              >
                <Sparkle className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </button>
              
              {/* Back to Portfolio Button */}
              <Link 
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-200 rounded-lg font-mono text-sm"
              >
                <House className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Portfolio</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Show welcome animation and enhanced suggestions when no conversation started */}
            {showWelcome && (
              <Suspense fallback={<WelcomeLoadingSkeleton />}>
                <AnimatedWelcome onComplete={handleWelcomeComplete} />
              </Suspense>
            )}
            
            {showEnhancedSuggestions && (
              <Suspense fallback={<SuggestionsLoadingSkeleton />}>
                <EnhancedSuggestions
                  onSendMessage={handleSendMessage}
                  timestamp={new Date()}
                />
                <QuickActions
                  onSendMessage={handleSendMessage}
                  isVisible={true}
                />
              </Suspense>
            )}
            
            {/* Show conversation progress after first message */}
            {conversationStartTime && userMessageCount > 0 && (
              <Suspense fallback={<ProgressLoadingSkeleton />}>
                <ConversationProgress
                  messageCount={userMessageCount}
                  conversationStartTime={conversationStartTime}
                  topicsExplored={topicsExplored}
                  isVisible={true}
                />
              </Suspense>
            )}
            
            {/* Show conversation messages */}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
                isStreaming={message.isStreaming}
                streamingComplete={message.streamingComplete}
                sources={message.sources}
              />
            ))}
            
            {isTyping && <TypingIndicator />}
            {isStreaming && !isTyping && (
              <div className="flex items-center gap-2 text-sm text-slate/70 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Streaming response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="border-t border-navy-lighter bg-navy/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            {/* Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                {/* Streaming toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUseStreaming(!useStreaming)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      useStreaming 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-slate/10 text-slate border border-slate/20'
                    }`}
                  >
                    {useStreaming ? 'Streaming ON' : 'Streaming OFF'}
                  </button>
                  <span className="text-xs text-slate/50">
                    {useStreaming ? 'Real-time responses' : 'Complete responses'}
                  </span>
                </div>
                
                {/* Auto-save toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoSave(!autoSave)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      autoSave 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-slate/10 text-slate border border-slate/20'
                    }`}
                  >
                    {autoSave ? 'Auto-save ON' : 'Auto-save OFF'}
                  </button>
                  <span className="text-xs text-slate/50">
                    {autoSave ? 'Saves automatically' : 'Manual save only'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate/50">
                  {isStreaming ? 'Streaming...' : isTyping ? 'Typing...' : 'Ready'}
                  {currentConversation && (
                    <span className="ml-2">
                      • {currentConversation.title}
                    </span>
                  )}
                </div>
                <ConnectionStatus showDetails={true} />
              </div>
            </div>
            
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isTyping || isStreaming}
              placeholder="Ask me about Mai's skills, experience, projects, or anything else..."
            />
          </div>
        </div>
      </div>

    </main>
  );
}