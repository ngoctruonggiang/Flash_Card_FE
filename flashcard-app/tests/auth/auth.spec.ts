import { test, expect } from "../fixtures";

test.describe("UC-AUTH: Authentication", () => {
  test.describe("UC-01: Register", () => {
    test("TC-AUTH-001: Should register a new user successfully", async ({
      page,
    }) => {
      await page.goto("/register");
      const timestamp = Date.now();
      await page.fill('input[placeholder="username"]', `newuser${timestamp}`);
      await page.fill('input[type="email"]', `newuser${timestamp}@example.com`);

      const passwordInputs = page.locator('input[placeholder="••••••••"]');
      await passwordInputs.nth(0).fill("password123");
      await passwordInputs.nth(1).fill("password123");

      await page.check('input[type="checkbox"]');
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    });
  });

  test.describe("UC-02: Login", () => {
    test("TC-AUTH-002: Should login successfully with valid credentials", async ({
      page,
    }) => {
      // 1. Register first to ensure user exists
      await page.goto("/register");
      const timestamp = Date.now();
      const username = `login${timestamp}`.substring(0, 20); // Ensure username is <= 20 chars
      const email = `login${timestamp}@example.com`;
      const password = "password123";

      await page.fill('input[placeholder="username"]', username);
      await page.fill('input[type="email"]', email);
      const passwordInputs = page.locator('input[placeholder="••••••••"]');
      await passwordInputs.nth(0).fill(password);
      await passwordInputs.nth(1).fill(password);
      await page.check('input[type="checkbox"]');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });

      // 2. Logout - Click logout button then confirm in modal
      await page.locator("button:has(svg.lucide-log-out)").click();
      // Confirm logout in modal
      await page.locator('button:has-text("Đăng xuất")').click();
      await page.waitForURL(/\/login/, { timeout: 15000 });

      // 3. Login
      await page.fill('input[type="email"]', email);
      await page.fill('input[placeholder="••••••••"]', password);
      await page.click('button[type="submit"]'); // "Đăng nhập"

      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("TC-AUTH-003: Should show error with invalid credentials", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.fill('input[type="email"]', "wrong@example.com");
      await page.fill('input[placeholder="••••••••"]', "wrongpass");
      await page.click('button[type="submit"]');

      // Look for error message box
      await expect(page.locator(".text-red-600, .bg-red-50")).toBeVisible();
    });
  });

  test.describe("UC-03: Logout", () => {
    test("TC-AUTH-004: Should logout successfully", async ({
      validUser: page,
    }) => {
      // validUser fixture logs us in
      // Click logout button
      await page.locator("button:has(svg.lucide-log-out)").click();
      // Confirm logout in modal
      await page.locator('button:has-text("Đăng xuất")').click();

      await expect(page).toHaveURL(/\/login/);
    });
  });
});
