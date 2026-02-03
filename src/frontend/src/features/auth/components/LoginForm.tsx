import { useState } from 'react';
import { Button, Input } from '@/components';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  // 1. Explicitly track the email in state
  const [email, setEmail] = useState('');

  const { mutate: login, isPending, error } = useLogin(onLoginSuccess);

  const apiError = error ? (error as any).response?.data?.detail || 'Authentication failed' : undefined;

  const handleAction = async (_formData: FormData) => {
    // 2. We use the state value directly
    if (email) {
      login({ email });
    }
  };

  return (
    <form action={handleAction} className="w-full space-y-6">
      <div className="space-y-4">
        <Input
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          autoComplete="username"
          required
          // 3. Bind the value and the change handler
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

      <Button type="submit" variant="primary" disabled={isPending} className="h-16 w-full text-xl shadow-xl shadow-orange-500/20">
        {isPending ? 'Verifying...' : 'Enter Journal'}
      </Button>
    </form>
  );
};
