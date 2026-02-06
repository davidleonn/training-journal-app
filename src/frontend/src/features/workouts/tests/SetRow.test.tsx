import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { SetRow } from '../components/SetRow';

// Helper to provide the React Hook Form context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      exercises: [{ sets: [{ weight: 100, reps: 5 }] }],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('SetRow', () => {
  const mockRemove = vi.fn();

  it('renders inputs with correct values and constraints', () => {
    // Updated title
    render(
      <TestWrapper>
        <SetRow exerciseIndex={0} setIndex={0} onRemove={mockRemove} />
      </TestWrapper>
    );

    // Verify Values
    const weightInput = screen.getByTestId('weight-input-0-0');
    const repsInput = screen.getByTestId('reps-input-0-0');

    expect(weightInput).toHaveValue(100);
    expect(repsInput).toHaveValue(5);

    // Verify negative numbers are blocked at the HTML level
    expect(weightInput).toHaveAttribute('min', '0');
    expect(repsInput).toHaveAttribute('min', '0');
  });

  it('calls onRemove when delete button is clicked', () => {
    render(
      <TestWrapper>
        <SetRow exerciseIndex={0} setIndex={0} onRemove={mockRemove} />
      </TestWrapper>
    );

    const removeBtn = screen.getByTestId('remove-set-btn-0-0');
    fireEvent.click(removeBtn);

    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
