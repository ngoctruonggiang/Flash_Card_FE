import path from "path";

// Unique test credentials - hard to match randomly
export const TEST_USER = {
  username: "testuser_e2e_x7k9m2",
  email: "testuser_e2e_x7k9m2@flashlearn-test.local",
  password: "TestP@ss#2024$Secure!",
  confirmPassword: "TestP@ss#2024$Secure!",
};

export const AUTH_FILE = path.join(__dirname, ".auth", "user.json");

/**
 * This file exports test credentials and auth helpers.
 * The actual authentication is handled in individual tests or fixtures.ts.
 */
