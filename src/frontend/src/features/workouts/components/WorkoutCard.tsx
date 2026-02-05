import { WorkoutCardProps } from '../types';
import { Button } from '@/components/ui/Button';

export const WorkoutCard = ({ workout, onEdit }: WorkoutCardProps) => {
  const date = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md" data-testid="workout-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900" data-testid="workout-name">
            {workout.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500" data-testid="workout-date">
            {date}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onEdit(workout.id)} testId="view-workout-btn">
          View Details
        </Button>
      </div>
    </div>
  );
};
