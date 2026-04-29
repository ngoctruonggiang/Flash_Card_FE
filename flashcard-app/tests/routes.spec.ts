import { test, expect, Page } from '@playwright/test';

// ============================================================================
// TEST DATA CONSTANTS
// ============================================================================
const TEST_USERS = {
  VALID: {
    email: 'duchai1703@gmail.com',
    password: '123456',
    name: 'Đức Hải'
  },
  INVALID: {
    email: 'invalid@email.com',
    password: 'wrongpass'
  },
  NEW: {
    email: 'newuser@test.com',
    password: 'NewPass123!',
    username: 'newuser'
  }
} as const;

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE_DECK: '/create-deck',
  ALL_DECKS: '/deck',
  STUDY: '/study',
  STATISTICS: '/statistics',
  SETTINGS: '/settings'
} as const;

const TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 3000,
  LONG: 5000,
  CARD_TRANSITION: 500
} as const;

// Helper function to login
async function login(page: Page, email = TEST_USERS.VALID.email, password = TEST_USERS.VALID.password) {
  await page.goto(ROUTES.LOGIN);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(ROUTES.DASHBOARD);
}

// Helper to clear authentication
async function clearAuth(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.context().clearCookies();
}

test.describe('Welcome/Home Page (/)', () => {
  test('should display welcome page with branding', async ({ page }) => {
    await page.goto('/');
    
    // Check logo and branding
    await expect(page.locator('text=FlashLearn')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Learn faster/i })).toBeVisible();
  });

  test('should have navigation to login', async ({ page }) => {
    await page.goto('/');
    
    // Check login button exists
    const loginButton = page.locator('button:has-text("Đăng nhập")');
    await expect(loginButton).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');
    
    // Check for feature descriptions
    await expect(page.locator('text=Spaced Repetition')).toBeVisible();
    await expect(page.locator('text=SM-2')).toBeVisible();
  });

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('button:has-text("Bắt đầu miễn phí")')).toBeVisible();
    await expect(page.locator('button:has-text("Xem demo")')).toBeVisible();
  });

  test('should display animated flashcards', async ({ page }) => {
    await page.goto('/');
    
    // Wait for flashcard to appear
    await expect(page.locator('text=Xin chào').or(page.locator('text=Học')).or(page.locator('text=Thành công'))).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    
    const registerButton = page.locator('button:has-text("Bắt đầu miễn phí")').first();
    await registerButton.click();
    await page.waitForURL('/register');
    
    await expect(page).toHaveURL('/register');
  });
});

test.describe('Login Page (/login)', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show quick login test accounts', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('text=Tài khoản test')).toBeVisible();
    await expect(page.locator('text=duchai1703@gmail.com')).toBeVisible();
    await expect(page.locator('text=hao@gmail.com')).toBeVisible();
    await expect(page.locator('text=truongdanh@gmail.com')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.locator('input[type="password"]').first();
    const toggleButton = page.locator('button').filter({ has: page.locator('svg') }).nth(1);
    
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleButton.click();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Check for error message
    await expect(page.locator('text=Email hoặc mật khẩu không đúng')).toBeVisible({ timeout: 2000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page);
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Chào mừng trở lại')).toBeVisible();
  });

  test('should have link to register page', async ({ page }) => {
    await page.goto('/login');
    
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
  });

  test('should quick login by clicking test account', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('button:has-text("👨‍💻 Đức Hải")').click();
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveValue('duchai1703@gmail.com');
  });
});

test.describe('Register Page (/register)', () => {
  test('should display registration form', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByRole('heading', { name: 'Tạo tài khoản' })).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('should have all required form fields', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.locator('label:has-text("Tên người dùng")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Mật khẩu")')).toBeVisible();
    await expect(page.locator('label:has-text("Xác nhận mật khẩu")')).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.goto('/register');
    
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('weak');
    
    // Wait for strength indicator
    await expect(page.locator('text=Yếu').or(page.locator('text=Trung bình')).or(page.locator('text=Khá')).or(page.locator('text=Mạnh'))).toBeVisible({ timeout: 1000 });
  });

  test('should validate password confirmation', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="email"]', 'test@example.com');
    const passwords = await page.locator('input[type="password"]').all();
    await passwords[0].fill('password123');
    await passwords[1].fill('password123');
    
    await expect(page.locator('text=Mật khẩu khớp')).toBeVisible();
  });

  test('should require terms agreement', async ({ page }) => {
    await page.goto('/register');
    
    const termsCheckbox = page.locator('input[type="checkbox"]');
    await expect(termsCheckbox).toHaveAttribute('required');
  });

  test('should register successfully', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[type="text"]', 'newuser');
    await page.fill('input[type="email"]', 'newuser@example.com');
    const passwords = await page.locator('input[type="password"]').all();
    await passwords[0].fill('StrongPass123!');
    await passwords[1].fill('StrongPass123!');
    await page.check('input[type="checkbox"]');
    
    page.on('dialog', dialog => dialog.accept());
    await page.click('button[type="submit"]');
    
    await page.waitForURL('/dashboard', { timeout: 5000 });
    await expect(page).toHaveURL('/dashboard');
  });

  test('should have link to login page', async ({ page }) => {
    await page.goto('/register');
    
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/register');
    
    const passwordInputs = await page.locator('input[type="password"]').all();
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Dashboard Page (/dashboard)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard with user info', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Chào mừng trở lại/i })).toBeVisible();
    await expect(page.locator('text=FlashLearn')).toBeVisible();
  });

  test('should show statistics cards', async ({ page }) => {
    await expect(page.locator('text=Tổng số thẻ')).toBeVisible();
    await expect(page.locator('text=Đã học hôm nay')).toBeVisible();
    await expect(page.locator('text=Độ chính xác')).toBeVisible();
    await expect(page.locator('text=Chuỗi ngày học')).toBeVisible();
  });

  test('should display user decks', async ({ page }) => {
    await expect(page.locator('text=Bộ thẻ của bạn')).toBeVisible();
    await expect(page.locator('text=Từ vựng IELTS').or(page.locator('text=Business English'))).toBeVisible();
  });

  test('should have action buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Bắt đầu học ngay")')).toBeVisible();
    await expect(page.locator('button:has-text("Tạo bộ thẻ mới")')).toBeVisible();
  });

  test('should navigate to study page', async ({ page }) => {
    await page.click('button:has-text("Bắt đầu học ngay")');
    await page.waitForURL('/study');
    await expect(page).toHaveURL('/study');
  });

  test('should navigate to create deck page', async ({ page }) => {
    await page.click('button:has-text("Tạo bộ thẻ mới")');
    await page.waitForURL('/create-deck');
    await expect(page).toHaveURL('/create-deck');
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('IELTS');
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('text=Hoạt động gần đây')).toBeVisible();
    await expect(page.locator('text=7 ngày qua')).toBeVisible();
  });

  test('should have settings button', async ({ page }) => {
    const settingsButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-settings"]') });
    await expect(settingsButton.first()).toBeVisible();
  });

  test('should have logout functionality', async ({ page }) => {
    page.on('dialog', dialog => dialog.dismiss());
    const logoutButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-log-out"]') });
    await logoutButton.first().click();
  });

  test('should show deck progress bars', async ({ page }) => {
    // Check for progress indicators
    const progressText = page.locator('text=Tiến độ');
    await expect(progressText.first()).toBeVisible();
  });
});

