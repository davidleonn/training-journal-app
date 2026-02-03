import { InputProps } from './types';

export const Input: React.FC<InputProps> = ({ label, id, name, testId, error, ...props }) => {
  const inputId = id || name;

  return (
    <div className="w-full space-y-2 text-left">
      <label htmlFor={inputId} className="ml-1 text-sm font-bold text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        data-testid={testId}
        {...props}
        className={`h-14 w-full rounded-2xl border-2 px-4 text-base transition-all placeholder:text-slate-300 focus:outline-none disabled:opacity-50 ${
          error
            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            : 'border-slate-100 bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100'
        }`}
      />
      {/* Show the error message below the input */}
      {error && <p className="ml-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};
