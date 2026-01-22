import { request } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables (order matters - .env.test values take precedence)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

/**
 * Global setup to clean up E2E test data before tests run.
 * This ensures a clean state before each test run.
 */
async function globalSetup() {
  const devLoginKey = process.env.DEVLOGIN_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:5000/api';

  if (!devLoginKey) {
    console.log('[Global Setup] No DEVLOGIN_KEY found, skipping cleanup');
    return;
  }

  console.log('[Global Setup] Starting E2E test data cleanup...');

  const context = await request.newContext({
    baseURL: apiUrl,
    extraHTTPHeaders: {
      'X-DevLogin-Key': devLoginKey,
    },
  });

  try {
    // Fetch all invites
    const invitesResponse = await context.get('/users/invites');
    if (invitesResponse.ok()) {
      const data = await invitesResponse.json();
      const invites = data.invites || [];

      // Filter for E2E test invites (emails containing 'e2e-invite' or 'test.example.com')
      const testInvites = invites.filter((invite: { email: string; status: string }) =>
        (invite.email.includes('e2e-invite') || invite.email.includes('test.example.com')) &&
        invite.status === 'pending'
      );

      console.log(`[Global Setup] Found ${testInvites.length} test invites to clean up`);

      // Delete each test invite
      for (const invite of testInvites) {
        const deleteResponse = await context.delete(`/users/invites/${invite.id}`);
        if (deleteResponse.ok()) {
          console.log(`[Global Setup] Deleted invite: ${invite.email}`);
        } else {
          console.log(`[Global Setup] Failed to delete invite: ${invite.email}`);
        }
      }
    }

    console.log('[Global Setup] E2E test data cleanup complete');
  } catch (error) {
    console.error('[Global Setup] Error during cleanup:', error);
  } finally {
    await context.dispose();
  }
}

export default globalSetup;
