import { Page } from "@playwright/test";
import { Login } from "./Login";

export class App {
  private _Login?: Login;

  constructor(public page: Page) {}

  public get login() {
    if (!this._Login) {
      this._Login = new Login(this.page);
    }
    return this._Login;
  }
}
