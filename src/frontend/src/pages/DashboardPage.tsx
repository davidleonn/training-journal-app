import { useProfile, HeroCard, ProgressChart, HistorySidebar } from '@/features';

export const DashboardPage = () => {
  const { data: profile, isLoading, isError } = useProfile();

  // Helper to extract username from email (e.g., david@test.com -> david)
  const userName = profile?.email.split('@')[0] || 'Athlete';

  if (isLoading) {
    return (
      <div className="flex h-[80vh] animate-pulse items-center justify-center font-black text-[#FF6B00]" data-testid="dashboard-loading">
        SYNCING PERFORMANCE DATA...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[80vh] items-center justify-center font-bold text-slate-500">Error loading profile. Please refresh or log in again.</div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 md:p-10">
      <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-3">
        {/* Left Columns - Switched from space-y-10 to space-y-6 on mobile */}
        <div className="space-y-6 md:space-y-10 lg:col-span-2">
          <HeroCard userName={userName} onStartSession={() => console.log('Open Modal')} />
          <ProgressChart />
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <HistorySidebar />
        </div>
      </div>
    </main>
  );
};
