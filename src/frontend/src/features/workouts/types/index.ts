export interface WorkoutRepInput {
  repNumber: number;
  weight: number;
}

export interface WorkoutSetInput {
  setNumber: number;
  reps: WorkoutRepInput[];
}

export interface WorkoutExerciseInput {
  name: string;
  position: number;
  sets: WorkoutSetInput[];
}

export interface CreateWorkoutRequest {
  name: string;
  date: string; // ISO Date String (e.g., "2026-02-05T12:00:00Z")
  exercises: WorkoutExerciseInput[];
}

export interface UpdateWorkoutRequest extends CreateWorkoutRequest {
  // Update has the exact same shape as Create in your backend
}

// OUTPUTS

export interface RepResponse {
  id: string;
  setId: string;
  weight: number;
  repNumber: number;
}

export interface SetResponse {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: RepResponse[];
}

export interface ExerciseResponse {
  id: string;
  workoutId: string;
  name: string;
  position: number;
  sets: SetResponse[];
}

export interface WorkoutResponse {
  id: string;
  userId: string;
  name: string;
  date: string;
  exercises: ExerciseResponse[];
}

export interface WorkoutSummaryResponse {
  id: string;
  name: string;
  date: string;
}

export interface WorkoutCardProps {
  workout: WorkoutSummaryResponse;
  onEdit: (id: string) => void;
}

export interface WorkoutListProps {
  workouts: WorkoutSummaryResponse[];
  loading: boolean;
  onEdit: (id: string) => void;
}

export interface SetRowProps {
  exerciseIndex: number;
  setIndex: number;
  onRemove: () => void;
}

export interface ExerciseCardProps {
  exerciseIndex: number;
  onRemove: () => void;
}
