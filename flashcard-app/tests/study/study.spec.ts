import { test, expect } from "../fixtures";

test.describe("UC-STUDY: Study Session", () => {
  test.beforeEach(async ({ validUser: page }) => {
    await page.goto("/create-deck");
    const timestamp = Date.now();
    await page.fill(
      'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
      `Study Deck ${timestamp}`
    );

    await page.click('button:has-text("Thêm thẻ mới")');
    await page
      .locator('input[placeholder="VD: Xin chào"]')
      .last()
      .fill("StudyFront");
    await page
      .locator('input[placeholder="VD: Hello"]')
      .last()
      .fill("StudyBack");

    await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

    // Wait for success modal and close it
    await page.waitForSelector("text=Thành công", { timeout: 15000 });
    await page.locator('button:has-text("Đóng")').click();

    // Navigate to the deck page
    await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });
  });

  test.describe("UC-20: Start Study Session", () => {
    test("TC-STUDY-001: Should start a study session", async ({
      validUser: page,
    }) => {
      await page.click('button:has-text("Bắt đầu học")');

      // Wait for modal transition
      await expect(page.locator("text=Bắt đầu học")).toBeVisible();
      await page.click('button:has-text("Học theo lộ trình")');

      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });
      await expect(page.locator("text=StudyFront")).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("UC-21: Record Review Outcome", () => {
    test("TC-STUDY-002: Should flip card and record outcome", async ({
      validUser: page,
    }) => {
      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await page.click("text=StudyFront");
      await expect(page.locator("text=StudyBack")).toBeVisible();

      await page
        .locator("button")
        .filter({ hasText: /Dễ|Easy|Good|Tốt/i })
        .first()
        .click();
      // Just verify no error, and maybe redirect or next card
    });
  });

  test.describe("UC-22: Session Summary", () => {
    test("TC-STUDY-003: Should show summary after completing session", async ({
      validUser: page,
    }) => {
      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      // Click card to flip it
      await page.click("text=StudyFront");

      // Wait for card to flip and show back content
      await expect(page.locator("text=StudyBack")).toBeVisible({
        timeout: 5000,
      });

      // Click Easy to graduate the card immediately (avoid requeue)
      await page.locator("button").filter({ hasText: /Easy/i }).first().click();

      // Should show Summary completion screen
      await expect(page.locator("text=🎉 Xuất sắc!")).toBeVisible({
        timeout: 15000,
      });
    });
  });
});
