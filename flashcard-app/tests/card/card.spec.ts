import { test, expect } from "../fixtures";

test.describe("UC-CARD: Card Management", () => {
  test.beforeEach(async ({ validUser: page }) => {
    await page.goto("/create-deck");
    const timestamp = Date.now();
    await page.fill(
      'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
      `Card Deck ${timestamp}`
    );

    // Add card content (required to save)
    await page.click('button:has-text("Thêm thẻ mới")');
    await page
      .locator('input[placeholder="VD: Xin chào"]')
      .last()
      .fill("InitialFront");
    await page
      .locator('input[placeholder="VD: Hello"]')
      .last()
      .fill("InitialBack");

    await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

    // Wait for success modal and close it
    await page.waitForSelector("text=Thành công", { timeout: 15000 });
    await page.locator('button:has-text("Đóng")').click();

    // Navigate to the deck page
    await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });
  });

  test.describe("UC-14: Add Card", () => {
    test("TC-CARD-001: Should add a new card to the deck", async ({
      validUser: page,
    }) => {
      await page.click('button:has-text("Chỉnh sửa")');

      // Wait for edit mode to load and deck name to be populated
      await page.waitForURL(/\/create-deck\?edit=/, { timeout: 15000 });
      await page.waitForSelector(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        { timeout: 10000 }
      );

      // Verify deck name is loaded (should have "Card Deck" in it)
      const deckNameInput = page.locator(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]'
      );
      await expect(deckNameInput).toHaveValue(/Card Deck/);

      await page.click('button:has-text("Thêm thẻ mới")');
      const frontInputs = page.locator('input[placeholder="VD: Xin chào"]');
      const backInputs = page.locator('input[placeholder="VD: Hello"]');

      await frontInputs.last().fill("MyNewCard");
      await backInputs.last().fill("MyBackCard");
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      // Wait for success modal and close it
      await page.waitForSelector("text=Thành công", { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();

      // Wait for navigation to deck detail page
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await expect(page.locator("text=MyNewCard")).toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator("text=MyBackCard")).toBeVisible();
    });
  });

  test.describe("UC-15: Edit Card", () => {
    test("TC-CARD-002: Should edit an existing card", async ({
      validUser: page,
    }) => {
      // Add card
      await page.click('button:has-text("Chỉnh sửa")');
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("OriginalFront");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("OriginalBack");
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      await expect(page.locator("text=OriginalFront")).toBeVisible({
        timeout: 10000,
      });

      // Edit
      await page.click('button:has-text("Chỉnh sửa")');
      await page.locator('input[value="OriginalFront"]').fill("UpdatedFront");
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      await expect(page.locator("text=UpdatedFront")).toBeVisible({
        timeout: 10000,
      });
    });
  });

  test.describe("UC-16: Delete Card", () => {
    test("TC-CARD-003: Should delete a card", async ({ validUser: page }) => {
      // Add TWO cards so delete is enabled (need > 1 card)
      await page.click('button:has-text("Chỉnh sửa")');

      // Wait for edit mode to load and deck name to be populated
      await page.waitForURL(/\/create-deck\?edit=/, { timeout: 15000 });
      await page.waitForSelector(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        { timeout: 10000 }
      );

      // Verify deck name is loaded (should have "Card Deck" in it)
      const deckNameInput = page.locator(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]'
      );
      await expect(deckNameInput).toHaveValue(/Card Deck/);

      // Card 1
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("Card1");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("Back1");

      // Card 2 (DeleteMe)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("DeleteMe");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("Back2");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      // Wait for success modal and close it
      await page.waitForSelector("text=Thành công", { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();

      // Wait for navigation to deck detail page
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await expect(page.locator("text=Card1")).toBeVisible({ timeout: 10000 });
      await expect(page.locator("text=DeleteMe")).toBeVisible();

      // Delete
      await page.click('button:has-text("Chỉnh sửa")');

      // Wait for edit mode to load and deck name to be populated
      await page.waitForURL(/\/create-deck\?edit=/, { timeout: 15000 });
      await page.waitForSelector(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        { timeout: 10000 }
      );

      // Verify deck name is still loaded
      await expect(
        page.locator(
          'input[placeholder="VD: Từ vựng IELTS, Business English..."]'
        )
      ).toHaveValue(/Card Deck/);

      // Delete the last one ('DeleteMe')
      // Note: We need to wait for inputs to be visible
      await expect(page.locator('input[value="DeleteMe"]')).toBeVisible();

      // Click last trash icon
      await page.locator("button:has(svg.lucide-trash-2)").last().click();

      // Save
      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      // Wait for success modal and close it
      await page.waitForSelector("text=Thành công", { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();

      // Wait for navigation to deck detail page
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // Verify
      await expect(page.locator("text=DeleteMe")).not.toBeVisible({
        timeout: 10000,
      });
      // Card1 should still be there
      await expect(page.locator("text=Card1")).toBeVisible();
    });
  });
});
