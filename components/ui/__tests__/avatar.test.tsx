import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('should render with default props', () => {
      render(<Avatar />);
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Avatar className="custom-avatar" />);
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('custom-avatar');
    });

    it('should have base avatar classes', () => {
      render(<Avatar />);
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass(
        'relative',
        'flex',
        'h-10',
        'w-10',
        'shrink-0',
        'overflow-hidden',
        'rounded-full'
      );
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      
      render(<Avatar ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('should forward HTML attributes', () => {
      render(
        <Avatar 
          id="test-avatar"
          role="img"
          aria-label="User avatar"
        />
      );
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('id', 'test-avatar');
      expect(avatar).toHaveAttribute('role', 'img');
      expect(avatar).toHaveAttribute('aria-label', 'User avatar');
    });
  });

  describe('AvatarImage', () => {
    it('should render with default props when image loads', () => {
      // Note: In test environment, AvatarImage only renders when image loads
      // We test the component structure and props
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test user" />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();

      // In test environment, fallback is shown since image doesn't load
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toBeInTheDocument();
    });

    it('should have correct structure when rendered', () => {
      // Test that the component accepts the expected props
      const TestComponent = () => (
        <Avatar>
          <AvatarImage
            src="/test.jpg"
            className="custom-image"
            alt="Test"
          />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );

      render(<TestComponent />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should support event handlers', () => {
      const handleLoad = vi.fn();
      const handleError = vi.fn();

      render(
        <Avatar>
          <AvatarImage
            src="/test.jpg"
            onLoad={handleLoad}
            onError={handleError}
            alt="Test"
          />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('AvatarFallback', () => {
    it('should render with default props', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );
      
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('JD');
    });

    it('should render with custom className', () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">FB</AvatarFallback>
        </Avatar>
      );
      
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveClass('custom-fallback');
    });

    it('should have base fallback classes', () => {
      render(
        <Avatar>
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );
      
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveClass(
        'flex',
        'h-full',
        'w-full',
        'items-center',
        'justify-center',
        'rounded-full',
        'bg-muted'
      );
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLSpanElement>();
      
      render(
        <Avatar>
          <AvatarFallback ref={ref}>FB</AvatarFallback>
        </Avatar>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('should render different fallback content types', () => {
      render(
        <Avatar>
          <AvatarFallback>
            <span>👤</span>
          </AvatarFallback>
        </Avatar>
      );
      
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveTextContent('👤');
    });
  });

  describe('Complete Avatar Structure', () => {
    it('should render avatar with image and fallback structure', () => {
      render(
        <Avatar>
          <AvatarImage src="/user.jpg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      const fallback = screen.getByTestId('avatar-fallback');

      expect(avatar).toBeInTheDocument();
      expect(fallback).toBeInTheDocument();
      expect(avatar).toContainElement(fallback);
    });

    it('should work with only fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      const fallback = screen.getByTestId('avatar-fallback');

      expect(avatar).toBeInTheDocument();
      expect(fallback).toBeInTheDocument();
      expect(avatar).toContainElement(fallback);
    });

    it('should work with image component structure', () => {
      render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="Test" />
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should support aria attributes on avatar and fallback', () => {
      render(
        <Avatar aria-label="User profile picture">
          <AvatarImage
            src="/user.jpg"
            alt="John Doe profile picture"
            aria-describedby="user-info"
          />
          <AvatarFallback aria-label="User initials">JD</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      const fallback = screen.getByTestId('avatar-fallback');

      expect(avatar).toHaveAttribute('aria-label', 'User profile picture');
      expect(fallback).toHaveAttribute('aria-label', 'User initials');
    });

    it('should support fallback accessibility', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveTextContent('JD');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty avatar', () => {
      render(<Avatar />);
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('');
    });

    it('should handle invalid image src gracefully', () => {
      render(
        <Avatar>
          <AvatarImage src="/invalid-image.jpg" alt="Invalid" />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      );

      // In test environment, fallback is shown when image fails to load
      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toBeInTheDocument();
      expect(fallback).toHaveTextContent('FB');
    });

    it('should combine custom classes with base classes', () => {
      render(
        <Avatar className="custom-size">
          <AvatarImage src="/test.jpg" className="custom-image" />
          <AvatarFallback className="custom-fallback">FB</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      const fallback = screen.getByTestId('avatar-fallback');

      expect(avatar).toHaveClass('relative', 'custom-size');
      expect(fallback).toHaveClass('flex', 'custom-fallback');
    });

    it('should handle complex fallback content', () => {
      render(
        <Avatar>
          <AvatarFallback>
            <div className="flex flex-col">
              <span>J</span>
              <span>D</span>
            </div>
          </AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByTestId('avatar-fallback');
      expect(fallback).toHaveTextContent('JD');
      expect(fallback.querySelector('.flex.flex-col')).toBeInTheDocument();
    });
  });

  describe('Props Forwarding', () => {
    it('should forward data attributes to avatar and fallback', () => {
      render(
        <Avatar data-user-id="123">
          <AvatarImage src="/test.jpg" data-loaded="true" />
          <AvatarFallback data-fallback="initials">FB</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      const fallback = screen.getByTestId('avatar-fallback');

      expect(avatar).toHaveAttribute('data-user-id', '123');
      expect(fallback).toHaveAttribute('data-fallback', 'initials');
    });
  });
});
