import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../collapsible';

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('Collapsible Components', () => {
  describe('Collapsible', () => {
    it('should render with default props', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toBeInTheDocument();
      expect(collapsible).toHaveAttribute('data-state', 'closed');
    });

    it('should render with custom className', () => {
      render(
        <Collapsible className="custom-collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveClass('custom-collapsible');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Collapsible ref={ref}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should support HTML div attributes', () => {
      render(
        <Collapsible
          id="test-collapsible"
          aria-label="Expandable section"
          data-custom="value"
        >
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('id', 'test-collapsible');
      expect(collapsible).toHaveAttribute('aria-label', 'Expandable section');
      expect(collapsible).toHaveAttribute('data-custom', 'value');
    });

    it('should handle controlled state', () => {
      const { rerender } = render(
        <Collapsible open={false}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('data-state', 'closed');
      
      rerender(
        <Collapsible open={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      expect(collapsible).toHaveAttribute('data-state', 'open');
    });

    it('should handle defaultOpen prop', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('data-state', 'open');
    });

    it('should call onOpenChange when state changes', async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      await user.click(trigger);
      
      expect(handleOpenChange).toHaveBeenCalledTimes(1);
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('should handle disabled state', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('data-disabled', '');
    });
  });

  describe('CollapsibleTrigger', () => {
    it('should render with default props', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle Content</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Toggle Content');
      expect(trigger).toHaveAttribute('type', 'button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should render with custom className', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger className="custom-trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <Collapsible>
          <CollapsibleTrigger ref={ref}>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const user = userEvent.setup();
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      const collapsible = screen.getByTestId('collapsible');
      
      expect(collapsible).toHaveAttribute('data-state', 'closed');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      await user.click(trigger);
      
      expect(collapsible).toHaveAttribute('data-state', 'open');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should handle keyboard events', async () => {
      const user = userEvent.setup();
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      const collapsible = screen.getByTestId('collapsible');
      
      // Focus the trigger
      trigger.focus();
      expect(trigger).toHaveFocus();
      
      // Press Space to toggle
      await user.keyboard(' ');
      expect(collapsible).toHaveAttribute('data-state', 'open');
      
      // Press Enter to toggle
      await user.keyboard('{Enter}');
      expect(collapsible).toHaveAttribute('data-state', 'closed');
    });

    it('should support HTML button attributes', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger
            id="toggle-button"
            aria-label="Expand section"
            data-custom="trigger-value"
          >
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      expect(trigger).toHaveAttribute('id', 'toggle-button');
      expect(trigger).toHaveAttribute('aria-label', 'Expand section');
      expect(trigger).toHaveAttribute('data-custom', 'trigger-value');
    });

    it('should be disabled when collapsible is disabled', async () => {
      const user = userEvent.setup();
      
      render(
        <Collapsible disabled>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      const collapsible = screen.getByTestId('collapsible');
      
      expect(trigger).toBeDisabled();
      expect(collapsible).toHaveAttribute('data-disabled', '');
      
      await user.click(trigger);
      expect(collapsible).toHaveAttribute('data-state', 'closed');
    });

    it('should support custom event handlers', () => {
      const handleClick = vi.fn();
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      
      render(
        <Collapsible>
          <CollapsibleTrigger
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      
      fireEvent.click(trigger);
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      fireEvent.focus(trigger);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      fireEvent.blur(trigger);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('CollapsibleContent', () => {
    it('should render with default props when open', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>This is the content</CollapsibleContent>
        </Collapsible>
      );
      
      const content = screen.getByTestId('collapsible-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('This is the content');
      expect(content).toHaveAttribute('data-state', 'open');
    });

    it('should not be visible when closed', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Hidden content</CollapsibleContent>
        </Collapsible>
      );
      
      const content = screen.getByTestId('collapsible-content');
      expect(content).toHaveAttribute('data-state', 'closed');
    });

    it('should render with custom className', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent className="custom-content">Content</CollapsibleContent>
        </Collapsible>
      );
      
      const content = screen.getByTestId('collapsible-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent ref={ref}>Content</CollapsibleContent>
        </Collapsible>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should support HTML div attributes', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent
            id="content-section"
            aria-label="Expandable content"
            data-custom="content-value"
          >
            Content
          </CollapsibleContent>
        </Collapsible>
      );
      
      const content = screen.getByTestId('collapsible-content');
      expect(content).toHaveAttribute('id', 'content-section');
      expect(content).toHaveAttribute('aria-label', 'Expandable content');
      expect(content).toHaveAttribute('data-custom', 'content-value');
    });

    it('should toggle visibility when trigger is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Toggleable content</CollapsibleContent>
        </Collapsible>
      );
      
      const trigger = screen.getByTestId('collapsible-trigger');
      const content = screen.getByTestId('collapsible-content');
      
      // Initially closed
      expect(content).toHaveAttribute('data-state', 'closed');
      
      // Click to open
      await user.click(trigger);
      expect(content).toHaveAttribute('data-state', 'open');
      
      // Click to close
      await user.click(trigger);
      expect(content).toHaveAttribute('data-state', 'closed');
    });

    it('should handle complex content', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <div>
              <h3>Section Title</h3>
              <p>This is a paragraph with content.</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
      
      const content = screen.getByTestId('collapsible-content');
      expect(content).toBeInTheDocument();
      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('This is a paragraph with content.')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Complete Collapsible Structure', () => {
    it('should work with multiple collapsibles', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Collapsible>
            <CollapsibleTrigger>First Toggle</CollapsibleTrigger>
            <CollapsibleContent>First Content</CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger>Second Toggle</CollapsibleTrigger>
            <CollapsibleContent>Second Content</CollapsibleContent>
          </Collapsible>
        </div>
      );

      const collapsibles = screen.getAllByTestId('collapsible');
      const triggers = screen.getAllByTestId('collapsible-trigger');
      const contents = screen.getAllByTestId('collapsible-content');

      expect(collapsibles).toHaveLength(2);
      expect(triggers).toHaveLength(2);
      expect(contents).toHaveLength(2);

      // Both should be closed initially
      expect(collapsibles[0]).toHaveAttribute('data-state', 'closed');
      expect(collapsibles[1]).toHaveAttribute('data-state', 'closed');

      // Open first collapsible
      await user.click(triggers[0]);
      expect(collapsibles[0]).toHaveAttribute('data-state', 'open');
      expect(collapsibles[1]).toHaveAttribute('data-state', 'closed');

      // Open second collapsible
      await user.click(triggers[1]);
      expect(collapsibles[0]).toHaveAttribute('data-state', 'open');
      expect(collapsibles[1]).toHaveAttribute('data-state', 'open');
    });

    it('should work with nested collapsibles', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger>Outer Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <p>Outer content</p>
            <Collapsible>
              <CollapsibleTrigger>Inner Toggle</CollapsibleTrigger>
              <CollapsibleContent>Inner content</CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      );

      // Initially only outer collapsible is visible
      const outerCollapsible = screen.getByTestId('collapsible');
      const outerTrigger = screen.getByTestId('collapsible-trigger');

      expect(outerCollapsible).toHaveAttribute('data-state', 'closed');

      // Open outer collapsible
      await user.click(outerTrigger);
      expect(outerCollapsible).toHaveAttribute('data-state', 'open');
      expect(screen.getByText('Outer content')).toBeInTheDocument();

      // Now inner collapsible should be accessible
      const allCollapsibles = screen.getAllByTestId('collapsible');
      const allTriggers = screen.getAllByTestId('collapsible-trigger');

      expect(allCollapsibles).toHaveLength(2);
      expect(allTriggers).toHaveLength(2);

      // Open inner collapsible
      await user.click(allTriggers[1]);
      expect(allCollapsibles[1]).toHaveAttribute('data-state', 'open');
      expect(screen.getByText('Inner content')).toBeInTheDocument();
    });

    it('should handle form elements inside content', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Form Toggle</CollapsibleTrigger>
          <CollapsibleContent>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Enter text" />
              <button type="submit">Submit</button>
            </form>
          </CollapsibleContent>
        </Collapsible>
      );

      const input = screen.getByPlaceholderText('Enter text');
      const submitButton = screen.getByText('Submit');

      await user.type(input, 'test input');
      expect(input).toHaveValue('test input');

      await user.click(submitButton);
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('collapsible-trigger');
      const content = screen.getByTestId('collapsible-content');

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');
      expect(content).toHaveAttribute('id');

      // The trigger's aria-controls should match the content's id
      const controlsId = trigger.getAttribute('aria-controls');
      const contentId = content.getAttribute('id');
      expect(controlsId).toBe(contentId);
    });

    it('should update ARIA attributes when state changes', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('collapsible-trigger');

      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('collapsible-trigger');

      // Should be focusable
      await user.tab();
      expect(trigger).toHaveFocus();

      // Should toggle with Space
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Should toggle with Enter
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should support screen reader announcements', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger aria-label="Expand FAQ section">
            FAQ
          </CollapsibleTrigger>
          <CollapsibleContent aria-label="FAQ answers">
            <p>Frequently asked questions content</p>
          </CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('collapsible-trigger');
      const content = screen.getByTestId('collapsible-content');

      expect(trigger).toHaveAttribute('aria-label', 'Expand FAQ section');
      expect(content).toHaveAttribute('aria-label', 'FAQ answers');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks', async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('collapsible-trigger');

      // Rapid clicks
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      expect(handleOpenChange).toHaveBeenCalledTimes(3);
    });

    it('should handle empty content', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent></CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId('collapsible-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('');
    });

    it('should handle content with only whitespace', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>   </CollapsibleContent>
        </Collapsible>
      );

      const content = screen.getByTestId('collapsible-content');
      expect(content).toBeInTheDocument();
    });

    it('should combine custom classes with base functionality', () => {
      render(
        <Collapsible className="custom-collapsible">
          <CollapsibleTrigger className="custom-trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent className="custom-content">Content</CollapsibleContent>
        </Collapsible>
      );

      const collapsible = screen.getByTestId('collapsible');
      const trigger = screen.getByTestId('collapsible-trigger');
      const content = screen.getByTestId('collapsible-content');

      expect(collapsible).toHaveClass('custom-collapsible');
      expect(trigger).toHaveClass('custom-trigger');
      expect(content).toHaveClass('custom-content');
    });

    it('should handle missing onOpenChange gracefully', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );

      const trigger = screen.getByTestId('collapsible-trigger');
      const collapsible = screen.getByTestId('collapsible');

      // Should not throw error when no handler is provided
      await user.click(trigger);
      expect(collapsible).toHaveAttribute('data-state', 'open');
    });
  });
});
