import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Alert, AlertTitle, AlertDescription, alertVariants } from '../alert';

describe('Alert Components', () => {
  describe('Alert', () => {
    it('should render with default props', () => {
      render(<Alert>Alert content</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Alert content');
      expect(alert.tagName).toBe('DIV');
    });

    it('should render with custom className', () => {
      render(<Alert className="custom-alert">Alert</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('custom-alert');
    });

    it('should have role="alert"', () => {
      render(<Alert>Alert</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('role', 'alert');
    });

    it('should have base alert classes', () => {
      render(<Alert>Alert</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass(
        'relative',
        'w-full',
        'rounded-lg',
        'border',
        'p-4'
      );
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<Alert ref={ref}>Alert with ref</Alert>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Alert with ref');
    });

    it('should forward HTML div attributes', () => {
      render(
        <Alert 
          id="test-alert"
          aria-label="Test alert"
          data-priority="high"
        >
          Alert
        </Alert>
      );
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('id', 'test-alert');
      expect(alert).toHaveAttribute('aria-label', 'Test alert');
      expect(alert).toHaveAttribute('data-priority', 'high');
    });
  });

  describe('Alert Variants', () => {
    it('should render default variant', () => {
      render(<Alert variant="default">Default Alert</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-background', 'text-foreground');
    });

    it('should render destructive variant', () => {
      render(<Alert variant="destructive">Destructive Alert</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass(
        'border-destructive/50',
        'text-destructive',
        'dark:border-destructive'
      );
    });

    it('should render without variant (default)', () => {
      render(<Alert>No variant Alert</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-background', 'text-foreground');
    });
  });

  describe('AlertTitle', () => {
    it('should render with default props', () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
        </Alert>
      );
      
      const title = screen.getByTestId('alert-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Alert Title');
      expect(title.tagName).toBe('H5');
    });

    it('should render with custom className', () => {
      render(
        <Alert>
          <AlertTitle className="custom-title">Title</AlertTitle>
        </Alert>
      );
      
      const title = screen.getByTestId('alert-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should have base title classes', () => {
      render(
        <Alert>
          <AlertTitle>Title</AlertTitle>
        </Alert>
      );
      
      const title = screen.getByTestId('alert-title');
      expect(title).toHaveClass(
        'mb-1',
        'font-medium',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      
      render(
        <Alert>
          <AlertTitle ref={ref}>Title</AlertTitle>
        </Alert>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('should support HTML heading attributes', () => {
      render(
        <Alert>
          <AlertTitle id="alert-title" aria-level={2}>
            Accessible Title
          </AlertTitle>
        </Alert>
      );
      
      const title = screen.getByTestId('alert-title');
      expect(title).toHaveAttribute('id', 'alert-title');
      expect(title).toHaveAttribute('aria-level', '2');
    });
  });

  describe('AlertDescription', () => {
    it('should render with default props', () => {
      render(
        <Alert>
          <AlertDescription>Alert description text</AlertDescription>
        </Alert>
      );
      
      const description = screen.getByTestId('alert-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Alert description text');
      expect(description.tagName).toBe('DIV');
    });

    it('should render with custom className', () => {
      render(
        <Alert>
          <AlertDescription className="custom-desc">Description</AlertDescription>
        </Alert>
      );
      
      const description = screen.getByTestId('alert-description');
      expect(description).toHaveClass('custom-desc');
    });

    it('should have base description classes', () => {
      render(
        <Alert>
          <AlertDescription>Description</AlertDescription>
        </Alert>
      );
      
      const description = screen.getByTestId('alert-description');
      expect(description).toHaveClass('text-sm', '[&_p]:leading-relaxed');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>();
      
      render(
        <Alert>
          <AlertDescription ref={ref}>Description</AlertDescription>
        </Alert>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should support HTML div attributes', () => {
      render(
        <Alert>
          <AlertDescription id="alert-desc" aria-describedby="help">
            Description with attributes
          </AlertDescription>
        </Alert>
      );
      
      const description = screen.getByTestId('alert-description');
      expect(description).toHaveAttribute('id', 'alert-desc');
      expect(description).toHaveAttribute('aria-describedby', 'help');
    });

    it('should handle paragraph content correctly', () => {
      render(
        <Alert>
          <AlertDescription>
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </AlertDescription>
        </Alert>
      );
      
      const description = screen.getByTestId('alert-description');
      expect(description).toHaveTextContent('First paragraphSecond paragraph');
      expect(description.querySelectorAll('p')).toHaveLength(2);
    });
  });

  describe('Complete Alert Structure', () => {
    it('should render complete alert with title and description', () => {
      render(
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong. Please try again.</AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      const title = screen.getByTestId('alert-title');
      const description = screen.getByTestId('alert-description');

      expect(alert).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(alert).toContainElement(title);
      expect(alert).toContainElement(description);

      expect(title).toHaveTextContent('Error');
      expect(description).toHaveTextContent('Something went wrong. Please try again.');
    });

    it('should work with only title', () => {
      render(
        <Alert>
          <AlertTitle>Info</AlertTitle>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      const title = screen.getByTestId('alert-title');

      expect(alert).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(alert).toContainElement(title);
    });

    it('should work with only description', () => {
      render(
        <Alert>
          <AlertDescription>Simple alert message</AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      const description = screen.getByTestId('alert-description');

      expect(alert).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(alert).toContainElement(description);
    });

    it('should work with icon and content', () => {
      const AlertIcon = () => <svg data-testid="alert-icon">Icon</svg>;
      
      render(
        <Alert>
          <AlertIcon />
          <AlertTitle>Alert with Icon</AlertTitle>
          <AlertDescription>This alert has an icon</AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      const icon = screen.getByTestId('alert-icon');
      const title = screen.getByTestId('alert-title');
      const description = screen.getByTestId('alert-description');

      expect(alert).toContainElement(icon);
      expect(alert).toContainElement(title);
      expect(alert).toContainElement(description);
    });
  });

  describe('Icon Styling', () => {
    it('should have icon-specific classes for SVG positioning', () => {
      render(<Alert>Alert with icon classes</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass(
        '[&>svg~*]:pl-7',
        '[&>svg+div]:translate-y-[-3px]',
        '[&>svg]:absolute',
        '[&>svg]:left-4',
        '[&>svg]:top-4',
        '[&>svg]:text-foreground'
      );
    });

    it('should apply destructive icon styling for destructive variant', () => {
      render(<Alert variant="destructive">Destructive alert</Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('[&>svg]:text-destructive');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by screen readers', () => {
      render(
        <Alert>
          <AlertTitle>Accessible Alert</AlertTitle>
          <AlertDescription>This is an accessible alert message</AlertDescription>
        </Alert>
      );
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Accessible AlertThis is an accessible alert message');
    });

    it('should support additional ARIA attributes', () => {
      render(
        <Alert aria-live="polite" aria-atomic="true">
          <AlertDescription>Live region alert</AlertDescription>
        </Alert>
      );
      
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty alert', () => {
      render(<Alert></Alert>);
      
      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('');
    });

    it('should handle complex nested content', () => {
      render(
        <Alert>
          <AlertTitle>
            <span>Complex</span>
            <strong>Title</strong>
          </AlertTitle>
          <AlertDescription>
            <div>
              <p>Nested paragraph</p>
              <ul>
                <li>List item</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveTextContent('ComplexTitleNested paragraphList item');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Alert variant="destructive" className="custom-alert">
          <AlertTitle className="custom-title">Title</AlertTitle>
          <AlertDescription className="custom-desc">Description</AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('alert');
      const title = screen.getByTestId('alert-title');
      const description = screen.getByTestId('alert-description');

      expect(alert).toHaveClass('relative', 'custom-alert', 'text-destructive');
      expect(title).toHaveClass('mb-1', 'custom-title');
      expect(description).toHaveClass('text-sm', 'custom-desc');
    });
  });

  describe('alertVariants utility', () => {
    it('should generate correct classes for default variant', () => {
      const classes = alertVariants();
      expect(classes).toContain('bg-background');
      expect(classes).toContain('text-foreground');
    });

    it('should generate correct classes for destructive variant', () => {
      const classes = alertVariants({ variant: 'destructive' });
      expect(classes).toContain('border-destructive/50');
      expect(classes).toContain('text-destructive');
    });
  });
});
