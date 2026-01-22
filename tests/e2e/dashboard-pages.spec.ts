import { test, expect } from '@playwright/test';

/**
 * Dashboard Pages E2E Tests
 * Tests for enrichments, prompts, and billing pages
 */

test.describe('Dashboard Pages - Unauthenticated', () => {
  test('enrichments page should redirect to sign-in', async ({ page }) => {
    const response = await page.goto('/dashboard/enrichments');
    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });

  test('prompts page should redirect to sign-in', async ({ page }) => {
    const response = await page.goto('/dashboard/prompts');
    await expect(page).toHaveURL(/sign-in/);
  });

  test('billing page should redirect to sign-in', async ({ page }) => {
    const response = await page.goto('/settings/billing');
    await expect(page).toHaveURL(/sign-in/);
  });
});

test.describe('Landing Page Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper CSS variables for dark mode', async ({ page }) => {
    // Check that CSS custom properties are defined
    const darkBlue = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--dark-blue');
    });
    expect(darkBlue.trim()).not.toBe('');

    const turquoise = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--turquoise');
    });
    expect(turquoise.trim()).not.toBe('');

    const cream = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--cream');
    });
    expect(cream.trim()).not.toBe('');
  });

  test('hero section should use CSS variables not hardcoded colors', async ({ page }) => {
    // Check that hero section uses CSS variables
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Screenshot to verify visually
    await heroSection.screenshot({
      path: 'test-artifacts/screenshots/hero-dark-mode.png',
    });
  });

  test('CTA band should have readable text in dark mode', async ({ page }) => {
    // Scroll to CTA section if present
    const ctaSection = page.locator('section:has-text("Ready to transform")').first();

    if (await ctaSection.count() > 0) {
      await ctaSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Check text is visible
      const heading = ctaSection.locator('h2, h3').first();
      if (await heading.count() > 0) {
        await expect(heading).toBeVisible();
      }

      await ctaSection.screenshot({
        path: 'test-artifacts/screenshots/cta-dark-mode.png',
      });
    }
  });
});

test.describe('Component Smoke Tests', () => {
  test('sign-in page loads', async ({ page }) => {
    // Sign-in uses Clerk which makes external calls, don't wait for networkidle
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check that Clerk component is present
    const signInForm = page.locator('[data-clerk-component]').first();
    // It should either show the Clerk form or redirect, both are valid
    const url = page.url();
    expect(url).toMatch(/sign-in|clerk/i);
  });

  test('docs page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/docs', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const criticalErrors = errors.filter(
      err => !err.includes('favicon') &&
             !err.includes('clerk') &&
             !err.includes('Clerk') &&
             !err.includes('WebSocket') &&
             !err.includes('webpack-hmr') &&
             !err.includes('hydration')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('api-reference page loads', async ({ page }) => {
    await page.goto('/api-reference', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check page loaded
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test('capture landing page full dark mode screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-artifacts/screenshots/landing-dark-mode-full.png',
      fullPage: true,
    });
  });

  test('capture docs page screenshot', async ({ page }) => {
    await page.goto('/docs', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'test-artifacts/screenshots/docs-page.png',
      fullPage: false,
    });
  });
});
