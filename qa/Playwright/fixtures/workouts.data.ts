import { WorkoutData } from "../types";

// Good for general smoke testing
export const standardWorkout: WorkoutData = {
  name: "Upper Body Power",
  exercises: [
    {
      name: "Bench Press",
      sets: [
        { weight: "100", reps: "5" },
        { weight: "100", reps: "5" },
        { weight: "100", reps: "5" }
      ]
    },
    {
      name: "Pull Ups",
      sets: [
        { weight: "0", reps: "10" },
        { weight: "0", reps: "8" }
      ]
    }
  ]
};

// 2. Complex Leg Day (Deep Nesting)
// Tests logic for adding multiple exercises AND multiple sets per exercise
export const complexLegDay: WorkoutData = {
  name: "Leg Day Destruction",
  exercises: [
    {
      name: "Leg Extensions",
      sets: [
        { weight: "40", reps: "20" },
        { weight: "50", reps: "15" },
        { weight: "60", reps: "12" },
        { weight: "70", reps: "10" }
      ]
    },
    {
      name: "Squats",
      sets: [
        { weight: "120", reps: "8" },
        { weight: "125", reps: "8" },
        { weight: "130", reps: "6" }
      ]
    },
    {
      name: "Lunges",
      sets: [
        { weight: "20", reps: "12" },
        { weight: "20", reps: "12" }
      ]
    }
  ]
};

// 3. Single Set Blast (Minimal Viable)
// Tests if the function works with zero "Add Set" or "Add Exercise" clicks
export const quickWorkout: WorkoutData = {
  name: "Morning Cardio",
  exercises: [
    {
      name: "Treadmill Run",
      sets: [{ weight: "0", reps: "1" }]
    }
  ]
};

// 4. High Volume (Stress Test)
// Tests UI performance and stability with 20 input operations in a single card
export const volumeWorkout: WorkoutData = {
  name: "German Volume Training",
  exercises: [
    {
      name: "Barbell Squat",
      sets: Array(10).fill({ weight: "100", reps: "10" }) // 10 sets of 10
    },
    {
      name: "Leg Curl",
      sets: Array(10).fill({ weight: "40", reps: "10" }) // 10 sets of 10
    }
  ]
};
