import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkoutCard } from '../components/WorkoutCard';
import { WorkoutSummaryResponse } from '../types';

describe('WorkoutCard', () => {
  const mockWorkout: WorkoutSummaryResponse = {
    id: 'test-id-123',
    name: 'Leg Day',
    date: '2026-02-05T10:00:00Z', // Thursday, February 5, 2026
  };

  const mockOnEdit = vi.fn();

  it('renders workout name and formatted date', () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={mockOnEdit} />);

    // Check Name
    expect(screen.getByTestId('workout-name')).toHaveTextContent('Leg Day');

    // Check Date (matches the en-US formatting in your component)
    // "Thursday, February 5, 2026"
    expect(screen.getByTestId('workout-date')).toHaveTextContent(/Thursday, February 5, 2026/i);
  });

  it('calls onEdit with correct ID when button is clicked', () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={mockOnEdit} />);

    const button = screen.getByTestId('view-workout-btn');
    fireEvent.click(button);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith('test-id-123');
  });
});
