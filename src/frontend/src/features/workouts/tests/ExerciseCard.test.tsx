import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { ExerciseCard } from '../components/ExerciseCard';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      exercises: [
        {
          name: 'Bench Press',
          sets: [{ weight: 80, reps: 8 }],
        },
      ],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ExerciseCard', () => {
  const mockRemove = vi.fn();

  it('renders exercise name and initial set', () => {
    render(
      <TestWrapper>
        <ExerciseCard exerciseIndex={0} onRemove={mockRemove} />
      </TestWrapper>
    );

    expect(screen.getByTestId('exercise-name-0')).toHaveValue('Bench Press');
    expect(screen.getByTestId('set-row-0-0')).toBeInTheDocument();
  });

  it('adds a new set when "Add Set" is clicked', () => {
    render(
      <TestWrapper>
        <ExerciseCard exerciseIndex={0} onRemove={mockRemove} />
      </TestWrapper>
    );

    // Click Add Set
    fireEvent.click(screen.getByTestId('add-set-btn-0'));

    // Should now see 2 sets (Index 0 and Index 1)
    expect(screen.getByTestId('set-row-0-1')).toBeInTheDocument();
  });

  it('calls onRemove when "Remove Exercise" is clicked', () => {
    render(
      <TestWrapper>
        <ExerciseCard exerciseIndex={0} onRemove={mockRemove} />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('remove-exercise-btn-0'));
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
