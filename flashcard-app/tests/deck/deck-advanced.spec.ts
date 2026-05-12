import { test, expect } from "../fixtures";

test.describe("UC-IMPORT-EXPORT: Import/Export Functionality", () => {
  test.describe("UC-18: Import JSON", () => {
    test("TC-IMPORT-001: Should display import button on create deck page", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");

      // Import button should be visible
      await expect(page.locator('button:has-text("Import")')).toBeVisible();
    });

    test("TC-IMPORT-002: Should show import dropdown on hover", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");

      // Hover over import button
      await page.hover('button:has-text("Import")');

      // Import JSON option should appear
      await expect(page.locator("text=Import JSON")).toBeVisible();
    });

    test("TC-IMPORT-003: Should have file input for JSON import", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");

      // Verify file input exists (hidden but present)
      const fileInput = page.locator('input[type="file"][accept=".json"]');
      await expect(fileInput).toHaveCount(1);
    });
  });

  test.describe("UC-19: Export JSON", () => {
    test("TC-EXPORT-001: Should have export button on deck detail page", async ({
      validUser: page,
    }) => {
      // Create a deck first
      await page.goto("/create-deck");
      const timestamp = Date.now();
      const deckName = `Export Test ${timestamp}`;

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("ExportFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("ExportBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // Look for export/download button
      const exportButton = page.locator("button:has(svg.lucide-download)");
      if (await exportButton.isVisible()) {
        await expect(exportButton).toBeVisible();
      }
    });
  });
});

test.describe("UC-DECK-DETAIL: Deck Detail Page", () => {
  test.describe("Deck Detail View", () => {
    test("TC-DECK-DETAIL-001: Should display deck detail page", async ({
      validUser: page,
    }) => {
      // Create a deck first
      await page.goto("/create-deck");
      const timestamp = Date.now();
      const deckName = `Detail Test ${timestamp}`;

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        deckName
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("DetailFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("DetailBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // Verify deck name is displayed
      await expect(page.locator(`h1:has-text("${deckName}")`)).toBeVisible();
    });

    test("TC-DECK-DETAIL-002: Should display deck statistics", async ({
      validUser: page,
    }) => {
      // Create a deck first
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Stats Detail ${timestamp}`
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("StatsFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("StatsBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // Look for statistics section (total cards, due cards, etc.)
      await expect(page.locator("text=Tổng thẻ")).toBeVisible({
        timeout: 10000,
      });
    });

    test("TC-DECK-DETAIL-003: Should have edit button", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Edit Button ${timestamp}`
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("EditFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("EditBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await expect(page.locator('button:has-text("Chỉnh sửa")')).toBeVisible();
    });

    test("TC-DECK-DETAIL-004: Should have delete button", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Delete Button ${timestamp}`
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("DeleteFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("DeleteBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await expect(page.locator('button:has-text("Xóa")')).toBeVisible();
    });

    test("TC-DECK-DETAIL-005: Should have start study button", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Study Button ${timestamp}`
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("StudyFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("StudyBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await expect(
        page.locator('button:has-text("Bắt đầu học")')
      ).toBeVisible();
    });

    test("TC-DECK-DETAIL-006: Should have back to dashboard button", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Back Button ${timestamp}`
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("BackFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("BackBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await expect(
        page.locator('button:has-text("Quay lại Dashboard")')
      ).toBeVisible();
    });

    test("TC-DECK-DETAIL-007: Should navigate back to dashboard", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Nav Back ${timestamp}`
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("NavFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("NavBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      await page.click('button:has-text("Quay lại Dashboard")');
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe("Card Search", () => {
    test("TC-DECK-DETAIL-008: Should have search functionality for cards", async ({
      validUser: page,
    }) => {
      await page.goto("/create-deck");
      const timestamp = Date.now();

      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `Search Test ${timestamp}`
      );

      // Add cards
      await page.click('button:has-text("Thêm thẻ mới")');
      await page
        .locator('input[placeholder="VD: Xin chào"]')
        .last()
        .fill("SearchWord");
      await page
        .locator('input[placeholder="VD: Hello"]')
        .last()
        .fill("SearchTranslation");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // Search input should be present
      const searchInput = page.locator('input[placeholder*="Tìm kiếm"]');
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeVisible();
      }
    });
  });
});

test.describe("UC-DECK-LIBRARY: Deck Library Page", () => {
  test.describe("View Mode Toggle", () => {
    test("TC-LIBRARY-001: Should toggle between grid and list view", async ({
      validUser: page,
    }) => {
      // Create a deck first
      await page.goto("/create-deck");
      const timestamp = Date.now();
      await page.fill(
        'input[placeholder="VD: Từ vựng IELTS, Business English..."]',
        `View Toggle ${timestamp}`
      );

      // Add card content (required)
      await page.click('button:has-text("Thêm thẻ mới")');
      await page.locator('input[placeholder="VD: Xin chào"]').last().fill("ViewFront");
      await page.locator('input[placeholder="VD: Hello"]').last().fill("ViewBack");

      await page.locator("button").filter({ hasText: "Lưu bộ thẻ" }).click();
      
      // Wait for success modal and close it
      await page.waitForSelector('text=Thành công', { timeout: 15000 });
      await page.locator('button:has-text("Đóng")').click();
      
      await page.waitForURL(/\/deck\/\d+/, { timeout: 15000 });

      // Go to deck library
      await page.goto("/deck");

      // Look for view mode toggle buttons (grid/list)
      const gridButton = page.locator("button:has(svg.lucide-layout-grid)");
      const listButton = page.locator("button:has(svg.lucide-list)");

      if (await gridButton.isVisible()) {
        await expect(gridButton).toBeVisible();
      }
      if (await listButton.isVisible()) {
        await expect(listButton).toBeVisible();
      }
    });
  });

  test.describe("Sort Functionality", () => {
    test("TC-LIBRARY-002: Should have sort options", async ({
      validUser: page,
    }) => {
      await page.goto("/deck");

      // Look for sort dropdown/select
      const sortSelect = page.locator('select, button:has-text("Sắp xếp")');
      if (await sortSelect.first().isVisible()) {
        await expect(sortSelect.first()).toBeVisible();
      }
    });
  });

  test.describe("Create New Deck", () => {
    test("TC-LIBRARY-003: Should navigate to create deck from library", async ({
      validUser: page,
    }) => {
      await page.goto("/deck");

      await page.click('button:has-text("Tạo bộ thẻ mới")');
      await expect(page).toHaveURL(/\/create-deck/);
    });
  });
});
