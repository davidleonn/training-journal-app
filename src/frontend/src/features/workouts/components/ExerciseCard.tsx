import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Input } from '@/components';
import { SetRow } from './SetRow';
import { WorkoutFormData } from '../hooks/useWorkoutForm';
import { ExerciseCardProps } from '../types';

export const ExerciseCard = ({ exerciseIndex, onRemove }: ExerciseCardProps) => {
  const { control, register } = useFormContext<WorkoutFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" data-testid={`exercise-card-${exerciseIndex}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex-1">
          <Input
            label="Exercise Name"
            placeholder="e.g. Bench Press"
            testId={`exercise-name-${exerciseIndex}`}
            autoComplete="off"
            {...register(`exercises.${exerciseIndex}.name`)}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRemove}
          className="h-14 border-red-200 px-6 text-red-600 hover:bg-red-50"
          testId={`remove-exercise-btn-${exerciseIndex}`}
        >
          Remove Exercise
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, setIndex) => (
          <SetRow key={field.id} exerciseIndex={exerciseIndex} setIndex={setIndex} onRemove={() => remove(setIndex)} />
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-orange-500 hover:text-orange-600"
          onClick={() => append({ weight: 0, reps: 0 })}
          testId={`add-set-btn`}
        >
          + Add Set
        </Button>
      </div>
    </div>
  );
};
