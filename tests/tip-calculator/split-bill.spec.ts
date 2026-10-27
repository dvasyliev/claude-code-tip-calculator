import { expect, test } from "@playwright/test";

test("splits tip and total between people", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Bill").fill("100");
  await page.getByLabel("Tip").fill("20");
  await page
    .getByRole("button", { name: "Are you splitting the bill?" })
    .click();
  await page.getByLabel("Number of people").fill("4");
  await page.getByLabel("Number of people").blur();

  await expect(page.getByText("5.00", { exact: true })).toBeVisible();
  await expect(page.getByText("30.00", { exact: true })).toBeVisible();
});
