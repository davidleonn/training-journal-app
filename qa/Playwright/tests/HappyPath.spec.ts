import { test } from "@playwright/test";
import { App } from "../pages/App";
import { verifyNavigation } from "../support";

let app: App;

test.describe.parallel("Login Happy Path", () => {
  test.beforeEach(async ({ page }) => {
    app = new App(page);
    await page.goto("/login");
    await page.waitForLoadState("load");
  });

  test("Simple login", async () => {
    const email = "davidleon_06@hotmail.com";
    await test.step("Login", async () => {
      await app.login.doLogin(email);
    });
    await test.step("Validate dashboard & Logout", async () => {
      await verifyNavigation(app.page, "dashboard");
      await app.dashboard.validateDashboardComponents();
      await app.dashboard.doLogout();
    });
  });
});
