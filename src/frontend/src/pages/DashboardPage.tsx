import { useNavigate } from 'react-router-dom';
import { useProfile, HeroCard, ProgressChart, HistorySidebar } from '@/features';
import { QuickActions } from '@/features';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useProfile();

  const userName = profile?.email.split('@')[0] || 'Athlete';

  if (isLoading) {
    return (
      <div className="flex h-[80vh] animate-pulse items-center justify-center font-black text-[#FF6B00]" data-testid="dashboard-loading">
        SYNCING PERFORMANCE DATA...
      </div>
    );
  }

  if (isError) {
    return <div className="flex h-[80vh] items-center justify-center font-bold text-slate-500">Error loading profile.</div>;
  }

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 md:p-10">
      <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-3">
        {/* Left Column (Main Content) */}
        <div className="space-y-6 md:space-y-10 lg:col-span-2">
          <HeroCard userName={userName} onStartSession={() => navigate('/workouts/start')} />
          <ProgressChart />
        </div>

        {/* Right Column (Sidebar + Actions) */}
        <div className="space-y-6 lg:col-span-1">
          {' '}
          <HistorySidebar />
          <QuickActions />
        </div>
      </div>
    </main>
  );
};
