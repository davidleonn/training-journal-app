import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../Header';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Setup a fresh QueryClient for every test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

// 2. Mock the useProfile hook so we don't hit the real API
vi.mock('@/features/auth/hooks/useProfile', () => ({
  useProfile: () => ({
    data: { email: 'davidleon_06@hotmail.com' },
    isLoading: false,
  }),
}));

describe('Header Component', () => {
  it('renders the logo and the user email prefix', () => {
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Checks if "JOURNAL" logo exists
    expect(screen.getByText(/JOURNAL/i)).toBeDefined();

    // Checks if the email prefix (davidleon_06) is displayed
    expect(screen.getByText(/davidleon_06/i)).toBeDefined();
  });

  it('removes token from sessionStorage on logout', () => {
    // Set a fake token
    sessionStorage.setItem('authToken', 'fake-jwt-token');

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </QueryClientProvider>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    // Verify the "key" was removed from the pocket
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });
});
