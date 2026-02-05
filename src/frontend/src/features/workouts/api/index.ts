import { api } from '@/api/axios';
import { CreateWorkoutRequest, UpdateWorkoutRequest, WorkoutResponse, WorkoutSummaryResponse } from '../types';

export const workoutsApi = {
  // GET: List all workouts (Lightweight summary)
  getAll: async (): Promise<WorkoutSummaryResponse[]> => {
    const response = await api.get<WorkoutSummaryResponse[]>('/workouts');
    return response.data;
  },

  // GET: Single full workout
  getById: async (id: string): Promise<WorkoutResponse> => {
    const response = await api.get<WorkoutResponse>(`/workouts/${id}`);
    return response.data;
  },

  // POST: Create
  create: async (data: CreateWorkoutRequest): Promise<WorkoutResponse> => {
    const response = await api.post<WorkoutResponse>('/workouts', data);
    return response.data;
  },

  // PUT: Update (Full Replace)
  update: async (id: string, data: UpdateWorkoutRequest): Promise<void> => {
    await api.put(`/workouts/${id}`, data);
  },

  // DELETE: Remove
  delete: async (id: string): Promise<void> => {
    await api.delete(`/workouts/${id}`);
  },
};
