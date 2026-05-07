import { test as base, expect, Page } from "@playwright/test";
import path from "path";
import { TEST_USER, AUTH_FILE } from "./auth.setup";

// Re-export test user for convenience
export { TEST_USER };

/**
 * Extended test fixture that provides authenticated page
 */
export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser }, use) => {
    // Create a new context with the saved auth state
    const context = await browser.newContext({
      storageState: AUTH_FILE,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };

/**
 * Helper to login programmatically via localStorage
 * Use this when you need quick auth without going through the UI
 */
export async function loginViaLocalStorage(page: Page): Promise<void> {
  await page.goto("/");

  // Set the same localStorage values the app expects
  await page.evaluate((user) => {
    const userData = {
      id: "999999",
      username: user.username,
      email: user.email,
      name: user.username,
      avatar: "🎓",
    };
    localStorage.setItem("flashlearn_user", JSON.stringify(userData));
    localStorage.setItem("access_token", "test-token-for-e2e");
    localStorage.setItem(
      "flashcard_user",
      JSON.stringify({
        ...userData,
        accessToken: "test-token-for-e2e",
      })
    );
  }, TEST_USER);
}

/**
 * Helper to clear auth state
 */
export async function logout(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Sample deck data for testing
 */
export const TEST_DECK = {
  title: "E2E Test Deck",
  description: "A deck created for integration testing",
  iconName: "Book",
  colorCode: "blue",
};

/**
 * Sample card data for testing
 */
export const TEST_CARDS = [
  {
    front: "Hello",
    back: "Xin chào",
    pronunciation: "/həˈloʊ/",
    wordType: "greeting",
  },
  {
    front: "Goodbye",
    back: "Tạm biệt",
    pronunciation: "/ɡʊdˈbaɪ/",
    wordType: "greeting",
  },
  {
    front: "Thank you",
    back: "Cảm ơn",
    pronunciation: "/θæŋk juː/",
    wordType: "phrase",
  },
];

/**
 * Wait for page to be fully loaded (no pending network requests)
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
}

/**
 * Check if element is visible and has expected text
 */
export async function expectElementWithText(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  const element = page.locator(selector).filter({ hasText: text });
  await expect(element).toBeVisible();
}
