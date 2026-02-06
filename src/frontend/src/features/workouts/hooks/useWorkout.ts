import { useState, useEffect, useCallback } from 'react';
import { workoutsApi } from '../api';
import { WorkoutSummaryResponse } from '../types';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workoutsApi.getAll();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteWorkout = async (id: string) => {
    try {
      await workoutsApi.delete(id);
      await fetchWorkouts();
    } catch (err) {
      console.error('Failed to delete:', err);
      setError('Could not remove workout');
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, error, refresh: fetchWorkouts, deleteWorkout };
};
