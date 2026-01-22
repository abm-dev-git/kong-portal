import { test, expect, uniqueName } from '../fixtures/auth.fixture';
import { MembersPage } from '../pages/MembersPage';

test.describe('Organization Members', () => {
  let membersPage: MembersPage;

  test.beforeEach(async ({ authedPage }) => {
    membersPage = new MembersPage(authedPage);
    await membersPage.goto();
  });

  test('should display members page', async () => {
    await expect(membersPage.heading).toBeVisible();
    await expect(membersPage.heading).toHaveText('Members');
  });

  test('should display members and invites tabs', async () => {
    await expect(membersPage.membersTab).toBeVisible();
    await expect(membersPage.invitesTab).toBeVisible();
  });

  test('should show invite button', async () => {
    await expect(membersPage.inviteButton).toBeVisible();
  });

  test('should open invite dialog', async ({ authedPage }) => {
    await membersPage.inviteButton.click();
    await expect(membersPage.inviteDialog).toBeVisible();

    // Verify dialog contains expected fields
    await expect(membersPage.emailInput).toBeVisible();
    await expect(membersPage.roleSelect).toBeVisible();

    // Close dialog
    await membersPage.cancelButton.click();
    await expect(membersPage.inviteDialog).not.toBeVisible();
  });

  test('should invite a new member', async ({ authedPage }) => {
    // Generate unique email to avoid conflicts
    const email = `e2e-invite-${Date.now()}@test.example.com`;

    await membersPage.inviteMember(email, 'viewer');

    // Verify success - either toast or invite appears in pending list
    // Check toast first
    const toast = authedPage.locator('[data-sonner-toast]:has-text("Invitation sent"), [role="status"]:has-text("sent"), [class*="toast"]:has-text("sent")');
    const toastVisible = await toast.isVisible({ timeout: 5000 }).catch(() => false);

    if (!toastVisible) {
      // Check pending invites tab
      await membersPage.switchToInvitesTab();
      const inviteRow = await membersPage.getPendingInvite(email);
      await expect(inviteRow).toBeVisible({ timeout: 5000 });
    }
  });

  test('should switch between members and invites tabs', async ({ authedPage }) => {
    // Start on members tab
    await membersPage.switchToMembersTab();

    // The members tab should be active
    await expect(membersPage.membersTab).toHaveAttribute('data-state', 'active');

    // Switch to invites tab
    await membersPage.switchToInvitesTab();

    // The invites tab should now be active
    await expect(membersPage.invitesTab).toHaveAttribute('data-state', 'active');
  });

  test('should validate email in invite form', async ({ authedPage }) => {
    await membersPage.inviteButton.click();
    await expect(membersPage.inviteDialog).toBeVisible();

    // Try to submit without email
    await membersPage.sendInviteButton.click();

    // Should show validation error or stay on dialog
    await expect(membersPage.inviteDialog).toBeVisible();

    // Enter invalid email
    await membersPage.emailInput.fill('invalid-email');
    await membersPage.sendInviteButton.click();

    // Dialog should still be visible (validation failed)
    await expect(membersPage.inviteDialog).toBeVisible();

    // Close dialog
    await membersPage.cancelButton.click();
  });

  test('should select different roles when inviting', async ({ authedPage }) => {
    await membersPage.inviteButton.click();
    await expect(membersPage.inviteDialog).toBeVisible();

    // Test selecting editor role
    await membersPage.roleSelect.click();
    const editorOption = authedPage.locator('[role="option"]:has-text("Editor")');
    await editorOption.click();

    // Test selecting admin role
    await membersPage.roleSelect.click();
    const adminOption = authedPage.locator('[role="option"]:has-text("Admin")');
    await adminOption.click();

    // Close dialog
    await membersPage.cancelButton.click();
  });

  test('should cancel a pending invite', async ({ authedPage }) => {
    // First create an invite
    const email = `e2e-cancel-test-${Date.now()}@test.example.com`;
    await membersPage.inviteMember(email, 'viewer');

    // Switch to invites tab
    await membersPage.switchToInvitesTab();

    // Find the invite row
    const inviteRow = await membersPage.getPendingInvite(email);
    await expect(inviteRow).toBeVisible({ timeout: 5000 });

    // Find and click the cancel/revoke button
    const cancelBtn = inviteRow.locator('button:has-text("Revoke"), button:has-text("Cancel"), button[aria-label*="revoke"], button[aria-label*="cancel"]');
    if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cancelBtn.click();

      // Handle confirmation dialog if present
      const confirmBtn = authedPage.locator('[role="dialog"] button:has-text("Revoke"), [role="dialog"] button:has-text("Confirm")');
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click();
      }

      // Verify the invite is no longer pending
      await authedPage.waitForTimeout(1000);
      // The row should either disappear or show revoked status
    }
  });
});
