import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = "playwright/.auth/user.json";
const dataFile = "tests/e2e/test-data.json";

test.describe("Authentication", () => {
  test("should sign up, log out, and log in", async ({ page }) => {
    const timestamp = Date.now();
    const username = `user${timestamp}`;
    const email = `user${timestamp}@example.com`;
    const password = "TestUser123";

    // Save test data for other tests
    fs.writeFileSync(dataFile, JSON.stringify({ username, email, password }));

    // 1. Sign up
    await page.goto("/register");
    await page.getByPlaceholder("username").fill(username);
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("••••••••").first().fill(password);
    await page.getByPlaceholder("••••••••").last().fill(password);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();

    // Verify redirection to dashboard or success
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByText(`Chào mừng trở lại, ${username}`)
    ).toBeVisible();

    // 2. Log out
    // Click logout button (last button in nav)
    await page.locator("nav button").last().click();

    // Handle confirmation modal
    await expect(
      page.getByRole("heading", { name: "Đăng xuất" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Đăng xuất" }).click();

    // Verify redirect (could be /login or /)
    await expect(page).toHaveURL(/(\/login|\/$)/);

    // 3. Log in
    // If on landing page, click Login first
    if (page.url() === "http://localhost:3001/") {
      await page.getByRole("button", { name: "Đăng nhập" }).click();
    } else if (!page.url().includes("/login")) {
      // If not on login page, go there
      await page.goto("/login");
    }

    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("••••••••").fill(password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    // Verify login
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByText(`Chào mừng trở lại, ${username}`)
    ).toBeVisible();

    // 4. Save storage state
    await page.context().storageState({ path: authFile });
  });
});