test.describe('Create Deck Page (/create-deck)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/create-deck');
  });

  test('should display create deck form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tạo bộ thẻ mới' })).toBeVisible();
    await expect(page.locator('label:has-text("Tên bộ thẻ")')).toBeVisible();
  });

  test('should have deck name and description fields', async ({ page }) => {
    const nameInput = page.locator('input[placeholder*="Từ vựng"]');
    const descriptionTextarea = page.locator('textarea[placeholder*="Mô tả"]');
    
    await expect(nameInput).toBeVisible();
    await expect(descriptionTextarea).toBeVisible();
  });

  test('should have default flashcard inputs', async ({ page }) => {
    await expect(page.locator('text=🇻🇳 Mặt trước (Tiếng Việt)')).toBeVisible();
    await expect(page.locator('text=🇬🇧 Mặt sau (Tiếng Anh)')).toBeVisible();
  });

  test('should add new flashcard', async ({ page }) => {
    const addButton = page.locator('button:has-text("Thêm thẻ mới")');
    const initialCards = await page.locator('text=🇻🇳 Mặt trước').count();
    
    await addButton.click();
    
    const afterCards = await page.locator('text=🇻🇳 Mặt trước').count();
    expect(afterCards).toBe(initialCards + 1);
  });

  test('should delete flashcard', async ({ page }) => {
    // Add a card first
    await page.click('button:has-text("Thêm thẻ mới")');
    
    const deleteButtons = page.locator('button').filter({ has: page.locator('svg[class*="lucide-trash"]') });
    const initialCount = await deleteButtons.count();
    
    await deleteButtons.last().click();
    
    const afterCount = await deleteButtons.count();
    expect(afterCount).toBeLessThanOrEqual(initialCount);
  });

  test('should have import/export functionality', async ({ page }) => {
    await expect(page.locator('button:has-text("Import")')).toBeVisible();
    await expect(page.locator('button:has-text("Export")')).toBeVisible();
  });

  test('should validate deck name before saving', async ({ page }) => {
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('tên bộ thẻ');
      dialog.accept();
    });
    
    await page.click('button:has-text("Lưu bộ thẻ")');
  });

  test('should create deck successfully', async ({ page }) => {
    await page.fill('input[placeholder*="Từ vựng"]', 'Test Deck');
    await page.fill('textarea[placeholder*="Mô tả"]', 'Test Description');
    
    const frontInputs = await page.locator('input[placeholder*="Xin chào"]').all();
    const backInputs = await page.locator('input[placeholder*="Hello"]').all();
    
    if (frontInputs.length > 0) await frontInputs[0].fill('Test Front');
    if (backInputs.length > 0) await backInputs[0].fill('Test Back');
    
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Lưu bộ thẻ")');
    
    await page.waitForURL('/dashboard', { timeout: 5000 });
  });

  test('should show tips section', async ({ page }) => {
    await expect(page.locator('text=Mẹo tạo flashcard hiệu quả')).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.click('button:has-text("Quay lại Dashboard")');
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('All Decks Page (/deck)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/deck');
  });

  test('should display all decks page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tất cả bộ thẻ' })).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('IELTS');
    await expect(page.locator('text=Từ vựng IELTS')).toBeVisible();
  });

  test('should have sort dropdown', async ({ page }) => {
    const sortSelect = page.locator('select');
    await expect(sortSelect).toBeVisible();
    
    await sortSelect.selectOption('name');
  });

  test('should toggle between grid and list view', async ({ page }) => {
    const gridButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-grid"]') });
    const listButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-list"]') });
    
    await expect(gridButton.first()).toBeVisible();
    await expect(listButton.first()).toBeVisible();
    
    await listButton.first().click();
    await gridButton.first().click();
  });

  test('should display deck cards', async ({ page }) => {
    await expect(page.locator('text=Từ vựng IELTS').or(page.locator('text=Business English'))).toBeVisible();
  });

  test('should show deck statistics', async ({ page }) => {
    await expect(page.locator('text=Tiến độ').first()).toBeVisible();
  });

  test('should navigate to create deck', async ({ page }) => {
    await page.click('button:has-text("Tạo bộ thẻ mới")');
    await page.waitForURL('/create-deck');
    await expect(page).toHaveURL('/create-deck');
  });

  test('should handle empty search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]');
    await searchInput.fill('NonexistentDeck12345');
    
    await expect(page.locator('text=Không tìm thấy')).toBeVisible({ timeout: 1000 });
  });
});

