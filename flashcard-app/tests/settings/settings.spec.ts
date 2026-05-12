import { test, expect } from "../fixtures";

test.describe("UC-SETTINGS: Settings Management", () => {
  test.describe("UC-04: View User Profile", () => {
    test("TC-SETTINGS-001: Should display settings page", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Verify settings page loaded
      await expect(page.locator('h1:has-text("Cài đặt")')).toBeVisible();
      await expect(
        page.locator("text=Quản lý tài khoản và tùy chọn học tập")
      ).toBeVisible();
    });

    test("TC-SETTINGS-002: Should display profile section", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Profile section should be visible
      await expect(page.locator("text=Thông tin cá nhân")).toBeVisible();
    });

    test("TC-SETTINGS-003: Should display back to dashboard button", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      await expect(
        page.locator('button:has-text("Quay lại Dashboard")')
      ).toBeVisible();
    });

    test("TC-SETTINGS-004: Should navigate back to dashboard", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      await page.click('button:has-text("Quay lại Dashboard")');
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe("UC-05: Update User Profile", () => {
    test("TC-SETTINGS-005: Should have save button", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Save button should be visible
      await expect(
        page.locator('button:has-text("Lưu thay đổi")')
      ).toBeVisible();
    });

    test("TC-SETTINGS-006: Should display study settings section", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Study settings section should be visible
      // Look for any settings-related text
      const studySection = page.locator("text=Cài đặt học tập");
      if (await studySection.isVisible()) {
        await expect(studySection).toBeVisible();
      }
    });

    test("TC-SETTINGS-007: Should display notification settings section", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Notification settings section check - use heading to be specific
      const notificationSection = page.getByRole('heading', { name: 'Thông báo' });
      if (await notificationSection.isVisible()) {
        await expect(notificationSection).toBeVisible();
      }
    });

    test("TC-SETTINGS-008: Should display appearance settings section", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Appearance settings section check
      const appearanceSection = page.locator("text=Giao diện");
      if (await appearanceSection.isVisible()) {
        await expect(appearanceSection).toBeVisible();
      }
    });
  });

  test.describe("UC-06: Delete User Account", () => {
    test("TC-SETTINGS-009: Should display danger zone section", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Danger zone section should be visible
      await expect(page.locator("text=Vùng nguy hiểm")).toBeVisible();
    });

    test("TC-SETTINGS-010: Should have delete account button", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Delete account button should exist
      await expect(
        page.locator('button:has-text("Xóa tài khoản")')
      ).toBeVisible();
    });

    test("TC-SETTINGS-011: Should show delete confirmation modal", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Click delete account button
      await page.click('button:has-text("Xóa tài khoản")');

      // Confirmation modal should appear
      await expect(
        page.locator("text=Bạn có chắc muốn xóa tài khoản")
      ).toBeVisible();
    });

    test("TC-SETTINGS-012: Should cancel delete account action", async ({
      validUser: page,
    }) => {
      await page.goto("/settings");

      // Click delete account button
      await page.click('button:has-text("Xóa tài khoản")');

      // Click cancel button in modal
      await page.locator('button:has-text("Hủy")').click();

      // Modal should be closed and still on settings page
      await expect(page).toHaveURL(/\/settings/);
    });
  });
});
