import { request } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables (order matters - .env.test values take precedence)
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

/**
 * Global teardown to clean up E2E test data after all tests complete.
 * This ensures test idempotency by removing test-generated invites.
 */
async function globalTeardown() {
  const devLoginKey = process.env.DEVLOGIN_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:5000/api';

  if (!devLoginKey) {
    console.log('[Global Teardown] No DEVLOGIN_KEY found, skipping cleanup');
    return;
  }

  console.log('[Global Teardown] Starting E2E test data cleanup...');

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

      console.log(`[Global Teardown] Found ${testInvites.length} test invites to clean up`);

      // Delete each test invite
      for (const invite of testInvites) {
        const deleteResponse = await context.delete(`/users/invites/${invite.id}`);
        if (deleteResponse.ok()) {
          console.log(`[Global Teardown] Deleted invite: ${invite.email}`);
        } else {
          console.log(`[Global Teardown] Failed to delete invite: ${invite.email}`);
        }
      }
    }

    console.log('[Global Teardown] E2E test data cleanup complete');
  } catch (error) {
    console.error('[Global Teardown] Error during cleanup:', error);
  } finally {
    await context.dispose();
  }
}

export default globalTeardown;
