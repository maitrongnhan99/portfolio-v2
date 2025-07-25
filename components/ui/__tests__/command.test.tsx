import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '../command';

// Mock cmdk
vi.mock('cmdk', () => {
  const MockedCommand = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedCommand.displayName = 'Command';

  const MockedInput = React.forwardRef<HTMLInputElement, any>(({ ...props }, ref) => (
    <input ref={ref} {...props} />
  ));
  MockedInput.displayName = 'CommandInput';

  const MockedList = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedList.displayName = 'CommandList';

  const MockedEmpty = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedEmpty.displayName = 'CommandEmpty';

  const MockedGroup = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedGroup.displayName = 'CommandGroup';

  const MockedItem = React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockedItem.displayName = 'CommandItem';

  const MockedSeparator = React.forwardRef<HTMLDivElement, any>(({ ...props }, ref) => (
    <div ref={ref} {...props} />
  ));
  MockedSeparator.displayName = 'CommandSeparator';

  return {
    Command: Object.assign(MockedCommand, {
      displayName: 'Command',
      Input: MockedInput,
      List: MockedList,
      Empty: MockedEmpty,
      Group: MockedGroup,
      Item: MockedItem,
      Separator: MockedSeparator,
    }),
  };
});

// Mock dialog components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, ...props }: any) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),
  DialogContent: ({ children, ...props }: any) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
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

