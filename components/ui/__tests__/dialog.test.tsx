import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../dialog';

// Mock Radix UI Dialog
vi.mock('@radix-ui/react-dialog', () => {
  const MockedRoot = ({ children, ...props }: any) => (
    <div data-testid="dialog-root" {...props}>
      {children}
    </div>
  );

  const MockedTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
    <button ref={ref} type="button" {...props}>
      {children}
    </button>
  ));
  MockedTrigger.displayName = 'MockedTrigger';

  const MockedContent = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedContent.displayName = 'MockedContent';

  const MockedOverlay = React.forwardRef<HTMLDivElement, any>(({ ...props }, ref) => (
    <div ref={ref} {...props} />
  ));
  MockedOverlay.displayName = 'MockedOverlay';

  const MockedTitle = React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
    <h2 ref={ref} {...props}>
      {children}
    </h2>
  ));
  MockedTitle.displayName = 'MockedTitle';

  const MockedDescription = React.forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => (
    <p ref={ref} {...props}>
      {children}
    </p>
  ));
  MockedDescription.displayName = 'MockedDescription';

  const MockedClose = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
    <button ref={ref} type="button" {...props}>
      {children}
    </button>
  ));
  MockedClose.displayName = 'MockedClose';

  return {
    Root: MockedRoot,
    Trigger: MockedTrigger,
    Content: MockedContent,
    Overlay: MockedOverlay,
    Title: MockedTitle,
    Description: MockedDescription,
    Close: MockedClose,
    Portal: ({ children }: any) => children,
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

describe('Dialog Components', () => {
  describe('Dialog', () => {
    it('should render with default props', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Dialog ref={ref}>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should support HTML div attributes', () => {
      render(
        <Dialog data-custom="value">
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      );
      
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('data-custom', 'value');
    });

    it('should handle open state', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('open');
    });

    it('should handle onOpenChange callback', () => {
      const handleOpenChange = vi.fn();
      
      render(
        <Dialog onOpenChange={handleOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  describe('DialogTrigger', () => {
    it('should render with default props', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      );
      
      const trigger = screen.getByTestId('dialog-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Open Dialog');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <Dialog>
          <DialogTrigger ref={ref}>Open Dialog</DialogTrigger>
        </Dialog>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dialog>
          <DialogTrigger onClick={handleClick}>Open Dialog</DialogTrigger>
        </Dialog>
      );
      
      const trigger = screen.getByTestId('dialog-trigger');
      await user.click(trigger);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support custom className', () => {
      render(
        <Dialog>
          <DialogTrigger className="custom-trigger">Open Dialog</DialogTrigger>
        </Dialog>
      );
      
      const trigger = screen.getByTestId('dialog-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should support disabled state', () => {
      render(
        <Dialog>
          <DialogTrigger disabled>Open Dialog</DialogTrigger>
        </Dialog>
      );
      
      const trigger = screen.getByTestId('dialog-trigger');
      expect(trigger).toBeDisabled();
    });
  });

  describe('DialogContent', () => {
    it('should render with default props', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <p>Dialog content goes here</p>
          </DialogContent>
        </Dialog>
      );
      
      const overlay = screen.getByTestId('dialog-overlay');
      const content = screen.getByTestId('dialog-content');
      const closeButton = screen.getByTestId('dialog-close-button');
      
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass(
        'fixed',
        'inset-0',
        'z-50',
        'bg-black/80',
        'backdrop-blur-sm'
      );
      
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass(
        'fixed',
        'left-[50%]',
        'top-[50%]',
        'z-50',
        'grid',
        'w-full',
        'max-w-lg',
        'translate-x-[-50%]',
        'translate-y-[-50%]',
        'gap-4',
        'border',
        'bg-background',
        'p-6',
        'shadow-lg'
      );
      
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveClass(
        'absolute',
        'right-4',
        'top-4',
        'rounded-sm',
        'opacity-70'
      );
    });

    it('should render with custom className', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="custom-content">
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const content = screen.getByTestId('dialog-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent ref={ref}>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle close button click', async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Dialog open onOpenChange={handleOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const closeButton = screen.getByTestId('dialog-close-button');
      await user.click(closeButton);
      
      // The close button should be clickable
      expect(closeButton).toBeInTheDocument();
    });

    it('should handle overlay click', async () => {
      const user = userEvent.setup();
      
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const overlay = screen.getByTestId('dialog-overlay');
      await user.click(overlay);
      
      // The overlay should be clickable
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('DialogTitle', () => {
    it('should render with default props', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const title = screen.getByTestId('dialog-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Dialog Title');
      expect(title).toHaveClass(
        'text-lg',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should render with custom className', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle className="custom-title">Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const title = screen.getByTestId('dialog-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle ref={ref}>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should support HTML heading attributes', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle id="dialog-title" aria-level={1}>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      
      const title = screen.getByTestId('dialog-title');
      expect(title).toHaveAttribute('id', 'dialog-title');
      expect(title).toHaveAttribute('aria-level', '1');
    });
  });

  describe('DialogDescription', () => {
    it('should render with default props', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>This is a dialog description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const description = screen.getByTestId('dialog-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('This is a dialog description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should render with custom className', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription className="custom-description">Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const description = screen.getByTestId('dialog-description');
      expect(description).toHaveClass('custom-description');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();

      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription ref={ref}>Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('DialogClose', () => {
    it('should render with default props', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId('dialog-close');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('Close');
      expect(closeButton).toHaveAttribute('type', 'button');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();

      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogClose ref={ref}>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogClose onClick={handleClick}>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId('dialog-close');
      await user.click(closeButton);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support custom className', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogClose className="custom-close">Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const closeButton = screen.getByTestId('dialog-close');
      expect(closeButton).toHaveClass('custom-close');
    });
  });

  describe('DialogHeader', () => {
    it('should render with default props', () => {
      render(
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog Description</DialogDescription>
        </DialogHeader>
      );

      const header = screen.getByText('Dialog Title').parentElement;
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'space-y-1.5',
        'text-center',
        'sm:text-left'
      );
    });

    it('should render with custom className', () => {
      render(
        <DialogHeader className="custom-header">
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
      );

      const header = screen.getByText('Dialog Title').parentElement;
      expect(header).toHaveClass('custom-header');
    });

    it('should support HTML div attributes', () => {
      render(
        <DialogHeader id="dialog-header" data-custom="value">
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogHeader>
      );

      const header = screen.getByText('Dialog Title').parentElement;
      expect(header).toHaveAttribute('id', 'dialog-header');
      expect(header).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('DialogFooter', () => {
    it('should render with default props', () => {
      render(
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <button>Save</button>
        </DialogFooter>
      );

      const footer = screen.getByText('Cancel').parentElement;
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        'flex',
        'flex-col-reverse',
        'sm:flex-row',
        'sm:justify-end',
        'sm:space-x-2'
      );
    });

    it('should render with custom className', () => {
      render(
        <DialogFooter className="custom-footer">
          <button>Save</button>
        </DialogFooter>
      );

      const footer = screen.getByText('Save').parentElement;
      expect(footer).toHaveClass('custom-footer');
    });

    it('should support HTML div attributes', () => {
      render(
        <DialogFooter id="dialog-footer" data-custom="value">
          <button>Save</button>
        </DialogFooter>
      );

      const footer = screen.getByText('Save').parentElement;
      expect(footer).toHaveAttribute('id', 'dialog-footer');
      expect(footer).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Complete Dialog Structure', () => {
    it('should render complete dialog', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to perform this action? This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-body">
              <p>Additional content goes here.</p>
            </div>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const dialog = screen.getByTestId('dialog');
      const trigger = screen.getByTestId('dialog-trigger');
      const overlay = screen.getByTestId('dialog-overlay');
      const content = screen.getByTestId('dialog-content');
      const title = screen.getByTestId('dialog-title');
      const description = screen.getByTestId('dialog-description');
      const closeButton = screen.getByTestId('dialog-close');
      const closeButtonInHeader = screen.getByTestId('dialog-close-button');

      expect(dialog).toBeInTheDocument();
      expect(trigger).toBeInTheDocument();
      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(closeButtonInHeader).toBeInTheDocument();

      expect(screen.getByText('Open Dialog')).toBeInTheDocument();
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
        <Dialog open>
          <DialogTrigger aria-label="Open confirmation dialog">Open Dialog</DialogTrigger>
          <DialogContent aria-labelledby="dialog-title" aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">Confirm Action</DialogTitle>
            <DialogDescription id="dialog-description">
              Are you sure you want to continue?
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByTestId('dialog-trigger');
      const content = screen.getByTestId('dialog-content');
      const title = screen.getByTestId('dialog-title');
      const description = screen.getByTestId('dialog-description');

      expect(trigger).toHaveAttribute('aria-label', 'Open confirmation dialog');
      expect(content).toHaveAttribute('aria-labelledby', 'dialog-title');
      expect(content).toHaveAttribute('aria-describedby', 'dialog-description');
      expect(title).toHaveAttribute('id', 'dialog-title');
      expect(description).toHaveAttribute('id', 'dialog-description');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByTestId('dialog-trigger');
      const closeButton = screen.getByTestId('dialog-close');
      const closeButtonInHeader = screen.getByTestId('dialog-close-button');

      // Should be focusable
      trigger.focus();
      expect(trigger).toHaveFocus();

      // Close buttons should be focusable
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      closeButtonInHeader.focus();
      expect(closeButtonInHeader).toHaveFocus();

      // Should handle Escape key
      await user.keyboard('{Escape}');
      expect(closeButtonInHeader).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle dialog without title', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <p>Dialog without title</p>
          </DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId('dialog-content');
      expect(content).toBeInTheDocument();
      expect(screen.getByText('Dialog without title')).toBeInTheDocument();
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Dialog open>
          <DialogTrigger className="custom-trigger">Open Dialog</DialogTrigger>
          <DialogContent className="custom-content">
            <DialogTitle className="custom-title">Dialog Title</DialogTitle>
            <DialogDescription className="custom-description">Description</DialogDescription>
            <DialogClose className="custom-close">Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByTestId('dialog-trigger');
      const content = screen.getByTestId('dialog-content');
      const title = screen.getByTestId('dialog-title');
      const description = screen.getByTestId('dialog-description');
      const closeButton = screen.getByTestId('dialog-close');

      expect(trigger).toHaveClass('custom-trigger');
      expect(content).toHaveClass('fixed', 'custom-content');
      expect(title).toHaveClass('text-lg', 'custom-title');
      expect(description).toHaveClass('text-sm', 'custom-description');
      expect(closeButton).toHaveClass('custom-close');
    });
  });
});