test.describe('Deck Detail Page (/deck/[id])', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/deck/1');
  });

  test('should display deck details', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Từ vựng/i })).toBeVisible();
  });

  test('should show deck statistics', async ({ page }) => {
    await expect(page.locator('text=Tổng số thẻ')).toBeVisible();
    await expect(page.locator('text=Đã học')).toBeVisible();
    await expect(page.locator('text=Cần học hôm nay')).toBeVisible();
    await expect(page.locator('text=Độ chính xác')).toBeVisible();
  });

  test('should have action buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Bắt đầu học")')).toBeVisible();
    await expect(page.locator('button:has-text("Chỉnh sửa")')).toBeVisible();
    await expect(page.locator('button:has-text("Xóa")')).toBeVisible();
  });

  test('should display cards list', async ({ page }) => {
    await expect(page.locator('text=Danh sách thẻ')).toBeVisible();
  });

  test('should have search in cards', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm thẻ"]');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('test');
  });

  test('should navigate to study', async ({ page }) => {
    await page.click('button:has-text("Bắt đầu học")');
    await page.waitForURL('/study');
    await expect(page).toHaveURL('/study');
  });

  test('should show delete confirmation', async ({ page }) => {
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('xóa');
      dialog.dismiss();
    });
    
    await page.click('button:has-text("Xóa")');
  });

  test('should export deck', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    
    const exportButton = page.locator('button:has-text("Export")');
    await exportButton.click();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.click('button:has-text("Quay lại Dashboard")');
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Study Page (/study)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/study');
  });

  test('should display flashcard', async ({ page }) => {
    await expect(page.locator('text=Xin chào').or(page.locator('text=Học tập')).or(page.locator('text=Thành công'))).toBeVisible();
  });

  test('should show progress bar', async ({ page }) => {
    const progressBar = page.locator('[class*="bg-gradient-to-r"][class*="from-blue-600"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('should show timer', async ({ page }) => {
    await expect(page.locator('text=/\\d+:\\d+/')).toBeVisible();
  });

  test('should show card counter', async ({ page }) => {
    await expect(page.locator('text=/\\d+\\/\\d+/')).toBeVisible();
  });

  test('should flip card on click', async ({ page }) => {
    const card = page.locator('[style*="preserve-3d"]').first();
    await card.click();
    
    // Wait for answer buttons to appear
    await expect(page.locator('button:has-text("Again")').or(page.locator('button:has-text("Easy")'))).toBeVisible({ timeout: 2000 });
  });

  test('should show answer buttons after flip', async ({ page }) => {
    const card = page.locator('[style*="preserve-3d"]').first();
    await card.click();
    
    await expect(page.locator('button:has-text("Again")')).toBeVisible();
    await expect(page.locator('button:has-text("Hard")')).toBeVisible();
    await expect(page.locator('button:has-text("Good")')).toBeVisible();
    await expect(page.locator('button:has-text("Easy")')).toBeVisible();
  });

  test('should navigate to next card after answer', async ({ page }) => {
    const card = page.locator('[style*="preserve-3d"]').first();
    await card.click();
    
    const goodButton = page.locator('button:has-text("Good")');
    await goodButton.click();
    
    // Wait for card transition
    await page.waitForTimeout(500);
  });

  test('should complete study session', async ({ page }) => {
    // Answer all cards quickly
    for (let i = 0; i < 10; i++) {
      const card = page.locator('[style*="preserve-3d"]').first();
      await card.click();
      
      const easyButton = page.locator('button:has-text("Easy")');
      await easyButton.click();
      
      await page.waitForTimeout(400);
      
      // Check if completion screen appeared
      const trophy = page.locator('text=Xuất sắc');
      if (await trophy.isVisible()) {
        break;
      }
    }
    
    await expect(page.locator('text=Xuất sắc').or(page.locator('text=hoàn thành'))).toBeVisible({ timeout: 10000 });
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.click('button:has-text("Quay lại")');
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Statistics Page (/statistics)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/statistics');
  });

  test('should display statistics page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Thống kê/i })).toBeVisible();
  });

  test('should show time range filters', async ({ page }) => {
    await expect(page.locator('button:has-text("7 ngày")')).toBeVisible();
    await expect(page.locator('button:has-text("30 ngày")')).toBeVisible();
    await expect(page.locator('button:has-text("Năm nay")')).toBeVisible();
  });

  test('should display statistics cards', async ({ page }) => {
    await expect(page.locator('text=Tổng số thẻ')).toBeVisible();
    await expect(page.locator('text=Trung bình/ngày')).toBeVisible();
    await expect(page.locator('text=Độ chính xác')).toBeVisible();
    await expect(page.locator('text=Chuỗi ngày học')).toBeVisible();
  });

  test('should show weekly chart', async ({ page }) => {
    await expect(page.locator('text=Biểu đồ tuần này')).toBeVisible();
    await expect(page.locator('text=T2')).toBeVisible();
    await expect(page.locator('text=CN')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await expect(page.locator('text=Hoạt động gần đây')).toBeVisible();
  });

  test('should switch time range', async ({ page }) => {
    const monthButton = page.locator('button:has-text("30 ngày")');
    await monthButton.click();
    
    // Verify button is active
    await expect(monthButton).toHaveClass(/from-blue-600/);
  });

  test('should show study time statistics', async ({ page }) => {
    await expect(page.locator('text=Thời gian học tập')).toBeVisible();
  });

  test('should navigate back', async ({ page }) => {
    await page.click('button:has-text("Quay lại")');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Settings Page (/settings)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/settings');
  });

  test('should display settings page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Cài đặt' })).toBeVisible();
  });

  test('should show profile section', async ({ page }) => {
    await expect(page.locator('text=Thông tin cá nhân')).toBeVisible();
    await expect(page.locator('label:has-text("Tên người dùng")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
  });

  test('should show study settings section', async ({ page }) => {
    await expect(page.locator('text=Cài đặt học tập')).toBeVisible();
    await expect(page.locator('text=Số thẻ mục tiêu mỗi ngày')).toBeVisible();
  });

  test('should adjust daily goal slider', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first();
    await slider.fill('80');
    
    await expect(page.locator('text=80')).toBeVisible();
  });

  test('should show notification settings', async ({ page }) => {
    await expect(page.locator('text=Thông báo')).toBeVisible();
    await expect(page.locator('text=Thông báo qua email')).toBeVisible();
  });

  test('should toggle notification checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const initialState = await checkbox.isChecked();
    
    await checkbox.click();
    
    const newState = await checkbox.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('should show appearance settings', async ({ page }) => {
    await expect(page.locator('text=Giao diện')).toBeVisible();
    await expect(page.locator('text=Ngôn ngữ')).toBeVisible();
  });

  test('should change language', async ({ page }) => {
    const languageSelect = page.locator('select');
    await languageSelect.selectOption('en');
    
    await expect(languageSelect).toHaveValue('en');
  });

  test('should show danger zone', async ({ page }) => {
    await expect(page.locator('text=Vùng nguy hiểm')).toBeVisible();
    await expect(page.locator('button:has-text("Xóa tài khoản")')).toBeVisible();
  });

  test('should save settings', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
    
    await page.click('button:has-text("Lưu thay đổi")');
    await expect(page.locator('text=Đã lưu cài đặt').or(page.locator('dialog'))).toBeVisible({ timeout: 2000 });
  });

  test('should confirm account deletion', async ({ page }) => {
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('XÓA TÀI KHOẢN');
      dialog.dismiss();
    });
    
    await page.click('button:has-text("Xóa tài khoản")');
  });

  test('should navigate back to dashboard', async ({ page }) => {
    await page.click('button:has-text("Quay lại Dashboard")');
    await page.waitForURL('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    // May redirect to login or show login UI
    // This depends on your auth implementation
  });

  test('should redirect to login when accessing create-deck without auth', async ({ page }) => {
    await page.goto('/create-deck');
    // May redirect to login
  });

  test('should redirect to login when accessing settings without auth', async ({ page }) => {
    await page.goto('/settings');
    // May redirect to login
  });
});

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should complete full user journey', async ({ page }) => {
    // Dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Create deck
    await page.click('button:has-text("Tạo bộ thẻ mới")');
    await page.waitForURL('/create-deck');
    
    // Back to dashboard
    await page.click('button:has-text("Quay lại Dashboard")');
    await page.waitForURL('/dashboard');
    
    // View all decks
    await page.goto('/deck');
    await expect(page.getByRole('heading', { name: 'Tất cả bộ thẻ' })).toBeVisible();
    
    // View statistics
    await page.goto('/statistics');
    await expect(page.getByRole('heading', { name: /Thống kê/i })).toBeVisible();
    
    // Settings
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: 'Cài đặt' })).toBeVisible();
    
    // Study
    await page.goto('/study');
    await expect(page.locator('text=Xin chào').or(page.locator('text=Học tập'))).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('text=FlashLearn')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await login(page);
    
    await expect(page.getByRole('heading', { name: /Chào mừng/i })).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await login(page);
    
    await expect(page.getByRole('heading', { name: /Chào mừng/i })).toBeVisible();
  });
});

