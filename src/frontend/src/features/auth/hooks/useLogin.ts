import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { LoginRequest, LoginResponse } from '../types';
import { AxiosError } from 'axios';

export const useLogin = (onLoginSuccess: () => void) => {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // API call
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // 1. Save Token
      sessionStorage.setItem('authToken', data.token);

      // 2. Navigate (The callback from your page)
      onLoginSuccess();
    },
    onError: (error: AxiosError) => {
      // Now we just log it, but the Component will use the 'isError' flag
      console.error('Login Failed:', error.response?.data || error.message);
    },
  });
};
