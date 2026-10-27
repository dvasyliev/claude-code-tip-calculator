import { expect, test } from "@playwright/test";

test("calculates tip amount and total from bill and tip", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Bill").fill("100");
  await page.getByLabel("Tip").fill("20");
  await page.getByLabel("Tip").blur();

  await expect(page.getByText("20.00", { exact: true })).toBeVisible();
  await expect(page.getByText("120.00", { exact: true })).toBeVisible();
});
