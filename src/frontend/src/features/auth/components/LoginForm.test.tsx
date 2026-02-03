import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './LoginForm';
import { server } from '../../../test/setup';
import { http, HttpResponse, delay } from 'msw';

// Helper to wrap with TanStack Query Provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('LoginForm', () => {
  it('calls onLoginSuccess when the form is submitted successfully', async () => {
    const mockSuccess = vi.fn();
    render(<LoginForm onLoginSuccess={mockSuccess} />, { wrapper: createWrapper() });

    const emailInput = screen.getByTestId('login-email-input');
    // Using your specific test user defined in MSW handlers
    fireEvent.change(emailInput, { target: { value: 'valid@test.com' } });

    const submitButton = screen.getByTestId('login-submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('shows red error message and PRESERVES email value when user is not found', async () => {
    const mockSuccess = vi.fn();
    render(<LoginForm onLoginSuccess={mockSuccess} />, { wrapper: createWrapper() });

    const emailInput = screen.getByTestId('login-email-input') as HTMLInputElement;
    const submitButton = screen.getByTestId('login-submit-button');

    // 1. Enter an email that triggers the 401 in MSW
    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });

    // 2. Submit
    fireEvent.click(submitButton);

    // 3. Check for the red error message appearing (from backend 'detail')
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    // 4. CRITICAL: Check that the input was NOT cleared
    expect(emailInput.value).toBe('wrong@test.com');
  });

  it('disables the button while the login request is pending', async () => {
    // 2. Override the handler to simulate a slow network (500ms delay)
    server.use(
      http.post('*/auth/login', async () => {
        await delay(500); // Wait 500ms before responding
        return HttpResponse.json({ id: 'slow-user' });
      })
    );

    render(<LoginForm onLoginSuccess={vi.fn()} />, { wrapper: createWrapper() });

    const emailInput = screen.getByTestId('login-email-input');
    const submitButton = screen.getByTestId('login-submit-button');

    fireEvent.change(emailInput, { target: { value: 'valid@test.com' } });

    // 3. Click the button
    fireEvent.click(submitButton);

    // 4. Assert: Button IS disabled (because we are inside that 500ms window)
    await waitFor(() => {
      expect(screen.getByText(/verifying/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // 5. Clean finish: Wait for the delay to end so the test doesn't complain about updates after exit
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
