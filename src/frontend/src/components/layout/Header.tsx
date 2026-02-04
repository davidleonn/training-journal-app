import { User, Dumbbell, LogOut } from 'lucide-react';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const userName = profile?.email.split('@')[0] || 'Athlete';

  return (
    <nav className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-4 shadow-sm" data-testid="header-container">
      {/* Logo Section */}
      <div className="flex cursor-pointer items-center gap-2" onClick={() => navigate('/dashboard')} data-testid="header-logo">
        <div className="rounded-xl bg-[#FF6B00] p-2 shadow-md shadow-orange-200">
          <Dumbbell size={22} className="text-white" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-900 italic">JOURNAL</span>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5" data-testid="header-user-display">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
            <User size={14} className="text-[#FF6B00]" />
          </div>
          <span className="text-sm font-bold text-slate-700 capitalize" data-testid="header-username">
            {userName}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-red-500"
          data-testid="header-logout-button"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};
