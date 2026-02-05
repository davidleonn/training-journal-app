import { useNavigate } from 'react-router-dom';
import { FormProvider, useFieldArray } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react'; // 👈 Import Arrow
import { Button, Input } from '@/components';
import { ExerciseCard, useWorkoutForm } from '@/features';

export const WorkoutEditorPage = () => {
  const navigate = useNavigate();
  const { form, submit } = useWorkoutForm();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24" data-testid="workout-editor-page">
      {/* 1. 🏗️ Standard Container: max-w-7xl */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 2. 📐 Consistent Header: Title/Timer Left, Exit Right */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Active Session</h1>
            {/* Timer sits nicely next to the title now */}
          </div>

          <Button
            variant="outline"
            className="border-transparent bg-transparent text-gray-500 shadow-none hover:bg-white hover:text-orange-600 hover:shadow-sm"
            onClick={() => navigate('/dashboard')} // Or maybe back to /workouts/start? Dashboard is safer.
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <FormProvider {...form}>
          <form onSubmit={submit} className="space-y-8" data-testid="workout-form">
            {/* Meta Data */}
            <div className="grid grid-cols-1 gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
              <Input label="Workout Name" placeholder="e.g. Pull Day" {...form.register('name')} />
              <Input label="Date" type="date" {...form.register('date')} />
            </div>

            {/* Exercises List */}
            <div data-testid="exercises-list">
              {fields.map((field, index) => (
                <ExerciseCard key={field.id} exerciseIndex={index} onRemove={() => remove(index)} />
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-dashed py-4 text-gray-600 hover:border-orange-500 hover:text-orange-600"
                onClick={() => append({ name: '', sets: [{ weight: 0, reps: 0 }] })}
              >
                + Add Exercise
              </Button>

              <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-4 md:static md:border-0 md:bg-transparent md:p-0">
                <Button type="submit" className="w-full py-6 text-lg shadow-xl shadow-orange-500/20">
                  Finish Workout 🎉
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </div>
  );
};
