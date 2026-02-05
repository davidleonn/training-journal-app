import { useFormContext } from 'react-hook-form';
import { Button, Input } from '@/components';
import { WorkoutFormData } from '../hooks/useWorkoutForm';
import { SetRowProps } from '../types';

export const SetRow = ({ exerciseIndex, setIndex, onRemove }: SetRowProps) => {
  const { register } = useFormContext<WorkoutFormData>();

  return (
    <div className="mb-2 flex items-center gap-4" data-testid={`set-row-${exerciseIndex}-${setIndex}`}>
      <div className="w-16">
        <span className="text-sm font-bold text-gray-400" data-testid={`set-number-${exerciseIndex}-${setIndex}`}>
          #{setIndex + 1}
        </span>
      </div>

      <Input
        label=""
        type="number"
        placeholder="kg"
        testId={`weight-input-${exerciseIndex}-${setIndex}`} // Unique ID
        {...register(`exercises.${exerciseIndex}.sets.${setIndex}.weight`, { valueAsNumber: true })}
      />

      <Input
        label=""
        type="number"
        placeholder="Reps"
        testId={`reps-input-${exerciseIndex}-${setIndex}`} // Unique ID
        {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`, { valueAsNumber: true })}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="border-red-200 text-red-500 hover:bg-red-50"
        testId={`remove-set-btn-${exerciseIndex}-${setIndex}`}
      >
        ✕
      </Button>
    </div>
  );
};
