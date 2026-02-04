import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistorySidebar } from '../components/HistorySidebar';

describe('HistorySidebar Component', () => {
  it('renders the sidebar and shows the empty state message', () => {
    render(<HistorySidebar />);

    expect(screen.getByTestId('history-sidebar')).toBeDefined();
    expect(screen.getByTestId('history-empty-state')).toBeDefined();
    expect(screen.getByText(/Your journal is empty/i)).toBeDefined();
  });
});
