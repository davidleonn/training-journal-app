import { WorkoutListProps } from '../types';
import { WorkoutCard } from './WorkoutCard';

// Add onDelete to Props and pass it to WorkoutCard
export const WorkoutList = ({ workouts, loading, onEdit, onDelete }: WorkoutListProps & { onDelete: (id: string) => void }) => {
  if (loading) {
    return (
      <div className="space-y-4" data-testid="workout-list-loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center" data-testid="workout-list-empty">
        <h3 className="text-lg font-medium text-gray-900">No workouts yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first workout plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="workout-list">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onEdit={onEdit}
          onDelete={onDelete} // Pass delete action
        />
      ))}
    </div>
  );
};
