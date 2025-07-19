import { useCallback, useEffect, useRef, useState } from "react";
import { Message, ScrollState } from "@/types/chat";

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function useChatScroll(messages: Message[], isTyping: boolean) {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isAtBottom: true,
    userHasScrolled: false,
    showScrollButton: false,
  });

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableElementRef = useRef<HTMLElement | null>(null);
  const previousMessageCountRef = useRef(0);
  const scrollPositionBeforeNewMessage = useRef<number | null>(null);

  const checkIfAtBottom = useCallback(() => {
    const scrollElement = scrollableElementRef.current;
    if (!scrollElement) return true;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const threshold = 100; // Consider "at bottom" if within 100px
    const atBottom = scrollHeight - scrollTop - clientHeight < threshold;

    return atBottom;
  }, []);

  const handleScroll = useCallback(() => {
    const atBottom = checkIfAtBottom();
    
    setScrollState(prev => ({
      ...prev,
      isAtBottom: atBottom,
      showScrollButton: !atBottom && messages.length > 0,
      userHasScrolled: !atBottom ? true : prev.userHasScrolled,
    }));
  }, [checkIfAtBottom, messages.length]);

  // Debounced version of handleScroll for better performance
  const debouncedHandleScroll = useRef(debounce(handleScroll, 50)).current;

  const scrollToBottom = useCallback(() => {
    const scrollElement = scrollableElementRef.current;
    if (!scrollElement) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth"
      });
    }
    setScrollState(prev => ({ ...prev, userHasScrolled: false }));
  }, []);

  // Set up scroll event listener
  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;

    // Find the actual scrollable element (Radix UI ScrollArea viewport)
    const scrollElement = viewport.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!scrollElement) return;

    // Store the scrollable element ref for use in other functions
    scrollableElementRef.current = scrollElement as HTMLElement;

    scrollElement.addEventListener("scroll", debouncedHandleScroll);
    return () => {
      scrollElement.removeEventListener("scroll", debouncedHandleScroll);
      scrollableElementRef.current = null;
    };
  }, [debouncedHandleScroll]);

  // Auto-scroll to bottom when appropriate
  useEffect(() => {
    // Check if a new message was added (not just updated)
    const isNewMessage = messages.length > previousMessageCountRef.current;
    previousMessageCountRef.current = messages.length;

    const scrollElement = scrollableElementRef.current;
    if (!scrollElement) return;

    if (isNewMessage) {
      // Save current scroll position if user has scrolled up
      if (scrollState.userHasScrolled && !scrollState.isAtBottom) {
        scrollPositionBeforeNewMessage.current = scrollElement.scrollTop;
      }

      // Only auto-scroll if:
      // 1. User is already at bottom OR hasn't manually scrolled
      if (scrollState.isAtBottom || !scrollState.userHasScrolled) {
        // Use requestAnimationFrame to ensure DOM is updated before scrolling
        requestAnimationFrame(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: "smooth"
          });
        });
      } else if (scrollPositionBeforeNewMessage.current !== null) {
        // Preserve scroll position when user has scrolled up
        requestAnimationFrame(() => {
          const heightDifference = scrollElement.scrollHeight - scrollElement.clientHeight;
          const adjustedPosition = Math.min(scrollPositionBeforeNewMessage.current!, heightDifference);
          scrollElement.scrollTop = adjustedPosition;
          scrollPositionBeforeNewMessage.current = null;
        });
      }
    }
  }, [messages.length, scrollState.isAtBottom, scrollState.userHasScrolled]);

  // Auto-scroll when typing indicator appears
  useEffect(() => {
    if (isTyping && (scrollState.isAtBottom || !scrollState.userHasScrolled)) {
      const scrollElement = scrollableElementRef.current;
      if (scrollElement) {
        requestAnimationFrame(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: "smooth"
          });
        });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [isTyping, scrollState.isAtBottom, scrollState.userHasScrolled]);

  // Reset scroll tracking when user sends a message
  const resetScrollTracking = useCallback(() => {
    setScrollState(prev => ({
      ...prev,
      userHasScrolled: false,
      isAtBottom: true,
    }));
  }, []);

  return {
    scrollState,
    scrollViewportRef,
    messagesEndRef,
    scrollToBottom,
    resetScrollTracking,
  };
}