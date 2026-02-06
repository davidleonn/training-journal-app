import { useNavigate } from 'react-router-dom';
import { PenTool, LayoutTemplate, ArrowRight } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section className="rounded-4xl border border-slate-100 bg-white p-6 shadow-sm" data-testid="dashboard-quick-actions">
      <h3 className="mb-4 text-lg font-bold text-slate-800">Quick Actions</h3>

      <div className="space-y-3">
        {/* Action 1: Direct to Editor (Empty) */}
        <button
          onClick={() => navigate('/workouts/new')}
          className="group flex w-full items-center justify-between rounded-xl bg-orange-50 p-4 transition-all hover:bg-orange-100 hover:shadow-md active:scale-95"
          data-testid="action-create-workout"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm">
              <PenTool size={18} />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">Create New Workout</p>
              <p className="text-xs text-slate-500">Skip the templates</p>
            </div>
          </div>
          <ArrowRight className="text-orange-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-600" size={18} />
        </button>

        {/* Action 2: Go to Lobby (Templates) */}
        <button
          onClick={() => navigate('/routines')} // 👈 Changed from /workouts/start
          className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-orange-200 hover:shadow-md active:scale-95"
          data-testid="action-browse-templates"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600">
              <LayoutTemplate size={18} />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">My Routines</p> {/* Changed Label */}
              <p className="text-xs text-slate-500">Manage your templates</p>
            </div>
          </div>
          <ArrowRight className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-600" size={18} />
        </button>
      </div>
    </section>
  );
};
