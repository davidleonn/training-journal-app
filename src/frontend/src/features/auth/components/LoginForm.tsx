import { Button, Input } from '@/components';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const handleAction = async (formData: FormData) => {
    const email = formData.get('email');
    console.log('Authenticating:', email);
    onLoginSuccess();
  };

  return (
    <form action={handleAction} className="w-full space-y-6">
      <div className="space-y-4">
        <Input
          name="email"
          label="Email Address"
          testId="login-email-input"
          type="email"
          placeholder="Enter your email"
          autoComplete="username" // Chrome prefers 'username' for the ID field
          required
        />
        <Input
          name="password"
          label="Access Key (Optional)"
          testId="login-password-input"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password" // Critical for clearing the DevTools warning
        />
      </div>

      <Button type="submit" variant="primary" data-testid="login-submit-button" className="h-16 w-full text-xl shadow-xl shadow-orange-500/20">
        Enter Journal
      </Button>
    </form>
  );
};
