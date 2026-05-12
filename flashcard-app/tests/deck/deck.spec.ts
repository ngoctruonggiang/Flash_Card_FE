import { test, expect } from "../fixtures";

test.describe("UC-DECK: Deck Management", () => {
  test.describe("UC-08: Create Deck", () => {
    test("TC-DECK-001: Should create a new deck successfully", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();
      const deckName = `Deck ${timestamp}`;
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );
      await page.fill(
        'textarea[placeholder="Mô tả ngắn về bộ thẻ này..."]',
        "Created via Playwright"
      );
      
      // Add card content (required to save)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("TestFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("TestBack");
      
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });
      await expect(page.locator(`h1:has-text("${deckName}")`)).toBeVisible();
    });
  });

  test.describe("UC-07: View Deck Library", () => {
    test("TC-DECK-002: Should list decks in the library", async ({
      validUser: page,
    }) => {
      await page.goto("/deck");
      await expect(page.locator('h1:has-text("Tất cả bộ thẻ")')).toBeVisible();
      // Verify Create New button exists (confirming page loaded)
      await expect(
        page.locator('button:has-text("Tạo bộ thẻ mới")')
      ).toBeVisible();
    });
  });

  test.describe("UC-09: Edit Deck", () => {
    test("TC-DECK-003: Should edit an existing deck", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();
      const deckName = `EditDeck ${timestamp}`;
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );
      
      // Add card content (required to save)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("EditFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("EditBack");
      
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await page.click('button:has-text("Chỉnh sửa")');
      await page.waitForURL(/\/create-deck\?edit=/);

      const newName = `${deckName} Updated`;
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        newName
      );
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      await expect(page.locator(`h1:has-text("${newName}")`)).toBeVisible({
        timeout: 15000,
      });
    });
  });

  test.describe("UC-10: Delete Deck", () => {
    test("TC-DECK-004: Should delete a deck", async ({ validUser: page }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();
      const deckName = `DeleteDeck ${timestamp}`;
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );
      
      // Add card content (required to save)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("DeleteFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("DeleteBack");
      
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await page.click('button:has-text("Xóa")');

      // Use visible to distinguish from hidden modal elements if any
      await page.locator('button:has-text("Xóa"):visible').last().click();

      await page.waitForURL(/\/dashboard|\/deck/);
    });
  });
});