describe('Command Components', () => {
  describe('Command', () => {
    it('should render with default props', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );
      
      const command = screen.getByTestId('command');
      expect(command).toBeInTheDocument();
      expect(command).toHaveClass(
        'flex',
        'h-full',
        'w-full',
        'flex-col',
        'overflow-hidden',
        'rounded-md',
        'bg-popover',
        'text-popover-foreground'
      );
    });

    it('should render with custom className', () => {
      render(
        <Command className="custom-command">
          <CommandInput placeholder="Search..." />
        </Command>
      );
      
      const command = screen.getByTestId('command');
      expect(command).toHaveClass('custom-command');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Command ref={ref}>
          <CommandInput placeholder="Search..." />
        </Command>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should support HTML div attributes', () => {
      render(
        <Command
          id="test-command"
          aria-label="Command palette"
          data-custom="value"
        >
          <CommandInput placeholder="Search..." />
        </Command>
      );
      
      const command = screen.getByTestId('command');
      expect(command).toHaveAttribute('id', 'test-command');
      expect(command).toHaveAttribute('aria-label', 'Command palette');
      expect(command).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('CommandDialog', () => {
    it('should render dialog with command inside', () => {
      render(
        <CommandDialog open>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </CommandDialog>
      );
      
      const dialog = screen.getByTestId('dialog');
      const dialogContent = screen.getByTestId('command-dialog-content');
      const command = screen.getByTestId('command-dialog');
      
      expect(dialog).toBeInTheDocument();
      expect(dialogContent).toBeInTheDocument();
      expect(command).toBeInTheDocument();
      
      expect(dialogContent).toHaveClass('overflow-hidden', 'p-0', 'shadow-lg');
    });

    it('should pass dialog props correctly', () => {
      const handleOpenChange = vi.fn();
      
      render(
        <CommandDialog open onOpenChange={handleOpenChange}>
          <CommandInput placeholder="Search..." />
        </CommandDialog>
      );
      
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('open');
    });
  });

  describe('CommandInput', () => {
    it('should render input with search icon', () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command or search..." />
        </Command>
      );
      
      const wrapper = screen.getByTestId('command-input-wrapper');
      const input = screen.getByTestId('command-input');
      
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('flex', 'items-center', 'border-b', 'px-3');
      expect(wrapper).toHaveAttribute('cmdk-input-wrapper', '');
      
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Type a command or search...');
      expect(input).toHaveClass(
        'flex',
        'h-11',
        'w-full',
        'rounded-md',
        'bg-transparent',
        'py-3',
        'text-sm',
        'outline-none',
        'placeholder:text-muted-foreground',
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      );
    });

    it('should render with custom className', () => {
      render(
        <Command>
          <CommandInput className="custom-input" placeholder="Search..." />
        </Command>
      );
      
      const input = screen.getByTestId('command-input');
      expect(input).toHaveClass('custom-input');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      
      render(
        <Command>
          <CommandInput ref={ref} placeholder="Search..." />
        </Command>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should handle input events', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Command>
          <CommandInput placeholder="Search..." onChange={handleChange} />
        </Command>
      );
      
      const input = screen.getByTestId('command-input');
      
      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });

    it('should support disabled state', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." disabled />
        </Command>
      );
      
      const input = screen.getByTestId('command-input');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });
  });

  describe('CommandList', () => {
    it('should render with default props', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandList>
        </Command>
      );
      
      const list = screen.getByTestId('command-list');
      expect(list).toBeInTheDocument();
      expect(list).toHaveClass('max-h-[300px]', 'overflow-y-auto', 'overflow-x-hidden');
    });

    it('should render with custom className', () => {
      render(
        <Command>
          <CommandList className="custom-list">
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );
      
      const list = screen.getByTestId('command-list');
      expect(list).toHaveClass('custom-list');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Command>
          <CommandList ref={ref}>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CommandEmpty', () => {
    it('should render with default props', () => {
      render(
        <Command>
          <CommandEmpty>No results found.</CommandEmpty>
        </Command>
      );
      
      const empty = screen.getByTestId('command-empty');
      expect(empty).toBeInTheDocument();
      expect(empty).toHaveTextContent('No results found.');
      expect(empty).toHaveClass('py-6', 'text-center', 'text-sm');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Command>
          <CommandEmpty ref={ref}>No results found.</CommandEmpty>
        </Command>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CommandGroup', () => {
    it('should render with default props', () => {
      render(
        <Command>
          <CommandGroup heading="Suggestions">
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </Command>
      );
      
      const group = screen.getByTestId('command-group');
      expect(group).toBeInTheDocument();
      expect(group).toHaveClass(
        'overflow-hidden',
        'p-1',
        'text-foreground'
      );
    });

    it('should render with custom className', () => {
      render(
        <Command>
          <CommandGroup className="custom-group">
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
        </Command>
      );
      
      const group = screen.getByTestId('command-group');
      expect(group).toHaveClass('custom-group');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Command>
          <CommandGroup ref={ref}>
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
        </Command>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CommandSeparator', () => {
    it('should render with default props', () => {
      render(
        <Command>
          <CommandSeparator />
        </Command>
      );
      
      const separator = screen.getByTestId('command-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('-mx-1', 'h-px', 'bg-border');
    });

    it('should render with custom className', () => {
      render(
        <Command>
          <CommandSeparator className="custom-separator" />
        </Command>
      );
      
      const separator = screen.getByTestId('command-separator');
      expect(separator).toHaveClass('custom-separator');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <Command>
          <CommandSeparator ref={ref} />
        </Command>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CommandItem', () => {
    it('should render with default props', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>Open File</CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByTestId('command-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Open File');
      expect(item).toHaveClass(
        'relative',
        'flex',
        'cursor-default',
        'gap-2',
        'select-none',
        'items-center',
        'rounded-sm',
        'px-2',
        'py-1.5',
        'text-sm',
        'outline-none'
      );
    });

    it('should render with custom className', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem className="custom-item">Item</CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByTestId('command-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <Command>
          <CommandList>
            <CommandItem ref={ref}>Item</CommandItem>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Command>
          <CommandList>
            <CommandItem onClick={handleClick}>Clickable Item</CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByTestId('command-item');
      await user.click(item);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support disabled state', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem disabled>Disabled Item</CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByTestId('command-item');
      expect(item).toHaveClass('data-[disabled=true]:pointer-events-none', 'data-[disabled=true]:opacity-50');
    });

    it('should render with shortcut', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Open File
              <CommandShortcut>⌘O</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByTestId('command-item');
      const shortcut = screen.getByTestId('command-shortcut');

      expect(item).toHaveTextContent('Open File');
      expect(shortcut).toHaveTextContent('⌘O');
    });
  });

  describe('CommandShortcut', () => {
    it('should render with default props', () => {
      render(<CommandShortcut>⌘K</CommandShortcut>);

      const shortcut = screen.getByTestId('command-shortcut');
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
      render(<CommandShortcut className="custom-shortcut">Ctrl+C</CommandShortcut>);

      const shortcut = screen.getByTestId('command-shortcut');
      expect(shortcut).toHaveClass('custom-shortcut');
    });

    it('should support HTML span attributes', () => {
      render(
        <CommandShortcut
          id="test-shortcut"
          aria-label="Keyboard shortcut"
          data-custom="value"
        >
          ⌘V
        </CommandShortcut>
      );

      const shortcut = screen.getByTestId('command-shortcut');
      expect(shortcut).toHaveAttribute('id', 'test-shortcut');
      expect(shortcut).toHaveAttribute('aria-label', 'Keyboard shortcut');
      expect(shortcut).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Complete Command Structure', () => {
    it('should render complete command palette', () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                Calendar
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Search Emoji
                <CommandShortcut>⌘J</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const command = screen.getByTestId('command');
      const input = screen.getByTestId('command-input');
      const list = screen.getByTestId('command-list');
      const empty = screen.getByTestId('command-empty');
      const groups = screen.getAllByTestId('command-group');
      const items = screen.getAllByTestId('command-item');
      const separator = screen.getByTestId('command-separator');
      const shortcuts = screen.getAllByTestId('command-shortcut');

      expect(command).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(empty).toBeInTheDocument();
      expect(groups).toHaveLength(2);
      expect(items).toHaveLength(5);
      expect(separator).toBeInTheDocument();
      expect(shortcuts).toHaveLength(2);

      expect(screen.getByText('Calendar')).toBeInTheDocument();
      expect(screen.getByText('⌘K')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should work with command dialog', () => {
      render(
        <CommandDialog open>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandGroup>
              <CommandItem>Item 1</CommandItem>
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      );

      const dialog = screen.getByTestId('dialog');
      const command = screen.getByTestId('command-dialog');
      const input = screen.getByTestId('command-input');
      const items = screen.getAllByTestId('command-item');

      expect(dialog).toBeInTheDocument();
      expect(command).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(items).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Command aria-label="Command palette">
          <CommandInput placeholder="Search..." aria-label="Search commands" />
          <CommandList aria-label="Command list">
            <CommandItem aria-label="Open file command">Open File</CommandItem>
          </CommandList>
        </Command>
      );

      const command = screen.getByTestId('command');
      const input = screen.getByTestId('command-input');
      const list = screen.getByTestId('command-list');
      const item = screen.getByTestId('command-item');

      expect(command).toHaveAttribute('aria-label', 'Command palette');
      expect(input).toHaveAttribute('aria-label', 'Search commands');
      expect(list).toHaveAttribute('aria-label', 'Command list');
      expect(item).toHaveAttribute('aria-label', 'Open file command');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();

      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByTestId('command-input');

      // Should be focusable
      await user.tab();
      expect(input).toHaveFocus();

      // Should be able to type
      await user.type(input, 'test');
      expect(input).toHaveValue('test');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty command', () => {
      render(<Command />);

      const command = screen.getByTestId('command');
      expect(command).toBeInTheDocument();
      expect(command).toHaveTextContent('');
    });

    it('should handle command with only input', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );

      const command = screen.getByTestId('command');
      const input = screen.getByTestId('command-input');

      expect(command).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Command className="custom-command">
          <CommandInput className="custom-input" placeholder="Search..." />
          <CommandList className="custom-list">
            <CommandItem className="custom-item">Item</CommandItem>
          </CommandList>
        </Command>
      );

      const command = screen.getByTestId('command');
      const input = screen.getByTestId('command-input');
      const list = screen.getByTestId('command-list');
      const item = screen.getByTestId('command-item');

      expect(command).toHaveClass('flex', 'custom-command');
      expect(input).toHaveClass('flex', 'custom-input');
      expect(list).toHaveClass('max-h-[300px]', 'custom-list');
      expect(item).toHaveClass('relative', 'custom-item');
    });
  });
});
