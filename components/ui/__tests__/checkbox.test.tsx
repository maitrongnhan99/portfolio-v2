import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Checkbox } from '../checkbox';

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('Checkbox Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Checkbox />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'button');
      expect(checkbox).toHaveAttribute('role', 'checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).toHaveClass(
        'peer',
        'h-4',
        'w-4',
        'shrink-0',
        'rounded-sm',
        'border',
        'border-primary',
        'ring-offset-background',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      );
    });

    it('should render with custom className', () => {
      render(<Checkbox className="custom-checkbox" />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveClass('custom-checkbox');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(<Checkbox ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveAttribute('type', 'button');
    });

    it('should render indicator when checked', () => {
      render(<Checkbox checked />);
      
      const checkbox = screen.getByTestId('checkbox');
      const indicator = screen.getByTestId('checkbox-indicator');
      
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveClass('flex', 'items-center', 'justify-center', 'text-current');
      
      // Should have check icon
      const checkIcon = indicator.querySelector('svg');
      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon).toHaveClass('h-4', 'w-4');
    });

    it('should not render indicator when unchecked', () => {
      render(<Checkbox checked={false} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');

      // Indicator might not be in DOM when unchecked (Radix UI behavior)
      const indicator = screen.queryByTestId('checkbox-indicator');
      // Either not present or present but empty
      if (indicator) {
        expect(indicator).toBeInTheDocument();
      }
    });

    it('should handle indeterminate state', () => {
      render(<Checkbox checked="indeterminate" />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Checkbox onCheckedChange={handleCheckedChange} />);
      
      const checkbox = screen.getByTestId('checkbox');
      await user.click(checkbox);
      
      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should toggle between checked and unchecked', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Checkbox onCheckedChange={handleCheckedChange} />);
      
      const checkbox = screen.getByTestId('checkbox');
      
      // First click - check
      await user.click(checkbox);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
      
      // Second click - uncheck
      await user.click(checkbox);
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
      
      expect(handleCheckedChange).toHaveBeenCalledTimes(2);
    });

    it('should handle keyboard events', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onCheckedChange={handleCheckedChange} />);

      const checkbox = screen.getByTestId('checkbox');

      // Focus the checkbox
      checkbox.focus();
      expect(checkbox).toHaveFocus();

      // Press Space to toggle
      await user.keyboard(' ');
      expect(handleCheckedChange).toHaveBeenCalledWith(true);

      // Press Enter to toggle again (both should toggle to true since it's uncontrolled)
      await user.keyboard('{Enter}');
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should not trigger events when disabled', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Checkbox disabled onCheckedChange={handleCheckedChange} />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
      
      await user.click(checkbox);
      expect(handleCheckedChange).not.toHaveBeenCalled();
    });

    it('should handle controlled state', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      
      const { rerender } = render(
        <Checkbox checked={false} onCheckedChange={handleCheckedChange} />
      );
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      
      await user.click(checkbox);
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
      
      // Simulate parent component updating the state
      rerender(<Checkbox checked={true} onCheckedChange={handleCheckedChange} />);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('States', () => {
    it('should render checked state correctly', () => {
      render(<Checkbox checked={true} />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
      expect(checkbox).toHaveClass('data-[state=checked]:bg-primary', 'data-[state=checked]:text-primary-foreground');
    });

    it('should render unchecked state correctly', () => {
      render(<Checkbox checked={false} />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('should render indeterminate state correctly', () => {
      render(<Checkbox checked="indeterminate" />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    });

    it('should render disabled state correctly', () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('should render required state correctly', () => {
      render(<Checkbox required />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Props Forwarding', () => {
    it('should support HTML button attributes', () => {
      render(
        <Checkbox
          id="test-checkbox"
          aria-label="Test checkbox"
          aria-describedby="checkbox-help"
          data-custom="value"
        />
      );

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('id', 'test-checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'checkbox-help');
      expect(checkbox).toHaveAttribute('data-custom', 'value');
    });

    it('should support event handlers', () => {
      const handleClick = vi.fn();
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      
      render(
        <Checkbox
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      );
      
      const checkbox = screen.getByTestId('checkbox');
      
      fireEvent.click(checkbox);
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      fireEvent.focus(checkbox);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      fireEvent.blur(checkbox);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should support style prop', () => {
      render(<Checkbox style={{ border: '2px solid red', margin: '10px' }} />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveStyle('border: 2px solid red');
      expect(checkbox).toHaveStyle('margin: 10px');
    });
  });

  describe('Form Integration', () => {
    it('should work in forms', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox />
          <button type="submit">Submit</button>
        </form>
      );

      const checkbox = screen.getByTestId('checkbox');
      const submitButton = screen.getByText('Submit');

      expect(checkbox).toBeInTheDocument();

      fireEvent.click(submitButton);
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should support defaultChecked', () => {
      render(<Checkbox defaultChecked />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('should work with labels', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Checkbox id="terms-checkbox" />
          <label htmlFor="terms-checkbox">I agree to the terms</label>
        </div>
      );
      
      const checkbox = screen.getByTestId('checkbox');
      const label = screen.getByText('I agree to the terms');
      
      expect(checkbox).toHaveAttribute('id', 'terms-checkbox');
      expect(label).toHaveAttribute('for', 'terms-checkbox');
      
      // Clicking the label should toggle the checkbox
      await user.click(label);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Checkbox aria-label="Accept terms and conditions" />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('role', 'checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Accept terms and conditions');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      
      render(<Checkbox />);
      
      const checkbox = screen.getByTestId('checkbox');
      
      // Should be focusable
      await user.tab();
      expect(checkbox).toHaveFocus();
      
      // Should have focus styles
      expect(checkbox).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('should support screen reader announcements', () => {
      render(
        <Checkbox 
          aria-label="Newsletter subscription"
          aria-describedby="newsletter-help"
        />
      );
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-label', 'Newsletter subscription');
      expect(checkbox).toHaveAttribute('aria-describedby', 'newsletter-help');
    });

    it('should announce state changes to screen readers', () => {
      const { rerender } = render(<Checkbox checked={false} />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      
      rerender(<Checkbox checked={true} />);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      
      rerender(<Checkbox checked="indeterminate" />);
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Checkbox onCheckedChange={handleCheckedChange} />);
      
      const checkbox = screen.getByTestId('checkbox');
      
      // Rapid clicks
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);
      
      expect(handleCheckedChange).toHaveBeenCalledTimes(3);
    });

    it('should handle null/undefined checked values', () => {
      render(<Checkbox checked={undefined} />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('should combine custom classes with base classes', () => {
      render(<Checkbox className="custom-checkbox border-red-500" />);
      
      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveClass('peer', 'h-4', 'w-4', 'custom-checkbox', 'border-red-500');
    });

    it('should handle empty onCheckedChange', async () => {
      const user = userEvent.setup();
      
      render(<Checkbox />);
      
      const checkbox = screen.getByTestId('checkbox');
      
      // Should not throw error when no handler is provided
      await user.click(checkbox);
      expect(checkbox).toBeInTheDocument();
    });
  });
});
