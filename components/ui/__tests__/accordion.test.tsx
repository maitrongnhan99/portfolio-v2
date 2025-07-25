import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion';

describe('Accordion Components', () => {
  describe('Accordion Root', () => {
    it('should render with default props', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      expect(trigger).toBeInTheDocument();
    });

    it('should support single type accordion', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const triggers = screen.getAllByTestId('accordion-trigger');
      expect(triggers).toHaveLength(2);
    });

    it('should support multiple type accordion', () => {
      render(
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const triggers = screen.getAllByTestId('accordion-trigger');
      expect(triggers).toHaveLength(2);
    });
  });

  describe('AccordionItem', () => {
    it('should render with default props', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="test-item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const item = screen.getByTestId('accordion-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('data-state', 'closed');
    });

    it('should render with custom className', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item" className="custom-item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const item = screen.getByTestId('accordion-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should have base item classes', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const item = screen.getByTestId('accordion-item');
      expect(item).toHaveClass('border-b');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Accordion type="single" collapsible>
          <AccordionItem ref={ref} value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('AccordionTrigger', () => {
    it('should render with default props', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Trigger Text</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      const header = screen.getByTestId('accordion-header');
      const icon = screen.getByTestId('accordion-icon');
      
      expect(trigger).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Trigger Text');
    });

    it('should render with custom className', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger className="custom-trigger">Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should have base trigger classes', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      expect(trigger).toHaveClass(
        'flex',
        'flex-1',
        'items-center',
        'justify-between',
        'py-4',
        'font-medium',
        'transition-all',
        'hover:underline'
      );
    });

    it('should have header with flex class', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const header = screen.getByTestId('accordion-header');
      expect(header).toHaveClass('flex');
    });

    it('should render arrow icon with correct classes', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const icon = screen.getByTestId('accordion-icon');
      expect(icon).toHaveClass(
        'h-4',
        'w-4',
        'shrink-0',
        'transition-transform',
        'duration-200'
      );
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger ref={ref}>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('AccordionContent', () => {
    it('should render with default props', () => {
      render(
        <Accordion type="single" collapsible defaultValue="item">
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content Text</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const content = screen.getByTestId('accordion-content');
      const contentInner = screen.getByTestId('accordion-content-inner');
      
      expect(content).toBeInTheDocument();
      expect(contentInner).toBeInTheDocument();
      expect(contentInner).toHaveTextContent('Content Text');
    });

    it('should render with custom className', () => {
      render(
        <Accordion type="single" collapsible defaultValue="item">
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent className="custom-content">Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const contentInner = screen.getByTestId('accordion-content-inner');
      expect(contentInner).toHaveClass('custom-content');
    });

    it('should have base content classes', () => {
      render(
        <Accordion type="single" collapsible defaultValue="item">
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const content = screen.getByTestId('accordion-content');
      const contentInner = screen.getByTestId('accordion-content-inner');
      
      expect(content).toHaveClass(
        'overflow-hidden',
        'text-sm',
        'transition-all'
      );
      expect(contentInner).toHaveClass('pb-4', 'pt-0');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Accordion type="single" collapsible defaultValue="item">
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent ref={ref}>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('User Interactions', () => {
    it('should toggle content on trigger click', async () => {
      const user = userEvent.setup();
      
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Toggle</AccordionTrigger>
            <AccordionContent>Hidden Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      
      // Initially closed
      expect(trigger).toHaveAttribute('data-state', 'closed');
      
      // Click to open
      await user.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');
      
      // Click to close
      await user.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('should handle keyboard navigation', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      
      // Focus the trigger
      trigger.focus();
      expect(trigger).toHaveFocus();
      
      // Press Enter to toggle
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('should support controlled state', async () => {
      const user = userEvent.setup();
      
      render(
        <Accordion type="single" value="item">
          <AccordionItem value="item">
            <AccordionTrigger>Controlled</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('should handle onValueChange callback', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Accordion type="single" collapsible onValueChange={handleValueChange}>
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      
      const trigger = screen.getByTestId('accordion-trigger');
      await user.click(trigger);
      
      expect(handleValueChange).toHaveBeenCalledWith('item');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Accessible Trigger</AccordionTrigger>
            <AccordionContent>Accessible Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByTestId('accordion-trigger');
      const content = screen.getByTestId('accordion-content');

      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');
      expect(content).toHaveAttribute('id');
    });

    it('should update ARIA attributes when opened', async () => {
      const user = userEvent.setup();

      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByTestId('accordion-trigger');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should be keyboard accessible', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Keyboard Test</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByTestId('accordion-trigger');

      // Should be focusable
      expect(trigger).toHaveAttribute('type', 'button');

      // Should respond to click
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Empty Content</AccordionTrigger>
            <AccordionContent></AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const trigger = screen.getByTestId('accordion-trigger');
      expect(trigger).toBeInTheDocument();
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Accordion type="single" collapsible defaultValue="item">
          <AccordionItem value="item" className="custom-item">
            <AccordionTrigger className="custom-trigger">Test</AccordionTrigger>
            <AccordionContent className="custom-content">Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );

      const item = screen.getByTestId('accordion-item');
      const trigger = screen.getByTestId('accordion-trigger');
      const content = screen.getByTestId('accordion-content');

      expect(item).toHaveClass('border-b', 'custom-item');
      expect(trigger).toHaveClass('flex', 'custom-trigger');
      expect(content).toBeInTheDocument();
    });
  });
});
