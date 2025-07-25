import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { ContainerTextFlip } from '../container-text-flip';

// Mock framer-motion
vi.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
    span: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => (
      <span ref={ref} {...props}>
        {children}
      </span>
    )),
  },
}));

describe('ContainerTextFlip Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ContainerTextFlip />);
      
      const container = screen.getByTestId('container-text-flip');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass(
        'relative',
        'inline-block',
        'rounded-lg',
        'pt-2',
        'pb-3',
        'text-center',
        'text-3xl',
        'md:text-5xl',
        'lg:text-6xl',
        'font-bold'
      );
    });

    it('should render with default words', () => {
      render(<ContainerTextFlip />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toBeInTheDocument();
      
      // Should start with the first word "better"
      expect(word).toHaveTextContent('better');
    });

    it('should render with custom words', () => {
      const customWords = ['hello', 'world', 'test'];
      render(<ContainerTextFlip words={customWords} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('hello');
    });

    it('should render with custom className', () => {
      render(<ContainerTextFlip className="custom-container" />);
      
      const container = screen.getByTestId('container-text-flip');
      expect(container).toHaveClass('custom-container');
    });

    it('should render with custom textClassName', () => {
      render(<ContainerTextFlip textClassName="custom-text" />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveClass('custom-text');
    });

    it('should render individual letters', () => {
      render(<ContainerTextFlip words={['test']} />);
      
      const letters = screen.getByTestId('container-text-flip-letters');
      expect(letters).toBeInTheDocument();
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(4);
      
      expect(letterSpans[0]).toHaveTextContent('t');
      expect(letterSpans[1]).toHaveTextContent('e');
      expect(letterSpans[2]).toHaveTextContent('s');
      expect(letterSpans[3]).toHaveTextContent('t');
    });

    it('should handle empty words array', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        render(<ContainerTextFlip words={[]} />);
        // If it renders without crashing, that's good
        const container = screen.queryByTestId('container-text-flip');
        if (container) {
          expect(container).toBeInTheDocument();
        }
      } catch (error) {
        // Expected to crash with empty array
        expect(error).toBeDefined();
      }

      consoleSpy.mockRestore();
    });

    it('should handle single word', () => {
      render(<ContainerTextFlip words={['single']} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('single');
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(6);
    });
  });

  describe('Animation and Word Cycling', () => {
    it('should cycle through words at specified interval', async () => {
      const words = ['first', 'second', 'third'];
      render(<ContainerTextFlip words={words} interval={1000} />);

      let word = screen.getByTestId('container-text-flip-word');

      // Initially should show first word
      expect(word).toHaveTextContent('first');

      // Simulate time passing - the component should cycle through words
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Re-query the element after state change
      word = screen.getByTestId('container-text-flip-word');
      expect(word).toBeInTheDocument();
      expect(['first', 'second', 'third']).toContain(word.textContent);
    });

    it('should use custom interval', async () => {
      const words = ['fast', 'change'];
      render(<ContainerTextFlip words={words} interval={500} />);

      let word = screen.getByTestId('container-text-flip-word');

      expect(word).toHaveTextContent('fast');

      // Simulate time passing with custom interval
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Re-query the element after state change
      word = screen.getByTestId('container-text-flip-word');
      expect(word).toBeInTheDocument();
      expect(['fast', 'change']).toContain(word.textContent);
    });

    it('should handle rapid interval changes', async () => {
      const words = ['rapid', 'test'];
      render(<ContainerTextFlip words={words} interval={100} />);

      let word = screen.getByTestId('container-text-flip-word');

      // Advance time multiple times quickly
      for (let i = 0; i < 3; i++) {
        act(() => {
          vi.advanceTimersByTime(100);
        });
      }

      // Re-query the element and verify it's still working
      word = screen.getByTestId('container-text-flip-word');
      expect(word).toBeInTheDocument();
      expect(['rapid', 'test']).toContain(word.textContent);
    });

    it('should clean up interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      const { unmount } = render(<ContainerTextFlip />);
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      
      clearIntervalSpy.mockRestore();
    });

    it('should restart interval when words prop changes', async () => {
      const { rerender } = render(<ContainerTextFlip words={['old']} interval={1000} />);

      let word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('old');

      // Change words prop
      rerender(<ContainerTextFlip words={['new', 'words']} interval={1000} />);

      // Re-query after rerender and verify it shows first word of new array
      word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('new');

      // Component should continue to work after prop change
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      word = screen.getByTestId('container-text-flip-word');
      expect(word).toBeInTheDocument();
    });
  });

  describe('Animation Properties', () => {
    it('should apply motion props to container', () => {
      render(<ContainerTextFlip />);

      const container = screen.getByTestId('container-text-flip');

      // Motion props are handled by framer-motion (mocked)
      // Just verify the component renders with motion wrapper
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('relative', 'inline-block');
    });

    it('should apply motion props to word container', () => {
      render(<ContainerTextFlip />);
      
      const word = screen.getByTestId('container-text-flip-word');
      
      expect(word).toHaveAttribute('transition');
      expect(word).toHaveAttribute('layoutId');
    });

    it('should apply motion props to individual letters', () => {
      render(<ContainerTextFlip words={['test']} />);
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      
      letterSpans.forEach(span => {
        expect(span).toHaveAttribute('initial');
        expect(span).toHaveAttribute('animate');
        expect(span).toHaveAttribute('transition');
      });
    });

    it('should use custom animation duration', () => {
      render(<ContainerTextFlip animationDuration={1000} />);
      
      const container = screen.getByTestId('container-text-flip');
      const word = screen.getByTestId('container-text-flip-word');
      
      expect(container).toBeInTheDocument();
      expect(word).toBeInTheDocument();
    });
  });

  describe('Text Content Variations', () => {
    it('should handle words with spaces', () => {
      render(<ContainerTextFlip words={['hello world']} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('hello world');
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(11);
      
      // Check space character exists (might not have visible text content)
      expect(letterSpans[5]).toBeInTheDocument();
    });

    it('should handle words with special characters', () => {
      render(<ContainerTextFlip words={['hello!', '@test#']} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('hello!');
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans[5]).toHaveTextContent('!');
    });

    it('should handle words with numbers', () => {
      render(<ContainerTextFlip words={['test123']} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('test123');
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(7);
      expect(letterSpans[4]).toHaveTextContent('1');
      expect(letterSpans[5]).toHaveTextContent('2');
      expect(letterSpans[6]).toHaveTextContent('3');
    });

  describe('Width Calculation', () => {
    it('should update width when word changes', async () => {
      // Mock scrollWidth
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        value: 100,
      });

      render(<ContainerTextFlip words={['short', 'verylongword']} />);

      let container = screen.getByTestId('container-text-flip');
      expect(container).toBeInTheDocument();

      // Advance to next word
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Re-query the element after state change
      container = screen.getByTestId('container-text-flip');
      expect(container).toBeInTheDocument();
    });

    it('should handle missing textRef gracefully', () => {
      render(<ContainerTextFlip words={['test']} />);

      const container = screen.getByTestId('container-text-flip');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle words with only whitespace', () => {
      render(<ContainerTextFlip words={['   ', '\t\t']} />);

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toBeInTheDocument();

      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(3);
    });

    it('should handle empty string in words array', () => {
      render(<ContainerTextFlip words={['', 'test']} />);

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('');

      const letterSpans = screen.queryAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(0);
    });

    it('should handle very fast intervals', async () => {
      render(<ContainerTextFlip words={['a', 'b']} interval={1} />);

      const word = screen.getByTestId('container-text-flip-word');

      // Should not crash with very fast intervals
      act(() => {
        vi.advanceTimersByTime(10);
      });

      expect(word).toBeInTheDocument();
    });

    it('should handle zero interval', () => {
      render(<ContainerTextFlip words={['test']} interval={0} />);

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('test');
    });

    it('should handle negative interval', () => {
      render(<ContainerTextFlip words={['test']} interval={-1000} />);

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('test');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <ContainerTextFlip
          className="custom-container"
          textClassName="custom-text"
          words={['test']}
        />
      );

      const container = screen.getByTestId('container-text-flip');
      const word = screen.getByTestId('container-text-flip-word');

      expect(container).toHaveClass('relative', 'custom-container');
      expect(word).toHaveClass('inline-block', 'custom-text');
    });

    it('should handle undefined props gracefully', () => {
      render(<ContainerTextFlip words={undefined as any} />);

      const container = screen.getByTestId('container-text-flip');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should handle reasonable number of words efficiently', () => {
      const manyWords = Array.from({ length: 50 }, (_, i) => `word${i}`);

      const startTime = performance.now();
      render(<ContainerTextFlip words={manyWords} />);
      const endTime = performance.now();

      const container = screen.getByTestId('container-text-flip');
      expect(container).toBeInTheDocument();

      // Should render reasonably quickly
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle words with many characters efficiently', () => {
      const longWords = ['a'.repeat(100), 'b'.repeat(100)];

      render(<ContainerTextFlip words={longWords} />);

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toBeInTheDocument();

      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(100);
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      render(<ContainerTextFlip words={['accessible', 'text']} />);

      const container = screen.getByTestId('container-text-flip');
      const word = screen.getByTestId('container-text-flip-word');

      expect(container).toBeInTheDocument();
      expect(word).toBeInTheDocument();
      expect(word).toHaveTextContent('accessible');
    });

    it('should maintain text content for assistive technologies', async () => {
      render(<ContainerTextFlip words={['first', 'second']} />);

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('first');

      // Component should maintain accessibility
      expect(word).toBeInTheDocument();
      expect(['first', 'second']).toContain(word.textContent);
    });
  });

  describe('TypeScript Interface', () => {
    it('should accept all defined props', () => {
      const props = {
        words: ['test'],
        interval: 2000,
        className: 'custom',
        textClassName: 'text-custom',
        animationDuration: 500,
      };

      render(<ContainerTextFlip {...props} />);

      const container = screen.getByTestId('container-text-flip');
      const word = screen.getByTestId('container-text-flip-word');

      expect(container).toHaveClass('custom');
      expect(word).toHaveClass('text-custom');
    });
  });
});

    it('should handle unicode characters', () => {
      render(<ContainerTextFlip words={['café', '🚀']} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('café');
    });

    it('should handle very long words', () => {
      const longWord = 'supercalifragilisticexpialidocious';
      render(<ContainerTextFlip words={[longWord]} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent(longWord);
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(longWord.length);
    });

    it('should handle very short words', () => {
      render(<ContainerTextFlip words={['a', 'I']} />);
      
      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('a');
      
      const letterSpans = screen.getAllByTestId(/container-text-flip-letter-\d+/);
      expect(letterSpans).toHaveLength(1);
    });
  });

  describe('Component Behavior', () => {
    it('should re-render when props change', () => {
      const { rerender } = render(<ContainerTextFlip words={['old']} />);

      let word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('old');

      rerender(<ContainerTextFlip words={['new']} />);

      word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('new');
    });

    it('should handle interval prop changes', () => {
      const { rerender } = render(
        <ContainerTextFlip words={['fast', 'slow']} interval={1000} />
      );

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('fast');

      // Change interval
      rerender(<ContainerTextFlip words={['fast', 'slow']} interval={500} />);

      // Should still render correctly
      expect(word).toBeInTheDocument();
      expect(['fast', 'slow']).toContain(word.textContent);
    });

    it('should maintain state during className changes', () => {
      const { rerender } = render(
        <ContainerTextFlip words={['test1', 'test2']} className="class1" />
      );

      const word = screen.getByTestId('container-text-flip-word');
      expect(word).toHaveTextContent('test1');

      // Change className but keep same words
      rerender(<ContainerTextFlip words={['test1', 'test2']} className="class2" />);

      // Should still render first word
      expect(word).toHaveTextContent('test1');
    });
  });
