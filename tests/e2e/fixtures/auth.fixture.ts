import { test as base, Page, expect, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Authentication modes supported by the fixture:
 * 1. STORAGE_STATE: Uses a pre-authenticated Playwright storage state file
 * 2. CLERK_SESSION: Uses Clerk session token directly
 * 3. DEVLOGIN: Uses a devlogin key to bypass auth (requires backend support)
 */

const STORAGE_STATE_PATH = path.join(__dirname, '..', '.auth', 'user.json');

/**
 * Custom test fixture that provides an authenticated page.
 *
 * Configuration options (via environment variables):
 * - PLAYWRIGHT_STORAGE_STATE: Path to storage state file (overrides default)
 * - CLERK_SESSION_TOKEN: Direct Clerk session token for authentication
 * - DEVLOGIN_KEY: DevLogin key for bypassing auth (requires backend support)
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use) => {
    const storageStatePath = process.env.PLAYWRIGHT_STORAGE_STATE || STORAGE_STATE_PATH;
    const clerkSessionToken = process.env.CLERK_SESSION_TOKEN;
    const devLoginKey = process.env.DEVLOGIN_KEY;

    let context: BrowserContext;

    // Option 1: Use storage state file if it exists
    if (fs.existsSync(storageStatePath)) {
      console.log('Using storage state from:', storageStatePath);
      context = await browser.newContext({
        storageState: storageStatePath,
      });
    }
    // Option 2: Use Clerk session token
    else if (clerkSessionToken) {
      console.log('Using Clerk session token');
      const baseURL = process.env.BASE_URL || 'https://dev.abm.dev';
      const domain = new URL(baseURL).hostname;

      context = await browser.newContext();
      await context.addCookies([
        {
          name: '__session',
          value: clerkSessionToken,
          domain: domain,
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'Lax',
        },
      ]);
    }
    // Option 3: Use devlogin key
    else if (devLoginKey) {
      console.log('Using DevLogin key for authentication');
      const baseURL = process.env.BASE_URL || 'https://dev.abm.dev';
      const domain = new URL(baseURL).hostname;

      context = await browser.newContext();
      await context.addCookies([
        {
          name: 'devlogin',
          value: devLoginKey,
          domain: domain,
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'Lax',
        },
      ]);
    }
    // No auth available
    else {
      throw new Error(
        'Authentication not configured. Please provide one of:\n' +
        '1. Storage state file at: ' + STORAGE_STATE_PATH + '\n' +
        '2. CLERK_SESSION_TOKEN environment variable\n' +
        '3. DEVLOGIN_KEY environment variable\n\n' +
        'To generate storage state, run: npx playwright test auth.setup.ts'
      );
    }

    const page = await context.newPage();

    // Add devlogin header to all API requests if devlogin key is set
    if (devLoginKey) {
      await page.route('**/api/**', async (route) => {
        const headers = {
          ...route.request().headers(),
          'X-DevLogin-Key': devLoginKey,
        };
        await route.continue({ headers });
      });

      await page.route('**/v1/**', async (route) => {
        const headers = {
          ...route.request().headers(),
          'X-DevLogin-Key': devLoginKey,
        };
        await route.continue({ headers });
      });
    }

    await use(page);

    await page.close();
    await context.close();
  },
});

export { expect };

/**
 * Helper to wait for page to be fully loaded after navigation
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  // Wait for any loading skeletons to disappear
  await page.waitForSelector('[class*="skeleton"]', { state: 'hidden', timeout: 10000 }).catch(() => {
    // Ignore if no skeletons found
  });
}

/**
 * Helper to generate unique test names with timestamp
 */
export function uniqueName(prefix: string): string {
  return `E2E-${prefix}-${Date.now()}`;
}
