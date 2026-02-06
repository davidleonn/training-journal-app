import { Page } from "@playwright/test";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { NewWorkout } from "./NewWorkout";
import { Workouts } from "./Workouts";

export class App {
  private _Login?: Login;
  private _Dashboard?: Dashboard;
  private _NewWorkout?: NewWorkout;
  private _Workouts?: Workouts;

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

  public get newWorkout() {
    if (!this._NewWorkout) {
      this._NewWorkout = new NewWorkout(this.page);
    }
    return this._NewWorkout;
  }

  public get workouts() {
    if (!this._Workouts) {
      this._Workouts = new Workouts(this.page);
    }
    return this._Workouts;
  }
}
