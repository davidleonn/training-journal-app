import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HistorySidebar } from '../components/HistorySidebar';
import * as useWorkoutsHook from '@/features';

// 1. Mock the Navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// 2. Mock the Data Hook
// We mock the entire module so we can change the return value per test
vi.mock('@/features/workouts/hooks/useWorkouts');

describe('HistorySidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton when fetching data', () => {
    // Simulate Loading
    vi.spyOn(useWorkoutsHook, 'useWorkouts').mockReturnValue({
      workouts: [],
      loading: true,
      error: null,
      refresh: vi.fn(),
    });

    render(<HistorySidebar />);
    expect(screen.getByTestId('history-loading')).toBeInTheDocument();
  });

  it('renders empty state when no workouts exist', () => {
    // Simulate Empty Data
    vi.spyOn(useWorkoutsHook, 'useWorkouts').mockReturnValue({
      workouts: [],
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    render(<HistorySidebar />);
    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
    expect(screen.getByText('No workouts yet.')).toBeInTheDocument();
  });

  it('renders list of workouts correctly', () => {
    // Simulate Real Data
    vi.spyOn(useWorkoutsHook, 'useWorkouts').mockReturnValue({
      workouts: [
        { id: '1', name: 'Leg Day', date: '2026-02-05T12:00:00Z' },
        { id: '2', name: 'Push Day', date: '2026-02-04T12:00:00Z' },
      ],
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    render(<HistorySidebar />);

    // Check that list container exists
    expect(screen.getByTestId('history-list')).toBeInTheDocument();

    // Check for specific items (using our slugified ID logic)
    expect(screen.getByTestId('history-item-leg-day')).toBeInTheDocument();
    expect(screen.getByTestId('history-item-push-day')).toBeInTheDocument();

    // Check that names are visible
    expect(screen.getByText('Leg Day')).toBeInTheDocument();
  });

  it('navigates to history list when "View All" is clicked', () => {
    vi.spyOn(useWorkoutsHook, 'useWorkouts').mockReturnValue({
      workouts: [],
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    render(<HistorySidebar />);

    const viewAllBtn = screen.getByTestId('view-all-history-btn');
    fireEvent.click(viewAllBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/workouts');
  });
});
