import { Page, Locator } from "@playwright/test";
import { assertComponentReady, waitAndClick, waitAndFill } from "../support";

export class Dashboard {
  readonly headerLogo: Locator;
  readonly headerProfile: Locator;
  readonly logoutButton: Locator;
  readonly heroCardComponent: Locator;
  readonly progressChartComponent: Locator;
  readonly historySideBarComponent: Locator;

  constructor(public readonly page: Page) {
    this.headerLogo = page.getByTestId("header-logo");
    this.headerProfile = page.getByTestId("header-user-display");
    this.logoutButton = page.getByTestId("header-logout-button");
    this.heroCardComponent = page.getByTestId("dashboard-hero");
    this.progressChartComponent = page.getByTestId("progress-chart-container");
    this.historySideBarComponent = page.getByTestId("history-sidebar");
  }

  public async validateDashboardComponents() {
    await assertComponentReady(this.headerLogo, "JOURNAL");
    await assertComponentReady(this.headerProfile, "davidleon_06");
    await assertComponentReady(this.heroCardComponent, "Active");
    await assertComponentReady(this.progressChartComponent, "Weekly");
    await assertComponentReady(this.historySideBarComponent, "History");
  }

  public async doLogout() {
    await waitAndClick(this.logoutButton);
  }
}
