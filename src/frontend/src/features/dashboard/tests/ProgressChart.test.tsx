import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProgressChart } from '../components/ProgressChart';

// Mock Recharts to avoid 0-height/width issues in JSDOM
vi.mock('recharts', async () => {
  const Original = await vi.importActual('recharts');
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('ProgressChart Component', () => {
  it('renders the chart container and volume metrics', () => {
    render(<ProgressChart />);

    expect(screen.getByTestId('progress-chart-container')).toBeDefined();
    expect(screen.getByText(/12,450/)).toBeDefined(); // Total volume check
    expect(screen.getByText(/Weekly Progress/i)).toBeDefined();
  });
});
