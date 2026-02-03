import { Page, Locator, expect } from "@playwright/test";

/**
 * Wait for a locator to be visible and then fill it with the provided value.
 * @param locator Playwright Locator
 * @param value Value to fill (string or number)
 */
export async function waitAndFill(locator: Locator, value: string | number): Promise<void> {
  await locator.waitFor({ state: "visible" });
  await expect(locator).toBeVisible({ timeout: 5000 });
  await locator.fill(typeof value === "number" ? value.toString() : value);
}
export async function waitClearAndFill(locator: Locator, value: string | number): Promise<void> {
  await locator.waitFor({ state: "visible" });
  await expect(locator).toBeVisible({ timeout: 5000 });
  await locator.fill("");
  await locator.fill(typeof value === "number" ? value.toString() : value);
}

/**
 * Wait for a locator to be visible and then click it.
 * @param locator Playwright Locator
 */
export async function waitAndClick(locator: Locator): Promise<void> {
  await locator.waitFor({ state: "visible" });
  await expect(locator).toBeVisible({ timeout: 5000 });
  await locator.click({ force: true });
}
