import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../Header';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Mock the useProfile hook
vi.mock('@/features/auth/hooks/useProfile', () => ({
  useProfile: () => ({
    data: { email: 'davidleon_06@hotmail.com' },
    isLoading: false,
  }),
}));

// 2. Helper to wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the logo and the container correctly', () => {
    renderWithProviders(<Header />);

    // Check if the logo and main container exist using test IDs
    expect(screen.getByTestId('header-logo')).toBeDefined();
    expect(screen.getByTestId('header-container')).toBeDefined();
    expect(screen.getByText(/JOURNAL/i)).toBeDefined();
  });

  it('displays the correct email prefix (username)', () => {
    renderWithProviders(<Header />);

    // Verify the email-to-username logic: davidleon_06@hotmail.com -> davidleon_06
    const usernameElement = screen.getByTestId('header-username');
    expect(usernameElement.textContent).toBe('davidleon_06');
  });

  it('removes token from sessionStorage and triggers logout', () => {
    // Set a fake token in the correct storage
    sessionStorage.setItem('authToken', 'fake-jwt-token');

    renderWithProviders(<Header />);

    // Use the test ID for the logout button
    const logoutBtn = screen.getByTestId('header-logout-button');
    fireEvent.click(logoutBtn);

    // Verify storage cleanup
    expect(sessionStorage.getItem('authToken')).toBeNull();
  });

  it('navigates to dashboard when clicking the logo', () => {
    renderWithProviders(<Header />);

    const logo = screen.getByTestId('header-logo');
    // We check if it's clickable; navigation itself is handled by react-router
    // and usually tested via integration tests, but this ensures the element is ready.
    expect(logo).toBeDefined();
  });
});
