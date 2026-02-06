import { useState } from 'react'; // Added for modal state
import { useNavigate } from 'react-router-dom';
import { FormProvider, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, PlusCircle, Layout, CalendarDays, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components';
import { ExerciseCard, useWorkoutForm } from '@/features';

export const WorkoutEditorPage = () => {
  const navigate = useNavigate();
  const { form, submit } = useWorkoutForm();

  // Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Intercept submit to show modal
  const handleSaveClick = async (e?: React.BaseSyntheticEvent) => {
    if (e) e.preventDefault();

    // Trigger validation before showing modal
    const isValid = await form.trigger();
    if (isValid) {
      setIsSaveModalOpen(true);
    }
  };

  // Final confirmation action
  const confirmSave = () => {
    setIsSaveModalOpen(false);
    submit(); // Executes the actual form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24" data-testid="workout-editor-page">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900" data-testid="editor-title">
              Workout Builder
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500" data-testid="editor-subtitle">
              Define your workout structure. You can log this session on any date later.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-transparent bg-transparent text-gray-500 shadow-none hover:bg-white hover:text-orange-600 hover:shadow-sm"
            onClick={() => navigate('/dashboard')}
            testId="discard-exit-btn"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Discard & Exit
          </Button>
        </div>

        <FormProvider {...form}>
          {/* Change onSubmit to our interceptor */}
          <form onSubmit={handleSaveClick} className="space-y-10" data-testid="workout-form">
            {/* Section 1: Workout Metadata */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
                <Layout size={14} /> Workout Details
              </h2>
              <div
                className="flex flex-col items-end gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row"
                data-testid="workout-metadata-section"
              >
                <div className="w-full flex-1">
                  <Input
                    label="Workout Name"
                    placeholder="e.g., Upper Body Power"
                    testId="workout-name-input"
                    autoComplete="off"
                    {...form.register('name')}
                  />
                </div>

                <div
                  className="flex h-14 min-w-fit items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 text-slate-500"
                  data-testid="workout-creation-date-display"
                >
                  <CalendarDays size={18} className="text-slate-400" />
                  <div className="text-left">
                    <p className="text-[10px] font-black tracking-tight text-slate-400 uppercase">Created On</p>
                    <p className="text-sm font-bold text-slate-700">{today}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Exercise Builder */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
                <PlusCircle size={14} /> Exercise List
              </h2>

              <div data-testid="exercises-list" className="space-y-6">
                {fields.map((field, index) => (
                  <ExerciseCard key={field.id} exerciseIndex={index} onRemove={() => remove(index)} />
                ))}
              </div>

              <button
                type="button"
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 py-10 text-slate-500 transition-all hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => append({ name: '', sets: [{ weight: 0, reps: 0 }] })}
                data-testid="add-exercise-builder-btn"
              >
                <PlusCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="text-lg font-bold">Add Another Exercise</span>
              </button>
            </section>

            {/* Final Submission */}
            <div className="mt-12 flex items-center justify-end border-t border-gray-200 pt-8">
              <Button type="submit" className="h-16 w-full gap-3 px-12 text-xl md:w-auto" variant="primary" testId="save-workout-submit-btn">
                <Save className="h-5 w-5" />
                Save New Workout
              </Button>
            </div>
          </form>
        </FormProvider>
      </main>

      {/* Confirmation Modal */}
      {isSaveModalOpen && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
          <div
            className="animate-in zoom-in-95 w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl duration-200"
            data-testid="save-confirm-modal"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <AlertCircle size={24} />
            </div>

            <h3 className="mb-2 text-xl font-black text-slate-900">Finish Workout?</h3>
            <p className="mb-6 text-slate-500">Are you ready to save this workout?</p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSaveModalOpen(false)}
                className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                testId="keep-editing-btn"
              >
                Keep Editing
              </Button>

              <Button type="button" onClick={confirmSave} className="flex-1 bg-[#FF6B00] hover:bg-[#e66000]" testId="confirm-save-btn">
                Yes, Save Workout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
