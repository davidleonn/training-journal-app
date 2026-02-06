import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuickActions } from '../components/QuickActions';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('QuickActions', () => {
  it('renders correctly', () => {
    render(<QuickActions />);
    expect(screen.getByTestId('dashboard-quick-actions')).toBeInTheDocument();
    expect(screen.getByText('My Routines')).toBeInTheDocument();
  });

  it('navigates to empty editor when "Log Empty Workout" is clicked', () => {
    render(<QuickActions />);

    const logBtn = screen.getByTestId('action-create-workout');
    fireEvent.click(logBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/workouts/new');
  });

  it('navigates to routines page when "My Routines" is clicked', () => {
    render(<QuickActions />);

    const browseBtn = screen.getByTestId('action-browse-templates');
    fireEvent.click(browseBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/routines');
  });
});
