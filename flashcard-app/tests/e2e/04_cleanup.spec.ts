import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = "playwright/.auth/user.json";
const dataFile = "tests/e2e/test-data.json";

test.use({ storageState: authFile });

test.describe("Cleanup", () => {
  test("should delete deck", async ({ page }) => {
    // Load test data
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const deckTitle = data.deckTitle;

    // Delete the deck
    await page.goto("/dashboard");
    await page.getByText(deckTitle).first().click();

    // Click Delete button
    await page.getByRole("button", { name: "Xóa" }).click();

    // Verify Confirm Modal
    await expect(
      page.getByRole("heading", { name: "Xóa bộ thẻ" })
    ).toBeVisible();
    await expect(
      page.getByText(
        "Bạn có chắc muốn xóa bộ thẻ này? Hành động này không thể hoàn tác!"
      )
    ).toBeVisible();

    // Confirm Delete
    await page.getByRole("button", { name: "Xóa" }).nth(1).click();

    // Verify Success Modal
    await expect(
      page.getByRole("heading", { name: "Thành công" })
    ).toBeVisible();
    await expect(page.getByText(`Đã xóa bộ thẻ "${deckTitle}"`)).toBeVisible();

    // Close Success Modal
    await page.getByRole("button", { name: "Đóng" }).click();

    // Verify Redirect to Dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify Deck is Gone
    await expect(page.getByText(deckTitle)).not.toBeVisible();
  });

  test("should delete user account", async ({ page }) => {
    // Navigate to settings page
    await page.goto("/settings");

    // Click Delete Account button
    await page.getByRole("button", { name: "Xóa tài khoản" }).click();

    // Verify Confirm Modal
    await expect(
      page.getByRole("heading", { name: "Xóa tài khoản" })
    ).toBeVisible();
    await expect(
      page.getByText(
        "Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn."
      )
    ).toBeVisible();

    // Confirm Delete - use the correct button text from ConfirmModal
    await page.getByRole("button", { name: "Xóa tài khoản" }).nth(1).click();

    // Verify redirect to home or login page
    await expect(page).toHaveURL(/(\/login|\/|\/register)/);

    // Clean up: Remove auth and data files
    if (fs.existsSync(authFile)) {
      fs.unlinkSync(authFile);
    }
    if (fs.existsSync(dataFile)) {
      fs.unlinkSync(dataFile);
    }
  });
});
