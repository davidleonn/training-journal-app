import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../Button';

describe('Button Atom', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('passes the "type" attribute correctly', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button');

    // This proves your "...props" spreading is working!
    expect(button).toHaveAttribute('type', 'submit');
  });
});
