import { Page, Locator } from "@playwright/test";
import { waitAndClick } from "../support";

export class Workouts {
  readonly confirmModal: Locator;
  constructor(public readonly page: Page) {
    this.confirmModal = page.getByTestId("confirm-modal");
  }

  private deleteWorkoutBtn(index: number): Locator {
    return this.page.getByTestId(`workout-card-${index}-delete-btn`);
  }

  public async deleteWorkout(index: number) {
    await waitAndClick(this.deleteWorkoutBtn(index));
    await waitAndClick(this.confirmModal);
  }
}