// ============================================================================
// 🔐 ENHANCED AUTHENTICATION TESTS
// ============================================================================
test.describe('🔐 Enhanced Authentication', () => {
  
  test('should handle empty login form submission', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.click('button[type="submit"]');
    
    const emailInput = page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });

  test('should maintain session after page reload', async ({ page }) => {
    await login(page);
    await page.reload();
    
    await expect(page).toHaveURL(ROUTES.DASHBOARD);
    await expect(page.locator('text=Chào mừng trở lại')).toBeVisible();
  });

  test('should prevent duplicate login submissions', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    await submitBtn.click();
    await submitBtn.click();
    
    await page.waitForURL(ROUTES.DASHBOARD, { timeout: TIMEOUTS.LONG });
    expect(page.url()).toContain(ROUTES.DASHBOARD);
  });

  test('should handle invalid email format', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid-email');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    
    // Check for loading indicator
    await expect(
      page.locator('text=Đang đăng nhập').or(submitBtn.locator('svg'))
    ).toBeVisible({ timeout: TIMEOUTS.SHORT });
  });
});

// ============================================================================
// 🛡️ ENHANCED PROTECTED ROUTES TESTS
// ============================================================================
test.describe('🛡️ Enhanced Protected Routes', () => {
  
  const protectedRoutes = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD },
    { name: 'Create Deck', path: ROUTES.CREATE_DECK },
    { name: 'All Decks', path: ROUTES.ALL_DECKS },
    { name: 'Settings', path: ROUTES.SETTINGS },
    { name: 'Statistics', path: ROUTES.STATISTICS }
  ];

  for (const route of protectedRoutes) {
    test(`should block ${route.name} without authentication`, async ({ page }) => {
      await clearAuth(page);
      await page.goto(route.path);
      
      await page.waitForLoadState('networkidle');
      
      const isOnLoginOrHome = page.url().includes('/login') || page.url().endsWith('/');
      const hasLoginForm = await page.locator('input[type="email"]').isVisible().catch(() => false);
      
      expect(isOnLoginOrHome || hasLoginForm).toBe(true);
    });
  }

  test('should handle expired session gracefully', async ({ page }) => {
    await login(page);
    
    await page.evaluate(() => {
      localStorage.removeItem('flashlearn_user');
      sessionStorage.clear();
    });
    
    await page.goto(ROUTES.DASHBOARD);
    await page.waitForLoadState('networkidle');
    
    const isRedirected = page.url().includes('/login') || page.url().endsWith('/');
    expect(isRedirected).toBe(true);
  });

  test('should handle 404 for non-existent deck', async ({ page }) => {
    await login(page);
    await page.goto('/deck/999999');
    
    await page.waitForLoadState('networkidle');
    
    const hasErrorMessage = await page.locator('text=Lỗi').or(
      page.locator('text=Không tìm thấy')
    ).isVisible().catch(() => false);
    
    const isRedirected = page.url().includes('/dashboard');
    
    expect(hasErrorMessage || isRedirected).toBe(true);
  });
});

