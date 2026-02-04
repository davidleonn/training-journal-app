import { Navigate, Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';

export const ProtectedRoute = () => {
  const token = sessionStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* This Header now automatically appears on all protected pages */}
      <Header />

      {/* This is where Dashboard, Workouts, etc. will render */}
      <Outlet />
    </div>
  );
};
