import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '../chart';

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="chart-tooltip">{children}</div>
  ),
  Legend: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="chart-legend">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
}));

describe('Chart Components', () => {
  const mockConfig: ChartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#8884d8',
    },
    mobile: {
      label: 'Mobile',
      color: '#82ca9d',
    },
  };

  describe('ChartContainer', () => {
    it('should render with default props', () => {
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart content</div>
        </ChartContainer>
      );
      
      const container = screen.getByTestId('chart-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass(
        'flex',
        'aspect-video',
        'justify-center',
        'text-xs'
      );
      expect(container).toHaveAttribute('data-chart');
      
      const responsiveContainer = screen.getByTestId('responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
      expect(responsiveContainer).toHaveTextContent('Chart content');
    });

    it('should render with custom className', () => {
      render(
        <ChartContainer config={mockConfig} className="custom-chart">
          <div>Chart content</div>
        </ChartContainer>
      );
      
      const container = screen.getByTestId('chart-container');
      expect(container).toHaveClass('custom-chart');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <ChartContainer ref={ref} config={mockConfig}>
          <div>Chart content</div>
        </ChartContainer>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should generate unique chart ID', () => {
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart 1</div>
        </ChartContainer>
      );
      
      const container1 = screen.getByTestId('chart-container');
      const chartId1 = container1.getAttribute('data-chart');
      expect(chartId1).toMatch(/^chart-/);
      
      // Render another chart
      render(
        <ChartContainer config={mockConfig}>
          <div>Chart 2</div>
        </ChartContainer>
      );
      
      const containers = screen.getAllByTestId('chart-container');
      const chartId2 = containers[1].getAttribute('data-chart');
      expect(chartId2).toMatch(/^chart-/);
      expect(chartId1).not.toBe(chartId2);
    });

    it('should use custom ID when provided', () => {
      render(
        <ChartContainer config={mockConfig} id="custom-chart-id">
          <div>Chart content</div>
        </ChartContainer>
      );
      
      const container = screen.getByTestId('chart-container');
      expect(container).toHaveAttribute('data-chart', 'chart-custom-chart-id');
    });

    it('should support HTML div attributes', () => {
      render(
        <ChartContainer 
          config={mockConfig}
          aria-label="Sales chart"
          role="img"
          data-custom="value"
        >
          <div>Chart content</div>
        </ChartContainer>
      );
      
      const container = screen.getByTestId('chart-container');
      expect(container).toHaveAttribute('aria-label', 'Sales chart');
      expect(container).toHaveAttribute('role', 'img');
      expect(container).toHaveAttribute('data-custom', 'value');
    });

    it('should render chart styles when config has colors', () => {
      const configWithColors: ChartConfig = {
        desktop: {
          label: 'Desktop',
          color: '#8884d8',
        },
        mobile: {
          label: 'Mobile',
          theme: {
            light: '#82ca9d',
            dark: '#4ade80',
          },
        },
      };

      render(
        <ChartContainer config={configWithColors}>
          <div>Chart content</div>
        </ChartContainer>
      );
      
      const container = screen.getByTestId('chart-container');
      expect(container).toBeInTheDocument();
      
      // Should have style element for colors
      const styleElement = container.querySelector('style');
      expect(styleElement).toBeInTheDocument();
    });

    it('should not render styles when config has no colors', () => {
      const configWithoutColors: ChartConfig = {
        desktop: {
          label: 'Desktop',
        },
        mobile: {
          label: 'Mobile',
        },
      };

      render(
        <ChartContainer config={configWithoutColors}>
          <div>Chart content</div>
        </ChartContainer>
      );
      
      const container = screen.getByTestId('chart-container');
      expect(container).toBeInTheDocument();
      
      // Should not have style element
      const styleElement = container.querySelector('style');
      expect(styleElement).not.toBeInTheDocument();
    });
  });

  describe('ChartTooltipContent', () => {
    const mockPayload = [
      {
        name: 'desktop',
        value: 100,
        color: '#8884d8',
        dataKey: 'desktop',
        payload: { desktop: 100, mobile: 80 },
      },
      {
        name: 'mobile',
        value: 80,
        color: '#82ca9d',
        dataKey: 'mobile',
        payload: { desktop: 100, mobile: 80 },
      },
    ];

    it('should render tooltip content when active', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            label="January"
          />
        </ChartContainer>
      );
      
      const tooltipContent = screen.getByTestId('chart-tooltip-content');
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent).toHaveClass(
        'grid',
        'min-w-[8rem]',
        'items-start',
        'gap-1.5',
        'rounded-lg',
        'border',
        'bg-background',
        'px-2.5',
        'py-1.5',
        'text-xs',
        'shadow-xl'
      );
    });

    it('should not render when not active', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={false}
            payload={mockPayload}
            label="January"
          />
        </ChartContainer>
      );
      
      const tooltipContent = screen.queryByTestId('chart-tooltip-content');
      expect(tooltipContent).not.toBeInTheDocument();
    });

    it('should not render when payload is empty', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={[]}
            label="January"
          />
        </ChartContainer>
      );
      
      const tooltipContent = screen.queryByTestId('chart-tooltip-content');
      expect(tooltipContent).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            label="January"
            className="custom-tooltip"
          />
        </ChartContainer>
      );
      
      const tooltipContent = screen.getByTestId('chart-tooltip-content');
      expect(tooltipContent).toHaveClass('custom-tooltip');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            ref={ref}
            active={true}
            payload={mockPayload}
            label="January"
          />
        </ChartContainer>
      );
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should hide label when hideLabel is true', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            label="January"
            hideLabel={true}
          />
        </ChartContainer>
      );
      
      const tooltipContent = screen.getByTestId('chart-tooltip-content');
      expect(tooltipContent).toBeInTheDocument();
      expect(tooltipContent).not.toHaveTextContent('January');
    });

    it('should hide indicators when hideIndicator is true', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            label="January"
            hideIndicator={true}
          />
        </ChartContainer>
      );
      
      const tooltipContent = screen.getByTestId('chart-tooltip-content');
      expect(tooltipContent).toBeInTheDocument();
      // Should not have indicator dots
      const indicators = tooltipContent.querySelectorAll('.shrink-0.rounded-\\[2px\\]');
      expect(indicators.length).toBe(0);
    });

    it('should render different indicator types', () => {
      const indicators = ['dot', 'line', 'dashed'] as const;

      indicators.forEach((indicator, index) => {
        const { container } = render(
          <ChartContainer config={mockConfig}>
            <ChartTooltipContent
              active={true}
              payload={mockPayload}
              label="January"
              indicator={indicator}
            />
          </ChartContainer>
        );

        const tooltipContent = container.querySelector('[data-testid="chart-tooltip-content"]');
        expect(tooltipContent).toBeInTheDocument();
      });
    });

    it('should handle custom formatter', () => {
      const customFormatter = (value: any, name: any) => (
        <span data-testid="custom-format">{`${name}: ${value}%`}</span>
      );
      
      render(
        <ChartContainer config={mockConfig}>
          <ChartTooltipContent
            active={true}
            payload={mockPayload}
            label="January"
            formatter={customFormatter}
          />
        </ChartContainer>
      );
      
      const customFormat = screen.getAllByTestId('custom-format');
      expect(customFormat.length).toBeGreaterThan(0);
    });
  });

  describe('ChartLegendContent', () => {
    const mockLegendPayload = [
      {
        value: 'desktop',
        type: 'line' as const,
        color: '#8884d8',
        dataKey: 'desktop',
      },
      {
        value: 'mobile',
        type: 'line' as const,
        color: '#82ca9d',
        dataKey: 'mobile',
      },
    ];

    it('should render legend content with payload', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={mockLegendPayload} />
        </ChartContainer>
      );

      const legendContent = screen.getByTestId('chart-legend-content');
      expect(legendContent).toBeInTheDocument();
      expect(legendContent).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'gap-4',
        'pt-3'
      );
    });

    it('should not render when payload is empty', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent payload={[]} />
        </ChartContainer>
      );

      const legendContent = screen.queryByTestId('chart-legend-content');
      expect(legendContent).not.toBeInTheDocument();
    });

    it('should not render when payload is undefined', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent />
        </ChartContainer>
      );

      const legendContent = screen.queryByTestId('chart-legend-content');
      expect(legendContent).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent
            payload={mockLegendPayload}
            className="custom-legend"
          />
        </ChartContainer>
      );

      const legendContent = screen.getByTestId('chart-legend-content');
      expect(legendContent).toHaveClass('custom-legend');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent
            ref={ref}
            payload={mockLegendPayload}
          />
        </ChartContainer>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should handle top vertical alignment', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent
            payload={mockLegendPayload}
            verticalAlign="top"
          />
        </ChartContainer>
      );

      const legendContent = screen.getByTestId('chart-legend-content');
      expect(legendContent).toHaveClass('pb-3');
    });

    it('should handle bottom vertical alignment', () => {
      render(
        <ChartContainer config={mockConfig}>
          <ChartLegendContent
            payload={mockLegendPayload}
            verticalAlign="bottom"
          />
        </ChartContainer>
      );

      const legendContent = screen.getByTestId('chart-legend-content');
      expect(legendContent).toHaveClass('pt-3');
    });
  });

  describe('Chart Integration', () => {
    it('should work with complete chart structure', () => {
      // Mock chart components are already imported at the top
      const LineChart = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="line-chart">{children}</div>
      );
      const Line = () => <div data-testid="line" />;
      const XAxis = () => <div data-testid="x-axis" />;
      const YAxis = () => <div data-testid="y-axis" />;
      const CartesianGrid = () => <div data-testid="cartesian-grid" />;

      render(
        <ChartContainer config={mockConfig}>
          <LineChart>
            <CartesianGrid />
            <XAxis />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line />
            <Line />
          </LineChart>
        </ChartContainer>
      );

      const container = screen.getByTestId('chart-container');
      const responsiveContainer = screen.getByTestId('responsive-container');
      const lineChart = screen.getByTestId('line-chart');

      expect(container).toBeInTheDocument();
      expect(responsiveContainer).toBeInTheDocument();
      expect(lineChart).toBeInTheDocument();
    });

    it('should handle complex chart config with icons', () => {
      const IconComponent = () => <svg data-testid="custom-icon" />;

      const configWithIcons: ChartConfig = {
        desktop: {
          label: 'Desktop',
          color: '#8884d8',
          icon: IconComponent,
        },
        mobile: {
          label: 'Mobile',
          color: '#82ca9d',
        },
      };

      render(
        <ChartContainer config={configWithIcons}>
          <div>Chart with icons</div>
        </ChartContainer>
      );

      const container = screen.getByTestId('chart-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should support ARIA attributes', () => {
      render(
        <ChartContainer
          config={mockConfig}
          role="img"
          aria-label="Sales data chart"
          aria-describedby="chart-description"
        >
          <div>Accessible chart</div>
        </ChartContainer>
      );

      const container = screen.getByTestId('chart-container');
      expect(container).toHaveAttribute('role', 'img');
      expect(container).toHaveAttribute('aria-label', 'Sales data chart');
      expect(container).toHaveAttribute('aria-describedby', 'chart-description');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty config', () => {
      const emptyConfig: ChartConfig = {};

      render(
        <ChartContainer config={emptyConfig}>
          <div>Chart with empty config</div>
        </ChartContainer>
      );

      const container = screen.getByTestId('chart-container');
      expect(container).toBeInTheDocument();
    });

    it('should handle config with only labels', () => {
      const labelOnlyConfig: ChartConfig = {
        desktop: { label: 'Desktop' },
        mobile: { label: 'Mobile' },
      };

      render(
        <ChartContainer config={labelOnlyConfig}>
          <div>Chart with labels only</div>
        </ChartContainer>
      );

      const container = screen.getByTestId('chart-container');
      expect(container).toBeInTheDocument();

      // Should not have style element since no colors
      const styleElement = container.querySelector('style');
      expect(styleElement).not.toBeInTheDocument();
    });

    it('should combine custom classes with base classes', () => {
      render(
        <ChartContainer config={mockConfig} className="custom-chart">
          <ChartTooltipContent
            active={true}
            payload={[{
              name: 'test',
              value: 100,
              color: '#000',
              dataKey: 'test',
              payload: {},
            }]}
            className="custom-tooltip"
          />
        </ChartContainer>
      );

      const container = screen.getByTestId('chart-container');
      const tooltip = screen.getByTestId('chart-tooltip-content');

      expect(container).toHaveClass('flex', 'custom-chart');
      expect(tooltip).toHaveClass('grid', 'custom-tooltip');
    });
  });
});
