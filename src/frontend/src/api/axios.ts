import axios from 'axios';

export const api = axios.create({
  // This matches your .NET launch settings
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5254',
  headers: {
    'Content-Type': 'application/json',
  },
});
