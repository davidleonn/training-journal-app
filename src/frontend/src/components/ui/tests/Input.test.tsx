import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Input';

describe('Input Atom', () => {
  it('renders with the correct label', () => {
    render(<Input label="Email Address" name="email" />);

    // Check if the label text exists
    expect(screen.getByText(/email address/i)).toBeInTheDocument();
  });

  it('is associated with its label for accessibility', () => {
    render(<Input label="Username" name="username" id="user-input" />);

    // If someone clicks the label, the input should focus.
    // This proves your HTML "for" and "id" attributes are working.
    const input = screen.getByLabelText(/username/i);
    expect(input).toBeInTheDocument();
  });
});
