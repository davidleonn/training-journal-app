import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmModal } from '../ConfirmModal';

describe('ConfirmModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Delete Item?',
    description: 'Are you sure you want to proceed?',
    confirmText: 'Yes, Delete',
    cancelText: 'No, Keep',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByText('Delete Item?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-modal')).toHaveTextContent('Yes, Delete');
    expect(screen.getByTestId('confirm-modal-cancel')).toHaveTextContent('No, Keep');
  });

  it('does not render when closed', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Delete Item?')).not.toBeInTheDocument();
  });

  it('calls onConfirm and onClose when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);

    const confirmBtn = screen.getByTestId('confirm-modal');
    fireEvent.click(confirmBtn);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls only onClose when cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);

    const cancelBtn = screen.getByTestId('confirm-modal-cancel');
    fireEvent.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });
});
