import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /register/i })).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/^password$/i).click();

    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('should show validation errors for weak password', async ({ page }) => {
    await page.getByLabel(/^password$/i).fill('weak');
    await page.getByLabel(/confirm password/i).click();

    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.getByLabel(/^password$/i).fill('StrongPassword123!');
    await page.getByLabel(/confirm password/i).fill('DifferentPassword123!');
    await page.getByRole('button', { name: /register/i }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/^password$/i).fill('StrongPassword123!');
    await page.getByLabel(/confirm password/i).fill('StrongPassword123!');
    await page.getByRole('button', { name: /register/i }).click();

    // Should show success message or redirect
    await expect(
      page.getByText(/registration successful/i).or(page.getByText(/account.*created/i)),
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show error for duplicate email', async ({ page }) => {
    // First, register a user
    const email = `duplicate-${Date.now()}@example.com`;

    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password$/i).fill('StrongPassword123!');
    await page.getByLabel(/confirm password/i).fill('StrongPassword123!');
    await page.getByRole('button', { name: /register/i }).click();

    // Wait for success
    await expect(page.getByText(/registration successful/i)).toBeVisible({
      timeout: 10000,
    });

    // Navigate back to register
    await page.goto('/register');

    // Try to register with same email
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password$/i).fill('StrongPassword123!');
    await page.getByLabel(/confirm password/i).fill('StrongPassword123!');
    await page.getByRole('button', { name: /register/i }).click();

    // Should show error
    await expect(page.getByText(/already exists/i)).toBeVisible({ timeout: 10000 });
  });

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /login/i });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/login');
  });
});
