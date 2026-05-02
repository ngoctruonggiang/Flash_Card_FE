import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = "playwright/.auth/user.json";
const dataFile = "tests/e2e/test-data.json";

test.use({ storageState: authFile });

test.describe("Study Modes", () => {
  test("should study in SM-2 and Cram modes", async ({ page }) => {
    // Load test data
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const deckTitle = data.deckTitle;

    // 1. Go to Dashboard and select deck
    await page.goto("/dashboard");
    await page.getByText(deckTitle).click();

    // 2. SM-2 Mode
    // Click "Bắt đầu học" - This now opens the modal
    await page.getByRole("button", { name: "Bắt đầu học" }).click();

    // Verify Modal appears
    await expect(
      page.getByRole("heading", { name: "Bắt đầu học" })
    ).toBeVisible();

    // Click "Học theo lộ trình" in the modal
    await page.getByRole("button", { name: "Học theo lộ trình" }).click();

    // Verify we are in study mode
    // Should see a card front
    await expect(
      page.getByRole("heading", { name: "Front 1", exact: true })
    ).toBeVisible();

    // Flip card by clicking it
    await page.getByRole("heading", { name: "Front 1", exact: true }).click();

    await expect(
      page.getByRole("heading", { name: "Back 1", exact: true })
    ).toBeVisible();

    // Verify due time preview and Randomly choose difficulty
    const buttons = page
      .locator("button")
      .filter({ hasText: /Again|Hard|Good|Easy|Lại|Khó|Tốt|Dễ/ });

    // Wait for buttons to be visible
    await expect(buttons.first()).toBeVisible();

    const count = await buttons.count();
    if (count > 0) {
      const randomIndex = Math.floor(Math.random() * count);
      await buttons.nth(randomIndex).click();
    }

    // 3. Cram Mode
    // Go back to deck page
    await page.goto("/dashboard");
    // Wait for deck to appear (loading state)
    await page.getByText(deckTitle).first().waitFor({ state: "visible" });
    await page.getByText(deckTitle).first().click();

    // Click "Bắt đầu học"
    await page.getByRole("button", { name: "Bắt đầu học" }).click();

    // Click "Luyện tập cấp tốc" in the modal
    await page.getByRole("button", { name: "Luyện tập cấp tốc" }).click();

    // Verify Cram mode
    // Should see card
    await expect(page.getByText("Front").first()).toBeVisible();

    // Flip and Next
    // Flip card
    await page.getByText("Front").first().click();

    // In Cram mode, verify Back is visible
    await expect(page.getByText("Back").first()).toBeVisible();

    // Click a difficulty button or Next
    const cramButtons = page
      .locator("button")
      .filter({ hasText: /Again|Hard|Good|Easy|Lại|Khó|Tốt|Dễ/ });
    if ((await cramButtons.count()) > 0) {
      await cramButtons.first().click();
    } else {
      await page
        .getByRole("button", { name: /Tiếp tục|Next/ })
        .click()
        .catch(() => {});
    }
  });

  test("should complete a study session", async ({ page }) => {
    // 1. Create a temporary deck with 1 card
    const deckTitle = `Study Deck ${Date.now()}`;
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Tạo bộ thẻ mới" }).click();
    await page
      .getByPlaceholder("VD: Từ vựng IELTS, Business English...")
      .fill(deckTitle);

    // Add 1 card
    await page.getByPlaceholder("VD: Xin chào").first().fill("Study Front");
    await page.getByPlaceholder("VD: Hello").first().fill("Study Back");

    await page.getByRole("button", { name: "Lưu bộ thẻ" }).click();
    await page.getByRole("button", { name: "Đóng" }).click();

    // 2. Start Study Session
    await page.getByText(deckTitle).first().click();
    await page.getByRole("button", { name: "Bắt đầu học" }).click();
    await page.getByRole("button", { name: "Học theo lộ trình" }).click();

    // 3. Study the card
    await expect(page.getByText("Study Front")).toBeVisible();
    await page.getByText("Study Front").click();
    await expect(page.getByText("Study Back")).toBeVisible();

    // Click "Easy/Dễ" to finish (since only 1 card)
    await page.getByRole("button", { name: /Easy|Dễ/ }).click();

    // 4. Verify Completion Screen
    await expect(page.getByText("🎉 Xuất sắc!")).toBeVisible();
    await expect(
      page.getByText("Bạn đã hoàn thành phiên học này!")
    ).toBeVisible();

    // Verify Buttons
    await expect(
      page.getByRole("button", { name: "Hoàn thành" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Tự luyện tập" })
    ).toBeVisible();

    // 5. Click "Hoàn thành" and verify back to previous page (Deck Detail)
    await page.getByRole("button", { name: "Hoàn thành" }).click();

    // Should be back at deck detail page
    await expect(page.getByRole("heading", { name: deckTitle })).toBeVisible();

    // Cleanup: Delete the deck
    await page.getByRole("button", { name: "Xóa" }).click();
    // Click the "Xóa" button in the confirmation dialog
    await page.getByRole("button", { name: "Xóa" }).last().click();
    await page.getByRole("button", { name: "Đóng" }).click();
  });
});
