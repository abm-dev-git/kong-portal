import { Page, Locator, expect } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/auth.fixture';

export class MembersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly inviteButton: Locator;
  readonly membersTab: Locator;
  readonly invitesTab: Locator;
  readonly membersTable: Locator;
  readonly invitesTable: Locator;

  // Invite dialog elements
  readonly inviteDialog: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly messageInput: Locator;
  readonly sendInviteButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1:has-text("Members")');
    this.inviteButton = page.locator('button:has-text("Invite Member")');
    this.membersTab = page.locator('[role="tab"]:has-text("Members")');
    this.invitesTab = page.locator('[role="tab"]:has-text("Pending Invites")');
    this.membersTable = page.locator('[role="tabpanel"]:first-of-type table, [role="tabpanel"]:first-of-type [class*="members"]');
    this.invitesTable = page.locator('[role="tabpanel"]:last-of-type table, [role="tabpanel"]:last-of-type [class*="invites"]');

    // Invite dialog elements
    this.inviteDialog = page.locator('[role="dialog"]:has-text("Invite Team Member")');
    this.emailInput = page.locator('[role="dialog"]:has-text("Invite") input#email, [role="dialog"]:has-text("Invite") input[type="email"]');
    this.roleSelect = page.locator('[role="dialog"]:has-text("Invite") [role="combobox"]');
    this.messageInput = page.locator('[role="dialog"]:has-text("Invite") textarea#message');
    this.sendInviteButton = page.locator('[role="dialog"]:has-text("Invite") button[type="submit"], [role="dialog"]:has-text("Invite") button:has-text("Send Invite")');
    this.cancelButton = page.locator('[role="dialog"]:has-text("Invite") button:has-text("Cancel")');
  }

  async goto() {
    await this.page.goto('/settings/team');
    await waitForPageLoad(this.page);
    await expect(this.heading).toBeVisible({ timeout: 15000 });
  }

  async inviteMember(email: string, role?: 'viewer' | 'editor' | 'admin', message?: string) {
    // Click invite button
    await this.inviteButton.click();
    await expect(this.inviteDialog).toBeVisible();

    // Fill email
    await this.emailInput.fill(email);

    // Select role if provided
    if (role) {
      await this.roleSelect.click();
      // Wait for dropdown to open and select role
      const roleOption = this.page.locator(`[role="option"]:has-text("${role.charAt(0).toUpperCase() + role.slice(1)}")`);
      await roleOption.click();
    }

    // Fill message if provided
    if (message) {
      await this.messageInput.fill(message);
    }

    // Send invite
    await this.sendInviteButton.click();

    // Wait for dialog to close (success case) or check for error toast
    try {
      await expect(this.inviteDialog).not.toBeVisible({ timeout: 15000 });
    } catch {
      // If dialog didn't close, check for error message and throw a more helpful error
      const errorToast = this.page.locator('[data-sonner-toast][data-type="error"], [role="alert"]:has-text("error"), [class*="toast"]:has-text("error")');
      const hasError = await errorToast.isVisible({ timeout: 1000 }).catch(() => false);
      if (hasError) {
        const errorText = await errorToast.textContent();
        throw new Error(`Invite failed: ${errorText}`);
      }
      // Close dialog manually if it's stuck
      await this.cancelButton.click().catch(() => {});
      throw new Error('Invite dialog did not close after submission');
    }
  }

  async getMemberRow(email: string): Promise<Locator> {
    return this.page.locator(`tr:has-text("${email}"), [class*="member"]:has-text("${email}")`);
  }

  async memberExists(email: string): Promise<boolean> {
    await this.membersTab.click();
    await this.page.waitForTimeout(500);
    const row = await this.getMemberRow(email);
    return await row.isVisible();
  }

  async switchToInvitesTab() {
    await this.invitesTab.click();
    await this.page.waitForTimeout(500);
  }

  async switchToMembersTab() {
    await this.membersTab.click();
    await this.page.waitForTimeout(500);
  }

  async getPendingInvite(email: string): Promise<Locator> {
    return this.page.locator(`tr:has-text("${email}"), [class*="invite"]:has-text("${email}")`);
  }

  async pendingInviteExists(email: string): Promise<boolean> {
    await this.switchToInvitesTab();
    const row = await this.getPendingInvite(email);
    return await row.isVisible();
  }

  async cancelInvite(email: string) {
    await this.switchToInvitesTab();
    const row = await this.getPendingInvite(email);

    // Find and click cancel/revoke button in the row
    const cancelButton = row.locator('button:has-text("Cancel"), button:has-text("Revoke"), button[aria-label*="cancel"], button[aria-label*="revoke"]');
    if (await cancelButton.isVisible()) {
      await cancelButton.click();

      // Confirm if there's a confirmation dialog
      const confirmDialog = this.page.locator('[role="dialog"]:has-text("Cancel"), [role="dialog"]:has-text("Revoke")');
      if (await confirmDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.page.locator('[role="dialog"] button:has-text("Confirm"), [role="dialog"] button:has-text("Cancel Invite")').click();
      }
    }
  }
}
