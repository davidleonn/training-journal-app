import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWorkouts } from '@/features';

export const HistorySidebar = () => {
  const navigate = useNavigate();
  const { workouts, loading } = useWorkouts();

  // Sort by date descending and take top 3
  const recentWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <aside className="flex min-h-125 flex-col rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm" data-testid="history-sidebar">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900">
          <HistoryIcon className="text-[#FF6B00]" size={26} /> History
        </h2>
        <Button variant="outline" className="h-auto px-3 py-1 text-xs font-bold" onClick={() => navigate('/workouts')} testId="view-all-history-btn">
          VIEW ALL
        </Button>
      </div>

      <div className="flex-1 space-y-4">
        {loading ? (
          <div className="space-y-4" data-testid="history-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-50" />
            ))}
          </div>
        ) : recentWorkouts.length === 0 ? (
          <div className="py-10 text-center" data-testid="history-empty">
            <HistoryIcon size={48} className="mx-auto mb-4 text-slate-100" />
            <p className="text-lg font-bold text-slate-400">No workouts yet.</p>
            <p className="text-sm text-slate-300">Completed sessions will appear here.</p>
          </div>
        ) : (
          <div data-testid="history-list">
            {recentWorkouts.map((workout) => {
              const date = new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const initial = workout.name.charAt(0).toUpperCase();
              const testIdName = workout.name.toLowerCase().replace(/\s+/g, '-');

              return (
                <div
                  key={workout.id}
                  onClick={() => navigate('/workouts')} // Just view details, don't edit instantly
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-white p-4 transition-all hover:border-orange-100 hover:bg-orange-50/50 hover:shadow-sm"
                  data-testid={`history-item-${testIdName}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-[#FF6B00]">
                      {initial}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 transition-colors group-hover:text-[#FF6B00]">{workout.name}</p>
                      <p className="text-xs font-medium text-slate-400">{date}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#FF6B00]" size={20} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
