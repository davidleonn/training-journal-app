import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-all active:scale-95';

  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-500',
    outline: 'border-2 border-slate-200 text-slate-900 hover:bg-slate-50',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        'w-full px-6 py-3 sm:w-auto sm:py-2', // Full-width on mobile, auto on desktop
        className
      )}
      {...props}
    />
  );
};
