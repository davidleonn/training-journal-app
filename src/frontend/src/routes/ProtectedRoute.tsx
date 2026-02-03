import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  // 1. Check if the token exists
  const token = localStorage.getItem('authToken');

  // 2. If NO token, kick them back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If YES token, render the child routes (The Dashboard)
  return <Outlet />;
};
