import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from './LoginForm';
import { server } from '../../../test/setup'; // Adjust this path to where your setup.ts is
import { http, HttpResponse, delay } from 'msw';

// Wrapper for React Query
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
  beforeAll(() => {
    // Create a fake LocalStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null, // Return null if missing (Standard)
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    // Force the window to use our fake storage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores JWT and calls onLoginSuccess when submitted successfully', async () => {
    const mockSuccess = vi.fn();
    render(<LoginForm onLoginSuccess={mockSuccess} />, { wrapper: createWrapper() });

    // 1. Input valid email (matches handlers.ts)
    const emailInput = screen.getByTestId('login-email-input');
    fireEvent.change(emailInput, { target: { value: 'valid@test.com' } });

    // 2. Click Submit
    fireEvent.click(screen.getByTestId('login-submit-button'));

    // 3. Wait for success
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledTimes(1);
    });

    // ✅ FIX: This should now pass because handlers.ts sends the token
    expect(localStorage.getItem('authToken')).toBe('eyJ_MOCK_JWT_TOKEN_123');
  });

  it('shows red error message when user is not found', async () => {
    const mockSuccess = vi.fn();
    render(<LoginForm onLoginSuccess={mockSuccess} />, { wrapper: createWrapper() });

    // 1. Input INVALID email
    const emailInput = screen.getByTestId('login-email-input');
    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    // 2. Check for error
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    // 3. Ensure no token is saved
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('disables the button while the login request is pending', async () => {
    // ✅ FIX: Override must ALSO return a token structure, or the component might crash
    server.use(
      http.post('*/auth/login', async () => {
        await delay(500);
        return HttpResponse.json({
          token: 'slow_token_123',
          expires: '2099-01-01T00:00:00Z',
        });
      })
    );

    render(<LoginForm onLoginSuccess={vi.fn()} />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByTestId('login-email-input'), { target: { value: 'valid@test.com' } });
    fireEvent.click(screen.getByTestId('login-submit-button'));

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText(/verifying/i)).toBeInTheDocument();
      expect(screen.getByTestId('login-submit-button')).toBeDisabled();
    });

    // Wait for it to finish so the test exits cleanly
    await waitFor(() => {
      expect(screen.getByTestId('login-submit-button')).not.toBeDisabled();
    });
  });
});
