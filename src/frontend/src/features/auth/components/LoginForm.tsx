import { useState } from 'react';
import { Button, Input } from '@/components';
import { useLogin } from '../hooks/useLogin';
import { ApiError, LoginFormProps } from '../types';

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');

  const { mutate: login, isPending, error } = useLogin(onLoginSuccess);

  const apiError = (error as ApiError | null)?.response?.data?.detail || (error ? 'Authentication failed' : undefined);

  // FIX: Switched to 'React.SyntheticEvent' to fix the React 19 deprecation error
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    // FIX: preventDefault stops the page refresh/blinking
    e.preventDefault();

    if (email) {
      login({ email });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        <Input
          name="email"
          data-testid="login-email-input"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          error={apiError}
        />

        <Input
          name="password"
          label="Access Key (Optional)"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        data-testid="login-submit-button"
        variant="primary"
        disabled={isPending}
        className="h-16 w-full text-xl shadow-xl shadow-orange-500/20"
      >
        {isPending ? 'Verifying...' : 'Enter Journal'}
      </Button>
    </form>
  );
};
