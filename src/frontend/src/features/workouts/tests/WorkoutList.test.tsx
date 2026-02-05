import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkoutList } from '../components/WorkoutList';
import { WorkoutSummaryResponse } from '../types';

describe('WorkoutList', () => {
  const mockWorkouts: WorkoutSummaryResponse[] = [
    { id: '1', name: 'Push Day', date: '2026-02-01T10:00:00Z' },
    { id: '2', name: 'Pull Day', date: '2026-02-02T10:00:00Z' },
  ];

  const mockOnEdit = vi.fn();

  it('renders loading skeleton when loading is true', () => {
    render(<WorkoutList workouts={[]} loading={true} onEdit={mockOnEdit} />);

    expect(screen.getByTestId('workout-list-loading')).toBeInTheDocument();
    // Should NOT show empty state or list
    expect(screen.queryByTestId('workout-list-empty')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workout-list')).not.toBeInTheDocument();
  });

  it('renders empty state when not loading and list is empty', () => {
    render(<WorkoutList workouts={[]} loading={false} onEdit={mockOnEdit} />);

    expect(screen.getByTestId('workout-list-empty')).toBeInTheDocument();
    expect(screen.getByText(/No workouts yet/i)).toBeInTheDocument();
  });

  it('renders list of workouts when data is present', () => {
    render(<WorkoutList workouts={mockWorkouts} loading={false} onEdit={mockOnEdit} />);

    const list = screen.getByTestId('workout-list');
    expect(list).toBeInTheDocument();

    // Check that we have 2 cards
    const cards = screen.getAllByTestId('workout-card');
    expect(cards).toHaveLength(2);

    // Verify content of first card
    expect(cards[0]).toHaveTextContent('Push Day');
    expect(cards[1]).toHaveTextContent('Pull Day');
  });

  it('propagates onEdit event from children', () => {
    render(<WorkoutList workouts={mockWorkouts} loading={false} onEdit={mockOnEdit} />);

    // Click the "View Details" button on the first card
    const buttons = screen.getAllByTestId('view-workout-btn');
    fireEvent.click(buttons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
