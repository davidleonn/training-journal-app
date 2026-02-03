import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages';

export default function App() {
  return (
    <Routes>
      {/* When the URL is /login, show the LoginPage */}
      <Route path="/login" element={<LoginPage />} />

      {/* Placeholder for your future Dashboard */}
      <Route
        path="/dashboard"
        element={
          <div className="p-8">
            <h1 className="text-2xl">Dashboard</h1>
            <p>You logged in successfully! Your ID is stored in LocalStorage.</p>
          </div>
        }
      />

      {/* Default: Redirect "/" to "/login" */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
