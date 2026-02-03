import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features'; // Pointing to the local component

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf9] p-6">
      <div className="w-full max-w-md rounded-[3xl] border border-orange-50/50 bg-white p-10 shadow-xl">
        <div className="mb-10 text-center">
          <div className="to-coral-500 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 text-3xl text-white shadow-lg">
            💪
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Training Journal</h1>
        </div>

        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};
