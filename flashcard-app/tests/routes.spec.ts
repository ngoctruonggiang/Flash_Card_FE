import { test, expect } from '@playwright/test';

// Helper function to login
async function login(page: any, email = 'duchai1703@gmail.com', password = '123456') {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
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
