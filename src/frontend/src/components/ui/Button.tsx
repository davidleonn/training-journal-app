import { cn } from '@/utils';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', testId, ...props }) => {
  const baseStyles = 'rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center';

  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-500/20',
    outline: 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'w-full px-6 py-4 sm:w-auto sm:px-5 sm:py-2.5', // This was your old default
    lg: 'px-8 py-4 text-lg',
  };

  return <button data-testid={testId} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props} />;
};
