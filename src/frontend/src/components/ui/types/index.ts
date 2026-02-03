export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  testId?: string;
  error?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  testId?: string;
}
