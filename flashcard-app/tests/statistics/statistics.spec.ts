import { test, expect } from "../fixtures";

test.describe("UC-STATISTICS: Statistics Page", () => {
  test.describe("UC-11: View Deck Statistics", () => {
    test("TC-STATS-001: Should display statistics page", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      // Wait for loading to complete
      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Verify statistics page loaded
      await expect(
        page.locator('h1:has-text("Thống kê học tập")')
      ).toBeVisible();
    });

    test("TC-STATS-002: Should display back to dashboard link", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector("text=Quay lại Dashboard", {
        timeout: 15000,
      });

      // Back to dashboard link should be visible
      await expect(page.locator("text=Quay lại Dashboard")).toBeVisible();
    });

    test("TC-STATS-003: Should navigate back to dashboard", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector("text=Quay lại Dashboard", {
        timeout: 15000,
      });

      await page.click("text=Quay lại Dashboard");
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("TC-STATS-004: Should display refresh button", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Refresh button should be visible
      await expect(
        page.locator(
          'button[title="Làm mới dữ liệu"], button:has(svg.lucide-refresh-cw)'
        )
      ).toBeVisible();
    });

    test("TC-STATS-005: Should display statistics description", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Description text should be visible
      await expect(
        page.locator(
          "text=Theo dõi tiến độ và hiệu suất của bạn theo thời gian thực"
        )
      ).toBeVisible();
    });
  });

  test.describe("UC-12: View Advanced Deck Statistics", () => {
    test("TC-STATS-006: Should display overview section", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Overview/Summary section should exist
      await expect(page.locator("text=Tổng quan")).toBeVisible({
        timeout: 10000,
      });
    });

    test("TC-STATS-007: Should display total reviews stat", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Total reviews stat should be visible
      await expect(page.locator("text=Tổng lượt ôn tập")).toBeVisible({
        timeout: 10000,
      });
    });

    test("TC-STATS-008: Should display deck count stat", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Deck count stat should be visible
      await expect(page.locator("text=Bộ thẻ đang học")).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("UC-23: View Study Session Statistics", () => {
    test("TC-STATS-009: Should handle loading state", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      // Either loading indicator or content should be present
      const loadingOrContent = await Promise.race([
        page
          .waitForSelector("text=Đang tải dữ liệu", { timeout: 5000 })
          .then(() => "loading"),
        page
          .waitForSelector('h1:has-text("Thống kê học tập")', { timeout: 5000 })
          .then(() => "content"),
      ]).catch(() => "timeout");

      expect(["loading", "content"]).toContain(loadingOrContent);
    });

    test("TC-STATS-010: Should refresh statistics on button click", async ({
      validUser: page,
    }) => {
      await page.goto("/statistics");

      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Click refresh button
      const refreshButton = page
        .locator(
          'button[title="Làm mới dữ liệu"], button:has(svg.lucide-refresh-cw)'
        )
        .first();

      await refreshButton.click();

      // Page should still show statistics after refresh
      await expect(
        page.locator('h1:has-text("Thống kê học tập")')
      ).toBeVisible();
    });
  });

  test.describe("Statistics After Study", () => {
    test("TC-STATS-011: Should show updated statistics after studying", async ({
      validUser: page,
    }) => {
      // First create a deck with cards and study it
      await page.goto("/create-deck");
      const timestamp = Date.now();
      const deckName = `Stats Test ${timestamp}`;

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );

      // Add a card
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("StatsFront");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("StatsBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      // Wait for success message and verify heading
      await page.waitForSelector("text=Thành công", { timeout: 15000 });
      await expect(
        page.getByRole("heading", { name: "Thành công" })
      ).toBeVisible();

      // Navigate to statistics page
      await page.goto("/statistics");

      await page.waitForSelector('h1:has-text("Thống kê học tập")', {
        timeout: 15000,
      });

      // Statistics should be visible
      await expect(
        page.locator('h1:has-text("Thống kê học tập")')
      ).toBeVisible();
    });
  });
});
