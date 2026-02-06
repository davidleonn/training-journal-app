import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, DashboardPage, WorkoutHistoryPage, WorkoutEditorPage, WorkoutStartPage, RoutinesPage } from './pages';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<WorkoutHistoryPage />} />
          <Route path="/workouts/new" element={<WorkoutEditorPage />} />
          <Route path="/workouts/start" element={<WorkoutStartPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
