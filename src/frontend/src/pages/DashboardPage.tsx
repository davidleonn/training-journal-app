import { History, TrendingUp, Plus } from 'lucide-react';
import { useProfile } from '@/features';

export const DashboardPage = () => {
  const { data: profile, isLoading } = useProfile();
  const userName = profile?.email.split('@')[0] || 'Athlete';

  if (isLoading) return <div className="animate-pulse p-10 font-bold text-orange-500">Loading Athlete...</div>;

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Columns */}
        <div className="space-y-10 lg:col-span-2">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-10 shadow-xl shadow-slate-200/50 md:p-14">
            <div className="relative z-10">
              <span className="rounded-full bg-orange-50 px-4 py-1.5 text-xs font-black text-[#FF6B00] uppercase">Athlete Status: Active</span>
              <h1 className="mt-6 text-5xl leading-[1.1] font-black tracking-tight md:text-6xl">
                Ready to crush it,
                <br />
                <span className="text-[#FF6B00] capitalize">{userName}?</span>
              </h1>
              <button className="mt-10 flex items-center gap-3 rounded-3xl bg-[#FF6B00] px-10 py-5 text-xl font-black text-white shadow-2xl shadow-orange-300 transition-all hover:scale-[1.02] active:scale-95">
                <Plus size={28} strokeWidth={3} /> START SESSION
              </button>
            </div>
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-orange-50 opacity-60 blur-[100px]" />
          </section>

          {/* Weekly Progress */}
          <section className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
              <TrendingUp className="text-[#FF6B00]" size={26} /> Weekly Progress
            </h2>
            <div className="flex h-64 items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 font-bold text-slate-300 italic">
              No data recorded yet.
            </div>
          </section>
        </div>

        {/* History Sidebar */}
        <aside className="min-h-125 rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
            <History className="text-[#FF6B00]" size={26} /> History
          </h2>
          <div className="py-20 text-center">
            <History size={48} className="mx-auto mb-4 text-slate-100" />
            <p className="font-bold text-slate-400">Journal empty.</p>
          </div>
        </aside>
      </div>
    </main>
  );
};
