import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWorkouts, WorkoutList } from '@/features';
import { Button } from '@/components';

export const WorkoutHistoryPage = () => {
  const navigate = useNavigate();
  const { workouts, loading, error, deleteWorkout } = useWorkouts();

  const handleEdit = (id: string) => {
    console.log('Navigate to details:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="workout-history-page">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="history-title">
              Your Workouts
            </h1>
            <p className="mt-1 text-sm text-gray-500" data-testid="history-subtitle">
              A complete log of your training history
            </p>
          </div>

          <Button
            variant="outline"
            className="border-transparent bg-transparent text-gray-500 shadow-none hover:bg-white hover:text-orange-600 hover:shadow-sm"
            onClick={() => navigate('/dashboard')}
            testId="back-to-dashboard-btn"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700" data-testid="history-error-message">
            {error}
          </div>
        )}

        <div data-testid="history-list-container">
          <WorkoutList workouts={workouts} loading={loading} onEdit={handleEdit} onDelete={deleteWorkout} />
        </div>
      </main>
    </div>
  );
};
