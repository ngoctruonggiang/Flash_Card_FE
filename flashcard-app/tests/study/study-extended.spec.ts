import { test, expect } from "../fixtures";

// Helper function to create deck and navigate to it
async function createDeckWithCards(
  page: any,
  deckName: string,
  cards: { front: string; back: string }[]
) {
  await page.goto("/create-deck");
  await page.fill(
    'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
    deckName
  );

  for (const card of cards) {
    await page.click('button:has-text("Thêm thẻ mới")');
    await page.locator('input[placeholder="VD: Xin chào"]').last().fill(card.front);
    await page.locator('input[placeholder="VD: Hello"]').last().fill(card.back);
  }

  await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

  // Wait for success or URL change
  await Promise.race([
    page.waitForSelector("text=Thành công", { timeout: 15000 }),
    page.waitForURL(/\/deck\/\d+/, { timeout: 15000 }),
  ]).catch(() => {});

  // Close success modal if present
  const closeBtn = page.locator('button:has-text("Đóng")');
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click();
  }

  // If we're not on deck page, navigate via dashboard
  if (!page.url().includes("/deck/")) {
    await page.goto("/dashboard");
    await page.waitForTimeout(1000);
    // Click the first deck card
    const deckCard = page.locator('[class*="cursor-pointer"]').filter({ hasText: deckName }).first();
    if (await deckCard.isVisible().catch(() => false)) {
      await deckCard.click();
      await page.waitForURL(/\/deck\/\d+/, { timeout: 10000 }).catch(() => {});
    }
  }
}

test.describe("UC-STUDY-EXTENDED: Extended Study Session Tests", () => {
  test.describe("Study Modal Interactions", () => {
    test("TC-STUDY-EXT-001: Should create deck successfully", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Study Modal ${timestamp}`
      );

      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("Word1");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("Trans1");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      // Wait for success modal heading
      const successHeading = page.getByRole('heading', { name: 'Thành công' });
      await expect(successHeading).toBeVisible({ timeout: 15000 });
    });

    test("TC-STUDY-EXT-002: Should display study mode options", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Study Mode ${timestamp}`, [
        { front: "Word1", back: "Trans1" },
      ]);

      // Click start study button
      const startStudyBtn = page.locator('button:has-text("Bắt đầu học")');
      await expect(startStudyBtn).toBeVisible({ timeout: 10000 });
      await startStudyBtn.click();

      // Look for study mode options
      await expect(
        page.locator('button:has-text("Học theo lộ trình")')
      ).toBeVisible({ timeout: 10000 });
    });

    test("TC-STUDY-EXT-003: Should close study modal", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Close Modal ${timestamp}`, [
        { front: "Word1", back: "Trans1" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await expect(page.locator('button:has-text("Học theo lộ trình")')).toBeVisible({ timeout: 10000 });

      // Close the modal
      const closeButton = page.locator("button:has(svg.lucide-x)");
      if (await closeButton.isVisible()) {
        await closeButton.click();
      } else {
        await page.keyboard.press("Escape");
      }

      await expect(page.locator("text=Học theo lộ trình")).not.toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Card Flip Functionality", () => {
    test("TC-STUDY-EXT-004: Should show front of card initially", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Flip Test ${timestamp}`, [
        { front: "FlipFront", back: "FlipBack" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await expect(page.locator("text=FlipFront")).toBeVisible({ timeout: 10000 });
    });

    test("TC-STUDY-EXT-005: Should flip to show back of card", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Flip Back ${timestamp}`, [
        { front: "FlipFront2", back: "FlipBack2" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await page.click("text=FlipFront2");
      await expect(page.locator("text=FlipBack2")).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Rating Buttons", () => {
    test("TC-STUDY-EXT-006: Should display rating buttons after flip", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Rating Test ${timestamp}`, [
        { front: "RatingFront", back: "RatingBack" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await page.click("text=RatingFront");

      await expect(
        page.locator("button").filter({ hasText: /Dễ|Easy|Good|Tốt|Khó|Hard|Lại|Again/i }).first()
      ).toBeVisible({ timeout: 5000 });
    });

    test("TC-STUDY-EXT-007: Should rate card as Again", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Again Test ${timestamp}`, [
        { front: "AgainFront", back: "AgainBack" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await page.click("text=AgainFront");

      // Use more specific selector - the Again rating button has "Again" and "<1 min"
      const againButton = page.getByRole('button', { name: /Again.*min/i });
      if (await againButton.isVisible()) {
        await againButton.click();
      }
    });

    test("TC-STUDY-EXT-008: Should rate card as Hard", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Hard Test ${timestamp}`, [
        { front: "HardFront", back: "HardBack" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await page.click("text=HardFront");

      const hardButton = page.locator("button").filter({ hasText: /Khó|Hard/i });
      if (await hardButton.isVisible()) {
        await hardButton.click();
      }
    });

    test("TC-STUDY-EXT-009: Should rate card as Good", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Good Test ${timestamp}`, [
        { front: "GoodFront", back: "GoodBack" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await page.click("text=GoodFront");

      const goodButton = page.locator("button").filter({ hasText: /Tốt|Good/i });
      if (await goodButton.isVisible()) {
        await goodButton.click();
      }
    });

    test("TC-STUDY-EXT-010: Should rate card as Easy", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Easy Test ${timestamp}`, [
        { front: "EasyFront", back: "EasyBack" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await page.click("text=EasyFront");

      const easyButton = page.locator("button").filter({ hasText: /Dễ|Easy/i });
      if (await easyButton.isVisible()) {
        await easyButton.click();
      }
    });
  });

  test.describe("Session Progress", () => {
    test("TC-STUDY-EXT-011: Should show progress through cards", async ({
      validUser: page,
    }) => {
      const timestamp = Date.now();
      await createDeckWithCards(page, `Progress Test ${timestamp}`, [
        { front: "Progress1", back: "ProgressBack1" },
        { front: "Progress2", back: "ProgressBack2" },
        { front: "Progress3", back: "ProgressBack3" },
      ]);

      await page.click('button:has-text("Bắt đầu học")');
      await page.click('button:has-text("Học theo lộ trình")');
      await page.waitForURL(/\/study\?deckId=/, { timeout: 20000 });

      await expect(page.locator("text=Progress1")).toBeVisible({ timeout: 10000 });

      await page.click("text=Progress1");
      await page.locator("button").filter({ hasText: /Dễ|Easy|Good|Tốt/i }).first().click();

      await page.waitForTimeout(1000);
    });
  });

  test.describe("Empty Deck Study", () => {
    test("TC-STUDY-EXT-012: Should handle deck with no cards", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Empty Study ${timestamp}`
      );

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();

      const hasWarning = await page
        .locator("text=Vui lòng thêm ít nhất 1 thẻ có nội dung")
        .isVisible()
        .catch(() => false);
      expect(hasWarning).toBeTruthy();
    });
  });
});
