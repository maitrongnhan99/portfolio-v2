import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../breadcrumb';

describe('Breadcrumb Components', () => {
  describe('Breadcrumb', () => {
    it('should render with default props', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toBeInTheDocument();
      expect(breadcrumb.tagName).toBe('NAV');
      expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb');
    });

    it('should render with custom className', () => {
      render(
        <Breadcrumb className="custom-breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveClass('custom-breadcrumb');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLElement>();
      
      render(
        <Breadcrumb ref={ref}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('NAV');
    });

    it('should support HTML nav attributes', () => {
      render(
        <Breadcrumb id="main-breadcrumb" role="navigation" aria-describedby="breadcrumb-help">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveAttribute('id', 'main-breadcrumb');
      expect(breadcrumb).toHaveAttribute('role', 'navigation');
      expect(breadcrumb).toHaveAttribute('aria-describedby', 'breadcrumb-help');
    });
  });

  describe('BreadcrumbList', () => {
    it('should render with default classes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const list = screen.getByTestId('breadcrumb-list');
      expect(list).toBeInTheDocument();
      expect(list.tagName).toBe('OL');
      expect(list).toHaveClass(
        'flex',
        'flex-wrap',
        'items-center',
        'gap-1.5',
        'break-words',
        'text-sm',
        'text-muted-foreground',
        'sm:gap-2.5'
      );
    });

    it('should render with custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList className="custom-list">
            <BreadcrumbItem>
              <BreadcrumbPage>Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const list = screen.getByTestId('breadcrumb-list');
      expect(list).toHaveClass('custom-list');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLOListElement>();
      
      render(
        <Breadcrumb>
          <BreadcrumbList ref={ref}>
            <BreadcrumbItem>
              <BreadcrumbPage>Test</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLOListElement);
    });
  });

  describe('BreadcrumbItem', () => {
    it('should render with default classes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Test Item</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const item = screen.getByTestId('breadcrumb-item');
      expect(item).toBeInTheDocument();
      expect(item.tagName).toBe('LI');
      expect(item).toHaveClass('inline-flex', 'items-center', 'gap-1.5');
      expect(item).toHaveTextContent('Test Item');
    });

    it('should render with custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="custom-item">
              <BreadcrumbPage>Custom Item</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const item = screen.getByTestId('breadcrumb-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLLIElement>();
      
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem ref={ref}>
              <BreadcrumbPage>Ref Item</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });

  describe('BreadcrumbLink', () => {
    it('should render as anchor by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const link = screen.getByTestId('breadcrumb-link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/home');
      expect(link).toHaveTextContent('Home');
      expect(link).toHaveClass('transition-colors', 'hover:text-foreground');
    });

    it('should render with custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test" className="custom-link">
                Test Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const link = screen.getByTestId('breadcrumb-link');
      expect(link).toHaveClass('custom-link');
    });

    it('should support asChild prop', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button onClick={() => {}}>Button Link</button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const link = screen.getByTestId('breadcrumb-link');
      expect(link.tagName).toBe('BUTTON');
      expect(link).toHaveTextContent('Button Link');
    });

    it('should handle click events', async () => {
      const handleClick = vi.fn((e) => {
        e.preventDefault();
      });
      const user = userEvent.setup();
      
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/test" onClick={handleClick}>
                Clickable Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const link = screen.getByTestId('breadcrumb-link');
      await user.click(link);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLAnchorElement>();
      
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink ref={ref} href="/ref">
                Ref Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe('BreadcrumbPage', () => {
    it('should render with default props and accessibility attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const page = screen.getByTestId('breadcrumb-page');
      expect(page).toBeInTheDocument();
      expect(page.tagName).toBe('SPAN');
      expect(page).toHaveTextContent('Current Page');
      expect(page).toHaveAttribute('role', 'link');
      expect(page).toHaveAttribute('aria-disabled', 'true');
      expect(page).toHaveAttribute('aria-current', 'page');
      expect(page).toHaveClass('font-normal', 'text-foreground');
    });

    it('should render with custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="custom-page">
                Custom Page
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const page = screen.getByTestId('breadcrumb-page');
      expect(page).toHaveClass('custom-page');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage ref={ref}>Ref Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('should render with default arrow icon', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const separator = screen.getByTestId('breadcrumb-separator');
      expect(separator).toBeInTheDocument();
      expect(separator.tagName).toBe('LI');
      expect(separator).toHaveAttribute('role', 'presentation');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveClass('[&>svg]:w-3.5', '[&>svg]:h-3.5');
    });

    it('should render with custom separator', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const separator = screen.getByTestId('breadcrumb-separator');
      expect(separator).toHaveTextContent('/');
    });

    it('should render with custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="custom-separator">
              →
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      
      const separator = screen.getByTestId('breadcrumb-separator');
      expect(separator).toHaveClass('custom-separator');
      expect(separator).toHaveTextContent('→');
    });
  });

  describe('BreadcrumbEllipsis', () => {
    it('should render with default props', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const ellipsis = screen.getByTestId('breadcrumb-ellipsis');
      expect(ellipsis).toBeInTheDocument();
      expect(ellipsis.tagName).toBe('SPAN');
      expect(ellipsis).toHaveAttribute('role', 'presentation');
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
      expect(ellipsis).toHaveClass(
        'flex',
        'h-9',
        'w-9',
        'items-center',
        'justify-center'
      );
    });

    it('should render with screen reader text', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const ellipsis = screen.getByTestId('breadcrumb-ellipsis');
      const srText = screen.getByText('More');

      expect(ellipsis).toBeInTheDocument();
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });

    it('should render with custom className', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis className="custom-ellipsis" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const ellipsis = screen.getByTestId('breadcrumb-ellipsis');
      expect(ellipsis).toHaveClass('custom-ellipsis');
    });
  });

  describe('Complete Breadcrumb Structure', () => {
    it('should render complete breadcrumb navigation', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics">Electronics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Laptop</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId('breadcrumb');
      const list = screen.getByTestId('breadcrumb-list');
      const items = screen.getAllByTestId('breadcrumb-item');
      const links = screen.getAllByTestId('breadcrumb-link');
      const separators = screen.getAllByTestId('breadcrumb-separator');
      const page = screen.getByTestId('breadcrumb-page');

      expect(breadcrumb).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(items).toHaveLength(4);
      expect(links).toHaveLength(3);
      expect(separators).toHaveLength(3);
      expect(page).toBeInTheDocument();

      expect(links[0]).toHaveTextContent('Home');
      expect(links[1]).toHaveTextContent('Products');
      expect(links[2]).toHaveTextContent('Electronics');
      expect(page).toHaveTextContent('Laptop');
    });

    it('should render breadcrumb with ellipsis for long paths', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products/electronics">Electronics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Laptop</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const ellipsis = screen.getByTestId('breadcrumb-ellipsis');
      const homeLink = screen.getByText('Home');
      const electronicsLink = screen.getByText('Electronics');
      const currentPage = screen.getByText('Laptop');

      expect(ellipsis).toBeInTheDocument();
      expect(homeLink).toBeInTheDocument();
      expect(electronicsLink).toBeInTheDocument();
      expect(currentPage).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for navigation', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId('breadcrumb');
      const page = screen.getByTestId('breadcrumb-page');
      const separator = screen.getByTestId('breadcrumb-separator');

      expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb');
      expect(page).toHaveAttribute('aria-current', 'page');
      expect(page).toHaveAttribute('aria-disabled', 'true');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const homeLink = screen.getByText('Home');
      const productsLink = screen.getByText('Products');

      // Tab to first link
      await user.tab();
      expect(homeLink).toHaveFocus();

      // Tab to second link
      await user.tab();
      expect(productsLink).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single breadcrumb item', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Only Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId('breadcrumb');
      const page = screen.getByTestId('breadcrumb-page');

      expect(breadcrumb).toBeInTheDocument();
      expect(page).toHaveTextContent('Only Page');
      expect(screen.queryByTestId('breadcrumb-separator')).not.toBeInTheDocument();
    });

    it('should handle empty breadcrumb', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId('breadcrumb');
      const list = screen.getByTestId('breadcrumb-list');

      expect(breadcrumb).toBeInTheDocument();
      expect(list).toBeInTheDocument();
      expect(list).toHaveTextContent('');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Breadcrumb className="custom-breadcrumb">
          <BreadcrumbList className="custom-list">
            <BreadcrumbItem className="custom-item">
              <BreadcrumbLink href="/" className="custom-link">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="custom-separator" />
            <BreadcrumbItem className="custom-item">
              <BreadcrumbPage className="custom-page">Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const breadcrumb = screen.getByTestId('breadcrumb');
      const list = screen.getByTestId('breadcrumb-list');
      const items = screen.getAllByTestId('breadcrumb-item');
      const link = screen.getByTestId('breadcrumb-link');
      const separator = screen.getByTestId('breadcrumb-separator');
      const page = screen.getByTestId('breadcrumb-page');

      expect(breadcrumb).toHaveClass('custom-breadcrumb');
      expect(list).toHaveClass('flex', 'custom-list');
      expect(items[0]).toHaveClass('inline-flex', 'custom-item');
      expect(link).toHaveClass('transition-colors', 'custom-link');
      expect(separator).toHaveClass('[&>svg]:w-3.5', 'custom-separator');
      expect(page).toHaveClass('font-normal', 'custom-page');
    });
  });
});
