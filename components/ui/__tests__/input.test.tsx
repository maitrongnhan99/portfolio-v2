import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Input } from '../input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Input />);

      const input = screen.getByTestId('input');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      // Default type is text, but attribute may not be present
      expect(input.type).toBe('text');
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
    });

    it('should render with specified type', () => {
      render(<Input type="email" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text here" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });
  });

  describe('Base Styling', () => {
    it('should have base input classes', () => {
      render(<Input />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass(
        'flex',
        'h-10',
        'w-full',
        'rounded-md',
        'border',
        'border-input',
        'bg-background',
        'px-3',
        'py-2',
        'text-base'
      );
    });

    it('should have focus styles', () => {
      render(<Input />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass(
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-ring',
        'focus-visible:ring-offset-2'
      );
    });

    it('should have disabled styles', () => {
      render(<Input disabled />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass(
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      );
      expect(input).toBeDisabled();
    });

    it('should have placeholder styles', () => {
      render(<Input placeholder="Test placeholder" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('placeholder:text-muted-foreground');
    });

    it('should have file input styles', () => {
      render(<Input type="file" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass(
        'file:border-0',
        'file:bg-transparent',
        'file:text-sm',
        'file:font-medium',
        'file:text-foreground'
      );
    });
  });

  describe('Input Types', () => {
    const inputTypes = [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search',
      'date', 'time', 'datetime-local', 'month', 'week', 'color',
      'file', 'hidden', 'range', 'checkbox', 'radio'
    ];

    inputTypes.forEach(type => {
      it(`should render ${type} input type`, () => {
        render(<Input type={type as any} />);
        
        const input = screen.getByTestId('input');
        expect(input).toHaveAttribute('type', type);
      });
    });
  });

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      const user = userEvent.setup();
      render(<Input />);
      
      const input = screen.getByTestId('input');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('should handle onChange events', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByTestId('input');
      await user.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenCalledTimes(4); // One for each character
    });

    it('should handle onFocus and onBlur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
      
      const input = screen.getByTestId('input');
      
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', () => {
      const handleKeyDown = vi.fn();
      const handleKeyUp = vi.fn();
      
      render(<Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);
      
      const input = screen.getByTestId('input');
      
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.keyUp(input, { key: 'Enter' });
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyUp).toHaveBeenCalledTimes(1);
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);
      
      const input = screen.getByTestId('input');
      await user.type(input, 'test');
      
      expect(input).toHaveValue('');
      expect(input).toBeDisabled();
    });
  });

  describe('Props Forwarding', () => {
    it('should forward HTML input attributes', () => {
      render(
        <Input 
          id="test-input"
          name="test-name"
          value="test-value"
          required
          autoComplete="email"
          maxLength={50}
          minLength={5}
        />
      );
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('id', 'test-input');
      expect(input).toHaveAttribute('name', 'test-name');
      expect(input).toHaveValue('test-value');
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('autocomplete', 'email');
      expect(input).toHaveAttribute('maxlength', '50');
      expect(input).toHaveAttribute('minlength', '5');
    });

    it('should support data attributes', () => {
      render(
        <Input 
          data-field="username"
          data-validation="required"
        />
      );
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-field', 'username');
      expect(input).toHaveAttribute('data-validation', 'required');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Accessibility', () => {
    it('should support aria attributes', () => {
      render(
        <Input 
          aria-label="Search input"
          aria-describedby="search-help"
          aria-required="true"
          aria-invalid="false"
        />
      );
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-label', 'Search input');
      expect(input).toHaveAttribute('aria-describedby', 'search-help');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should be accessible by label', () => {
      render(
        <div>
          <label htmlFor="accessible-input">Username</label>
          <Input id="accessible-input" />
        </div>
      );
      
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('should support role attribute', () => {
      render(<Input role="searchbox" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('role', 'searchbox');
    });
  });

  describe('Form Integration', () => {
    it('should work in form context', () => {
      const handleSubmit = vi.fn(e => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" defaultValue="testuser" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const input = screen.getByTestId('input');
      const button = screen.getByRole('button');
      
      expect(input).toHaveAttribute('name', 'username');
      expect(input).toHaveValue('testuser');
      
      fireEvent.click(button);
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should support controlled input', async () => {
      const ControlledInput = () => {
        const [value, setValue] = React.useState('');
        return (
          <Input 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };
      
      const user = userEvent.setup();
      render(<ControlledInput />);
      
      const input = screen.getByTestId('input');
      await user.type(input, 'controlled');
      
      expect(input).toHaveValue('controlled');
    });

    it('should support uncontrolled input with defaultValue', () => {
      render(<Input defaultValue="default text" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('default text');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<Input value="" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('');
    });

    it('should handle numeric values', () => {
      render(<Input type="number" value={42} />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveValue(42);
    });

    it('should combine custom className with base classes', () => {
      render(<Input className="text-red-500 border-red-500" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('flex', 'h-10', 'text-red-500', 'border-red-500');
    });

    it('should handle readonly attribute', () => {
      render(<Input readOnly value="readonly text" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveValue('readonly text');
    });

    it('should handle step attribute for number inputs', () => {
      render(<Input type="number" step="0.01" />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('step', '0.01');
    });
  });

  describe('Responsive Styling', () => {
    it('should have responsive text size classes', () => {
      render(<Input />);
      
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-base', 'md:text-sm');
    });
  });
});
