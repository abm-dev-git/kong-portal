import { test, expect } from '@playwright/test';

/**
 * Landing Page E2E Tests
 * Visual and functional testing for the landing page
 */

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load the landing page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Kong Portal|ABM/i);

    // Check that main content is visible
    await expect(page.locator('main#main-content')).toBeVisible();
  });

  test('should display hero section with background image', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Check for hero heading
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toContainText(/decision|intelligence|personalization|accounts/i);
  });

  test('should display navigation with logo and links', async ({ page }) => {
    const nav = page.locator('header');
    await expect(nav).toBeVisible();

    // Check for logo (first matching link)
    const logo = page.getByRole('link', { name: 'ABM.dev home' });
    await expect(logo).toBeVisible();

    // Check for sign in button
    const signInBtn = page.getByRole('button', { name: /sign in/i });
    await expect(signInBtn).toBeVisible();
  });

  test('should display QuickStart section', async ({ page }) => {
    // QuickStart has the "Start in 3 minutes" badge
    const quickStartSection = page.locator('text=Start in 3 minutes');
    await expect(quickStartSection).toBeVisible();

    // Check for code example tabs
    const curlTab = page.getByRole('tab', { name: /curl/i });
    await expect(curlTab).toBeVisible();
  });

  test('should display all landing page sections', async ({ page }) => {
    // Check for key sections by their unique content
    const sections = [
      'Get started with one API call', // QuickStart
      'Enrichment that', // EnrichmentFeature context
      'abm.dev', // EnrichmentAgents quote or branding
      'Pricing', // PricingTeaser
    ];

    for (const text of sections) {
      const element = page.locator(`text=${text}`).first();
      await expect(element).toBeVisible({ timeout: 10000 });
    }
  });

  test('should have accessible skip link', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    // Skip link exists and has sr-only class (screen reader only by default)
    await expect(skipLink).toHaveClass(/sr-only/);
    // The focus:not-sr-only class makes it visible on focus via CSS, but the class remains
    await expect(skipLink).toBeAttached();
  });

  test('should have no critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical errors (Clerk, favicon, Next.js dev warnings, WebSocket HMR)
    const criticalErrors = errors.filter(
      err => !err.includes('favicon') &&
             !err.includes('clerk') &&
             !err.includes('Clerk') &&
             !err.includes('allowedDevOrigins') &&
             !err.includes('Cross origin') &&
             !err.includes('WebSocket') &&
             !err.includes('webpack-hmr')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test.describe('Visual Screenshots', () => {
    test('capture full page screenshot', async ({ page }) => {
      // Wait for any animations to settle
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: 'test-artifacts/screenshots/landing-page-full.png',
        fullPage: true,
      });
    });

    test('capture hero section screenshot', async ({ page }) => {
      const heroSection = page.locator('section').first();
      await heroSection.screenshot({
        path: 'test-artifacts/screenshots/hero-section.png',
      });
    });

    test('capture QuickStart section screenshot', async ({ page }) => {
      const quickStart = page.locator('section:has-text("Start in 3 minutes")');
      await quickStart.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await quickStart.screenshot({
        path: 'test-artifacts/screenshots/quickstart-section.png',
      });
    });

    test('capture pricing section screenshot', async ({ page }) => {
      // Find pricing section by heading text
      const pricing = page.locator('section:has-text("Transparent")').first();
      await pricing.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await pricing.screenshot({
        path: 'test-artifacts/screenshots/pricing-section.png',
      });
    });
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone X

  test('should display mobile navigation', async ({ page }) => {
    await page.goto('/');

    // Mobile menu button should be visible
    const menuButton = page.getByRole('button', { name: /menu|navigation/i });
    await expect(menuButton).toBeVisible();
  });

  test('capture mobile screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-artifacts/screenshots/landing-page-mobile.png',
      fullPage: true,
    });
  });
});
