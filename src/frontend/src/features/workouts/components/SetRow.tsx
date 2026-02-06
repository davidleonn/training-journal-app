import { useFormContext } from 'react-hook-form';
import { Button, Input } from '@/components';
import { WorkoutFormData } from '../hooks/useWorkoutForm';
import { SetRowProps } from '../types';

export const SetRow = ({ exerciseIndex, setIndex, onRemove }: SetRowProps) => {
  const { register } = useFormContext<WorkoutFormData>();

  return (
    <div className="mb-2 flex items-end gap-4" data-testid={`set-row-${exerciseIndex}-${setIndex}`}>
      <div className="flex h-14 w-16 items-center justify-center">
        <span className="text-sm font-bold text-gray-400">#{setIndex + 1}</span>
      </div>

      {/* Weight Input */}
      <div className="flex-1">
        <Input
          label="Weight (kg)"
          type="number"
          min={0}
          placeholder="kg"
          testId={`weight-input-${exerciseIndex}-${setIndex}`}
          {...register(`exercises.${exerciseIndex}.sets.${setIndex}.weight`, {
            valueAsNumber: true,
            min: 0,
          })}
        />
      </div>

      {/* Reps Input */}
      <div className="flex-1">
        <Input
          label="Reps"
          type="number"
          min={1}
          placeholder="Reps"
          testId={`reps-input-${exerciseIndex}-${setIndex}`}
          {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`, {
            valueAsNumber: true,
            min: 1,
          })}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="flex h-14 w-14 items-center justify-center border-red-200 p-0 text-red-500 hover:bg-red-50"
        testId={`remove-set-btn-${exerciseIndex}-${setIndex}`}
      >
        ✕
      </Button>
    </div>
  );
};
