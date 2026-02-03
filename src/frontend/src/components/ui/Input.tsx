interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, name, ...props }) => {
  // Use provided id, or fallback to name so the label is always linked
  const inputId = id || name;

  return (
    <div className="w-full space-y-2 text-left">
      <label htmlFor={inputId} className="ml-1 text-sm font-bold text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        {...props}
        className="h-14 w-full rounded-2xl border-2 border-slate-100 bg-white px-4 text-base transition-all placeholder:text-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:outline-none disabled:opacity-50"
      />
    </div>
  );
};
