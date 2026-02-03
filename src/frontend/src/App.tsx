import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages'; // Ensure this path matches your project
import { ProtectedRoute } from '@/routes/ProtectedRoute'; // Import the guard

export default function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES (Anyone can see) --- */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- PROTECTED ROUTES (Only with Token) --- */}
      {/* We wrap these routes inside the Guard */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold text-green-600">Dashboard Unlocked 🔓</h1>
              <p className="mt-4">You are seeing this because you have a valid JWT token in LocalStorage!</p>
            </div>
          }
        />
        {/* You can add more protected pages here later (e.g., /profile, /workouts) */}
      </Route>

      {/* --- DEFAULT --- */}
      {/* If user goes to "/", try sending them to dashboard. 
          The ProtectedRoute will kick them to Login if they aren't signed in. */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
