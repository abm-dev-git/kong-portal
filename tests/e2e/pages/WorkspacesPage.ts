import { Page, Locator, expect } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/auth.fixture';

export class WorkspacesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newWorkspaceButton: Locator;
  readonly createDialog: Locator;
  readonly workspaceGrid: Locator;

  // Create dialog elements
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly isDefaultSwitch: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1:has-text("Workspaces")');
    this.newWorkspaceButton = page.locator('button:has-text("New Workspace")');
    this.createDialog = page.locator('[role="dialog"]:has-text("Create Workspace")');
    this.workspaceGrid = page.locator('.grid');

    // Create dialog elements
    this.nameInput = page.locator('[role="dialog"]:has-text("Create Workspace") input#name');
    this.descriptionInput = page.locator('[role="dialog"]:has-text("Create Workspace") textarea#description');
    this.isDefaultSwitch = page.locator('[role="dialog"]:has-text("Create Workspace") button[role="switch"]');
    this.createButton = page.locator('[role="dialog"]:has-text("Create Workspace") button:has-text("Create Workspace")');
    this.cancelButton = page.locator('[role="dialog"]:has-text("Create Workspace") button:has-text("Cancel")');
  }

  async goto() {
    await this.page.goto('/settings/workspaces');
    await waitForPageLoad(this.page);
    await expect(this.heading).toBeVisible({ timeout: 15000 });
  }

  async createWorkspace(name: string, description?: string, isDefault?: boolean) {
    // Click new workspace button
    await this.newWorkspaceButton.click();
    await expect(this.createDialog).toBeVisible();

    // Fill name
    await this.nameInput.fill(name);

    // Fill description if provided
    if (description) {
      await this.descriptionInput.fill(description);
    }

    // Set default if requested
    if (isDefault) {
      const isChecked = await this.isDefaultSwitch.getAttribute('aria-checked') === 'true';
      if (!isChecked) {
        await this.isDefaultSwitch.click();
      }
    }

    // Click create
    await this.createButton.click();

    // Wait for dialog to close
    await expect(this.createDialog).not.toBeVisible({ timeout: 10000 });
  }

  async getWorkspaceCard(workspaceName: string): Promise<Locator> {
    return this.page.locator(`[class*="card"]:has-text("${workspaceName}")`);
  }

  async workspaceExists(workspaceName: string): Promise<boolean> {
    const card = await this.getWorkspaceCard(workspaceName);
    return await card.isVisible();
  }

  async isDefaultWorkspace(workspaceName: string): Promise<boolean> {
    const card = await this.getWorkspaceCard(workspaceName);
    const defaultBadge = card.locator('[class*="badge"]:has-text("Default"), :has-text("Default")');
    return await defaultBadge.isVisible();
  }

  async openWorkspaceMenu(workspaceName: string) {
    const card = await this.getWorkspaceCard(workspaceName);
    const menuButton = card.locator('button:has([class*="MoreVertical"])');
    await menuButton.click();
  }

  async editWorkspace(workspaceName: string, newName?: string, newDescription?: string) {
    await this.openWorkspaceMenu(workspaceName);

    // Click Edit
    await this.page.locator('[role="menuitem"]:has-text("Edit")').click();

    // Wait for edit dialog
    const editDialog = this.page.locator('[role="dialog"]:has-text("Edit Workspace")');
    await expect(editDialog).toBeVisible();

    // Update fields if provided
    if (newName) {
      const nameInput = this.page.locator('[role="dialog"]:has-text("Edit Workspace") input#edit-name');
      await nameInput.fill(newName);
    }

    if (newDescription !== undefined) {
      const descInput = this.page.locator('[role="dialog"]:has-text("Edit Workspace") textarea#edit-description');
      await descInput.fill(newDescription);
    }

    // Save
    await this.page.locator('[role="dialog"]:has-text("Edit Workspace") button:has-text("Save Changes")').click();

    // Wait for dialog to close
    await expect(editDialog).not.toBeVisible({ timeout: 10000 });
  }

  async setAsDefault(workspaceName: string) {
    await this.openWorkspaceMenu(workspaceName);

    // Click Edit
    await this.page.locator('[role="menuitem"]:has-text("Edit")').click();

    // Wait for edit dialog
    const editDialog = this.page.locator('[role="dialog"]:has-text("Edit Workspace")');
    await expect(editDialog).toBeVisible();

    // Toggle default switch
    const defaultSwitch = this.page.locator('[role="dialog"]:has-text("Edit Workspace") button[role="switch"]');
    const isChecked = await defaultSwitch.getAttribute('aria-checked') === 'true';
    if (!isChecked) {
      await defaultSwitch.click();
    }

    // Save
    await this.page.locator('[role="dialog"]:has-text("Edit Workspace") button:has-text("Save Changes")').click();

    // Wait for dialog to close
    await expect(editDialog).not.toBeVisible({ timeout: 10000 });
  }

  async archiveWorkspace(workspaceName: string) {
    await this.openWorkspaceMenu(workspaceName);

    // Click Archive
    await this.page.locator('[role="menuitem"]:has-text("Archive")').click();

    // Confirm in dialog
    const archiveDialog = this.page.locator('[role="dialog"]:has-text("Archive Workspace")');
    await expect(archiveDialog).toBeVisible();
    await this.page.locator('[role="dialog"]:has-text("Archive Workspace") button:has-text("Archive Workspace")').click();

    // Wait for dialog to close
    await expect(archiveDialog).not.toBeVisible({ timeout: 10000 });
  }
}
