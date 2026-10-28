import { expect, test } from "@playwright/test";

test("saved calculations stay after a reload", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Bill").fill("50");
  await page.getByLabel("Tip").fill("15");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveText([
    "Bill 50.00 · Tip 15% · 1 person · 57.50 each",
  ]);

  await page
    .getByRole("button", { name: "Are you splitting the bill?" })
    .click();
  await page.getByRole("button", { name: "Save" }).click();

  const items = [
    "Bill 50.00 · Tip 15% · 2 people · 28.75 each",
    "Bill 50.00 · Tip 15% · 1 person · 57.50 each",
  ];
  await expect(page.getByRole("listitem")).toHaveText(items);

  await page.reload();

  await expect(page.getByRole("listitem")).toHaveText(items);
});
