import { test, expect } from '@playwright/test';

test.describe('Guest Join Flow', () => {
  const validMeetingId = '550e8400-e29b-41d4-a716-446655440000';

  test('should display guest join page', async ({ page }) => {
    await page.goto(`/join/${validMeetingId}`);

    await expect(page.getByRole('heading', { name: /join meeting/i })).toBeVisible();
    await expect(page.getByText(/joining as a guest/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /join as guest/i })).toBeVisible();
  });

  test('should display meeting ID on page', async ({ page }) => {
    await page.goto(`/join/${validMeetingId}`);

    await expect(page.getByText(validMeetingId)).toBeVisible();
  });

  test('should successfully join as guest', async ({ page }) => {
    await page.goto(`/join/${validMeetingId}`);

    await page.getByRole('button', { name: /join as guest/i }).click();

    await expect(page.getByText(/successfully joined/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test('should have links to register and login', async ({ page }) => {
    await page.goto(`/join/${validMeetingId}`);

    const registerLink = page.getByRole('link', { name: /create an account/i });
    const loginLink = page.getByRole('link', { name: /login/i });

    await expect(registerLink).toBeVisible();
    await expect(loginLink).toBeVisible();
    await expect(registerLink).toHaveAttribute('href', '/register');
    await expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('should work with invite code in URL', async ({ page }) => {
    await page.goto(`/join/${validMeetingId}?code=MEETRA-CODE`);

    await page.getByRole('button', { name: /join as guest/i }).click();

    await expect(page.getByText(/successfully joined/i)).toBeVisible({
      timeout: 10000,
    });
  });
});
