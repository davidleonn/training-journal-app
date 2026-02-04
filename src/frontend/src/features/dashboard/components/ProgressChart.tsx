import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock data - eventually this will come from your backend
const data = [
  { day: 'Mon', volume: 2100 },
  { day: 'Tue', volume: 3500 },
  { day: 'Wed', volume: 2800 },
  { day: 'Thu', volume: 5100 },
  { day: 'Fri', volume: 4200 },
  { day: 'Sat', volume: 7000 },
  { day: 'Sun', volume: 5500 },
];

export const ProgressChart = () => {
  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm" data-testid="progress-chart-container">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900">
            <TrendingUp className="text-[#FF6B00]" size={26} /> Weekly Progress
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-400">Total training volume (kg)</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-slate-900">12,450</span>
          <p className="text-[10px] font-black tracking-widest text-green-500 uppercase">▲ 12% vs last week</p>
        </div>
      </div>

      <div className="h-64 w-full" data-testid="chart-render-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="volume" stroke="#FF6B00" strokeWidth={4} fillOpacity={1} fill="url(#colorVolume)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