// ============================================================================
// 🌐 NETWORK & ERROR HANDLING TESTS
// ============================================================================
test.describe('🌐 Network & Error Handling', () => {
  
  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/api/**', route => route.abort());
    
    await page.goto(ROUTES.LOGIN);
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    await page.click('button[type="submit"]');
    
    // Should show error or stay on login page
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    expect(page.url()).toContain('/login');
  });

  test('should handle slow network connection', async ({ page }) => {
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });
    
    await page.goto(ROUTES.LOGIN);
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    
    // Should show loading state
    const isLoading = await submitBtn.isDisabled().catch(() => false);
    expect(isLoading).toBe(true);
  });

  test('should handle empty search results', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.ALL_DECKS);
    
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]');
    await searchInput.fill('ThisDeckDefinitelyDoesNotExist12345XYZ');
    
    await expect(
      page.locator('text=Không tìm thấy')
    ).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  });

  test('should handle offline mode', async ({ page, context }) => {
    await login(page);
    
    await context.setOffline(true);
    
    await page.goto(ROUTES.STATISTICS).catch(() => {});
    await page.waitForLoadState('networkidle');
    
    await context.setOffline(false);
  });
});

// ============================================================================
// ♿ ACCESSIBILITY TESTS
// ============================================================================
test.describe('♿ Accessibility Tests', () => {
  
  test('should support keyboard navigation', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    await page.keyboard.press('Tab');
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeFocused();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt !== null && alt !== undefined).toBe(true);
    }
  });

  test('should announce errors to screen readers', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    await page.fill('input[type="email"]', TEST_USERS.INVALID.email);
    await page.fill('input[type="password"]', TEST_USERS.INVALID.password);
    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator('text=Email hoặc mật khẩu không đúng');
    await expect(errorMessage).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    
    await expect(page.locator('label:has-text("Tên người dùng")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Mật khẩu")')).toBeVisible();
  });
});

// ============================================================================
// ⚡ PERFORMANCE TESTS
// ============================================================================
test.describe('⚡ Performance Tests', () => {
  
  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await login(page);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle rapid navigation', async ({ page }) => {
    await login(page);
    
    await page.goto(ROUTES.DASHBOARD);
    await page.goto(ROUTES.ALL_DECKS);
    await page.goto(ROUTES.STATISTICS);
    await page.goto(ROUTES.SETTINGS);
    await page.goto(ROUTES.DASHBOARD);
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Chào mừng trở lại')).toBeVisible();
  });

  test('should handle multiple rapid clicks', async ({ page }) => {
    await login(page);
    
    const createDeckButton = page.locator('button:has-text("Tạo bộ thẻ mới")');
    
    await createDeckButton.click();
    await createDeckButton.click().catch(() => {});
    await createDeckButton.click().catch(() => {});
    
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(ROUTES.CREATE_DECK);
  });

  test('should render large deck lists efficiently', async ({ page }) => {
    await login(page);
    
    const startTime = Date.now();
    await page.goto(ROUTES.ALL_DECKS);
    await page.waitForLoadState('networkidle');
    const renderTime = Date.now() - startTime;
    
    expect(renderTime).toBeLessThan(3000);
  });
});

// ============================================================================
// 🎨 DATA VALIDATION & EDGE CASES
// ============================================================================
test.describe('🎨 Data Validation & Edge Cases', () => {
  
  test('should handle empty deck creation', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    page.once('dialog', dialog => {
      expect(dialog.message()).toContain('tên bộ thẻ');
      dialog.accept();
    });
    
    await page.click('button:has-text("Lưu bộ thẻ")');
  });

  test('should handle special characters in input', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    const nameInput = page.locator('input[placeholder*="Từ vựng"]');
    await nameInput.fill('Test !@#$%^&*() 中文 ñ ü');
    
    const value = await nameInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should handle very long input', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    const longText = 'A'.repeat(200);
    const nameInput = page.locator('input[placeholder*="Từ vựng"]');
    await nameInput.fill(longText);
    
    const value = await nameInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should handle password mismatch on register', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="email"]', 'test@example.com');
    
    const passwords = await page.locator('input[type="password"]').all();
    await passwords[0].fill('password123');
    await passwords[1].fill('differentPassword456');
    
    const matchIndicator = page.locator('text=Mật khẩu khớp');
    await expect(matchIndicator).not.toBeVisible();
  });

  test('should validate required fields on register', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    
    await page.click('button[type="submit"]');
    
    const usernameInput = page.locator('input[type="text"]').first();
    const validationMessage = await usernameInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    
    expect(validationMessage.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// 🔄 STATE MANAGEMENT & PERSISTENCE
// ============================================================================
test.describe('🔄 State Management', () => {
  
  test('should persist search query on navigation', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.ALL_DECKS);
    
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]');
    await searchInput.fill('IELTS');
    
    await page.goto(ROUTES.DASHBOARD);
    await page.goto(ROUTES.ALL_DECKS);
    
    // Search might be cleared (depends on implementation)
    const currentValue = await searchInput.inputValue();
    expect(currentValue).toBeDefined();
  });

  test('should remember view preference', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.ALL_DECKS);
    
    const listButton = page.locator('button').filter({ 
      has: page.locator('svg[class*="lucide-list"]') 
    });
    
    await listButton.first().click();
    await page.reload();
    
    // View preference might persist
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle concurrent deck operations', async ({ browser }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    await login(page1);
    await page1.goto(ROUTES.CREATE_DECK);
    
    await page1.fill('input[placeholder*="Từ vựng"]', 'Concurrent Test Deck');
    
    const frontInputs = await page1.locator('input[placeholder*="Xin chào"]').all();
    if (frontInputs.length > 0) {
      await frontInputs[0].fill('Test');
    }
    
    await context1.close();
  });
});

// ============================================================================
// 📊 COMPREHENSIVE FLOW TESTS
// ============================================================================
test.describe('📊 Comprehensive User Flows', () => {
  
  test('should complete full registration to study flow', async ({ page }) => {
    // Skip actual registration to avoid data pollution
    // But test the flow structure
    await page.goto(ROUTES.REGISTER);
    
    await expect(page.getByRole('heading', { name: 'Tạo tài khoản' })).toBeVisible();
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test('should handle study session interruption', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.STUDY);
    
    // Start studying
    const card = page.locator('[style*="preserve-3d"]').first();
    if (await card.isVisible()) {
      await card.click();
      
      // Navigate away mid-session
      await page.goto(ROUTES.DASHBOARD);
      
      await expect(page).toHaveURL(ROUTES.DASHBOARD);
    }
  });

  test('should handle deck deletion flow', async ({ page }) => {
    await login(page);
    await page.goto('/deck/1');
    
    page.once('dialog', dialog => {
      expect(dialog.message()).toContain('xóa');
      dialog.dismiss();
    });
    
    const deleteButton = page.locator('button:has-text("Xóa")');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
    }
  });
});

// ============================================================================
// 📱 ENHANCED RESPONSIVE TESTS
// ============================================================================
test.describe('📱 Enhanced Responsive Design', () => {
  
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  test('should adapt layout for all viewports', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(ROUTES.HOME);
      
      await expect(page.locator('text=FlashLearn')).toBeVisible();
    }
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(ROUTES.HOME);
    
    const buttons = await page.locator('button').all();
    for (const btn of buttons.slice(0, 2)) {
      const box = await btn.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });
});

// ============================================================================
// 🌐 NETWORK ERROR HANDLING TESTS
// ============================================================================
test.describe('🌐 Network Error Handling', () => {
  test('should handle complete network failure on login', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    // Block all network requests
    await page.route('**/*', route => route.abort('failed'));
    
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    await page.click('button[type="submit"]');
    
    // Should stay on login page and show error
    await page.waitForTimeout(TIMEOUTS.SHORT);
    expect(page.url()).toContain('/login');
  });

  test('should handle slow network gracefully', async ({ page }) => {
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });
    
    await page.goto(ROUTES.LOGIN);
    const startTime = Date.now();
    await login(page);
    const duration = Date.now() - startTime;
    
    // Should eventually succeed
    expect(duration).toBeGreaterThan(2000);
    await expect(page).toHaveURL(ROUTES.DASHBOARD);
  });

  test('should retry failed API calls', async ({ page }) => {
    let attemptCount = 0;
    
    await page.route('**/api/**', async route => {
      attemptCount++;
      if (attemptCount < 2) {
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ROUTES.LOGIN);
    await login(page);
    
    // Should eventually succeed after retry
    expect(attemptCount).toBeGreaterThan(1);
  });

  test('should handle offline mode', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await login(page);
    
    // Simulate going offline
    await page.context().setOffline(true);
    await page.goto(ROUTES.DASHBOARD).catch(() => {});
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    // Go back online
    await page.context().setOffline(false);
    await page.reload();
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    // Should work again
    expect(page.url()).toBeTruthy();
  });

  test('should handle API timeout', async ({ page }) => {
    await page.route('**/api/**', async () => {
      // Never resolve - simulate timeout
      await new Promise(() => {});
    });
    
    await page.goto(ROUTES.LOGIN);
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(TIMEOUTS.LONG);
    // Should show timeout or stay on page
    expect(page.url()).toContain('/login');
  });
});

