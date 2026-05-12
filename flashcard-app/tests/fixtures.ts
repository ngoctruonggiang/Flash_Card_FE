import { test as base, Page, expect } from "@playwright/test";

type MyFixtures = {
  validUser: Page;
};

export const test = base.extend<MyFixtures>({
  validUser: async ({ page }, use) => {
    // 1. Navigate to Register page
    await page.goto("/register");

    // 2. Fill Registration Form
    const timestamp = Date.now();
    await page.fill('input[placeholder="username"]', `user${timestamp}`);
    await page.fill('input[type="email"]', `user${timestamp}@example.com`);
    await page.fill('input[placeholder="••••••••"]', "password123"); // Password
    // Handle multiple inputs with same placeholder if needed, or use .nth()
    // The first password field is usually the main one, second is confirm.
    // Better to use distinct locators if possible.
    const passwordInputs = page.locator('input[placeholder="••••••••"]');
    await passwordInputs.nth(0).fill("password123");
    await passwordInputs.nth(1).fill("password123");

    // 3. Agree to terms
    await page.check('input[type="checkbox"]');

    // 4. Submit
    await page.click('button[type="submit"]');

    // 5. Wait for successful redirection to dashboard
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    await use(page);
  },
});

export { expect } from "@playwright/test";
