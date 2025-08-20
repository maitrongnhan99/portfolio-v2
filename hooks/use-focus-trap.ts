import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  isActive: boolean;
  initialFocus?: boolean;
  restoreFocus?: boolean;
  allowOutsideClick?: boolean;
}

/**
 * Hook for trapping focus within a container element
 * Useful for modals, dialogs, and other overlay components
 */
export function useFocusTrap({
  isActive,
  initialFocus = true,
  restoreFocus = true,
  allowOutsideClick = false,
}: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, []);

  // Handle tab key navigation
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: move to previous element
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move to next element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [isActive, getFocusableElements]
  );

  // Handle escape key
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (isActive && event.key === 'Escape') {
        // Allow parent components to handle escape
        event.stopPropagation();
      }
    },
    [isActive]
  );

  // Handle clicks outside the container
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        !isActive ||
        allowOutsideClick ||
        !containerRef.current ||
        containerRef.current.contains(event.target as Node)
      ) {
        return;
      }

      // Prevent clicks outside the container
      event.preventDefault();
      event.stopPropagation();

      // Optionally refocus the first element
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    },
    [isActive, allowOutsideClick, getFocusableElements]
  );

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the first focusable element if requested
    if (initialFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Small delay to ensure the element is rendered
        setTimeout(() => {
          focusableElements[0].focus();
        }, 0);
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleOutsideClick, true);

    return () => {
      // Remove event listeners
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleOutsideClick, true);

      // Restore focus to the previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [
    isActive,
    initialFocus,
    restoreFocus,
    handleTabKey,
    handleEscapeKey,
    handleOutsideClick,
    getFocusableElements,
  ]);

  return containerRef;
}

/**
 * Hook for managing focus announcements for screen readers
 */
export function useFocusAnnouncement() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove the announcement after it's been read
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
}

/**
 * Hook for managing focus restoration after route changes
 */
export function useFocusOnRouteChange() {
  useEffect(() => {
    // Focus the main content area when route changes
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent instanceof HTMLElement) {
      mainContent.focus();
    }
  }, []);
}

/**
 * Hook for skip link functionality
 */
export function useSkipLink() {
  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main, [role="main"], #main-content');
    if (mainContent instanceof HTMLElement) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const skipToNavigation = useCallback(() => {
    const navigation = document.querySelector('nav, [role="navigation"], #navigation');
    if (navigation instanceof HTMLElement) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { skipToContent, skipToNavigation };
}
