import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('calls onLoginSuccess when the form is submitted', async () => {
    // 1. Create a spy function
    const mockSuccess = vi.fn();

    // 2. Render the component
    render(<LoginForm onLoginSuccess={mockSuccess} />);

    // 3. Find the email input and type something
    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // 4. Click the submit button
    const submitButton = screen.getByRole('button', { name: /enter journal/i });
    fireEvent.click(submitButton);

    // 5. Wait for the success signal (important for React 19 Actions)
    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
