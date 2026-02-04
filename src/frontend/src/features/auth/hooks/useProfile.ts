import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';

export interface UserProfile {
  id: string;
  email: string;
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>('/users/profile');
      return data;
    },
    // If the backend returns 401, don't keep retrying
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    // Only run if we actually have a token in storage
    enabled: !!sessionStorage.getItem('authToken'),
  });
};
