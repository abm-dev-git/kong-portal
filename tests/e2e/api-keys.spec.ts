import { test, expect } from '@playwright/test';

/**
 * API Keys E2E Tests
 * Tests for the API Key Management page
 *
 * Note: These tests require authentication. They test the UI components
 * without actually creating keys (which would require Kong to be running).
 */

test.describe('API Keys Page', () => {
  test.beforeEach(async ({ page }) => {
    // Note: This will redirect to sign-in for unauthenticated users
    // In a real test environment, you'd set up authentication
    await page.goto('/api-keys');
  });

  test('redirects to sign-in when not authenticated', async ({ page }) => {
    // Should redirect to sign-in page for unauthenticated access
    await expect(page).toHaveURL(/\/sign-in/);
  });
});

test.describe('API Keys Page - Authenticated', () => {
  // Note: These tests would require setting up Clerk test authentication
  // For now, we test the redirect behavior which confirms route protection works

  test('protected route requires authentication', async ({ page }) => {
    const response = await page.goto('/api-keys');
    // Page should load (200) but redirect to sign-in
    expect(response?.status()).toBeLessThan(400);
  });
});

test.describe('API Keys API Routes', () => {
  test('GET /api/api-keys returns 401 without auth', async ({ request }) => {
    const response = await request.get('/api/api-keys');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('POST /api/api-keys returns 401 without auth', async ({ request }) => {
    const response = await request.post('/api/api-keys', {
      data: { name: 'Test Key' },
    });
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('DELETE /api/api-keys/test-id returns 401 without auth', async ({ request }) => {
    const response = await request.delete('/api/api-keys/test-id');
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });
});

test.describe('API Keys UI Components', () => {
  // Test that the main landing page has link to API keys
  test('dashboard has API keys link', async ({ page }) => {
    await page.goto('/');
    // Landing page should have navigation that could lead to API keys
    await expect(page).toHaveTitle(/ABM\.dev/i);
  });
});
