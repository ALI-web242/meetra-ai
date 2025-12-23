import { test, expect } from '@playwright/test';

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const API_URL = process.env.API_URL || 'http://localhost:3000';

test.describe('Meeting Creation & Joining', () => {
  let authToken: string;
  let testUserEmail: string;

  test.beforeAll(async ({ request }) => {
    // Register a test user
    testUserEmail = `test-e2e-${Date.now()}@example.com`;

    const registerResponse = await request.post(`${API_URL}/api/v1/auth/register`, {
      data: {
        email: testUserEmail,
        password: 'TestPassword123!',
      },
    });

    if (registerResponse.ok()) {
      const data = await registerResponse.json();
      authToken = data.accessToken;
    }
  });

  test.describe('Home Page', () => {
    test('should display create meeting and join meeting options', async ({ page }) => {
      await page.goto(BASE_URL);

      // Check for Create Meeting section
      await expect(page.getByRole('heading', { name: /create meeting/i })).toBeVisible();

      // Check for Join Meeting section
      await expect(page.getByRole('heading', { name: /join meeting/i })).toBeVisible();

      // Check for meeting ID input
      await expect(page.getByPlaceholder(/xxx-xxx-xxx/i)).toBeVisible();
    });

    test('should have join meeting button disabled when no ID entered', async ({ page }) => {
      await page.goto(BASE_URL);

      const joinButton = page.getByRole('button', { name: /join meeting/i });
      await expect(joinButton).toBeDisabled();
    });

    test('should enable join button when meeting ID is entered', async ({ page }) => {
      await page.goto(BASE_URL);

      const input = page.getByPlaceholder(/xxx-xxx-xxx/i);
      await input.fill('ABC-DEF-GHI');

      const joinButton = page.getByRole('button', { name: /join meeting/i });
      await expect(joinButton).toBeEnabled();
    });
  });

  test.describe('Create Meeting Flow', () => {
    test('should require authentication to create meeting', async ({ page }) => {
      await page.goto(BASE_URL);

      // Clear any existing auth
      await page.evaluate(() => {
        localStorage.clear();
      });

      await page.reload();

      // Should see "Sign In to Create" instead of "New Meeting"
      await expect(page.getByRole('link', { name: /sign in to create/i })).toBeVisible();
    });

    test('should open create meeting modal when authenticated', async ({ page }) => {
      await page.goto(BASE_URL);

      // Set auth token
      await page.evaluate((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString());
      }, authToken);

      await page.reload();

      // Click new meeting button
      await page.getByRole('button', { name: /new meeting/i }).click();

      // Modal should appear
      await expect(page.getByRole('heading', { name: /create meeting/i })).toBeVisible();

      // Should have name input
      await expect(page.getByLabel(/meeting name/i)).toBeVisible();

      // Should have password toggle
      await expect(page.getByText(/password protect/i)).toBeVisible();
    });

    test('should create meeting and show share link', async ({ page }) => {
      await page.goto(BASE_URL);

      // Set auth token
      await page.evaluate((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString());
      }, authToken);

      await page.reload();

      // Open modal
      await page.getByRole('button', { name: /new meeting/i }).click();

      // Fill meeting name
      await page.getByLabel(/meeting name/i).fill('E2E Test Meeting');

      // Create meeting
      await page.getByRole('button', { name: /create meeting/i }).click();

      // Should show success with meeting link
      await expect(page.getByText(/meeting created/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/meeting id/i)).toBeVisible();
    });
  });

  test.describe('Join Meeting Flow', () => {
    let meetingId: string;

    test.beforeAll(async ({ request }) => {
      // Create a meeting to join
      const response = await request.post(`${API_URL}/api/meetings`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          name: 'E2E Join Test Meeting',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        meetingId = data.meetingId;
      }
    });

    test('should navigate to meeting room page', async ({ page }) => {
      await page.goto(BASE_URL);

      // Enter meeting ID
      const input = page.getByPlaceholder(/xxx-xxx-xxx/i);
      await input.fill(meetingId);

      // Click join
      await page.getByRole('button', { name: /join meeting/i }).click();

      // Should navigate to meeting page
      await expect(page).toHaveURL(new RegExp(`/m/${meetingId}`));
    });

    test('should show meeting info on room page', async ({ page }) => {
      await page.goto(`${BASE_URL}/m/${meetingId}`);

      // Should show meeting name
      await expect(page.getByText(/e2e join test meeting/i)).toBeVisible({ timeout: 10000 });

      // Should show meeting ID
      await expect(page.getByText(meetingId)).toBeVisible();
    });

    test('should require authentication to join', async ({ page }) => {
      await page.goto(`${BASE_URL}/m/${meetingId}`);

      // Clear auth
      await page.evaluate(() => {
        localStorage.clear();
      });

      await page.reload();

      // Should show sign in prompt
      await expect(page.getByText(/sign in to join/i)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Password Protected Meeting', () => {
    let protectedMeetingId: string;

    test.beforeAll(async ({ request }) => {
      // Create a password-protected meeting
      const response = await request.post(`${API_URL}/api/meetings`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          name: 'Protected E2E Meeting',
          password: 'secretpass',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        protectedMeetingId = data.meetingId;
      }
    });

    test('should show password input for protected meeting', async ({ page }) => {
      await page.goto(`${BASE_URL}/m/${protectedMeetingId}`);

      // Set auth
      await page.evaluate((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString());
      }, authToken);

      await page.reload();

      // Should show password indicator
      await expect(page.getByText(/password protected/i)).toBeVisible({ timeout: 10000 });

      // Should have password input
      await expect(page.getByLabel(/meeting password/i)).toBeVisible();
    });
  });

  test.describe('Meeting Room Controls', () => {
    let meetingId: string;

    test.beforeAll(async ({ request }) => {
      // Create a meeting
      const response = await request.post(`${API_URL}/api/meetings`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          name: 'Controls Test Meeting',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        meetingId = data.meetingId;
      }
    });

    test('should show start button for host', async ({ page }) => {
      await page.goto(`${BASE_URL}/m/${meetingId}`);

      // Set auth
      await page.evaluate((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString());
      }, authToken);

      await page.reload();

      // Join meeting
      await page.getByRole('button', { name: /join meeting/i }).click();

      // Should show start meeting button (for host)
      await expect(page.getByRole('button', { name: /start meeting/i })).toBeVisible({ timeout: 10000 });
    });

    test('should show leave button', async ({ page }) => {
      await page.goto(`${BASE_URL}/m/${meetingId}`);

      // Set auth
      await page.evaluate((token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('tokenExpiry', (Date.now() + 3600000).toString());
      }, authToken);

      await page.reload();

      // Join meeting
      await page.getByRole('button', { name: /join meeting/i }).click();

      // Should show leave button
      await expect(page.getByRole('button', { name: /leave/i })).toBeVisible({ timeout: 10000 });
    });
  });
});
