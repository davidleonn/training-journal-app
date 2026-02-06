import { Page, Locator, expect } from "@playwright/test";
import { waitAndClick, waitAndFill } from "../support";
import { ExerciseData, SetData, WorkoutData } from "../types";

export class NewWorkout {
  readonly workoutNameInput: Locator;
  readonly dateComponent: Locator;
  readonly addExerciseBtn: Locator;
  readonly saveWorkoutBtn: Locator;
  readonly confirmSaveBtn: Locator;

  constructor(public readonly page: Page) {
    this.workoutNameInput = page.getByTestId("workout-name-input");
    this.dateComponent = page.getByTestId("workout-creation-date-display");
    this.addExerciseBtn = page.getByTestId("add-exercise-builder-btn");
    this.saveWorkoutBtn = page.getByTestId("save-workout-submit-btn");
    this.confirmSaveBtn = page.getByTestId("confirm-save-btn");
  }

  private exerciseNameInput(index: number): Locator {
    return this.page.getByTestId(`exercise-name-${index}`);
  }

  private weightInput(exerciseIndex: number, setIndex: number): Locator {
    return this.page.getByTestId(`weight-input-${exerciseIndex}-${setIndex}`);
  }

  private repsInput(exerciseIndex: number, setIndex: number): Locator {
    return this.page.getByTestId(`reps-input-${exerciseIndex}-${setIndex}`);
  }

  private addSetBtn(exerciseIndex: number): Locator {
    return this.page.getByTestId(`add-set-btn-${exerciseIndex}`);
  }

  public async validateDate() {
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    // Check if the component contains the generated date string
    await expect(this.dateComponent).toContainText(today);
  }

  public async createWorkout(data: WorkoutData) {
    await waitAndFill(this.workoutNameInput, data.name);

    for (const [index, exercise] of data.exercises.entries()) {
      await this.fillExercise(index, exercise);
    }

    await this.saveWorkout();
  }

  private async fillExercise(index: number, exercise: ExerciseData) {
    // The page starts with 1 empty exercise. For subsequent ones, we must add them.
    if (index > 0) {
      await waitAndClick(this.addExerciseBtn);
    }

    await waitAndFill(this.exerciseNameInput(index), exercise.name);

    for (const [setIndex, set] of exercise.sets.entries()) {
      await this.fillSet(index, setIndex, set);
    }
  }

  private async fillSet(exerciseIndex: number, setIndex: number, set: SetData) {
    if (setIndex > 0) {
      await waitAndClick(this.addSetBtn(exerciseIndex));
    }

    await waitAndFill(this.weightInput(exerciseIndex, setIndex), set.weight);
    await waitAndFill(this.repsInput(exerciseIndex, setIndex), set.reps);
  }

  public async saveWorkout() {
    await waitAndClick(this.saveWorkoutBtn);
    await waitAndClick(this.confirmSaveBtn);
  }
}
