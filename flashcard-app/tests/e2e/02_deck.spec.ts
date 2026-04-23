import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = "playwright/.auth/user.json";
const dataFile = "tests/e2e/test-data.json";

test.use({ storageState: authFile });

test.describe("Deck Management", () => {
  test("should create a deck with 10 cards", async ({ page }) => {
    // Load test data
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const deckTitle = `Deck ${Date.now()}`;
    const deckDesc = "This is a test deck";

    // Update data file with deck name
    data.deckTitle = deckTitle;
    fs.writeFileSync(dataFile, JSON.stringify(data));

    // 1. Go to Create Deck page
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Tạo bộ thẻ mới" }).click();

    // 2. Fill Deck Info
    await page
      .getByPlaceholder("VD: Từ vựng IELTS, Business English...")
      .fill(deckTitle);
    await page.getByPlaceholder("Mô tả ngắn về bộ thẻ này...").fill(deckDesc);

    // Select Icon (first one in the icon section)
    await page
      .locator("div")
      .filter({ hasText: /^Biểu tượng$/ })
      .locator("..")
      .locator("button")
      .first()
      .click();

    // 3. Add 10 Cards
    // Note: The page initializes with 2 empty cards.

    // Fill Card 1 (using .first())
    await page.getByPlaceholder("VD: Xin chào").first().fill("Front 1");
    await page.getByPlaceholder("VD: Hello").first().fill("Back 1");

    await page
      .getByRole("button", { name: "Thêm chi tiết (Tùy chọn)" })
      .first()
      .click();
    await page
      .getByRole("combobox")
      .first()
      .selectOption({ label: "Danh từ (Noun)" })
      .catch(() => {});

    const addExampleBtn1 = page
      .getByRole("button", { name: "Thêm ví dụ" })
      .first();
    await addExampleBtn1.click();
    await page
      .getByPlaceholder("Câu ví dụ (Tiếng Anh)")
      .first()
      .fill("Example 1 for card 1");
    await page
      .getByPlaceholder("Dịch nghĩa (Tiếng Việt)")
      .first()
      .fill("Meaning 1 for card 1");

    await addExampleBtn1.click();
    // For the second example of the first card, we use nth(1) because first() is nth(0)
    await page
      .getByPlaceholder("Câu ví dụ (Tiếng Anh)")
      .nth(1)
      .fill("Example 2 for card 1");
    await page
      .getByPlaceholder("Dịch nghĩa (Tiếng Việt)")
      .nth(1)
      .fill("Meaning 2 for card 1");

    // Loop for remaining 9 cards (indices 1 to 9)
    for (let i = 1; i < 10; i++) {
      // If i >= 2, we need to add a new card. (Card 2 is already there)
      if (i >= 2) {
        await page.getByRole("button", { name: "Thêm thẻ mới" }).click();
      }

      // Fill Front and Back
      const frontInput = page.getByPlaceholder("VD: Xin chào").last();
      const backInput = page.getByPlaceholder("VD: Hello").last();

      await frontInput.fill(`Front ${i + 1}`);
      await backInput.fill(`Back ${i + 1}`);

      // Add 2 Examples
      const detailsBtn = page
        .getByRole("button", { name: "Thêm chi tiết (Tùy chọn)" })
        .last();
      await detailsBtn.click();

      // Select Part of Speech
      await page
        .getByRole("combobox")
        .last()
        .selectOption({ label: "Danh từ (Noun)" })
        .catch(() => {});

      // Click "Thêm ví dụ" twice
      const addExampleBtn = page
        .getByRole("button", { name: "Thêm ví dụ" })
        .last();

      // Add Example 1
      await addExampleBtn.click();
      await page
        .getByPlaceholder("Câu ví dụ (Tiếng Anh)")
        .last()
        .fill(`Example 1 for card ${i + 1}`);
      await page
        .getByPlaceholder("Dịch nghĩa (Tiếng Việt)")
        .last()
        .fill(`Meaning 1 for card ${i + 1}`);

      // Add Example 2
      await addExampleBtn.click();
      await page
        .getByPlaceholder("Câu ví dụ (Tiếng Anh)")
        .last()
        .fill(`Example 2 for card ${i + 1}`);
      await page
        .getByPlaceholder("Dịch nghĩa (Tiếng Việt)")
        .last()
        .fill(`Meaning 2 for card ${i + 1}`);
    }

    // 4. Submit
    await page.getByRole("button", { name: "Lưu bộ thẻ" }).click();

    // Handle Success Modal
    await expect(
      page.getByRole("heading", { name: "Thành công" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Đóng" }).click();

    // Verify Redirect to Dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Click on the new deck to go to Deck Page
    await page.getByText(deckTitle).first().click();

    // Verify Redirect to Deck Page
    await expect(page).toHaveURL(/\/deck\//);
    await expect(page.getByRole("heading", { name: deckTitle })).toBeVisible();
  });

  test("should edit deck details", async ({ page }) => {
    // Load test data to get the deck created in the previous test
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const deckTitle = data.deckTitle;

    // Navigate to dashboard and open the deck
    await page.goto("/dashboard");
    await page.getByText(deckTitle).first().click();

    // Verify we're on the deck page
    await expect(page).toHaveURL(/\/deck\//);
    await expect(page.getByRole("heading", { name: deckTitle })).toBeVisible();

    // Click Edit button
    await page
      .getByRole("button", { name: "Chỉnh sửa" })
      .click()
      .catch(async () => {
        await page.locator('button:has-text("Chỉnh sửa")').click();
      });

    // Change Title
    const newTitle = `${deckTitle} Edited`;
    await page
      .getByPlaceholder("VD: Từ vựng IELTS, Business English...")
      .fill(newTitle);

    // Save
    await page
      .getByRole("button", { name: "Lưu bộ thẻ" })
      .click()
      .catch(() => {
        return page.getByRole("button", { name: "Lưu bộ thẻ" }).click();
      });

    // Update data file with new title
    data.deckTitle = newTitle;
    fs.writeFileSync(dataFile, JSON.stringify(data));
  });
});
