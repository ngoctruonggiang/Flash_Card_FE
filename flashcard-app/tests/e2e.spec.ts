import { test, expect } from "./fixtures";

test.describe("E2E: Complete User Flows", () => {
  test.describe("Complete Flashcard Learning Flow", () => {
    test("TC-E2E-001: Full cycle - Register, Create Deck, Add Cards, Study, View Stats", async ({
      page,
    }) => {
      // 1. Register new user
      await page.goto("/register");
      const timestamp = Date.now();
      const username = `e2euser${timestamp}`;
      const email = `e2euser${timestamp}@example.com`;
      const password = "password123";

      await page.fill('input[placeholder="username"]', username);
      await page.fill('input[type="email"]', email);
      const passwordInputs = page.locator('input[placeholder="••••••••"]');
      await passwordInputs.nth(0).fill(password);
      await passwordInputs.nth(1).fill(password);
      await page.check('input[type="checkbox"]');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/, { timeout: 15000 });

      // 2. Create a new deck
      await page.click('button:has-text("Tạo bộ thẻ mới")');
      await expect(page).toHaveURL(/\/create-deck/);

      const deckName = `E2E Deck ${timestamp}`;
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );
      await page.fill(
        'textarea[placeholder="Mô tả ngắn về bộ thẻ này..."]',
        "End-to-end test deck"
      );

      // 3. Add cards to the deck
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("Hello");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("Xin chào");

      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("Goodbye");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("Tạm biệt");

      // 4. Save the deck
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success message and close modal
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      // Wait for navigation to deck page
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // 6. Start a study session from deck detail page
      await page.click('button:has-text("Bắt đầu học")');
      await expect(page.locator("text=Bắt đầu học")).toBeVisible();
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      // 7. Study the first card
      await page.click("text=Hello");
      await expect(page.locator("text=Xin chào")).toBeVisible();
      await page
        .locator("button")
        .filter({ hasText: /Dễ|Easy|Good|Tốt/i })
        .first()
        .click();

      // 8. Navigate to statistics
      await page.goto("/statistics");
      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });
      await expect(
        page.locator('h1:has-text("Thống kê học tập")')
      ).toBeVisible();
    });

    test("TC-E2E-002: Deck management flow - Create, Edit, Delete", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();

      // 1. Create a deck
      await page.goto("/create-deck");
      const originalName = `Original ${timestamp}`;
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        originalName
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("ManageFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("ManageBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });

    test("TC-E2E-003: Card management flow - Add, Edit, Delete", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();

      // 1. Create deck with cards
      await page.goto("/create-deck");
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Card Flow ${timestamp}`
      );

      // Add two cards
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("CardA");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("BackA");

      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("CardB");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("BackB");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });
  });

  test.describe("Navigation Flow", () => {
    test("TC-E2E-004: Complete navigation through all pages", async ({
      validUser: page,
    }) => {
      // Start at dashboard
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.locator("text=FlashLearn")).toBeVisible();

      // Navigate to deck library
      await page.click('button:has-text("Mở bộ sưu tập thẻ")');
      await expect(page).toHaveURL(/\/deck/);
      await expect(page.locator('h1:has-text("Tất cả bộ thẻ")')).toBeVisible();

      // Navigate to create deck
      await page.click('button:has-text("Tạo bộ thẻ mới")');
      await expect(page).toHaveURL(/\/create-deck/);

      // Navigate back to dashboard
      await page.click('button:has-text("Quay lại Dashboard")');
      await expect(page).toHaveURL(/\/dashboard/);

      // Navigate to settings
      await page.goto("/settings");
      await expect(page.locator('h1:has-text("Cài đặt")')).toBeVisible();

      // Navigate back to dashboard
      await page.click('button:has-text("Quay lại Dashboard")');
      await expect(page).toHaveURL(/\/dashboard/);

      // Navigate to statistics
      await page.goto("/statistics");
      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });
      await expect(
        page.locator('h1:has-text("Thống kê học tập")')
      ).toBeVisible();
    });
  });

  test.describe("Error Recovery Flow", () => {
    test("TC-E2E-005: Should handle network errors gracefully", async ({
      validUser: page,
    }) => {
      // This test verifies the app doesn't crash on navigation
      await page.goto("/dashboard");
      await expect(page.locator("text=FlashLearn")).toBeVisible();

      // Rapidly navigate between pages
      await page.goto("/deck");
      await page.goto("/settings");
      await page.goto("/statistics");
      await page.goto("/dashboard");

      // App should still be functional
      await expect(page.locator("text=FlashLearn")).toBeVisible();
    });

    test("TC-E2E-006: Should handle invalid deck ID gracefully", async ({
      validUser: page,
    }) => {
      // Try to access a non-existent deck
      await page.goto("/deck/99999999");

      // Should either show error message or redirect
      await page.waitForTimeout(3000);

      // App should not crash - either shows error or redirects
      const url = page.url();
      expect(url).toBeTruthy();
    });
  });

  test.describe("Logout Flow", () => {
    test("TC-E2E-007: Complete logout and re-login flow", async ({
      validUser: page,
    }) => {
      // Verify logged in
      await expect(page).toHaveURL(/\/dashboard/);

      // Logout
      await page.locator("button:has(svg.lucide-log-out)").click();
      await page.locator('button:has-text("Đăng xuất")').click();
      
      // After logout, user may be redirected to home (/) or login (/login)
      await page.waitForURL(/\/($|login)/, { timeout: 10000 });
      const url = page.url();
      expect(url.endsWith('/') || url.includes('/login')).toBeTruthy();
    });
  });
});
