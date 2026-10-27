import { expect, test } from "@playwright/test";

test("reset restores defaults and closes the split", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Bill").fill("100");
  await page.getByLabel("Tip").fill("20");
  await page
    .getByRole("button", { name: "Are you splitting the bill?" })
    .click();
  await page.getByRole("button", { name: "Reset" }).click();

  await expect(page.getByLabel("Bill")).toHaveValue("0.00");
  await expect(page.getByLabel("Tip")).toHaveValue("0");
  await expect(page.getByLabel("Number of people")).toBeHidden();
});
