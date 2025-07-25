import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card>Card Content</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card Content');
      expect(card.tagName).toBe('DIV');
    });

    it('should render with custom className', () => {
      render(<Card className="custom-class">Card</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
    });

    it('should have base card classes', () => {
      render(<Card>Card</Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass(
        'rounded-lg',
        'border',
        'bg-card',
        'text-card-foreground',
        'shadow-sm'
      );
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<Card ref={ref}>Card with ref</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Card with ref');
    });

    it('should forward HTML div attributes', () => {
      render(
        <Card 
          id="test-card"
          role="article"
          aria-label="Test card"
        >
          Card
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('id', 'test-card');
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('aria-label', 'Test card');
    });
  });

  describe('CardHeader', () => {
    it('should render with default props', () => {
      render(<CardHeader>Header Content</CardHeader>);
      
      const header = screen.getByTestId('card-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Header Content');
    });

    it('should have base header classes', () => {
      render(<CardHeader>Header</CardHeader>);
      
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'space-y-1.5',
        'p-6'
      );
    });

    it('should render with custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('custom-header');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<CardHeader ref={ref}>Header</CardHeader>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardTitle', () => {
    it('should render with default props', () => {
      render(<CardTitle>Title Text</CardTitle>);
      
      const title = screen.getByTestId('card-title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Title Text');
    });

    it('should have base title classes', () => {
      render(<CardTitle>Title</CardTitle>);
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass(
        'text-2xl',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should render with custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      
      const title = screen.getByTestId('card-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<CardTitle ref={ref}>Title</CardTitle>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardDescription', () => {
    it('should render with default props', () => {
      render(<CardDescription>Description text</CardDescription>);
      
      const description = screen.getByTestId('card-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('Description text');
    });

    it('should have base description classes', () => {
      render(<CardDescription>Description</CardDescription>);
      
      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass(
        'text-sm',
        'text-muted-foreground'
      );
    });

    it('should render with custom className', () => {
      render(<CardDescription className="custom-desc">Description</CardDescription>);
      
      const description = screen.getByTestId('card-description');
      expect(description).toHaveClass('custom-desc');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<CardDescription ref={ref}>Description</CardDescription>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardContent', () => {
    it('should render with default props', () => {
      render(<CardContent>Content text</CardContent>);
      
      const content = screen.getByTestId('card-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content text');
    });

    it('should have base content classes', () => {
      render(<CardContent>Content</CardContent>);
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('should render with custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<CardContent ref={ref}>Content</CardContent>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardFooter', () => {
    it('should render with default props', () => {
      render(<CardFooter>Footer content</CardFooter>);
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer content');
    });

    it('should have base footer classes', () => {
      render(<CardFooter>Footer</CardFooter>);
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass(
        'flex',
        'items-center',
        'p-6',
        'pt-0'
      );
    });

    it('should render with custom className', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);
      
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveClass('custom-footer');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Complete Card Structure', () => {
    it('should render a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      );

      const card = screen.getByTestId('card');
      const header = screen.getByTestId('card-header');
      const title = screen.getByTestId('card-title');
      const description = screen.getByTestId('card-description');
      const content = screen.getByTestId('card-content');
      const footer = screen.getByTestId('card-footer');

      expect(card).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(content).toBeInTheDocument();
      expect(footer).toBeInTheDocument();

      expect(title).toHaveTextContent('Card Title');
      expect(description).toHaveTextContent('Card description text');
      expect(content).toHaveTextContent('This is the main content of the card.');
      expect(footer).toHaveTextContent('Action Button');
    });

    it('should maintain proper hierarchy', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      const card = screen.getByTestId('card');
      const header = screen.getByTestId('card-header');
      const title = screen.getByTestId('card-title');
      const description = screen.getByTestId('card-description');
      const content = screen.getByTestId('card-content');
      const footer = screen.getByTestId('card-footer');

      expect(card).toContainElement(header);
      expect(card).toContainElement(content);
      expect(card).toContainElement(footer);
      expect(header).toContainElement(title);
      expect(header).toContainElement(description);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Card></Card>);
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('');
    });

    it('should handle complex nested content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>
              <span>Complex</span>
              <strong>Title</strong>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p>Paragraph 1</p>
              <p>Paragraph 2</p>
            </div>
          </CardContent>
        </Card>
      );

      const card = screen.getByTestId('card');
      expect(card).toHaveTextContent('ComplexTitleParagraph 1Paragraph 2');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Card className="bg-red-500">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Title</CardTitle>
          </CardHeader>
        </Card>
      );

      const card = screen.getByTestId('card');
      const header = screen.getByTestId('card-header');
      const title = screen.getByTestId('card-title');

      expect(card).toHaveClass('rounded-lg', 'bg-red-500');
      expect(header).toHaveClass('flex', 'p-4');
      expect(title).toHaveClass('font-semibold', 'text-lg');
    });
  });

  describe('Accessibility', () => {
    it('should support aria attributes on all components', () => {
      render(
        <Card aria-label="Product card">
          <CardHeader aria-label="Product header">
            <CardTitle aria-level={2}>Product Name</CardTitle>
            <CardDescription aria-describedby="price">Product description</CardDescription>
          </CardHeader>
          <CardContent aria-label="Product details">Details</CardContent>
          <CardFooter aria-label="Product actions">Actions</CardFooter>
        </Card>
      );

      const card = screen.getByTestId('card');
      const header = screen.getByTestId('card-header');
      const title = screen.getByTestId('card-title');
      const description = screen.getByTestId('card-description');
      const content = screen.getByTestId('card-content');
      const footer = screen.getByTestId('card-footer');

      expect(card).toHaveAttribute('aria-label', 'Product card');
      expect(header).toHaveAttribute('aria-label', 'Product header');
      expect(title).toHaveAttribute('aria-level', '2');
      expect(description).toHaveAttribute('aria-describedby', 'price');
      expect(content).toHaveAttribute('aria-label', 'Product details');
      expect(footer).toHaveAttribute('aria-label', 'Product actions');
    });
  });
});
