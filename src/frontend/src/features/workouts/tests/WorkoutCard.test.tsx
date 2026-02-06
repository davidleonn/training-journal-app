import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkoutCard } from '../components/WorkoutCard';
import { WorkoutSummaryResponse } from '../types';

describe('WorkoutCard', () => {
  const mockWorkout: WorkoutSummaryResponse = {
    id: 'test-id-123',
    name: 'Leg Day',
    date: '2026-02-05T10:00:00Z',
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn(); // 1. Mock the delete function

  it('renders workout name and formatted date', () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByTestId('workout-name')).toHaveTextContent('Leg Day');
    expect(screen.getByTestId('workout-date')).toHaveTextContent(/Thursday, February 5, 2026/i);
  });

  it('calls onEdit with correct ID when button is clicked', () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const button = screen.getByTestId('view-workout-btn');
    fireEvent.click(button);
    expect(mockOnEdit).toHaveBeenCalledWith('test-id-123');
  });

  // 2. New Test: Verify Delete Flow
  it('opens confirmation modal and calls onDelete when confirmed', async () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Click the Trash Icon
    const deleteBtn = screen.getByTestId('delete-workout-btn');
    fireEvent.click(deleteBtn);

    // Verify Modal Appears
    expect(await screen.findByText('Delete Workout?')).toBeInTheDocument();

    // Click "Delete" inside the modal
    const confirmBtn = screen.getByTestId('confirm-modal-confirm');
    fireEvent.click(confirmBtn);

    // Verify the function was actually called
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith('test-id-123');
    });
  });

  // 3. New Test: Verify Cancel Flow
  it('does not call onDelete if modal is cancelled', async () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // Open Modal
    fireEvent.click(screen.getByTestId('delete-workout-btn'));

    // Click "Cancel"
    const cancelBtn = screen.getByTestId('confirm-modal-cancel');
    fireEvent.click(cancelBtn);

    // Verify delete was NOT called
    expect(mockOnDelete).not.toHaveBeenCalled();
  });
});
