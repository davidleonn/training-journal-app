import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  testId?: string;
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', testId, ...props }) => {
  const baseStyles = 'rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center';

  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-500/20',
    outline: 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300',
  };

  return (
    <button
      data-testid={testId}
      className={cn(
        baseStyles,
        variants[variant],
        'w-full px-6 py-4 sm:w-auto sm:px-5 sm:py-2.5', // Modern mobile-first sizing
        className
      )}
      {...props}
    />
  );
};
