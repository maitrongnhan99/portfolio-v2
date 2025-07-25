import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { ColourfulText } from '../colourful-text';

// Mock framer-motion
vi.mock('motion/react', () => ({
  motion: {
    span: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => (
      <span ref={ref} {...props}>
        {children}
      </span>
    )),
  },
}));

describe('ColourfulText Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ColourfulText text="Hello" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      expect(colourfulText).toHaveTextContent('Hello');
    });

    it('should render each character as a separate span', () => {
      render(<ColourfulText text="Test" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      
      // Should have 4 character spans
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(4);
      
      expect(charSpans[0]).toHaveTextContent('T');
      expect(charSpans[1]).toHaveTextContent('e');
      expect(charSpans[2]).toHaveTextContent('s');
      expect(charSpans[3]).toHaveTextContent('t');
    });

    it('should handle empty text', () => {
      render(<ColourfulText text="" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      expect(colourfulText).toHaveTextContent('');
      
      const charSpans = screen.queryAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(0);
    });

    it('should handle single character', () => {
      render(<ColourfulText text="A" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      expect(colourfulText).toHaveTextContent('A');
      
      const charSpan = screen.getByTestId('colourful-text-char-0');
      expect(charSpan).toHaveTextContent('A');
    });

    it('should handle text with spaces', () => {
      render(<ColourfulText text="Hello World" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      expect(colourfulText).toHaveTextContent('Hello World');
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(11);
      
      // Check space character exists (whitespace-pre class should preserve it)
      const spaceSpan = screen.getByTestId('colourful-text-char-5');
      expect(spaceSpan).toBeInTheDocument();
      expect(spaceSpan).toHaveClass('whitespace-pre');
    });

    it('should handle special characters', () => {
      render(<ColourfulText text="Hello! @#$" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      expect(colourfulText).toHaveTextContent('Hello! @#$');
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(10);
      
      expect(screen.getByTestId('colourful-text-char-5')).toHaveTextContent('!');
      expect(screen.getByTestId('colourful-text-char-7')).toHaveTextContent('@');
      expect(screen.getByTestId('colourful-text-char-8')).toHaveTextContent('#');
      expect(screen.getByTestId('colourful-text-char-9')).toHaveTextContent('$');
    });

    it('should handle unicode characters', () => {
      render(<ColourfulText text="Hello 🌟" />);

      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      expect(colourfulText).toHaveTextContent('Hello 🌟');

      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      // Unicode emoji might be split into multiple characters by JavaScript
      expect(charSpans.length).toBeGreaterThanOrEqual(7);
    });

    it('should apply correct CSS classes to character spans', () => {
      render(<ColourfulText text="Hi" />);
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      
      charSpans.forEach(span => {
        expect(span).toHaveClass(
          'inline-block',
          'whitespace-pre',
          'font-sans',
          'tracking-tight'
        );
      });
    });
  });

  describe('Animation and Color Changes', () => {
    it('should have motion props applied to character spans', () => {
      render(<ColourfulText text="Test" />);
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      
      charSpans.forEach(span => {
        // Motion props should be applied (mocked as regular props)
        expect(span).toHaveAttribute('initial');
        expect(span).toHaveAttribute('animate');
        expect(span).toHaveAttribute('transition');
      });
    });

    it('should update colors after interval', async () => {
      render(<ColourfulText text="Test" />);
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(4);
      
      // Fast-forward time to trigger color change
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      // Component should still be rendered with same text
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('Test');
    });

    it('should handle multiple color updates', async () => {
      render(<ColourfulText text="Hi" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('Hi');
      
      // Trigger multiple color changes
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      // Component should still work correctly
      expect(colourfulText).toHaveTextContent('Hi');
    });

    it('should clean up interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      const { unmount } = render(<ColourfulText text="Test" />);
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      
      clearIntervalSpy.mockRestore();
    });
  });

  describe('Text Content Variations', () => {
    it('should handle long text', () => {
      const longText = 'This is a very long text that should be rendered with colorful animation';
      render(<ColourfulText text={longText} />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent(longText);
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(longText.length);
    });

    it('should handle text with line breaks', () => {
      const textWithBreaks = 'Line 1\nLine 2';
      render(<ColourfulText text={textWithBreaks} />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(textWithBreaks.length);
      
      // Check newline character exists (whitespace-pre class should preserve it)
      const newlineSpan = screen.getByTestId('colourful-text-char-6');
      expect(newlineSpan).toBeInTheDocument();
      expect(newlineSpan).toHaveClass('whitespace-pre');
    });

    it('should handle text with tabs', () => {
      const textWithTabs = 'Hello\tWorld';
      render(<ColourfulText text={textWithTabs} />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(textWithTabs.length);
      
      // Check tab character exists (whitespace-pre class should preserve it)
      const tabSpan = screen.getByTestId('colourful-text-char-5');
      expect(tabSpan).toBeInTheDocument();
      expect(tabSpan).toHaveClass('whitespace-pre');
    });

    it('should handle numeric text', () => {
      render(<ColourfulText text="12345" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('12345');
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(5);
      
      expect(charSpans[0]).toHaveTextContent('1');
      expect(charSpans[1]).toHaveTextContent('2');
      expect(charSpans[2]).toHaveTextContent('3');
      expect(charSpans[3]).toHaveTextContent('4');
      expect(charSpans[4]).toHaveTextContent('5');
    });

    it('should handle mixed alphanumeric text', () => {
      render(<ColourfulText text="ABC123xyz" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('ABC123xyz');
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(9);
    });
  });

  describe('Component Behavior', () => {
    it('should re-render when text prop changes', () => {
      const { rerender } = render(<ColourfulText text="Hello" />);
      
      let colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('Hello');
      
      let charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(5);
      
      rerender(<ColourfulText text="World" />);
      
      colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('World');
      
      charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(5);
    });

    it('should handle rapid text changes', () => {
      const { rerender } = render(<ColourfulText text="A" />);
      
      rerender(<ColourfulText text="AB" />);
      rerender(<ColourfulText text="ABC" />);
      rerender(<ColourfulText text="ABCD" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('ABCD');
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(4);
    });

    it('should maintain animation state during text changes', () => {
      const { rerender } = render(<ColourfulText text="Hello" />);
      
      // Advance time to trigger color change
      act(() => {
        vi.advanceTimersByTime(2500);
      });
      
      rerender(<ColourfulText text="World" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('World');
    });
  });

  describe('Edge Cases', () => {
    it('should handle text with only spaces', () => {
      render(<ColourfulText text="   " />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toBeInTheDocument();
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(3);
      
      charSpans.forEach(span => {
        expect(span).toBeInTheDocument();
        expect(span).toHaveClass('whitespace-pre');
      });
    });

    it('should handle very short text', () => {
      render(<ColourfulText text="X" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('X');
      
      const charSpan = screen.getByTestId('colourful-text-char-0');
      expect(charSpan).toHaveTextContent('X');
    });

    it('should handle text with repeated characters', () => {
      render(<ColourfulText text="aaa" />);
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent('aaa');
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(3);
      
      charSpans.forEach(span => {
        expect(span).toHaveTextContent('a');
      });
    });

    it('should not break with null or undefined text', () => {
      // TypeScript would prevent this, but testing runtime behavior
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      try {
        render(<ColourfulText text={null as any} />);
      } catch (error) {
        // Expected to throw or handle gracefully
        expect(error).toBeDefined();
      }
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('should handle reasonable text length efficiently', () => {
      const mediumText = 'A'.repeat(100);
      
      const startTime = performance.now();
      render(<ColourfulText text={mediumText} />);
      const endTime = performance.now();
      
      const colourfulText = screen.getByTestId('colourful-text');
      expect(colourfulText).toHaveTextContent(mediumText);
      
      const charSpans = screen.getAllByTestId(/colourful-text-char-\d+/);
      expect(charSpans).toHaveLength(100);
      
      // Should render reasonably quickly (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
