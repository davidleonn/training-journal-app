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
  const mockOnDelete = vi.fn();

  it('renders loading skeleton when loading is true', () => {
    render(<WorkoutList workouts={[]} loading={true} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByTestId('workout-list-loading')).toBeInTheDocument();
    // Should NOT show empty state or list
    expect(screen.queryByTestId('workout-list-empty')).not.toBeInTheDocument();
    expect(screen.queryByTestId('workout-list')).not.toBeInTheDocument();
  });

  it('renders empty state when not loading and list is empty', () => {
    render(<WorkoutList workouts={[]} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByTestId('workout-list-empty')).toBeInTheDocument();
    expect(screen.getByText(/No workouts yet/i)).toBeInTheDocument();
  });

  it('renders list of workouts when data is present', () => {
    render(<WorkoutList workouts={mockWorkouts} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const list = screen.getByTestId('workout-list');
    expect(list).toBeInTheDocument();

    // 1. Verify specific cards exist by their unique IDs
    const card0 = screen.getByTestId('workout-card-0');
    const card1 = screen.getByTestId('workout-card-1');

    expect(card0).toBeInTheDocument();
    expect(card1).toBeInTheDocument();

    // 2. Verify content matches the mock data
    expect(card0).toHaveTextContent('Push Day');
    expect(card1).toHaveTextContent('Pull Day');
  });

  it('propagates onDelete event from children', () => {
    render(<WorkoutList workouts={mockWorkouts} loading={false} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByTestId('workout-card-0-delete-btn');
    fireEvent.click(deleteButtons[0]);

    // Click confirm in the modal that appears
    fireEvent.click(screen.getByTestId('confirm-modal'));

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
