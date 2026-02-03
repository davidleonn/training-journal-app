import { Button, Input } from '@/components';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const handleAction = async (formData: FormData) => {
    const email = formData.get('email');
    // const password = formData.get('password');

    console.log('Authenticating:', email);

    // This replaces the old handleSubmit logic
    onLoginSuccess();
  };

  return (
    <form action={handleAction} className="w-full space-y-6">
      <div className="space-y-4">
        {/* IMPORTANT: Added 'name' props so the Action can find the data */}
        <Input name="email" label="Email Address" type="email" placeholder="Enter your email" required />
        <Input name="password" label="Access Key (Optional)" type="password" placeholder="••••••••" />
      </div>

      <Button type="submit" variant="primary" className="h-16 w-full text-xl shadow-xl shadow-orange-500/20">
        Enter Journal
      </Button>
    </form>
  );
};
