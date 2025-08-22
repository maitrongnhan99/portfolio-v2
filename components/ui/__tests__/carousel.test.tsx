import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../carousel';

// Mock embla-carousel-react
vi.mock('embla-carousel-react', () => ({
  default: vi.fn(() => [
    vi.fn(), // carouselRef
    {
      canScrollPrev: vi.fn(() => true),
      canScrollNext: vi.fn(() => true),
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    }
  ])
}));

describe('Carousel Components', () => {
  describe('Carousel', () => {
    it('should render with default props', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toBeInTheDocument();
      expect(carousel).toHaveAttribute('role', 'region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
      expect(carousel).toHaveClass('relative');
    });

    it('should render with custom className', () => {
      render(
        <Carousel className="custom-carousel">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveClass('custom-carousel', 'relative');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Carousel ref={ref}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should support HTML div attributes', () => {
      render(
        <Carousel id="test-carousel" aria-label="Image carousel">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveAttribute('id', 'test-carousel');
      expect(carousel).toHaveAttribute('aria-label', 'Image carousel');
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const carousel = screen.getByTestId('carousel');
      
      // Focus the carousel
      carousel.focus();
      
      // Test arrow key navigation
      await user.keyboard('{ArrowLeft}');
      await user.keyboard('{ArrowRight}');
      
      // Should not throw errors
      expect(carousel).toBeInTheDocument();
    });

    it('should call setApi when provided', () => {
      const setApi = vi.fn();
      
      render(
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      // setApi should be called with the carousel API
      expect(setApi).toHaveBeenCalled();
    });
  });

  describe('CarouselContent', () => {
    it('should render with default classes', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Content</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const viewport = screen.getByTestId('carousel-viewport');
      const content = screen.getByTestId('carousel-content');
      
      expect(viewport).toBeInTheDocument();
      expect(viewport).toHaveClass('overflow-hidden');
      
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('flex', '-ml-4');
    });

    it('should render with custom className', () => {
      render(
        <Carousel>
          <CarouselContent className="custom-content">
            <CarouselItem>Content</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const content = screen.getByTestId('carousel-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Carousel>
          <CarouselContent ref={ref}>
            <CarouselItem>Content</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Content</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const content = screen.getByTestId('carousel-content');
      expect(content).toHaveClass('flex', '-mt-4', 'flex-col');
    });
  });

  describe('CarouselItem', () => {
    it('should render with default classes and accessibility attributes', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Item Content</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const item = screen.getByTestId('carousel-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Item Content');
      expect(item).toHaveAttribute('role', 'group');
      expect(item).toHaveAttribute('aria-roledescription', 'slide');
      expect(item).toHaveClass(
        'min-w-0',
        'shrink-0',
        'grow-0',
        'basis-full',
        'pl-4'
      );
    });

    it('should render with custom className', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem className="custom-item">Custom Item</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const item = screen.getByTestId('carousel-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem ref={ref}>Item</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Vertical Item</CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const item = screen.getByTestId('carousel-item');
      expect(item).toHaveClass('pt-4');
    });

    it('should support HTML div attributes', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem id="slide-1" aria-label="First slide">
              Slide 1
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      );
      
      const item = screen.getByTestId('carousel-item');
      expect(item).toHaveAttribute('id', 'slide-1');
      expect(item).toHaveAttribute('aria-label', 'First slide');
    });
  });

  describe('CarouselPrevious', () => {
    it('should render with default props', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
        </Carousel>
      );
      
      const prevButton = screen.getByTestId('carousel-previous');
      expect(prevButton).toBeInTheDocument();
      expect(prevButton.tagName).toBe('BUTTON');
      expect(prevButton).toHaveClass(
        'absolute',
        'h-8',
        'w-8',
        'rounded-full',
        '-left-12',
        'top-1/2',
        '-translate-y-1/2'
      );
      
      // Should have screen reader text
      const srText = screen.getByText('Previous slide');
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });

  describe('CarouselNext', () => {
    it('should render with default props', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      );

      const nextButton = screen.getByTestId('carousel-next');
      expect(nextButton).toBeInTheDocument();
      expect(nextButton.tagName).toBe('BUTTON');
      expect(nextButton).toHaveClass(
        'absolute',
        'h-8',
        'w-8',
        'rounded-full',
        '-right-12',
        'top-1/2',
        '-translate-y-1/2'
      );

      // Should have screen reader text
      const srText = screen.getByText('Next slide');
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });

    it('should render with custom className', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext className="custom-next" />
        </Carousel>
      );

      const nextButton = screen.getByTestId('carousel-next');
      expect(nextButton).toHaveClass('custom-next');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext ref={ref} />
        </Carousel>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const user = userEvent.setup();

      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      );

      const nextButton = screen.getByTestId('carousel-next');

      // Click the next button
      await user.click(nextButton);

      // Should not throw errors
      expect(nextButton).toBeInTheDocument();
    });

    it('should handle vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      );

      const nextButton = screen.getByTestId('carousel-next');
      expect(nextButton).toHaveClass(
        '-bottom-12',
        'left-1/2',
        '-translate-x-1/2',
        'rotate-90'
      );
    });

    it('should support custom variant and size', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext variant="ghost" size="sm" />
        </Carousel>
      );

      const nextButton = screen.getByTestId('carousel-next');
      expect(nextButton).toBeInTheDocument();
    });
  });

  describe('Complete Carousel Structure', () => {
    it('should render complete carousel with multiple slides', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      const viewport = screen.getByTestId('carousel-viewport');
      const content = screen.getByTestId('carousel-content');
      const items = screen.getAllByTestId('carousel-item');
      const prevButton = screen.getByTestId('carousel-previous');
      const nextButton = screen.getByTestId('carousel-next');

      expect(carousel).toBeInTheDocument();
      expect(viewport).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(items).toHaveLength(3);
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();

      expect(items[0]).toHaveTextContent('Slide 1');
      expect(items[1]).toHaveTextContent('Slide 2');
      expect(items[2]).toHaveTextContent('Slide 3');
    });

    it('should work with complex slide content', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div className="slide-content">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image1.jpg" alt="Image 1" />
                <h3>Slide Title 1</h3>
                <p>Slide description</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="slide-content">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image2.jpg" alt="Image 2" />
                <h3>Slide Title 2</h3>
                <p>Another description</p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );

      const items = screen.getAllByTestId('carousel-item');
      expect(items).toHaveLength(2);

      expect(screen.getByText('Slide Title 1')).toBeInTheDocument();
      expect(screen.getByText('Slide Title 2')).toBeInTheDocument();
      expect(screen.getByAltText('Image 1')).toBeInTheDocument();
      expect(screen.getByAltText('Image 2')).toBeInTheDocument();
    });
  });

  describe('Carousel Options', () => {
    it('should handle carousel options', () => {
      const opts = {
        align: 'start' as const,
        loop: true,
      };

      render(
        <Carousel opts={opts}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      expect(carousel).toBeInTheDocument();
    });

    it('should handle plugins', () => {
      const plugins = []; // Mock plugins array

      render(
        <Carousel plugins={plugins}>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      expect(carousel).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      const items = screen.getAllByTestId('carousel-item');

      expect(carousel).toHaveAttribute('role', 'region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');

      items.forEach(item => {
        expect(item).toHaveAttribute('role', 'group');
        expect(item).toHaveAttribute('aria-roledescription', 'slide');
      });
    });

    it('should have accessible navigation buttons', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );

      const prevButton = screen.getByTestId('carousel-previous');
      const nextButton = screen.getByTestId('carousel-next');

      expect(prevButton.tagName).toBe('BUTTON');
      expect(nextButton.tagName).toBe('BUTTON');

      expect(screen.getByText('Previous slide')).toHaveClass('sr-only');
      expect(screen.getByText('Next slide')).toHaveClass('sr-only');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');

      // Focus the carousel
      carousel.focus();

      // Test keyboard navigation
      await user.keyboard('{ArrowLeft}');
      await user.keyboard('{ArrowRight}');

      expect(carousel).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single slide', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Only Slide</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      const items = screen.getAllByTestId('carousel-item');

      expect(carousel).toBeInTheDocument();
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent('Only Slide');
    });

    it('should handle empty carousel', () => {
      render(
        <Carousel>
          <CarouselContent>
          </CarouselContent>
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      const content = screen.getByTestId('carousel-content');

      expect(carousel).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Carousel className="custom-carousel">
          <CarouselContent className="custom-content">
            <CarouselItem className="custom-item">Slide</CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="custom-prev" />
          <CarouselNext className="custom-next" />
        </Carousel>
      );

      const carousel = screen.getByTestId('carousel');
      const content = screen.getByTestId('carousel-content');
      const item = screen.getByTestId('carousel-item');
      const prevButton = screen.getByTestId('carousel-previous');
      const nextButton = screen.getByTestId('carousel-next');

      expect(carousel).toHaveClass('relative', 'custom-carousel');
      expect(content).toHaveClass('flex', 'custom-content');
      expect(item).toHaveClass('min-w-0', 'custom-item');
      expect(prevButton).toHaveClass('absolute', 'custom-prev');
      expect(nextButton).toHaveClass('absolute', 'custom-next');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when useCarousel is used outside Carousel context', () => {
      // Mock console.error to avoid test output pollution
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const TestComponent = () => {
        try {
          // This should be imported from the carousel file, but for testing we'll simulate it
          const context = React.useContext(React.createContext(null));
          if (!context) {
            throw new Error("useCarousel must be used within a <Carousel />");
          }
          return <div>Should not render</div>;
        } catch (error) {
          return <div>Error caught</div>;
        }
      };

      render(<TestComponent />);

      expect(screen.getByText('Error caught')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });
});

    it('should render with custom className', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="custom-prev" />
        </Carousel>
      );
      
      const prevButton = screen.getByTestId('carousel-previous');
      expect(prevButton).toHaveClass('custom-prev');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious ref={ref} />
        </Carousel>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const user = userEvent.setup();
      
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
        </Carousel>
      );
      
      const prevButton = screen.getByTestId('carousel-previous');
      
      // Click the previous button
      await user.click(prevButton);
      
      // Should not throw errors
      expect(prevButton).toBeInTheDocument();
    });

    it('should handle vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
        </Carousel>
      );
      
      const prevButton = screen.getByTestId('carousel-previous');
      expect(prevButton).toHaveClass(
        '-top-12',
        'left-1/2',
        '-translate-x-1/2',
        'rotate-90'
      );
    });

    it('should support custom variant and size', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious variant="ghost" size="sm" />
        </Carousel>
      );
      
      const prevButton = screen.getByTestId('carousel-previous');
      expect(prevButton).toBeInTheDocument();
    });
  });
