import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../dropdown-menu';

// Mock Radix UI DropdownMenu
vi.mock('@radix-ui/react-dropdown-menu', () => {
  const MockedRoot = React.forwardRef<HTMLDivElement, any>(({ children, onOpenChange, ...props }, ref) => (
    <div ref={ref} data-testid="dropdown-menu" {...props}>
      {children}
    </div>
  ));
  MockedRoot.displayName = 'MockedRoot';

  const MockedTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
    <button ref={ref} type="button" {...props}>
      {children}
    </button>
  ));
  MockedTrigger.displayName = 'MockedTrigger';

  const MockedContent = React.forwardRef<HTMLDivElement, any>(({ children, sideOffset, ...props }, ref) => (
    <div ref={ref} {...props} data-sideoffset={sideOffset}>
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

// Mock Phosphor Icons
vi.mock('@phosphor-icons/react', () => ({
  ArrowRightIcon: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="arrow-right-icon">
      <path d="M8 4l4 4-4 4" />
    </svg>
  ),
  CheckIcon: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="check-icon">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  CircleIcon: ({ className, ...props }: any) => (
    <svg className={className} {...props} data-testid="circle-icon">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
}));

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe('DropdownMenu Components', () => {
  describe('DropdownMenu', () => {
    it('should render with default props', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      const dropdownMenu = screen.getByTestId('dropdown-menu');
      expect(dropdownMenu).toBeInTheDocument();
    });

    it('should handle open/close state', () => {
      const handleOpenChange = vi.fn();
      
      render(
        <DropdownMenu onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      const dropdownMenu = screen.getByTestId('dropdown-menu');
      expect(dropdownMenu).toBeInTheDocument();
    });

    it('should support HTML div attributes', () => {
      render(
        <DropdownMenu data-custom="value">
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      const dropdownMenu = screen.getByTestId('dropdown-menu');
      expect(dropdownMenu).toHaveAttribute('data-custom', 'value');
    });

    it('should handle open state', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      const dropdownMenu = screen.getByTestId('dropdown-menu');
      expect(dropdownMenu).toHaveAttribute('open');
    });

    it('should handle onOpenChange callback', () => {
      const handleOpenChange = vi.fn();
      
      render(
        <DropdownMenu onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      const dropdownMenu = screen.getByTestId('dropdown-menu');
      expect(dropdownMenu).toBeInTheDocument();
    });
  });

  describe('DropdownMenuTrigger', () => {
    it('should render with default props', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      const trigger = screen.getByTestId('dropdown-menu-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Open Menu');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger ref={ref}>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      
      render(
        <DropdownMenu>
          <DropdownMenuTrigger onClick={handleClick}>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      const trigger = screen.getByTestId('dropdown-menu-trigger');
      await user.click(trigger);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger className="custom-trigger">Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      const trigger = screen.getByTestId('dropdown-menu-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should support disabled state', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger disabled>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>
      );
      
      const trigger = screen.getByTestId('dropdown-menu-trigger');
      expect(trigger).toBeDisabled();
    });
  });

  describe('DropdownMenuContent', () => {
    it('should render with default props', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      const content = screen.getByTestId('dropdown-menu-content');
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
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-content">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      const content = screen.getByTestId('dropdown-menu-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent ref={ref}>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle custom sideOffset', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8}>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
      const content = screen.getByTestId('dropdown-menu-content');
      expect(content).toHaveAttribute('data-sideoffset', '8');
    });
  });

  describe('DropdownMenuItem', () => {
    it('should render with default props', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Menu Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId('dropdown-menu-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Menu Item');
      expect(item).toHaveClass(
        'relative',
        'flex',
        'cursor-default',
        'select-none',
        'items-center',
        'gap-2',
        'rounded-sm',
        'px-2',
        'py-1.5',
        'text-sm',
        'outline-none'
      );
    });

    it('should render with inset prop', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId('dropdown-menu-item');
      expect(item).toHaveClass('pl-8');
    });

    it('should render with custom className', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item">Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId('dropdown-menu-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem ref={ref}>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>Clickable Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId('dropdown-menu-item');
      await user.click(item);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render with shortcut', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Copy
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByTestId('dropdown-menu-item');
      const shortcut = screen.getByTestId('dropdown-menu-shortcut');

      expect(item).toHaveTextContent('Copy');
      expect(shortcut).toHaveTextContent('⌘C');
    });
  });

  describe('DropdownMenuCheckboxItem', () => {
    it('should render with default props', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem>Checkbox Item</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const checkboxItem = screen.getByTestId('dropdown-menu-checkbox-item');
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
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Checked Item</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const checkboxItem = screen.getByTestId('dropdown-menu-checkbox-item');
      const checkIcon = screen.getByTestId('check-icon');

      expect(checkboxItem).toBeInTheDocument();
      expect(checkIcon).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem ref={ref}>Item</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle checked change events', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem onClick={handleCheckedChange}>
              Toggle Item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const checkboxItem = screen.getByTestId('dropdown-menu-checkbox-item');
      await user.click(checkboxItem);

      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('DropdownMenuShortcut', () => {
    it('should render with default props', () => {
      render(<DropdownMenuShortcut>⌘K</DropdownMenuShortcut>);

      const shortcut = screen.getByTestId('dropdown-menu-shortcut');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toHaveTextContent('⌘K');
      expect(shortcut).toHaveClass(
        'ml-auto',
        'text-xs',
        'tracking-widest',
        'opacity-60'
      );
    });

    it('should render with custom className', () => {
      render(<DropdownMenuShortcut className="custom-shortcut">Ctrl+C</DropdownMenuShortcut>);

      const shortcut = screen.getByTestId('dropdown-menu-shortcut');
      expect(shortcut).toHaveClass('custom-shortcut');
    });

    it('should support HTML span attributes', () => {
      render(
        <DropdownMenuShortcut
          id="test-shortcut"
          aria-label="Keyboard shortcut"
          data-custom="value"
        >
          ⌘V
        </DropdownMenuShortcut>
      );

      const shortcut = screen.getByTestId('dropdown-menu-shortcut');
      expect(shortcut).toHaveAttribute('id', 'test-shortcut');
      expect(shortcut).toHaveAttribute('aria-label', 'Keyboard shortcut');
      expect(shortcut).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Complete DropdownMenu Structure', () => {
    it('should render complete dropdown menu', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              Copy
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Paste
              <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Show toolbar</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const dropdownMenu = screen.getByTestId('dropdown-menu');
      const trigger = screen.getByTestId('dropdown-menu-trigger');
      const content = screen.getByTestId('dropdown-menu-content');
      const label = screen.getByTestId('dropdown-menu-label');
      const items = screen.getAllByTestId('dropdown-menu-item');
      const shortcuts = screen.getAllByTestId('dropdown-menu-shortcut');
      const separators = screen.getAllByTestId('dropdown-menu-separator');
      const checkboxItem = screen.getByTestId('dropdown-menu-checkbox-item');
      const radioGroup = screen.getByTestId('dropdown-menu-radio-group');
      const radioItems = screen.getAllByTestId('dropdown-menu-radio-item');

      expect(dropdownMenu).toBeInTheDocument();
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
        <DropdownMenu open>
          <DropdownMenuTrigger aria-label="Open dropdown menu">Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent aria-label="Dropdown menu options">
            <DropdownMenuItem aria-label="Copy text">Copy</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId('dropdown-menu-trigger');
      const content = screen.getByTestId('dropdown-menu-content');
      const item = screen.getByTestId('dropdown-menu-item');

      expect(trigger).toHaveAttribute('aria-label', 'Open dropdown menu');
      expect(content).toHaveAttribute('aria-label', 'Dropdown menu options');
      expect(item).toHaveAttribute('aria-label', 'Copy text');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId('dropdown-menu-trigger');

      // Should be focusable
      trigger.focus();
      expect(trigger).toHaveFocus();

      // Should handle keyboard navigation
      await user.keyboard('{ArrowDown}');
      expect(trigger).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty dropdown menu', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent></DropdownMenuContent>
        </DropdownMenu>
      );

      const dropdownMenu = screen.getByTestId('dropdown-menu');
      const content = screen.getByTestId('dropdown-menu-content');

      expect(dropdownMenu).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <DropdownMenu open>
          <DropdownMenuTrigger className="custom-trigger">Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-content">
            <DropdownMenuItem className="custom-item">Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId('dropdown-menu-trigger');
      const content = screen.getByTestId('dropdown-menu-content');
      const item = screen.getByTestId('dropdown-menu-item');

      expect(trigger).toHaveClass('custom-trigger');
      expect(content).toHaveClass('z-50', 'custom-content');
      expect(item).toHaveClass('relative', 'custom-item');
    });
  });
});
