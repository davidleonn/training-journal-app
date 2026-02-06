export interface SetData {
  weight: string;
  reps: string;
}

export interface ExerciseData {
  name: string;
  sets: SetData[];
}

export interface WorkoutData {
  name: string;
  exercises: ExerciseData[];
}
