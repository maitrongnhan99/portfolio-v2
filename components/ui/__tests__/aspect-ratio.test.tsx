import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AspectRatio } from '../aspect-ratio';

describe('AspectRatio Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(
        <AspectRatio>
          <div>Content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('Content');
    });

    it('should render with custom ratio', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          <img src="/test.jpg" alt="Test" />
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      // AspectRatio uses position: absolute for proper aspect ratio behavior
      expect(aspectRatio).toHaveStyle('position: absolute');
    });

    it('should render with 1:1 ratio by default', () => {
      render(
        <AspectRatio>
          <div>Square content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      // Default ratio is 1 (1:1), uses position: absolute
      expect(aspectRatio).toHaveStyle('position: absolute');
    });

    it('should render children correctly', () => {
      render(
        <AspectRatio ratio={4 / 3}>
          <img src="/image.jpg" alt="Test Image" />
          <div>Overlay content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      const image = screen.getByAltText('Test Image');
      const overlay = screen.getByText('Overlay content');
      
      expect(aspectRatio).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(overlay).toBeInTheDocument();
      expect(aspectRatio).toContainElement(image);
      expect(aspectRatio).toContainElement(overlay);
    });
  });

  describe('Aspect Ratios', () => {
    it('should handle 16:9 aspect ratio', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          <div>16:9 content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('16:9 content');
    });

    it('should handle 4:3 aspect ratio', () => {
      render(
        <AspectRatio ratio={4 / 3}>
          <div>4:3 content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('4:3 content');
    });

    it('should handle 3:2 aspect ratio', () => {
      render(
        <AspectRatio ratio={3 / 2}>
          <div>3:2 content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('3:2 content');
    });

    it('should handle 21:9 ultrawide aspect ratio', () => {
      render(
        <AspectRatio ratio={21 / 9}>
          <div>21:9 ultrawide content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('21:9 ultrawide content');
    });

    it('should handle portrait aspect ratio', () => {
      render(
        <AspectRatio ratio={9 / 16}>
          <div>Portrait content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('Portrait content');
    });

    it('should handle custom decimal ratio', () => {
      render(
        <AspectRatio ratio={1.618}>
          <div>Golden ratio content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('Golden ratio content');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward HTML div attributes', () => {
      render(
        <AspectRatio
          id="custom-aspect-ratio"
          className="custom-class"
          role="img"
          aria-label="Custom aspect ratio"
          data-custom="value"
        >
          <div>Content with attributes</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toHaveAttribute('id', 'custom-aspect-ratio');
      expect(aspectRatio).toHaveClass('custom-class');
      expect(aspectRatio).toHaveAttribute('role', 'img');
      expect(aspectRatio).toHaveAttribute('aria-label', 'Custom aspect ratio');
      expect(aspectRatio).toHaveAttribute('data-custom', 'value');
    });

    it('should support style prop', () => {
      render(
        <AspectRatio style={{ border: '1px solid red', margin: '10px' }}>
          <div>Styled content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toHaveStyle('border: 1px solid red');
      expect(aspectRatio).toHaveStyle('margin: 10px');
    });

    it('should support event handlers', () => {
      const handleClick = vi.fn();
      const handleMouseEnter = vi.fn();
      
      render(
        <AspectRatio onClick={handleClick} onMouseEnter={handleMouseEnter}>
          <div>Interactive content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');

      // Click event
      fireEvent.click(aspectRatio);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Mouse enter event
      fireEvent.mouseEnter(aspectRatio);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <AspectRatio ref={ref} ratio={16 / 9}>
          <div>Ref content</div>
        </AspectRatio>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Ref content');
    });

    it('should allow ref manipulation', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <AspectRatio ref={ref}>
          <div>Manipulatable content</div>
        </AspectRatio>
      );
      
      // Should be able to call DOM methods on the ref
      expect(ref.current?.tagName).toBe('DIV');
      expect(ref.current?.getAttribute('data-testid')).toBe('aspect-ratio');
    });
  });

  describe('Common Use Cases', () => {
    it('should work with images', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          <img 
            src="/hero-image.jpg" 
            alt="Hero image" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      const image = screen.getByAltText('Hero image');
      
      expect(aspectRatio).toBeInTheDocument();
      expect(image).toBeInTheDocument();
      expect(aspectRatio).toContainElement(image);
      expect(image).toHaveStyle('width: 100%');
      expect(image).toHaveStyle('height: 100%');
    });

    it('should work with videos', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          <video 
            src="/video.mp4" 
            controls
            style={{ width: '100%', height: '100%' }}
          >
            Your browser does not support the video tag.
          </video>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      const video = screen.getByText('Your browser does not support the video tag.').parentElement;
      
      expect(aspectRatio).toBeInTheDocument();
      expect(video).toBeInTheDocument();
      expect(aspectRatio).toContainElement(video!);
    });

    it('should work with iframes', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video"
            style={{ width: '100%', height: '100%' }}
          />
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      const iframe = screen.getByTitle('YouTube video');
      
      expect(aspectRatio).toBeInTheDocument();
      expect(iframe).toBeInTheDocument();
      expect(aspectRatio).toContainElement(iframe);
    });

    it('should work with complex content', () => {
      render(
        <AspectRatio ratio={4 / 3}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img 
              src="/background.jpg" 
              alt="Background" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <h2>Overlay Title</h2>
              <p>Overlay description</p>
            </div>
          </div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      const background = screen.getByAltText('Background');
      const title = screen.getByText('Overlay Title');
      const description = screen.getByText('Overlay description');
      
      expect(aspectRatio).toBeInTheDocument();
      expect(background).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(
        <AspectRatio ratio={16 / 9}>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('');
    });

    it('should handle null children', () => {
      render(
        <AspectRatio ratio={16 / 9}>
          {null}
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('');
    });

    it('should handle conditional children', () => {
      const showContent = true;
      
      render(
        <AspectRatio ratio={16 / 9}>
          {showContent && <div>Conditional content</div>}
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('Conditional content');
    });

    it('should handle very small ratios', () => {
      render(
        <AspectRatio ratio={0.1}>
          <div>Very tall content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('Very tall content');
    });

    it('should handle very large ratios', () => {
      render(
        <AspectRatio ratio={10}>
          <div>Very wide content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('Very wide content');
    });

    it('should handle zero ratio gracefully', () => {
      render(
        <AspectRatio ratio={0}>
          <div>Zero ratio content</div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toBeInTheDocument();
      expect(aspectRatio).toHaveTextContent('Zero ratio content');
    });
  });

  describe('Accessibility', () => {
    it('should support ARIA attributes', () => {
      render(
        <AspectRatio 
          ratio={16 / 9}
          role="img"
          aria-label="Video thumbnail"
          aria-describedby="video-description"
        >
          <img src="/thumbnail.jpg" alt="Video thumbnail" />
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      expect(aspectRatio).toHaveAttribute('role', 'img');
      expect(aspectRatio).toHaveAttribute('aria-label', 'Video thumbnail');
      expect(aspectRatio).toHaveAttribute('aria-describedby', 'video-description');
    });

    it('should work with screen readers', () => {
      render(
        <AspectRatio ratio={16 / 9} aria-label="Image gallery">
          <div role="img" aria-label="Gallery image">
            <img src="/gallery.jpg" alt="Gallery item" />
          </div>
        </AspectRatio>
      );
      
      const aspectRatio = screen.getByTestId('aspect-ratio');
      const galleryImage = screen.getByRole('img', { name: 'Gallery image' });
      
      expect(aspectRatio).toHaveAttribute('aria-label', 'Image gallery');
      expect(galleryImage).toBeInTheDocument();
    });
  });
});
