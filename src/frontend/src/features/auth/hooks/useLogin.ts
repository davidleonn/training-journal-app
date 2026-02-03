import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { User, LoginRequest } from '../types';

export const useLogin = (onLoginSuccess: () => void) => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post<User>('/auth/login', data);
      return response.data;
    },
    onSuccess: (user) => {
      localStorage.setItem('user_id', user.id);
      onLoginSuccess();
    },
  });
};
