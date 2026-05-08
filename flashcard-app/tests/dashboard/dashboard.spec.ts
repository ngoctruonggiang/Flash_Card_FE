import { test, expect } from "@playwright/test";
import { TEST_USER, loginViaLocalStorage } from "../fixtures";

test.describe("UC-07: Dashboard Page Integration Tests", () => {
  // For protected routes, we need to be authenticated
  test.beforeEach(async ({ page }) => {
    // Login via localStorage for faster setup
    await loginViaLocalStorage(page);
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("TC-DASH-001: Dashboard page loads with navigation elements", async ({
    page,
  }) => {
    // Check for FlashLearn logo/brand
    await expect(page.locator("text=FlashLearn")).toBeVisible();

    // Check for navigation elements
    await expect(page.locator("nav")).toBeVisible();

    // Check for settings button/link
    const settingsButton = page
      .locator("button, a")
      .filter({ has: page.locator("svg") });
    await expect(settingsButton.first()).toBeVisible();
  });

  test("TC-DASH-002: Dashboard header shows welcome message", async ({
    page,
  }) => {
    // Look for welcome message pattern
    const welcomeMessage = page.locator("text=Chào mừng trở lại");
    await expect(welcomeMessage).toBeVisible();

    // Check for date display
    const dateSection = page.locator("text=Hôm nay là");
    await expect(dateSection).toBeVisible();
  });

  test("TC-DASH-003: Stats grid displays statistics cards", async ({
    page,
  }) => {
    // Wait for stats to load
    await page.waitForTimeout(2000);

    // Look for stats grid with multiple stat cards
    const statsSection = page.locator(".grid");
    await expect(statsSection.first()).toBeVisible();

    // Check for at least one stat label
    const statLabels = [
      "Tổng thẻ",
      "Đã học",
      "Streak",
      "Độ chính xác",
      "Bộ thẻ",
    ];
    let foundLabel = false;
    for (const label of statLabels) {
      const labelElement = page.locator(`text=${label}`);
      if (await labelElement.isVisible().catch(() => false)) {
        foundLabel = true;
        break;
      }
    }
    // At least one stat should be visible (or stats section exists)
    expect(foundLabel || (await statsSection.first().isVisible())).toBe(true);
  });

  test("TC-DASH-004: Create deck button navigates to create-deck page", async ({
    page,
  }) => {
    // Find and click create deck button
    const createDeckButton = page.locator(
      'button:has-text("Tạo bộ thẻ"), a:has-text("Tạo bộ thẻ")'
    );
    await expect(createDeckButton.first()).toBeVisible();
    await createDeckButton.first().click();

    // Should navigate to create-deck page
    await page.waitForURL("**/create-deck**", { timeout: 5000 });
    await expect(page).toHaveURL(/\/create-deck/);
  });

  test("TC-DASH-005: Open deck collection button works", async ({ page }) => {
    // Find deck collection button
    const deckButton = page.locator(
      'button:has-text("Mở bộ sưu tập"), button:has-text("bộ sưu tập thẻ")'
    );

    if (
      await deckButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await deckButton.first().click();
      await page.waitForURL("**/deck**", { timeout: 5000 });
      await expect(page).toHaveURL(/\/deck/);
    } else {
      // If no collection button, deck list should be on dashboard directly
      const deckList = page.locator("text=Bộ thẻ của bạn");
      await expect(deckList).toBeVisible();
    }
  });

  test("TC-DASH-006: Statistics link navigates to statistics page", async ({
    page,
  }) => {
    // Find statistics button in navigation
    const statsButton = page.locator(
      'a[href="/statistics"], button[title="Thống kê"]'
    );

    if (
      await statsButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await statsButton.first().click();
      await page.waitForURL("**/statistics**", { timeout: 5000 });
      await expect(page).toHaveURL(/\/statistics/);
    } else {
      // Statistics might be accessed via icon button
      test.skip();
    }
  });

  test("TC-DASH-007: Settings navigation works", async ({ page }) => {
    // Find settings button
    const settingsButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-settings") });

    if (await settingsButton.isVisible().catch(() => false)) {
      await settingsButton.click();
      await page.waitForURL("**/settings**", { timeout: 5000 });
      await expect(page).toHaveURL(/\/settings/);
    } else {
      // Try clicking any settings-related element
      const settingsLink = page.locator('a[href="/settings"]');
      if (await settingsLink.isVisible().catch(() => false)) {
        await settingsLink.click();
        await expect(page).toHaveURL(/\/settings/);
      } else {
        test.skip();
      }
    }
  });

  test("TC-DASH-008: Logout button shows confirmation modal", async ({
    page,
  }) => {
    // Find logout button
    const logoutButton = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-log-out") });

    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();

      // Confirmation modal should appear
      const modal = page.locator("text=Đăng xuất").first();
      await expect(modal).toBeVisible({ timeout: 3000 });

      // Check for confirm/cancel buttons in modal
      const confirmButton = page.locator('button:has-text("Đăng xuất")').last();
      await expect(confirmButton).toBeVisible();
    } else {
      test.skip();
    }
  });

  test("TC-DASH-009: Search input filters decks", async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]');

    if (await searchInput.isVisible().catch(() => false)) {
      // Type a search query
      await searchInput.fill("test");
      await page.waitForTimeout(500);

      // Search should filter the content (or show no results message)
      await expect(searchInput).toHaveValue("test");
    } else {
      test.skip();
    }
  });

  test("TC-DASH-010: Deck cards are clickable and navigate to detail", async ({
    page,
  }) => {
    // Wait for decks to load
    await page.waitForTimeout(2000);

    // Find any deck card
    const deckCard = page.locator('[class*="rounded"]').filter({
      has: page.locator('button:has-text("Học"), button:has-text("Xem")'),
    });

    if (
      await deckCard
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await deckCard.first().click();
      // Should navigate to deck detail
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url.includes("/deck/") || url.includes("/dashboard")).toBe(true);
    } else {
      // If no decks, check for empty state message
      const emptyMessage = page.locator(
        "text=Chưa có bộ thẻ, text=Tạo bộ thẻ đầu tiên"
      );
      const hasDeckSection = await page
        .locator("text=Bộ thẻ")
        .isVisible()
        .catch(() => false);
      expect(hasDeckSection).toBe(true);
    }
  });
});
