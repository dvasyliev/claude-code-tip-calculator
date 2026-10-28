import { expect, test } from "@playwright/test";

test("clear removes the history for good", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Clear" }).click();

  await expect(page.getByRole("heading", { name: "History" })).toBeHidden();
  await expect(page.getByRole("listitem")).toHaveCount(0);

  await page.reload();

  await expect(page.getByRole("heading", { name: "History" })).toBeHidden();
});
