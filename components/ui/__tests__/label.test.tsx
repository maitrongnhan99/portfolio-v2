import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Label } from '../label';

describe('Label Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Label>Label Text</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Label Text');
      expect(label.tagName).toBe('LABEL');
    });

    it('should render with custom className', () => {
      render(<Label className="custom-class">Custom Label</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toHaveClass('custom-class');
    });

    it('should render with children', () => {
      render(
        <Label>
          <span>Icon</span>
          Label Text
        </Label>
      );
      
      const label = screen.getByTestId('label');
      expect(label).toHaveTextContent('IconLabel Text');
    });
  });

  describe('Base Styling', () => {
    it('should have base label classes', () => {
      render(<Label>Styled Label</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toHaveClass(
        'text-sm',
        'font-medium',
        'leading-none',
        'peer-disabled:cursor-not-allowed',
        'peer-disabled:opacity-70'
      );
    });

    it('should combine custom className with base classes', () => {
      render(<Label className="text-red-500">Custom Styled Label</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toHaveClass('text-sm', 'font-medium', 'text-red-500');
    });
  });

  describe('Form Association', () => {
    it('should associate with form control using htmlFor', () => {
      render(
        <div>
          <Label htmlFor="test-input">Input Label</Label>
          <input id="test-input" type="text" />
        </div>
      );
      
      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('should work with nested form controls', () => {
      render(
        <Label>
          Checkbox Label
          <input type="checkbox" />
        </Label>
      );
      
      const label = screen.getByTestId('label');
      const checkbox = screen.getByRole('checkbox');
      expect(label).toContainElement(checkbox);
    });
  });

  describe('Props Forwarding', () => {
    it('should forward HTML label attributes', () => {
      render(
        <Label 
          id="test-label"
          title="Label tooltip"
          form="test-form"
        >
          Form Label
        </Label>
      );
      
      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('id', 'test-label');
      expect(label).toHaveAttribute('title', 'Label tooltip');
      expect(label).toHaveAttribute('form', 'test-form');
    });

    it('should support data attributes', () => {
      render(
        <Label data-field="username" data-required="true">
          Username
        </Label>
      );
      
      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('data-field', 'username');
      expect(label).toHaveAttribute('data-required', 'true');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLLabelElement>();
      
      render(<Label ref={ref}>Label with ref</Label>);
      
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current).toHaveTextContent('Label with ref');
    });
  });

  describe('Accessibility', () => {
    it('should support aria attributes', () => {
      render(
        <Label 
          aria-describedby="description"
          aria-required="true"
        >
          Required Field
        </Label>
      );
      
      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('aria-describedby', 'description');
      expect(label).toHaveAttribute('aria-required', 'true');
    });

    it('should be accessible by screen readers', () => {
      render(
        <div>
          <Label htmlFor="accessible-input">Screen Reader Label</Label>
          <input id="accessible-input" type="text" />
        </div>
      );

      const input = screen.getByLabelText('Screen Reader Label');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'accessible-input');
    });

    it('should support role attribute', () => {
      render(<Label role="presentation">Presentation Label</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toHaveAttribute('role', 'presentation');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Label></Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('');
    });

    it('should handle numeric children', () => {
      render(<Label>{123}</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toHaveTextContent('123');
    });

    it('should handle boolean children', () => {
      render(<Label>{true && 'Conditional Label'}</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toHaveTextContent('Conditional Label');
    });

    it('should handle null/undefined children gracefully', () => {
      render(<Label>{null}</Label>);
      
      const label = screen.getByTestId('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('');
    });

    it('should handle complex nested content', () => {
      render(
        <Label>
          <strong>Bold</strong>
          <em>Italic</em>
          <span className="text-red-500">Colored</span>
        </Label>
      );
      
      const label = screen.getByTestId('label');
      expect(label).toHaveTextContent('BoldItalicColored');
      expect(label.querySelector('strong')).toBeInTheDocument();
      expect(label.querySelector('em')).toBeInTheDocument();
      expect(label.querySelector('.text-red-500')).toBeInTheDocument();
    });
  });

  describe('Peer Disabled Styles', () => {
    it('should have peer-disabled styles', () => {
      render(
        <div>
          <input disabled className="peer" />
          <Label>Disabled Peer Label</Label>
        </div>
      );
      
      const label = screen.getByTestId('label');
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
    });
  });

  describe('Form Integration', () => {
    it('should work in a complete form setup', () => {
      render(
        <form>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <input 
              id="email" 
              type="email" 
              name="email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <input 
              id="password" 
              type="password" 
              name="password"
              required
            />
          </div>
        </form>
      );
      
      const emailLabel = screen.getByText('Email Address');
      const passwordLabel = screen.getByText('Password');
      const emailInput = screen.getByLabelText('Email Address');
      const passwordInput = screen.getByLabelText('Password');
      
      expect(emailLabel).toHaveAttribute('for', 'email');
      expect(passwordLabel).toHaveAttribute('for', 'password');
      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });
});
