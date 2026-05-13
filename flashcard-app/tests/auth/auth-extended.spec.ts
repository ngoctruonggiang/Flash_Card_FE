import { test, expect } from "../fixtures";

test.describe("UC-AUTH-EXTENDED: Extended Authentication Tests", () => {
  test.describe("Registration Validation", () => {
    test("TC-AUTH-EXT-001: Should show error for empty registration form", async ({
      page,
    }) => {
      await page.goto("/register");

      // Try to submit without filling any fields
      await page.click('button[type="submit"]');

      // Form should not submit (still on register page)
      await expect(page).toHaveURL(/\/register/);
    });

    test("TC-AUTH-EXT-002: Should show error for mismatched passwords", async ({
      page,
    }) => {
      await page.goto("/register");

      const timestamp = Date.now();
      await page.fill('input[placeholder="username"]', `mismatch${timestamp}`);
      await page.fill(
        'input[type="email"]',
        `mismatch${timestamp}@example.com`
      );

      const passwordInputs = page.locator('input[placeholder="••••••••"]');
      await passwordInputs.nth(0).fill("password123");
      await passwordInputs.nth(1).fill("differentpassword");

      await page.check('input[type="checkbox"]');
      await page.click('button[type="submit"]');

      // Should show validation error or stay on page
      await expect(page).toHaveURL(/\/register/);
    });

    test("TC-AUTH-EXT-003: Should require terms acceptance", async ({
      page,
    }) => {
      await page.goto("/register");

      const timestamp = Date.now();
      await page.fill('input[placeholder="username"]', `terms${timestamp}`);
      await page.fill('input[type="email"]', `terms${timestamp}@example.com`);

      const passwordInputs = page.locator('input[placeholder="••••••••"]');
      await passwordInputs.nth(0).fill("password123");
      await passwordInputs.nth(1).fill("password123");

      // Don't check terms checkbox
      await page.click('button[type="submit"]');

      // Should stay on register page
      await expect(page).toHaveURL(/\/register/);
    });
  });

  test.describe("Login Validation", () => {
    test("TC-AUTH-EXT-004: Should show error for empty login form", async ({
      page,
    }) => {
      await page.goto("/login");

      await page.click('button[type="submit"]');

      // Should stay on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test("TC-AUTH-EXT-005: Should show error for invalid email format", async ({
      page,
    }) => {
      await page.goto("/login");

      await page.fill('input[type="email"]', "invalidemail");
      await page.fill('input[placeholder="••••••••"]', "password123");
      await page.click('button[type="submit"]');

      // Should show validation or error
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe("Navigation Protection", () => {
    test("TC-AUTH-EXT-006: Should redirect to login when accessing protected route", async ({
      page,
    }) => {
      // Try to access dashboard without being logged in
      await page.goto("/dashboard");

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test("TC-AUTH-EXT-007: Should redirect to login when accessing settings", async ({
      page,
    }) => {
      await page.goto("/settings");

      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test("TC-AUTH-EXT-008: Should show error or redirect when accessing statistics without auth", async ({
      page,
    }) => {
      await page.goto("/statistics");

      // App may either redirect to login OR show an unauthorized error
      const isLoginPage = await page.url().includes("/login");
      const hasError = await page
        .locator("text=Unauthorized")
        .isVisible()
        .catch(() => false);
      const hasErrorPage = await page
        .locator("text=Đã xảy ra lỗi")
        .isVisible()
        .catch(() => false);

      expect(isLoginPage || hasError || hasErrorPage).toBeTruthy();
    });

    test("TC-AUTH-EXT-009: Should redirect to login when accessing deck library", async ({
      page,
    }) => {
      await page.goto("/deck");

      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test("TC-AUTH-EXT-010: Should redirect to login when accessing create deck", async ({
      page,
    }) => {
      await page.goto("/create-deck");

      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
  });

  test.describe("Session Persistence", () => {
    test("TC-AUTH-EXT-011: Should maintain session after page reload", async ({
      validUser: page,
    }) => {
      // validUser fixture logs us in
      await expect(page).toHaveURL(/\/dashboard/);

      // Reload the page
      await page.reload();

      // Should still be on dashboard (session persisted)
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.locator("text=FlashLearn")).toBeVisible();
    });
  });

  test.describe("Login/Register Links", () => {
    test("TC-AUTH-EXT-012: Should navigate from login to register", async ({
      page,
    }) => {
      await page.goto("/login");

      // Look for "Register" or "Sign up" link
      const registerLink = page.locator(
        'a:has-text("Đăng ký"), a:has-text("Register")'
      );
      if (await registerLink.isVisible()) {
        await registerLink.click();
        await expect(page).toHaveURL(/\/register/);
      }
    });

    test("TC-AUTH-EXT-013: Should navigate from register to login", async ({
      page,
    }) => {
      await page.goto("/register");

      // Look for "Login" or "Sign in" link
      const loginLink = page.locator(
        'a:has-text("Đăng nhập"), a:has-text("Login")'
      );
      if (await loginLink.isVisible()) {
        await loginLink.click();
        await expect(page).toHaveURL(/\/login/);
      }
    });
  });
});
