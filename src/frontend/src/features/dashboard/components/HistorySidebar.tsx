import { History as HistoryIcon } from 'lucide-react';

export const HistorySidebar = () => (
  <aside className="min-h-125 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm" data-testid="history-sidebar">
    <h2 className="mb-8 flex items-center gap-3 text-2xl font-black text-slate-900">
      <HistoryIcon className="text-[#FF6B00]" size={26} /> History
    </h2>

    <div className="py-20 text-center" data-testid="history-empty-state">
      <HistoryIcon size={48} className="mx-auto mb-4 text-slate-100" />
      <p className="text-lg font-bold text-slate-400">Your journal is empty.</p>
      <p className="text-sm text-slate-300">Completed workouts will appear here.</p>
    </div>
  </aside>
);
