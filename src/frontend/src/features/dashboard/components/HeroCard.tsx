import { Plus } from 'lucide-react';

interface HeroCardProps {
  userName: string;
  onStartSession: () => void;
}

export const HeroCard = ({ userName, onStartSession }: HeroCardProps) => (
  <section
    className="relative flex min-h-80 flex-col justify-center overflow-hidden rounded-[2.5rem] border border-white bg-white p-8 shadow-xl shadow-slate-200/50 md:min-h-100 md:p-14"
    data-testid="dashboard-hero"
  >
    <div className="relative z-10">
      <span className="rounded-full bg-orange-50 px-4 py-1.5 text-[10px] font-black tracking-widest text-[#FF6B00] uppercase md:text-xs">
        Athlete Status: Active
      </span>

      {/* 🛠️ FIX: Adjusted font scaling and added break-words */}
      <h1 className="mt-4 max-w-full text-3xl leading-[1.1] font-black tracking-tight wrap-break-word text-slate-900 sm:text-4xl md:mt-6 md:text-5xl lg:text-6xl">
        Ready to crush it,
        <br />
        <span className="text-[#FF6B00] capitalize" data-testid="hero-username">
          {userName}?
        </span>
      </h1>

      <button
        onClick={onStartSession}
        className="mt-6 flex w-fit items-center gap-2 rounded-2xl bg-[#FF6B00] px-6 py-3 text-lg font-black text-white shadow-2xl shadow-orange-300 transition-all hover:scale-[1.02] hover:bg-[#e66000] active:scale-95 md:mt-10 md:gap-3 md:rounded-3xl md:px-10 md:py-5 md:text-xl"
        data-testid="start-session-button"
      >
        <Plus className="h-5 w-5 md:h-7 md:w-7" strokeWidth={3} /> START SESSION
      </button>
    </div>

    {/* Decorative blur adjusted for mobile */}
    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-40 w-40 rounded-full bg-orange-50 opacity-60 blur-[60px] md:h-80 md:w-80 md:blur-[100px]" />
  </section>
);
