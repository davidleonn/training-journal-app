import { Page, Locator } from "@playwright/test";
import { waitAndClick, waitAndFill } from "../support";

export class Login {
  readonly emailInput: Locator;
  readonly enterButton: Locator;

  constructor(public readonly page: Page) {
    this.emailInput = page.getByTestId("login-email-input");
    this.enterButton = page.getByTestId("login-submit-button");
  }

  public async doLogin(email: string) {
    await waitAndFill(this.emailInput, email);
    await waitAndClick(this.enterButton);
  }
}
