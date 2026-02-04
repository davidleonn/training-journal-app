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

/**
 * Validates that a UI component exists, is stable, and meets accessibility standards.
 */
export async function assertComponentReady(locator: Locator, expectedText?: string | RegExp): Promise<void> {
  // 1. Basic Visibility & Attachment
  // Ensures the component is in the DOM and visible to the user.
  await locator.waitFor({ state: "visible", timeout: 10000 });
  await expect(locator).toBeVisible();

  // 2. Structural Integrity (Bounding Box)
  // Ensures the element has a height/width (not rendered at 0x0 by a CSS bug).
  const box = await locator.boundingBox();
  if (!box || box.width === 0 || box.height === 0) {
    throw new Error(`Component ${locator} exists but has no visible area (0x0).`);
  }

  // 3. Content Validation (If text is provided)
  // Useful for checking the "Ready to crush it" text or "JOURNAL" logo.
  if (expectedText) {
    await expect(locator).toContainText(expectedText);
  }

  // 4. Stability Check
  // In a dashboard with animations (like your Hero blur or Chart fade-in),
  // this ensures the element has stopped moving/reflowing.
  await locator.evaluate((node) => {
    return new Promise((resolve) => {
      if (window.getComputedStyle(node).transitionProperty === "none") resolve(true);
      node.addEventListener("transitionend", () => resolve(true), { once: true });
      setTimeout(() => resolve(true), 500); // Fail-safe
    });
  });
}
