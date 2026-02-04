import { Page } from "@playwright/test";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";

export class App {
  private _Login?: Login;
  private _Dashboard?: Dashboard;

  constructor(public page: Page) {}

  public get login() {
    if (!this._Login) {
      this._Login = new Login(this.page);
    }
    return this._Login;
  }

  public get dashboard() {
    if (!this._Dashboard) {
      this._Dashboard = new Dashboard(this.page);
    }
    return this._Dashboard;
  }
}
