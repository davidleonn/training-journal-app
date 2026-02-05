import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Input } from '@/components';
import { SetRow } from './SetRow';
import { WorkoutFormData } from '../hooks/useWorkoutForm';
import { ExerciseCardProps } from '../types';

export const ExerciseCard = ({ exerciseIndex, onRemove }: ExerciseCardProps) => {
  const { control, register } = useFormContext<WorkoutFormData>();

  // Manage the list of Sets for THIS exercise
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" data-testid={`exercise-card-${exerciseIndex}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className="mr-4 flex-1">
          <Input
            label="Exercise Name"
            placeholder="e.g. Bench Press"
            testId={`exercise-name-${exerciseIndex}`}
            {...register(`exercises.${exerciseIndex}.name`)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          className="mt-8 border-red-200 text-red-600 hover:bg-red-50"
          testId={`remove-exercise-btn-${exerciseIndex}`}
        >
          Remove Exercise
        </Button>
      </div>

      <div className="space-y-2">
        <div className="mb-2 flex gap-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          <div className="w-16">Set</div>
          <div className="flex-1">Weight (kg)</div>
          <div className="flex-1">Reps</div>
          <div className="w-10"></div>
        </div>

        {fields.map((field, setIndex) => (
          <SetRow key={field.id} exerciseIndex={exerciseIndex} setIndex={setIndex} onRemove={() => remove(setIndex)} />
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-orange-500 hover:text-orange-600"
          onClick={() => append({ weight: 0, reps: 0 })}
          testId={`add-set-btn-${exerciseIndex}`}
        >
          + Add Set
        </Button>
      </div>
    </div>
  );
};
