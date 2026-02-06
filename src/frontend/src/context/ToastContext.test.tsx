import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from './ToastContext';

// 1. Create a Test Component to consume the hook
const TestComponent = () => {
  const { addToast } = useToast();
  return (
    <div>
      <button onClick={() => addToast('Operation Successful', 'success')} data-testid="trigger-success">
        Show Success
      </button>
      <button onClick={() => addToast('Operation Failed', 'error')} data-testid="trigger-error">
        Show Error
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Take control of time
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a success toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // 1. Click button
    fireEvent.click(screen.getByTestId('trigger-success'));

    // 2. Check if toast appears
    const toast = screen.getByTestId('toast-item-success');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Operation Successful');
  });

  it('renders an error toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('trigger-error'));

    const toast = screen.getByTestId('toast-item-error');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Operation Failed');
  });

  it('removes toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Trigger and verify existence
    fireEvent.click(screen.getByTestId('trigger-success'));
    expect(screen.getByTestId('toast-item-success')).toBeInTheDocument();

    // Click Close
    fireEvent.click(screen.getByTestId('toast-close-btn'));

    // Verify removal
    expect(screen.queryByTestId('toast-item-success')).not.toBeInTheDocument();
  });

  it('auto-dismisses toast after 3 seconds', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('trigger-success'));
    expect(screen.getByTestId('toast-item-success')).toBeInTheDocument();

    // Fast-forward time by 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Verify it's gone
    expect(screen.queryByTestId('toast-item-success')).not.toBeInTheDocument();
  });

  it('can display multiple toasts simultaneously', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('trigger-success'));
    fireEvent.click(screen.getByTestId('trigger-error'));

    // Both should exist
    expect(screen.getByTestId('toast-item-success')).toBeInTheDocument();
    expect(screen.getByTestId('toast-item-error')).toBeInTheDocument();

    // Container should have 2 children
    expect(screen.getByTestId('toast-container').children).toHaveLength(2);
  });
});