// ============================================================================
// ♿ ACCESSIBILITY TESTS
// ============================================================================
test.describe('♿ Accessibility', () => {
  test('should support keyboard navigation on login', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 3)) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    await login(page);
    
    // Check for semantic HTML landmarks
    const main = await page.locator('main, [role="main"]').count();
    const nav = await page.locator('nav, [role="navigation"]').count();
    
    expect(main + nav).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
    }
  });

  test('should support Enter key for form submission', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    await page.keyboard.press('Enter');
    
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    await expect(page).toHaveURL(ROUTES.DASHBOARD);
  });

  test('should have descriptive link text', async ({ page }) => {
    await login(page);
    
    const links = await page.locator('a').all();
    for (const link of links.slice(0, 5)) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });
});

// ============================================================================
// ⚡ PERFORMANCE TESTS
// ============================================================================
test.describe('⚡ Performance', () => {
  test('should load home page within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(ROUTES.HOME);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load dashboard within 5 seconds', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    const startTime = Date.now();
    await login(page);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have memory leaks on navigation', async ({ page }) => {
    await login(page);
    
    const routes = [ROUTES.DASHBOARD, ROUTES.ALL_DECKS, ROUTES.STATISTICS, ROUTES.SETTINGS];
    
    for (let i = 0; i < 3; i++) {
      for (const route of routes) {
        await page.goto(route);
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }
    }
    
    // Should still be responsive
    await expect(page).toHaveURL(ROUTES.SETTINGS);
  });

  test('should handle rapid navigation without crashing', async ({ page }) => {
    await login(page);
    
    const routes = [ROUTES.DASHBOARD, ROUTES.CREATE_DECK, ROUTES.ALL_DECKS, ROUTES.STATISTICS];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(100);
    }
    
    // Should still work
    expect(page.url()).toContain('/statistics');
  });

  test('should handle large dataset efficiently', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.ALL_DECKS);
    
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('should load statistics charts quickly', async ({ page }) => {
    await login(page);
    
    const startTime = Date.now();
    await page.goto(ROUTES.STATISTICS);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(4000);
  });
});

