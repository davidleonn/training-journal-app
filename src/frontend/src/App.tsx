import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { DashboardPage } from '@/pages';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        {/* Swapping the placeholder for our actual DashboardPage */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
