import axios from 'axios';

// Rename 'apiClient' to 'api' if your other files import { api }
export const api = axios.create({
  baseURL: 'http://localhost:5254',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (This part is fine)
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (THE FIX IS HERE)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Get the original request configuration
    const originalRequest = error.config;

    // 2. Check if the error is 401 AND it is NOT a login attempt
    // (We check if the URL contains "login" to avoid redirecting loop)
    if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes('/login')) {
      // Only force logout if the token expired while browsing the app
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    // 3. Always return the error so your React Query hook can see it
    return Promise.reject(error);
  }
);
