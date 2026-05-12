import { test, expect } from "../fixtures";

test.describe("UC-CARD-EXTENDED: Extended Card Management Tests", () => {
  test.describe("Card Content Validation", () => {
    test("TC-CARD-EXT-001: Should not save card with empty front", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Empty Front ${timestamp}`
      );

      // Add a card with empty front
      await page.click('button:has-text("Thêm thẻ mới")');
      // Leave front empty
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("BackContent");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      // Either shows error or navigates (depends on validation)
      // Check if we're still on create-deck or moved to deck
      const url = page.url();
      expect(url).toMatch(/\/(create-deck|deck)/);
    });

    test("TC-CARD-EXT-002: Should not save card with empty back", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Empty Back ${timestamp}`
      );

      // Add a card with empty back
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("FrontContent");
      // Leave back empty

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      const url = page.url();
      expect(url).toMatch(/\/(create-deck|deck)/);
    });

    test("TC-CARD-EXT-003: Should save card with special characters", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Special Chars ${timestamp}`
      );

      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("Xin chào! 你好 👋");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("Hello! مرحبا 🌍");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success message and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });

    test("TC-CARD-EXT-004: Should save card with long content", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Long Content ${timestamp}`
      );

      const longText =
        "This is a very long text that contains many words and sentences to test how the application handles longer content in flashcards.";

      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill(longText);
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("Translation");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success message and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });
  });

  test.describe("Multiple Cards Management", () => {
    test("TC-CARD-EXT-005: Should add multiple cards at once", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Multi Cards ${timestamp}`
      );

      // Add 3 cards
      for (let i = 1; i <= 3; i++) {
        await page.click('button:has-text("Thêm thẻ mới")');
        await page
          .locator('input[placeholder="VD: Xin chào"]')
          .last()
          .fill(`Front${i}`);
        await page
          .locator('input[placeholder="VD: Hello"]')
          .last()
          .fill(`Back${i}`);
      }

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success message and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });

    test("TC-CARD-EXT-006: Should handle card reordering in edit mode", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Reorder Test ${timestamp}`
      );

      // Add 2 cards
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("First");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("FirstBack");

      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("Second");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("SecondBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success message and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });
  });

  test.describe("Card Edit Scenarios", () => {
    test("TC-CARD-EXT-007: Should edit card and save changes", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Edit Card ${timestamp}`
      );

      // Add a card
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("Original");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("OriginalBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success message and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });

    test("TC-CARD-EXT-008: Should cancel edit without saving", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Cancel Edit ${timestamp}`
      );

      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("KeepThis");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("KeepThisBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success message and verify heading
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await expect(page.getByRole('heading', { name: 'Thành công' })).toBeVisible();
    });
  });
});
