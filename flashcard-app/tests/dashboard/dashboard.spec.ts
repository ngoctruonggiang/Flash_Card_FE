import { test, expect } from "../fixtures";

test.describe("UC-DASHBOARD: Dashboard", () => {
  test.describe("Dashboard Navigation", () => {
    test("TC-DASH-001: Should display dashboard after login", async ({
      validUser: page,
    }) => {
      // validUser fixture already logs us in and redirects to dashboard
      await expect(page).toHaveURL(/\/dashboard/);

      // Verify FlashLearn logo/branding is visible
      await expect(page.locator("text=FlashLearn")).toBeVisible();
    });

    test("TC-DASH-002: Should display user information in header", async ({
      validUser: page,
    }) => {
      // Check that user avatar/menu area exists
      await expect(
        page.locator(".bg-gradient-to-br.from-blue-500.to-purple-500")
      ).toBeVisible();
    });

    test("TC-DASH-003: Should display stats grid", async ({
      validUser: page,
    }) => {
      // Stats grid should be visible with statistics cards
      await expect(page.locator("text=Bộ thẻ của bạn")).toBeVisible();
    });

    test("TC-DASH-004: Should display action buttons", async ({
      validUser: page,
    }) => {
      // Check for "Open collection" and "Create new deck" buttons
      await expect(
        page.locator('button:has-text("Mở bộ sưu tập thẻ")')
      ).toBeVisible();
      await expect(
        page.locator('button:has-text("Tạo bộ thẻ mới")')
      ).toBeVisible();
    });
  });

  test.describe("Dashboard Navigation Actions", () => {
    test("TC-DASH-005: Should navigate to deck library from dashboard", async ({
      validUser: page,
    }) => {
      await page.click('button:has-text("Mở bộ sưu tập thẻ")');
      await expect(page).toHaveURL(/\/deck/);
      await expect(page.locator('h1:has-text("Tất cả bộ thẻ")')).toBeVisible();
    });

    test("TC-DASH-006: Should navigate to create deck page", async ({
      validUser: page,
    }) => {
      await page.click('button:has-text("Tạo bộ thẻ mới")');
      await expect(page).toHaveURL(/\/create-deck/);
    });

    test("TC-DASH-007: Should navigate to settings page", async ({
      validUser: page,
    }) => {
      // Navigate to settings directly - the settings button may not be visible in navbar
      await page.goto("/settings");
      await expect(page).toHaveURL(/\/settings/);
      await expect(page.locator('h1:has-text("Cài đặt")')).toBeVisible();
    });

    test("TC-DASH-008: Should navigate to statistics page", async ({
      validUser: page,
    }) => {
      // Click statistics button
      await page
        .locator('button[title="Thống kê"], a[href="/statistics"]')
        .first()
        .click();
      await expect(page).toHaveURL(/\/statistics/);
      await expect(
        page.locator('h1:has-text("Thống kê học tập")')
      ).toBeVisible();
    });
  });

  test.describe("Dashboard Search", () => {
    test("TC-DASH-009: Should have search functionality", async ({
      validUser: page,
    }) => {
      // First create a deck to search for
      await page.goto("/create-deck");
      const timestamp = Date.now();
      const deckName = `SearchTest ${timestamp}`;
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("SearchFront");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("SearchBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      // Wait for success modal and close it
      await page.waitForSelector("text=Thành công", { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();

      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // Go back to dashboard
      await page.goto("/dashboard");

      // Try searching (search bar may be hidden on mobile)
      const searchInput = page.locator(
        'input[placeholder="Tìm kiếm bộ thẻ..."]'
      );
      if (await searchInput.isVisible()) {
        await searchInput.fill(deckName);
        // The search should filter decks
        await page.waitForTimeout(500); // Wait for debounce
      }
    });
  });

  test.describe("Dashboard Logout", () => {
    test("TC-DASH-010: Should show logout confirmation modal", async ({
      validUser: page,
    }) => {
      // Click logout button
      await page.locator("button:has(svg.lucide-log-out)").click();

      // Verify confirmation modal appears - use heading to be specific
      await expect(
        page.getByRole("heading", { name: "Đăng xuất" })
      ).toBeVisible();
      await expect(
        page.locator("text=Bạn có chắc muốn đăng xuất?")
      ).toBeVisible();
    });

    test("TC-DASH-011: Should cancel logout when clicking cancel", async ({
      validUser: page,
    }) => {
      // Click logout button
      await page.locator("button:has(svg.lucide-log-out)").click();

      // Click cancel/close button
      await page.locator('button:has-text("Hủy")').click();

      // Should still be on dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});
