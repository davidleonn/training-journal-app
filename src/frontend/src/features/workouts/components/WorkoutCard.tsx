import { useState } from 'react'; //
import { Trash2 } from 'lucide-react';
import { WorkoutCardProps } from '../types'; //
import { Button } from '@/components/ui/Button'; //
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const WorkoutCard = ({ workout, onEdit, onDelete }: WorkoutCardProps & { onDelete: (id: string) => void }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const date = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }); //

  return (
    <>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(workout.id)} testId="view-workout-btn">
              View Details
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-red-100 text-red-500 hover:border-red-200 hover:bg-red-50"
              onClick={() => setIsDeleteModalOpen(true)}
              testId="delete-workout-btn"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(workout.id)}
        title="Delete Workout?"
        description="This action cannot be undone. This workout session will be permanently removed from your history."
        confirmText="Delete"
        cancelText="Keep Workout"
      />
    </>
  );
};
