import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroCard } from '../components/HeroCard';

describe('HeroCard Component', () => {
  it('renders the specific athlete name provided in props', () => {
    render(<HeroCard userName="David" onStartSession={vi.fn()} />);

    expect(screen.getByTestId('hero-username')).toHaveTextContent('David?');
    expect(screen.getByText(/Ready to crush it/i)).toBeDefined();
  });

  it('calls the onStartSession function when the button is clicked', () => {
    const mockStart = vi.fn();
    render(<HeroCard userName="Athlete" onStartSession={mockStart} />);

    const startBtn = screen.getByTestId('start-session-button');
    fireEvent.click(startBtn);

    expect(mockStart).toHaveBeenCalledTimes(1);
  });
});
