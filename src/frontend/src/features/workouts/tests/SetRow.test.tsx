import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SetRow } from '../components/SetRow';
import { FormProvider, useForm } from 'react-hook-form';

// Wrapper to provide React Hook Form context
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
    render(
      <TestWrapper>
        <SetRow exerciseIndex={0} setIndex={0} onRemove={mockRemove} />
      </TestWrapper>
    );

    const weightInput = screen.getByLabelText(/Weight \(kg\)/i);
    const repsInput = screen.getByLabelText(/Reps/i);

    expect(weightInput).toBeInTheDocument();
    expect(weightInput).toHaveValue(100);

    expect(repsInput).toBeInTheDocument();
    expect(repsInput).toHaveValue(5);

    expect(weightInput).toHaveAttribute('min', '0');
    expect(repsInput).toHaveAttribute('min', '1');
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
