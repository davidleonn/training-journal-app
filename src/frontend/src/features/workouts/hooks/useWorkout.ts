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

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, error, refresh: fetchWorkouts };
};