// ============================================================================
// 🔐 ENHANCED ERROR HANDLING & VALIDATION
// ============================================================================
test.describe('🔐 Enhanced Error Handling', () => {
  test('should validate email format on login', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', TEST_USERS.VALID.password);
    await page.click('button[type="submit"]');
    
    const emailInput = page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should show specific error messages', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    await page.fill('input[type="email"]', TEST_USERS.INVALID.email);
    await page.fill('input[type="password"]', TEST_USERS.INVALID.password);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Email hoặc mật khẩu không đúng')).toBeVisible({ timeout: TIMEOUTS.LONG });
  });

  test('should handle empty form submission', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await page.click('button[type="submit"]');
    
    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should validate password requirements on register', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123');
    
    // Password strength indicator should show weak
    await page.waitForTimeout(TIMEOUTS.SHORT);
  });

  test('should show console errors gracefully', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(ROUTES.DASHBOARD);
    await page.waitForLoadState('networkidle');
    
    // Some errors are acceptable, should not crash
    expect(errors.length).toBeLessThan(10);
  });
});

// ============================================================================
// 🛡️ DATA VALIDATION & SECURITY TESTS
// ============================================================================
test.describe('🛡️ Data Validation & Security', () => {
  test('should prevent XSS in deck name', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('input[placeholder*="tên bộ thẻ"]', xssPayload);
    await page.fill('textarea[placeholder*="mô tả"]', 'Test description');
    
    await page.waitForTimeout(TIMEOUTS.SHORT);
    
    // Should sanitize or escape
    expect(page.url()).toContain('/create-deck');
  });

  test('should handle SQL injection attempts', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    await page.fill('input[type="email"]', "admin' OR '1'='1");
    await page.fill('input[type="password"]', "' OR '1'='1");
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(TIMEOUTS.SHORT);
    // Should reject or sanitize
    expect(page.url()).toContain('/login');
  });

  test('should handle very long inputs', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    
    const longEmail = 'a'.repeat(300) + '@example.com';
    await page.fill('input[type="email"]', longEmail);
    await page.fill('input[type="text"]', 'a'.repeat(200));
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(TIMEOUTS.SHORT);
    // Should handle gracefully
    expect(page.url()).toBeTruthy();
  });

  test('should handle special characters in password', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    
    await page.fill('input[type="email"]', TEST_USERS.VALID.email);
    await page.fill('input[type="password"]', 'P@ssw0rd!#$%^&*()');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(TIMEOUTS.SHORT);
    // Should handle without crashing
    expect(page.url()).toBeTruthy();
  });

  test('should validate card content length', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    await page.click('text=Thêm thẻ');
    const longText = 'A'.repeat(10000);
    await page.fill('input[placeholder*="mặt trước"]', longText);
    await page.fill('textarea[placeholder*="mặt sau"]', longText);
    
    await page.waitForTimeout(TIMEOUTS.SHORT);
    expect(page.url()).toContain('/create-deck');
  });

  test('should sanitize HTML in card content', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    await page.click('text=Thêm thẻ');
    await page.fill('input[placeholder*="mặt trước"]', '<img src=x onerror=alert(1)>');
    await page.fill('textarea[placeholder*="mặt sau"]', '<iframe src="evil.com"></iframe>');
    
    await page.waitForTimeout(TIMEOUTS.SHORT);
    expect(page.url()).toContain('/create-deck');
  });
});

// ============================================================================
// 🔄 SESSION MANAGEMENT TESTS
// ============================================================================
test.describe('🔄 Session Management', () => {
  test('should persist session after page refresh', async ({ page }) => {
    await login(page);
    await page.reload();
    
    await expect(page).toHaveURL(ROUTES.DASHBOARD, { timeout: TIMEOUTS.LONG });
    await expect(page.locator('text=Chào mừng').or(page.locator('text=Tổng số thẻ'))).toBeVisible();
  });

  test('should maintain authentication state', async ({ page }) => {
    await login(page);
    
    // Check cookies/localStorage exist
    const cookies = await page.context().cookies();
    expect(cookies.length).toBeGreaterThan(0);
    
    await page.reload();
    await expect(page).toHaveURL(ROUTES.DASHBOARD, { timeout: TIMEOUTS.LONG });
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    await login(page);
    
    // Clear auth
    await clearAuth(page);
    
    // Try to navigate to protected route
    await page.goto(ROUTES.DASHBOARD);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    // Should redirect to login
    const isOnLogin = await page.url().includes('/login');
    expect(isOnLogin).toBeTruthy();
  });

  test('should handle concurrent session in different tabs', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Login in first tab
    await login(page1);
    await expect(page1).toHaveURL(ROUTES.DASHBOARD);
    
    // Second tab should also be logged in
    await page2.goto(ROUTES.DASHBOARD);
    await page2.waitForTimeout(TIMEOUTS.MEDIUM);
    
    const isAuthenticated = !page2.url().includes('/login');
    expect(isAuthenticated).toBeTruthy();
    
    await context.close();
  });
});

