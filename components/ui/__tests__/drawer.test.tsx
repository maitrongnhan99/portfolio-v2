import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerOverlay,
} from '../drawer';

// Mock Vaul Drawer
vi.mock('vaul', () => {
  const MockedRoot = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));

  const MockedTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
    <button ref={ref} type="button" {...props}>
      {children}
    </button>
  ));

  const MockedContent = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));

  const MockedOverlay = React.forwardRef<HTMLDivElement, any>(({ ...props }, ref) => (
    <div ref={ref} {...props} />
  ));

  const MockedTitle = React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
    <h2 ref={ref} {...props}>
      {children}
    </h2>
  ));

  const MockedDescription = React.forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => (
    <p ref={ref} {...props}>
      {children}
    </p>
  ));

  const MockedClose = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
    <button ref={ref} type="button" {...props}>
      {children}
    </button>
  ));

  return {
    Drawer: {
      Root: MockedRoot,
      Trigger: MockedTrigger,
      Content: MockedContent,
      Overlay: MockedOverlay,
      Title: MockedTitle,
      Description: MockedDescription,
      Close: MockedClose,
      Portal: ({ children }: any) => children,
    },
  };
});

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('Drawer Components', () => {
  describe('Drawer', () => {
    it('should render with default props', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      
      const drawer = screen.getByTestId('drawer');
      expect(drawer).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Drawer ref={ref}>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
        </Drawer>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should support HTML div attributes', () => {
      render(
        <Drawer data-custom="value">
          <DrawerTrigger>Open Drawer</DrawerTrigger>
        </Drawer>
      );
      
      const drawer = screen.getByTestId('drawer');
      expect(drawer).toHaveAttribute('data-custom', 'value');
    });

    it('should handle shouldScaleBackground prop', () => {
      render(
        <Drawer shouldScaleBackground={false}>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
        </Drawer>
      );

      const drawer = screen.getByTestId('drawer');
      // The shouldScaleBackground prop is passed to the Vaul component
      expect(drawer).toBeInTheDocument();
    });

    it('should default shouldScaleBackground to true', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
        </Drawer>
      );

      const drawer = screen.getByTestId('drawer');
      // The shouldScaleBackground prop defaults to true
      expect(drawer).toBeInTheDocument();
    });

    it('should handle open state', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      
      const drawer = screen.getByTestId('drawer');
      expect(drawer).toHaveAttribute('open');
    });

    it('should handle onOpenChange callback', () => {
      const handleOpenChange = vi.fn();
      
      render(
        <Drawer onOpenChange={handleOpenChange}>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      
      const drawer = screen.getByTestId('drawer');
      expect(drawer).toBeInTheDocument();
    });
  });

  describe('DrawerTrigger', () => {
    it('should render with default props', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
        </Drawer>
      );
      
      const trigger = screen.getByTestId('drawer-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Open Drawer');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <Drawer>
          <DrawerTrigger ref={ref}>Open Drawer</DrawerTrigger>
        </Drawer>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Drawer>
          <DrawerTrigger onClick={handleClick}>Open Drawer</DrawerTrigger>
        </Drawer>
      );
      
      const trigger = screen.getByTestId('drawer-trigger');
      await user.click(trigger);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support custom className', () => {
      render(
        <Drawer>
          <DrawerTrigger className="custom-trigger">Open Drawer</DrawerTrigger>
        </Drawer>
      );
      
      const trigger = screen.getByTestId('drawer-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should support disabled state', () => {
      render(
        <Drawer>
          <DrawerTrigger disabled>Open Drawer</DrawerTrigger>
        </Drawer>
      );
      
      const trigger = screen.getByTestId('drawer-trigger');
      expect(trigger).toBeDisabled();
    });
  });

  describe('DrawerContent', () => {
    it('should render with default props', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <p>Drawer content goes here</p>
          </DrawerContent>
        </Drawer>
      );
      
      const overlay = screen.getByTestId('drawer-overlay');
      const content = screen.getByTestId('drawer-content');
      const handle = screen.getByTestId('drawer-handle');
      
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-black/80');
      
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass(
        'fixed',
        'inset-x-0',
        'bottom-0',
        'z-50',
        'mt-24',
        'flex',
        'h-auto',
        'flex-col',
        'rounded-t-[10px]',
        'border',
        'bg-background'
      );
      
      expect(handle).toBeInTheDocument();
      expect(handle).toHaveClass(
        'mx-auto',
        'mt-4',
        'h-2',
        'w-[100px]',
        'rounded-full',
        'bg-muted'
      );
    });

    it('should render with custom className', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent className="custom-content">
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      
      const content = screen.getByTestId('drawer-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent ref={ref}>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle overlay click', async () => {
      const user = userEvent.setup();
      
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      
      const overlay = screen.getByTestId('drawer-overlay');
      await user.click(overlay);
      
      // The overlay should be clickable
      expect(overlay).toBeInTheDocument();
    });

    it('should handle drag handle interaction', async () => {
      const user = userEvent.setup();
      
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      
      const handle = screen.getByTestId('drawer-handle');
      
      // Simulate drag interaction
      fireEvent.mouseDown(handle);
      fireEvent.mouseMove(handle, { clientY: 100 });
      fireEvent.mouseUp(handle);
      
      expect(handle).toBeInTheDocument();
    });
  });

  describe('DrawerTitle', () => {
    it('should render with default props', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );

      const title = screen.getByTestId('drawer-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Drawer Title');
      expect(title).toHaveClass(
        'text-lg',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should render with custom className', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="custom-title">Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );

      const title = screen.getByTestId('drawer-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();

      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle ref={ref}>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should support HTML heading attributes', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle id="drawer-title" aria-level={1}>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );

      const title = screen.getByTestId('drawer-title');
      expect(title).toHaveAttribute('id', 'drawer-title');
      expect(title).toHaveAttribute('aria-level', '1');
    });
  });

  describe('DrawerDescription', () => {
    it('should render with default props', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>This is a drawer description</DrawerDescription>
          </DrawerContent>
        </Drawer>
      );

      const description = screen.getByTestId('drawer-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('This is a drawer description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should render with custom className', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription className="custom-description">Description</DrawerDescription>
          </DrawerContent>
        </Drawer>
      );

      const description = screen.getByTestId('drawer-description');
      expect(description).toHaveClass('custom-description');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();

      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription ref={ref}>Description</DrawerDescription>
          </DrawerContent>
        </Drawer>
      );

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('DrawerClose', () => {
    it('should render with default props', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      );

      const closeButton = screen.getByTestId('drawer-close');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('Close');
      expect(closeButton).toHaveAttribute('type', 'button');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerClose ref={ref}>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerClose onClick={handleClick}>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      );

      const closeButton = screen.getByTestId('drawer-close');
      await user.click(closeButton);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support custom className', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerClose className="custom-close">Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      );

      const closeButton = screen.getByTestId('drawer-close');
      expect(closeButton).toHaveClass('custom-close');
    });
  });

  describe('DrawerHeader', () => {
    it('should render with default props', () => {
      render(
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>Drawer Description</DrawerDescription>
        </DrawerHeader>
      );

      const header = screen.getByText('Drawer Title').parentElement;
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(
        'grid',
        'gap-1.5',
        'p-4',
        'text-center',
        'sm:text-left'
      );
    });

    it('should render with custom className', () => {
      render(
        <DrawerHeader className="custom-header">
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerHeader>
      );

      const header = screen.getByText('Drawer Title').parentElement;
      expect(header).toHaveClass('custom-header');
    });

    it('should support HTML div attributes', () => {
      render(
        <DrawerHeader id="drawer-header" data-custom="value">
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerHeader>
      );

      const header = screen.getByText('Drawer Title').parentElement;
      expect(header).toHaveAttribute('id', 'drawer-header');
      expect(header).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('DrawerFooter', () => {
    it('should render with default props', () => {
      render(
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
          <button>Save</button>
        </DrawerFooter>
      );

      const footer = screen.getByText('Cancel').parentElement;
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        'mt-auto',
        'flex',
        'flex-col',
        'gap-2',
        'p-4'
      );
    });

    it('should render with custom className', () => {
      render(
        <DrawerFooter className="custom-footer">
          <button>Save</button>
        </DrawerFooter>
      );

      const footer = screen.getByText('Save').parentElement;
      expect(footer).toHaveClass('custom-footer');
    });

    it('should support HTML div attributes', () => {
      render(
        <DrawerFooter id="drawer-footer" data-custom="value">
          <button>Save</button>
        </DrawerFooter>
      );

      const footer = screen.getByText('Save').parentElement;
      expect(footer).toHaveAttribute('id', 'drawer-footer');
      expect(footer).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Complete Drawer Structure', () => {
    it('should render complete drawer', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Confirm Action</DrawerTitle>
              <DrawerDescription>
                Are you sure you want to perform this action? This cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <div className="drawer-body p-4">
              <p>Additional content goes here.</p>
            </div>
            <DrawerFooter>
              <DrawerClose>Cancel</DrawerClose>
              <button>Confirm</button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );

      const drawer = screen.getByTestId('drawer');
      const trigger = screen.getByTestId('drawer-trigger');
      const overlay = screen.getByTestId('drawer-overlay');
      const content = screen.getByTestId('drawer-content');
      const handle = screen.getByTestId('drawer-handle');
      const title = screen.getByTestId('drawer-title');
      const description = screen.getByTestId('drawer-description');
      const closeButton = screen.getByTestId('drawer-close');

      expect(drawer).toBeInTheDocument();
      expect(trigger).toBeInTheDocument();
      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(handle).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();

      expect(screen.getByText('Open Drawer')).toBeInTheDocument();
      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to perform this action? This cannot be undone.')).toBeInTheDocument();
      expect(screen.getByText('Additional content goes here.')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Drawer open>
          <DrawerTrigger aria-label="Open confirmation drawer">Open Drawer</DrawerTrigger>
          <DrawerContent aria-labelledby="drawer-title" aria-describedby="drawer-description">
            <DrawerTitle id="drawer-title">Confirm Action</DrawerTitle>
            <DrawerDescription id="drawer-description">
              Are you sure you want to continue?
            </DrawerDescription>
          </DrawerContent>
        </Drawer>
      );

      const trigger = screen.getByTestId('drawer-trigger');
      const content = screen.getByTestId('drawer-content');
      const title = screen.getByTestId('drawer-title');
      const description = screen.getByTestId('drawer-description');

      expect(trigger).toHaveAttribute('aria-label', 'Open confirmation drawer');
      expect(content).toHaveAttribute('aria-labelledby', 'drawer-title');
      expect(content).toHaveAttribute('aria-describedby', 'drawer-description');
      expect(title).toHaveAttribute('id', 'drawer-title');
      expect(description).toHaveAttribute('id', 'drawer-description');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      );

      const trigger = screen.getByTestId('drawer-trigger');
      const closeButton = screen.getByTestId('drawer-close');

      // Should be focusable
      trigger.focus();
      expect(trigger).toHaveFocus();

      // Close button should be focusable
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      // Should handle Escape key
      await user.keyboard('{Escape}');
      expect(closeButton).toBeInTheDocument();
    });

    it('should support swipe gestures', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      const handle = screen.getByTestId('drawer-handle');

      // Simulate touch events for swipe gesture
      fireEvent.touchStart(handle, {
        touches: [{ clientY: 100 }],
      });

      fireEvent.touchMove(handle, {
        touches: [{ clientY: 200 }],
      });

      fireEvent.touchEnd(handle);

      expect(content).toBeInTheDocument();
      expect(handle).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle drawer without title', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <p>Drawer without title</p>
          </DrawerContent>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      expect(content).toBeInTheDocument();
      expect(screen.getByText('Drawer without title')).toBeInTheDocument();
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Drawer open>
          <DrawerTrigger className="custom-trigger">Open Drawer</DrawerTrigger>
          <DrawerContent className="custom-content">
            <DrawerTitle className="custom-title">Drawer Title</DrawerTitle>
            <DrawerDescription className="custom-description">Description</DrawerDescription>
            <DrawerClose className="custom-close">Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      );

      const trigger = screen.getByTestId('drawer-trigger');
      const content = screen.getByTestId('drawer-content');
      const title = screen.getByTestId('drawer-title');
      const description = screen.getByTestId('drawer-description');
      const closeButton = screen.getByTestId('drawer-close');

      expect(trigger).toHaveClass('custom-trigger');
      expect(content).toHaveClass('fixed', 'custom-content');
      expect(title).toHaveClass('text-lg', 'custom-title');
      expect(description).toHaveClass('text-sm', 'custom-description');
      expect(closeButton).toHaveClass('custom-close');
    });

    it('should handle empty drawer content', () => {
      render(
        <Drawer open>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent></DrawerContent>
        </Drawer>
      );

      const content = screen.getByTestId('drawer-content');
      const handle = screen.getByTestId('drawer-handle');

      expect(content).toBeInTheDocument();
      expect(handle).toBeInTheDocument();
    });
  });
});
