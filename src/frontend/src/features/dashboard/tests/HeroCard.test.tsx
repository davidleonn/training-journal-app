import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroCard } from '../components/HeroCard';

describe('HeroCard', () => {
  const mockStartSession = vi.fn();
  const userName = 'David';

  it('renders the user name correctly', () => {
    render(<HeroCard userName={userName} onStartSession={mockStartSession} />);

    expect(screen.getByTestId('hero-username')).toHaveTextContent('David');
  });

  it('calls onStartSession when button is clicked', () => {
    render(<HeroCard userName={userName} onStartSession={mockStartSession} />);

    const button = screen.getByTestId('start-session-button');
    fireEvent.click(button);

    expect(mockStartSession).toHaveBeenCalledTimes(1);
  });
});