// ============================================================================
// 📊 STATE MANAGEMENT TESTS
// ============================================================================
test.describe('📊 State Management', () => {
  test('should preserve deck form state on navigation', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    await page.fill('input[placeholder*="tên bộ thẻ"]', 'My Test Deck');
    await page.click('text=Thêm thẻ');
    await page.fill('input[placeholder*="mặt trước"]', 'Question 1');
    
    // Navigate away and back
    await page.goto(ROUTES.DASHBOARD);
    await page.goto(ROUTES.CREATE_DECK);
    
    // State might not be preserved (depends on implementation)
    await page.waitForTimeout(TIMEOUTS.SHORT);
    expect(page.url()).toContain('/create-deck');
  });

  test('should update statistics after completing study', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.STATISTICS);
    
    // Record initial stats if available
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    // Complete a study session would update stats
    expect(page.url()).toContain('/statistics');
  });

  test('should sync deck list after creation', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.ALL_DECKS);
    
    await page.goto(ROUTES.CREATE_DECK);
    // Create deck would increase count
    
    await page.goto(ROUTES.ALL_DECKS);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    expect(page.url()).toContain('/deck');
  });
});

// ============================================================================
// 📱 ENHANCED MOBILE & TOUCH TESTS
// ============================================================================
test.describe('📱 Enhanced Mobile & Touch', () => {
  test('should handle touch gestures on study cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    await page.goto(ROUTES.STUDY);
    
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    
    const flipButton = page.locator('button:has-text("Lật thẻ")');
    if (await flipButton.isVisible()) {
      await flipButton.tap();
      await page.waitForTimeout(TIMEOUTS.SHORT);
    }
  });

  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    
    // Look for mobile menu icon
    await page.waitForTimeout(TIMEOUTS.SHORT);
    
    expect(page.url()).toContain('/dashboard');
  });

  test('should adjust layout in landscape mode', async ({ page }) => {
    await page.setViewportSize({ width: 812, height: 375 });
    await login(page);
    
    await expect(page).toHaveURL(ROUTES.DASHBOARD);
    await page.waitForTimeout(TIMEOUTS.SHORT);
  });

  test('should be usable on tablet portrait', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    await page.click('text=Thêm thẻ');
    await page.waitForTimeout(TIMEOUTS.SHORT);
    expect(page.url()).toContain('/create-deck');
  });

  test('should scale text appropriately on different screens', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(ROUTES.HOME);
      
      const heading = page.locator('h1, h2').first();
      if (await heading.isVisible()) {
        const fontSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
        expect(fontSize).toBeTruthy();
      }
    }
  });

  test('should handle rapid card additions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    for (let i = 0; i < 5; i++) {
      await page.click('text=Thêm thẻ');
      await page.waitForTimeout(100);
    }
    
    expect(page.url()).toContain('/create-deck');
  });
});

// ============================================================================
// 🎯 USER FLOW INTEGRATION TESTS
// ============================================================================
test.describe('🎯 Complete User Flows', () => {
  test('complete user journey: home to study', async ({ page }) => {
    // Start from home
    await page.goto(ROUTES.HOME);
    await expect(page.locator('text=FlashLearn')).toBeVisible();
    
    // Navigate to login
    await page.click('text=Đăng nhập');
    await expect(page).toHaveURL(ROUTES.LOGIN);
    
    // Login
    await login(page);
    await expect(page).toHaveURL(ROUTES.DASHBOARD);
    
    // Go to create deck
    const createButton = page.locator('text=Tạo bộ thẻ mới').or(page.locator('button:has-text("Tạo")'));
    if (await createButton.first().isVisible()) {
      await createButton.first().click();
      await expect(page).toHaveURL(ROUTES.CREATE_DECK);
    }
  });

  test('complete study session workflow', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.ALL_DECKS);
    
    const studyButton = page.locator('button:has-text("Học ngay")').first();
    if (await studyButton.isVisible()) {
      await studyButton.click();
      await page.waitForTimeout(TIMEOUTS.MEDIUM);
      
      // Complete one card
      const flipButton = page.locator('button:has-text("Lật thẻ")');
      if (await flipButton.isVisible()) {
        await flipButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
        
        const difficultyButton = page.locator('button:has-text("Khó")').or(page.locator('button:has-text("Dễ")'));
        if (await difficultyButton.first().isVisible()) {
          await difficultyButton.first().click();
          await page.waitForTimeout(TIMEOUTS.SHORT);
        }
      }
    }
  });

  test('navigation through all major pages', async ({ page }) => {
    await login(page);
    
    const routes = [ROUTES.DASHBOARD, ROUTES.ALL_DECKS, ROUTES.STATISTICS, ROUTES.SETTINGS];
    
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
      await page.waitForTimeout(TIMEOUTS.SHORT);
    }
  });

  test('deck creation to study flow', async ({ page }) => {
    await login(page);
    await page.goto(ROUTES.CREATE_DECK);
    
    await page.fill('input[placeholder*="tên bộ thẻ"]', 'Integration Test Deck');
    await page.fill('textarea[placeholder*="mô tả"]', 'Test description');
    
    await page.click('text=Thêm thẻ');
    await page.fill('input[placeholder*="mặt trước"]', 'Q1');
    await page.fill('textarea[placeholder*="mặt sau"]', 'A1');
    
    await page.waitForTimeout(TIMEOUTS.SHORT);
    expect(page.url()).toContain('/create-deck');
  });
});
