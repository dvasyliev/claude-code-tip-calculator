import { expect, test } from "@playwright/test";

// Starting point for generated end-to-end tests: opens the home page.
test("seed", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(page.locator("body")).toBeVisible();
});
