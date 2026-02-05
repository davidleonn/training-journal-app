import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { workoutsApi } from '../api';

// 1. Define Validation Schema (Matches your Backend DTOs)
const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  date: z.string(),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1, 'Exercise name is required'),
        sets: z
          .array(
            z.object({
              weight: z.number().min(0),
              reps: z.number().min(1, 'Must have at least 1 rep'),
            })
          )
          .min(1, 'Add at least one set'),
      })
    )
    .min(1, 'Add at least one exercise'),
});

// Infer the type from the schema
export type WorkoutFormData = z.infer<typeof workoutSchema>;

export const useWorkoutForm = () => {
  const navigate = useNavigate();

  // 2. Initialize Form
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: '',
      date: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
      exercises: [
        { name: '', sets: [{ weight: 0, reps: 0 }] }, // Start with 1 empty exercise
      ],
    },
  });

  // 3. Helper to submit to Backend
  const submit = async (data: WorkoutFormData) => {
    try {
      // Transform simple form data to complex Backend DTO structure
      await workoutsApi.create({
        name: data.name,
        date: new Date(data.date).toISOString(),
        exercises: data.exercises.map((ex, exIndex) => ({
          name: ex.name,
          position: exIndex,
          sets: ex.sets.map((set, setIndex) => ({
            setNumber: setIndex + 1,
            reps: [{ weight: set.weight, repNumber: set.reps }], // Backend expects a list of reps
          })),
        })),
      });
      navigate('/workouts'); // Redirect back to history
    } catch (error) {
      console.error('Failed to create workout', error);
      // In a real app, you'd show a toast notification here
    }
  };

  return { form, submit: form.handleSubmit(submit) };
};
