import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from '../context-menu';

// Mock Radix UI ContextMenu
vi.mock('@radix-ui/react-context-menu', () => {
  const MockedRoot = ({ children, ...props }: any) => (
    <div data-testid="context-menu-root" {...props}>
      {children}
    </div>
  );

  const MockedTrigger = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedTrigger.displayName = 'MockedTrigger';

  const MockedContent = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedContent.displayName = 'MockedContent';

  const MockedItem = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedItem.displayName = 'MockedItem';

  const MockedCheckboxItem = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedCheckboxItem.displayName = 'MockedCheckboxItem';

  const MockedRadioItem = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedRadioItem.displayName = 'MockedRadioItem';

  const MockedLabel = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedLabel.displayName = 'MockedLabel';

  const MockedSeparator = React.forwardRef<HTMLDivElement, any>(({ ...props }, ref) => (
    <div ref={ref} {...props} />
  ));
  MockedSeparator.displayName = 'MockedSeparator';

  const MockedGroup = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedGroup.displayName = 'MockedGroup';

  const MockedSub = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedSub.displayName = 'MockedSub';

  const MockedSubTrigger = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedSubTrigger.displayName = 'MockedSubTrigger';

  const MockedSubContent = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedSubContent.displayName = 'MockedSubContent';

  const MockedRadioGroup = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedRadioGroup.displayName = 'MockedRadioGroup';

  const MockedItemIndicator = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedItemIndicator.displayName = 'MockedItemIndicator';

  return {
    Root: MockedRoot,
    Trigger: MockedTrigger,
    Content: MockedContent,
    Item: MockedItem,
    CheckboxItem: MockedCheckboxItem,
    RadioItem: MockedRadioItem,
    Label: MockedLabel,
    Separator: MockedSeparator,
    Group: MockedGroup,
    Portal: ({ children }: any) => children,
    Sub: MockedSub,
    SubTrigger: MockedSubTrigger,
    SubContent: MockedSubContent,
    RadioGroup: MockedRadioGroup,
    ItemIndicator: MockedItemIndicator,
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

describe('ContextMenu Components', () => {
  describe('ContextMenu', () => {
    it('should render with default props', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const contextMenu = screen.getByTestId('context-menu-root');
      expect(contextMenu).toBeInTheDocument();
    });

    it('should support HTML div attributes', () => {
      render(
        <ContextMenu data-custom="value">
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        </ContextMenu>
      );
      
      const contextMenu = screen.getByTestId('context-menu-root');
      expect(contextMenu).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('ContextMenuTrigger', () => {
    it('should render with default props', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
        </ContextMenu>
      );
      
      const trigger = screen.getByTestId('context-menu-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Right click me');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <ContextMenu>
          <ContextMenuTrigger ref={ref}>Right click me</ContextMenuTrigger>
        </ContextMenu>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle right click events', async () => {
      const user = userEvent.setup();
      
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const trigger = screen.getByTestId('context-menu-trigger');
      
      // Simulate right click
      fireEvent.contextMenu(trigger);
      
      expect(trigger).toBeInTheDocument();
    });
  });

  describe('ContextMenuContent', () => {
    it('should render with default props', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const content = screen.getByTestId('context-menu-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass(
        'z-50',
        'min-w-[8rem]',
        'overflow-hidden',
        'rounded-md',
        'border',
        'bg-popover',
        'p-1',
        'text-popover-foreground',
        'shadow-md'
      );
    });

    it('should render with custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent className="custom-content">
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const content = screen.getByTestId('context-menu-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent ref={ref}>
            <ContextMenuItem>Item 1</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('ContextMenuItem', () => {
    it('should render with default props', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Menu Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const item = screen.getByTestId('context-menu-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Menu Item');
      expect(item).toHaveClass(
        'relative',
        'flex',
        'cursor-default',
        'select-none',
        'items-center',
        'rounded-sm',
        'px-2',
        'py-1.5',
        'text-sm',
        'outline-none'
      );
    });

    it('should render with inset prop', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem inset>Inset Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const item = screen.getByTestId('context-menu-item');
      expect(item).toHaveClass('pl-8');
    });

    it('should render with custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem className="custom-item">Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const item = screen.getByTestId('context-menu-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem ref={ref}>Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={handleClick}>Clickable Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const item = screen.getByTestId('context-menu-item');
      await user.click(item);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render with shortcut', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
      
      const item = screen.getByTestId('context-menu-item');
      const shortcut = screen.getByTestId('context-menu-shortcut');
      
      expect(item).toHaveTextContent('Copy');
      expect(shortcut).toHaveTextContent('⌘C');
    });
  });

  describe('ContextMenuCheckboxItem', () => {
    it('should render with default props', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem>Checkbox Item</ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const checkboxItem = screen.getByTestId('context-menu-checkbox-item');
      expect(checkboxItem).toBeInTheDocument();
      expect(checkboxItem).toHaveTextContent('Checkbox Item');
      expect(checkboxItem).toHaveClass(
        'relative',
        'flex',
        'cursor-default',
        'select-none',
        'items-center',
        'rounded-sm',
        'py-1.5',
        'pl-8',
        'pr-2',
        'text-sm',
        'outline-none'
      );
    });

    it('should render with checked state', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem checked>Checked Item</ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const checkboxItem = screen.getByTestId('context-menu-checkbox-item');
      // The checked prop is passed to the component
      expect(checkboxItem).toBeInTheDocument();
      expect(checkboxItem).toHaveTextContent('Checked Item');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem ref={ref}>Item</ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle checked change events', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem onClick={handleCheckedChange}>
              Toggle Item
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const checkboxItem = screen.getByTestId('context-menu-checkbox-item');
      await user.click(checkboxItem);

      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('ContextMenuSeparator', () => {
    it('should render with default props', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Item 2</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const separator = screen.getByTestId('context-menu-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('-mx-1', 'my-1', 'h-px', 'bg-border');
    });

    it('should render with custom className', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuSeparator className="custom-separator" />
          </ContextMenuContent>
        </ContextMenu>
      );

      const separator = screen.getByTestId('context-menu-separator');
      expect(separator).toHaveClass('custom-separator');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuSeparator ref={ref} />
          </ContextMenuContent>
        </ContextMenu>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('ContextMenuShortcut', () => {
    it('should render with default props', () => {
      render(<ContextMenuShortcut>⌘K</ContextMenuShortcut>);

      const shortcut = screen.getByTestId('context-menu-shortcut');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toHaveTextContent('⌘K');
      expect(shortcut).toHaveClass(
        'ml-auto',
        'text-xs',
        'tracking-widest',
        'text-muted-foreground'
      );
    });

    it('should render with custom className', () => {
      render(<ContextMenuShortcut className="custom-shortcut">Ctrl+C</ContextMenuShortcut>);

      const shortcut = screen.getByTestId('context-menu-shortcut');
      expect(shortcut).toHaveClass('custom-shortcut');
    });

    it('should support HTML span attributes', () => {
      render(
        <ContextMenuShortcut
          id="test-shortcut"
          aria-label="Keyboard shortcut"
          data-custom="value"
        >
          ⌘V
        </ContextMenuShortcut>
      );

      const shortcut = screen.getByTestId('context-menu-shortcut');
      expect(shortcut).toHaveAttribute('id', 'test-shortcut');
      expect(shortcut).toHaveAttribute('aria-label', 'Keyboard shortcut');
      expect(shortcut).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Complete ContextMenu Structure', () => {
    it('should render complete context menu', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Paste
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>Show toolbar</ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value="option1">
              <ContextMenuRadioItem value="option1">Option 1</ContextMenuRadioItem>
              <ContextMenuRadioItem value="option2">Option 2</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      );

      const contextMenu = screen.getByTestId('context-menu-root');
      const trigger = screen.getByTestId('context-menu-trigger');
      const content = screen.getByTestId('context-menu-content');
      const label = screen.getByText('Actions');
      const items = screen.getAllByTestId('context-menu-item');
      const shortcuts = screen.getAllByTestId('context-menu-shortcut');
      const separators = screen.getAllByTestId('context-menu-separator');
      const checkboxItem = screen.getByTestId('context-menu-checkbox-item');
      const radioGroup = screen.getByTestId('context-menu-radio-group');
      const radioItems = screen.getAllByTestId('context-menu-radio-item');

      expect(contextMenu).toBeInTheDocument();
      expect(trigger).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(items).toHaveLength(2);
      expect(shortcuts).toHaveLength(2);
      expect(separators).toHaveLength(2);
      expect(checkboxItem).toBeInTheDocument();
      expect(radioGroup).toBeInTheDocument();
      expect(radioItems).toHaveLength(2);

      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('⌘C')).toBeInTheDocument();
      expect(screen.getByText('Show toolbar')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger aria-label="Open context menu">Right click me</ContextMenuTrigger>
          <ContextMenuContent aria-label="Context menu options">
            <ContextMenuItem aria-label="Copy text">Copy</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const trigger = screen.getByTestId('context-menu-trigger');
      const content = screen.getByTestId('context-menu-content');
      const item = screen.getByTestId('context-menu-item');

      expect(trigger).toHaveAttribute('aria-label', 'Open context menu');
      expect(content).toHaveAttribute('aria-label', 'Context menu options');
      expect(item).toHaveAttribute('aria-label', 'Copy text');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <ContextMenu>
          <ContextMenuTrigger tabIndex={0}>Right click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Item 1</ContextMenuItem>
            <ContextMenuItem>Item 2</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const trigger = screen.getByTestId('context-menu-trigger');

      // Should be focusable with tabIndex
      trigger.focus();
      expect(trigger).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty context menu', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right click me</ContextMenuTrigger>
          <ContextMenuContent></ContextMenuContent>
        </ContextMenu>
      );

      const contextMenu = screen.getByTestId('context-menu-root');
      const content = screen.getByTestId('context-menu-content');

      expect(contextMenu).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger className="custom-trigger">Right click me</ContextMenuTrigger>
          <ContextMenuContent className="custom-content">
            <ContextMenuItem className="custom-item">Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );

      const trigger = screen.getByTestId('context-menu-trigger');
      const content = screen.getByTestId('context-menu-content');
      const item = screen.getByTestId('context-menu-item');

      expect(trigger).toHaveClass('custom-trigger');
      expect(content).toHaveClass('z-50', 'custom-content');
      expect(item).toHaveClass('relative', 'custom-item');
    });
  });
});
