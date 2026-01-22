import { test, expect } from '@playwright/test';

/**
 * API Reference E2E Tests
 * Tests for the custom API documentation pages
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

  test('should display base URL section', async ({ page }) => {
    // Should show the base URL
    const baseUrl = page.locator('text=https://api.abm.dev');
    await expect(baseUrl).toBeVisible();
  });

  test('should display authentication section', async ({ page }) => {
    // Should show authentication heading
    const authSection = page.getByRole('heading', { name: 'Authentication' });
    await expect(authSection).toBeVisible();

    // Should show X-API-Key header example
    const apiKeyHeader = page.getByText('X-API-Key', { exact: true });
    await expect(apiKeyHeader).toBeVisible();
  });

  test('should display API category cards', async ({ page }) => {
    // Check for main API category cards
    const enrichmentCard = page.locator('text=Enrichment').first();
    await expect(enrichmentCard).toBeVisible();

    const jobsCard = page.locator('text=Jobs').first();
    await expect(jobsCard).toBeVisible();

    const integrationsCard = page.locator('text=CRM Integrations').first();
    await expect(integrationsCard).toBeVisible();

    const linkedinCard = page.locator('text=LinkedIn Connection').first();
    await expect(linkedinCard).toBeVisible();

    const configCard = page.locator('text=Configuration').first();
    await expect(configCard).toBeVisible();
  });

  test('should navigate to enrichment API page', async ({ page }) => {
    // Click on enrichment card
    await page.click('a[href="/api-reference/enrichment"]');

    // Should navigate to enrichment page
    await expect(page).toHaveURL(/\/api-reference\/enrichment/);

    // Should show enrichment API content
    const heading = page.getByRole('heading', { name: /Enrichment/i });
    await expect(heading).toBeVisible();
  });

  test('should display rate limits section', async ({ page }) => {
    // Should show rate limit information
    const rateLimits = page.locator('text=Rate Limits');
    await expect(rateLimits).toBeVisible();
  });

  test('capture API reference screenshot', async ({ page }) => {
    await page.screenshot({
      path: 'test-artifacts/screenshots/api-reference.png',
      fullPage: true,
    });
  });
});

test.describe('Docs Page', () => {
  test('should load the docs page', async ({ page }) => {
    await page.goto('/docs');
    await page.waitForLoadState('networkidle');

    // Check page title
    await expect(page).toHaveTitle(/Documentation/i);

    // Check for the page heading
    const heading = page.getByRole('heading', { name: /Documentation/i });
    await expect(heading).toBeVisible();
  });

  test('should display getting started section', async ({ page }) => {
    await page.goto('/docs');

    // Should show Getting Started card
    const gettingStarted = page.locator('text=Getting Started').first();
    await expect(gettingStarted).toBeVisible();
  });

  test('should have link to API reference', async ({ page }) => {
    await page.goto('/docs');

    // Should have an API Reference link
    const apiRefLink = page.locator('a[href="/api-reference"]').first();
    await expect(apiRefLink).toBeVisible();
  });
});
