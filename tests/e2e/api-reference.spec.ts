import { test, expect } from '@playwright/test';

/**
 * API Reference E2E Tests
 * Tests for the Stoplight Elements API documentation page (iframe-based)
 */

test.describe('API Reference', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api-reference');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the API reference page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/API Reference/i);

    // Check for the page heading
    const heading = page.getByRole('heading', { name: /API Reference/i });
    await expect(heading).toBeVisible();
  });

  test('should display auth status banner', async ({ page }) => {
    // Should show sign-in prompt for unauthenticated users
    const authBanner = page.locator('text=Sign in to use Try It console');
    await expect(authBanner).toBeVisible();
  });

  test('should load Stoplight Elements iframe', async ({ page }) => {
    // Wait for iframe to load
    await page.waitForTimeout(2000);

    // Check for the stoplight container with iframe
    const stoplightContainer = page.locator('.stoplight-container');
    await expect(stoplightContainer).toBeVisible();

    // Check that iframe exists and has loaded
    const iframe = page.locator('.stoplight-container iframe');
    await expect(iframe).toBeVisible();
  });

  test('should load API docs in iframe', async ({ page }) => {
    // Wait for iframe to fully render
    await page.waitForTimeout(3000);

    // Get the iframe
    const iframe = page.frameLocator('.stoplight-container iframe');

    // Wait for Stoplight Elements web component to load
    // The elements-api tag should be present
    const elementsApi = iframe.locator('elements-api');
    await expect(elementsApi).toBeVisible({ timeout: 10000 });
  });

  test('/docs should redirect to /api-reference', async ({ page }) => {
    await page.goto('/docs');
    // Should redirect to /api-reference
    await expect(page).toHaveURL(/\/api-reference/);
  });

  test('capture API reference screenshot', async ({ page }) => {
    // Wait for Stoplight Elements to fully load in iframe
    await page.waitForTimeout(5000);

    await page.screenshot({
      path: 'test-artifacts/screenshots/api-reference.png',
      fullPage: true,
    });
  });
});
