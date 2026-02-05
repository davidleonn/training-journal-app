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

  it('renders inputs with correct values', () => {
    render(
      <TestWrapper>
        <SetRow exerciseIndex={0} setIndex={0} onRemove={mockRemove} />
      </TestWrapper>
    );

    // Verify Set Number
    expect(screen.getByTestId('set-number-0-0')).toHaveTextContent('#1');

    // Verify Inputs (Connected to Form)
    expect(screen.getByTestId('weight-input-0-0')).toHaveValue(100);
    expect(screen.getByTestId('reps-input-0-0')).toHaveValue(5);
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
