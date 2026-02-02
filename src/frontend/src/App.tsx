import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Simple placeholder since the page doesn't exist yet */}
        <Route path="/dashboard" element={<div className="p-20 font-black">Dashboard Placeholder</div>} />

        {/* Redirect root to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
