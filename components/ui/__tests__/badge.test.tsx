import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Badge, badgeVariants } from '../badge';

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Badge>Default Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('Default Badge');
      expect(badge.tagName).toBe('DIV');
    });

    it('should render with custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('custom-class');
    });

    it('should render with children', () => {
      render(
        <Badge>
          <span>Icon</span>
          Badge Text
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('IconBadge Text');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Badge variant="default">Default</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(
        'border-transparent',
        'bg-primary',
        'text-primary-foreground'
      );
    });

    it('should render secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(
        'border-transparent',
        'bg-secondary',
        'text-secondary-foreground'
      );
    });

    it('should render destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(
        'border-transparent',
        'bg-destructive',
        'text-destructive-foreground'
      );
    });

    it('should render outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('text-foreground');
    });
  });

  describe('Base Styling', () => {
    it('should have base badge classes', () => {
      render(<Badge>Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'rounded-full',
        'border',
        'px-2.5',
        'py-0.5',
        'text-xs',
        'font-semibold',
        'transition-colors'
      );
    });

    it('should have focus styles', () => {
      render(<Badge>Focusable Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:ring-offset-2'
      );
    });
  });

  describe('Props Forwarding', () => {
    it('should forward HTML div attributes', () => {
      render(
        <Badge 
          id="test-badge"
          role="status"
          aria-label="Status badge"
          title="Badge tooltip"
        >
          Status
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('id', 'test-badge');
      expect(badge).toHaveAttribute('role', 'status');
      expect(badge).toHaveAttribute('aria-label', 'Status badge');
      expect(badge).toHaveAttribute('title', 'Badge tooltip');
    });

    it('should support data attributes', () => {
      render(
        <Badge data-value="test" data-category="info">
          Data Badge
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-value', 'test');
      expect(badge).toHaveAttribute('data-category', 'info');
    });
  });

  describe('Accessibility', () => {
    it('should support aria attributes', () => {
      render(
        <Badge aria-describedby="description" aria-live="polite">
          Accessible Badge
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('aria-describedby', 'description');
      expect(badge).toHaveAttribute('aria-live', 'polite');
    });

    it('should be focusable when tabIndex is provided', () => {
      render(<Badge tabIndex={0}>Focusable Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Badge></Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('');
    });

    it('should handle numeric children', () => {
      render(<Badge>{42}</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('42');
    });

    it('should handle boolean children', () => {
      render(<Badge>{true && 'Conditional Text'}</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('Conditional Text');
    });

    it('should handle null/undefined children gracefully', () => {
      render(<Badge>{null}</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('');
    });

    it('should combine custom className with variant classes', () => {
      render(<Badge variant="destructive" className="custom-spacing">Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-destructive', 'custom-spacing');
    });
  });

  describe('badgeVariants utility', () => {
    it('should generate correct classes for default variant', () => {
      const classes = badgeVariants();
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should generate correct classes for secondary variant', () => {
      const classes = badgeVariants({ variant: 'secondary' });
      expect(classes).toContain('bg-secondary');
      expect(classes).toContain('text-secondary-foreground');
    });

    it('should generate correct classes for destructive variant', () => {
      const classes = badgeVariants({ variant: 'destructive' });
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-destructive-foreground');
    });

    it('should generate correct classes for outline variant', () => {
      const classes = badgeVariants({ variant: 'outline' });
      expect(classes).toContain('text-foreground');
    });
  });

  describe('Styling Combinations', () => {
    it('should apply hover styles for default variant', () => {
      render(<Badge variant="default">Hover Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('hover:bg-primary/80');
    });

    it('should apply hover styles for secondary variant', () => {
      render(<Badge variant="secondary">Hover Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('hover:bg-secondary/80');
    });

    it('should apply hover styles for destructive variant', () => {
      render(<Badge variant="destructive">Hover Badge</Badge>);
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('hover:bg-destructive/80');
    });
  });
});
