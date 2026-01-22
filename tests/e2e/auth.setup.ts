import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '.auth', 'user.json');

/**
 * Authentication setup script.
 *
 * This test performs manual login via Clerk and saves the authentication state
 * to be reused by other tests.
 *
 * Usage:
 *   npx playwright test auth.setup.ts --headed
 *
 * After running, the storage state will be saved to tests/e2e/.auth/user.json
 */
setup('authenticate', async ({ page }) => {
  const baseURL = process.env.BASE_URL || 'https://dev.abm.dev';

  console.log('Starting authentication setup...');
  console.log('Navigate to:', baseURL);

  // Go to the app - this will redirect to sign-in
  await page.goto(baseURL);

  // Wait for user to complete authentication
  // This will show the login page and wait for the user to sign in manually
  console.log('\n=== MANUAL AUTHENTICATION REQUIRED ===');
  console.log('Please sign in to your account in the browser window.');
  console.log('The test will continue once you are logged in.\n');

  // Wait for navigation to dashboard or protected route
  // This indicates successful authentication
  await page.waitForURL('**/dashboard**', { timeout: 120000 });

  console.log('Authentication successful!');

  // Verify we're logged in
  await expect(page.locator('button:has-text("Workspace"), h1:has-text("Overview")')).toBeVisible({ timeout: 10000 });

  // Save storage state
  await page.context().storageState({ path: authFile });

  console.log('Storage state saved to:', authFile);
  console.log('\nYou can now run authenticated tests with:');
  console.log('  npm run test:e2e -- tests/e2e/settings/');
});
