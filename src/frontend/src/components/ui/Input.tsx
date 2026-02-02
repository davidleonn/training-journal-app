import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-2 text-left">
      {label && <label className="ml-1 text-sm font-bold text-slate-700">{label}</label>}
      <input
        className={cn(
          'h-14 w-full rounded-2xl border-2 border-slate-100 bg-white px-4 text-base transition-all placeholder:text-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none disabled:opacity-50',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="ml-1 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
};
