import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../alert-dialog';

describe('AlertDialog Components', () => {
  describe('AlertDialog Root', () => {
    it('should render trigger and content when open', () => {
      render(
        <AlertDialog open>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog Title</AlertDialogTitle>
            <AlertDialogDescription>Dialog Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      // When dialog is open, trigger is hidden but still in document
      const trigger = screen.getByText('Open Dialog');
      const title = screen.getByTestId('alert-dialog-title');
      const description = screen.getByTestId('alert-dialog-description');

      expect(trigger).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('should not render content when closed', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      expect(trigger).toBeInTheDocument();
      
      // Content should not be in the document when closed
      expect(screen.queryByTestId('alert-dialog-title')).not.toBeInTheDocument();
    });

    it('should handle controlled state', () => {
      const handleOpenChange = vi.fn();
      
      render(
        <AlertDialog open={true} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Controlled Dialog</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const title = screen.getByTestId('alert-dialog-title');
      expect(title).toBeInTheDocument();
    });
  });

  describe('AlertDialogTrigger', () => {
    it('should render as button by default', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger>Trigger Button</AlertDialogTrigger>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>
      );
      
      const trigger = screen.getByRole('button', { name: 'Trigger Button' });
      expect(trigger).toBeInTheDocument();
    });

    it('should open dialog when clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <AlertDialog>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Opened Dialog</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);
      
      const title = screen.getByTestId('alert-dialog-title');
      expect(title).toBeInTheDocument();
    });

    it('should support asChild prop', () => {
      render(
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="custom-trigger">Custom Trigger</button>
          </AlertDialogTrigger>
          <AlertDialogContent>Content</AlertDialogContent>
        </AlertDialog>
      );
      
      const trigger = screen.getByRole('button', { name: 'Custom Trigger' });
      expect(trigger).toHaveClass('custom-trigger');
    });
  });

  describe('AlertDialogOverlay', () => {
    it('should render with default classes when dialog is open', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const overlay = screen.getByTestId('alert-dialog-overlay');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass(
        'fixed',
        'inset-0',
        'z-50',
        'bg-black/80'
      );
    });

    it('should render with custom className', () => {
      const CustomOverlay = React.forwardRef<
        React.ElementRef<typeof AlertDialogOverlay>,
        React.ComponentPropsWithoutRef<typeof AlertDialogOverlay>
      >((props, ref) => (
        <AlertDialogOverlay ref={ref} className="custom-overlay" {...props} />
      ));
      CustomOverlay.displayName = 'CustomOverlay';

      render(
        <AlertDialog open>
          <AlertDialogPortal>
            <CustomOverlay />
            <AlertDialogContent>
              <AlertDialogTitle>Dialog</AlertDialogTitle>
              <AlertDialogDescription>Description</AlertDialogDescription>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      );

      const overlays = screen.getAllByTestId('alert-dialog-overlay');
      const customOverlay = overlays.find(overlay => overlay.classList.contains('custom-overlay'));
      expect(customOverlay).toBeInTheDocument();
      expect(customOverlay).toHaveClass('custom-overlay');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <AlertDialog open>
          <AlertDialogPortal>
            <AlertDialogOverlay ref={ref} />
            <AlertDialogContent>
              <AlertDialogTitle>Dialog</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialog>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('AlertDialogContent', () => {
    it('should render with default classes when dialog is open', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Content Dialog</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const content = screen.getByTestId('alert-dialog-content');
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
    });

    it('should render with custom className', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent className="custom-content">
            <AlertDialogTitle>Custom Content</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const content = screen.getByTestId('alert-dialog-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <AlertDialog open>
          <AlertDialogContent ref={ref}>
            <AlertDialogTitle>Ref Dialog</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should include overlay automatically', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog with Overlay</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const overlay = screen.getByTestId('alert-dialog-overlay');
      const content = screen.getByTestId('alert-dialog-content');
      
      expect(overlay).toBeInTheDocument();
      expect(content).toBeInTheDocument();
    });
  });

  describe('AlertDialogHeader', () => {
    it('should render with default classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Header Title</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const header = screen.getByTestId('alert-dialog-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'space-y-2',
        'text-center',
        'sm:text-left'
      );
    });

    it('should render with custom className', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader className="custom-header">
              <AlertDialogTitle>Custom Header</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const header = screen.getByTestId('alert-dialog-header');
      expect(header).toHaveClass('custom-header');
    });

    it('should support HTML div attributes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader id="custom-header" role="banner">
              <AlertDialogTitle>Attributed Header</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const header = screen.getByTestId('alert-dialog-header');
      expect(header).toHaveAttribute('id', 'custom-header');
      expect(header).toHaveAttribute('role', 'banner');
    });
  });

  describe('AlertDialogFooter', () => {
    it('should render with default classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const footer = screen.getByTestId('alert-dialog-footer');
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
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogFooter className="custom-footer">
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const footer = screen.getByTestId('alert-dialog-footer');
      expect(footer).toHaveClass('custom-footer');
    });

    it('should support HTML div attributes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogFooter id="custom-footer" role="contentinfo">
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const footer = screen.getByTestId('alert-dialog-footer');
      expect(footer).toHaveAttribute('id', 'custom-footer');
      expect(footer).toHaveAttribute('role', 'contentinfo');
    });
  });

  describe('AlertDialogTitle', () => {
    it('should render with default classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const title = screen.getByTestId('alert-dialog-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Dialog Title');
      expect(title).toHaveClass('text-lg', 'font-semibold');
    });

    it('should render with custom className', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle className="custom-title">Custom Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const title = screen.getByTestId('alert-dialog-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>();
      
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle ref={ref}>Ref Title</AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should support HTML heading attributes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle id="dialog-title" aria-level={2}>
              Accessible Title
            </AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      const title = screen.getByTestId('alert-dialog-title');
      expect(title).toHaveAttribute('id', 'dialog-title');
      expect(title).toHaveAttribute('aria-level', '2');
    });
  });

  describe('AlertDialogDescription', () => {
    it('should render with default classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogDescription>This is a description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const description = screen.getByTestId('alert-dialog-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('This is a description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();

      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogDescription ref={ref}>Ref Description</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('AlertDialogAction', () => {
    it('should render with button variant classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByTestId('alert-dialog-action');
      expect(action).toBeInTheDocument();
      expect(action).toHaveTextContent('Confirm');
      expect(action).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogAction onClick={handleClick}>Click Me</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );

      const action = screen.getByTestId('alert-dialog-action');
      await user.click(action);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('AlertDialogCancel', () => {
    it('should render with outline button variant classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      const cancel = screen.getByTestId('alert-dialog-cancel');
      expect(cancel).toBeInTheDocument();
      expect(cancel).toHaveTextContent('Cancel');
      expect(cancel).toHaveClass('border', 'border-input', 'bg-background');
    });

    it('should render with responsive margin classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Dialog</AlertDialogTitle>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogContent>
        </AlertDialog>
      );

      const cancel = screen.getByTestId('alert-dialog-cancel');
      expect(cancel).toHaveClass('mt-2', 'sm:mt-0');
    });
  });

  describe('Complete AlertDialog Structure', () => {
    it('should render complete dialog with all components', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to perform this action?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

      const content = screen.getByTestId('alert-dialog-content');
      const header = screen.getByTestId('alert-dialog-header');
      const title = screen.getByTestId('alert-dialog-title');
      const description = screen.getByTestId('alert-dialog-description');
      const footer = screen.getByTestId('alert-dialog-footer');
      const cancel = screen.getByTestId('alert-dialog-cancel');
      const action = screen.getByTestId('alert-dialog-action');

      expect(content).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
      expect(cancel).toBeInTheDocument();
      expect(action).toBeInTheDocument();

      expect(title).toHaveTextContent('Confirm Action');
      expect(description).toHaveTextContent('Are you sure you want to perform this action?');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Accessible Dialog</AlertDialogTitle>
            <AlertDialogDescription>This dialog is accessible</AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      );

      const content = screen.getByTestId('alert-dialog-content');
      expect(content).toHaveAttribute('role', 'alertdialog');
      expect(content).toHaveAttribute('aria-labelledby');
      expect(content).toHaveAttribute('aria-describedby');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle></AlertDialogTitle>
          </AlertDialogContent>
        </AlertDialog>
      );

      const title = screen.getByTestId('alert-dialog-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <AlertDialog open>
          <AlertDialogContent className="custom-content">
            <AlertDialogHeader className="custom-header">
              <AlertDialogTitle className="custom-title">Title</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      );

      const content = screen.getByTestId('alert-dialog-content');
      const header = screen.getByTestId('alert-dialog-header');
      const title = screen.getByTestId('alert-dialog-title');

      expect(content).toHaveClass('fixed', 'custom-content');
      expect(header).toHaveClass('flex', 'custom-header');
      expect(title).toHaveClass('text-lg', 'custom-title');
    });
  });
});
