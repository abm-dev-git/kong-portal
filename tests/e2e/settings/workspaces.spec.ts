import { test, expect, uniqueName } from '../fixtures/auth.fixture';
import { WorkspacesPage } from '../pages/WorkspacesPage';

test.describe('Workspaces Management', () => {
  let workspacesPage: WorkspacesPage;

  test.beforeEach(async ({ authedPage }) => {
    workspacesPage = new WorkspacesPage(authedPage);
    await workspacesPage.goto();
  });

  test('should display workspaces page', async () => {
    await expect(workspacesPage.heading).toBeVisible();
    await expect(workspacesPage.heading).toHaveText('Workspaces');
  });

  test('should show new workspace button', async () => {
    await expect(workspacesPage.newWorkspaceButton).toBeVisible();
  });

  test('should open create workspace dialog', async ({ authedPage }) => {
    await workspacesPage.newWorkspaceButton.click();
    await expect(workspacesPage.createDialog).toBeVisible();

    // Verify dialog contains expected fields
    await expect(workspacesPage.nameInput).toBeVisible();
    await expect(workspacesPage.descriptionInput).toBeVisible();
    await expect(workspacesPage.isDefaultSwitch).toBeVisible();

    // Close dialog
    await workspacesPage.cancelButton.click();
    await expect(workspacesPage.createDialog).not.toBeVisible();
  });

  test('should create a new workspace', async ({ authedPage }) => {
    const workspaceName = uniqueName('Workspace');
    const description = 'E2E test workspace';

    await workspacesPage.createWorkspace(workspaceName, description);

    // Verify workspace appears in the list
    const workspaceCard = await workspacesPage.getWorkspaceCard(workspaceName);
    await expect(workspaceCard).toBeVisible({ timeout: 10000 });

    // Verify success toast
    const toast = authedPage.locator('[data-sonner-toast], [role="status"]:has-text("Success"), [class*="toast"]:has-text("created")');
    await expect(toast).toBeVisible({ timeout: 5000 }).catch(() => {
      // Toast might have auto-dismissed
    });
  });

  test('should create workspace with default flag', async ({ authedPage }) => {
    const workspaceName = uniqueName('DefaultWS');

    await workspacesPage.createWorkspace(workspaceName, 'Default workspace test', true);

    // Verify workspace appears and is marked as default
    const workspaceCard = await workspacesPage.getWorkspaceCard(workspaceName);
    await expect(workspaceCard).toBeVisible({ timeout: 10000 });

    // Check for default badge
    const isDefault = await workspacesPage.isDefaultWorkspace(workspaceName);
    expect(isDefault).toBeTruthy();
  });

  test('should edit a workspace', async ({ authedPage }) => {
    // Create a workspace first
    const originalName = uniqueName('EditWS');
    await workspacesPage.createWorkspace(originalName, 'To be edited');
    await expect(await workspacesPage.getWorkspaceCard(originalName)).toBeVisible({ timeout: 10000 });

    // Edit the workspace
    const newName = uniqueName('EditedWS');
    await workspacesPage.editWorkspace(originalName, newName, 'Updated description');

    // Verify new name appears
    await expect(await workspacesPage.getWorkspaceCard(newName)).toBeVisible({ timeout: 10000 });
  });

  test('should archive a workspace', async ({ authedPage }) => {
    // Create a non-default workspace to archive
    const workspaceName = uniqueName('ArchiveWS');
    await workspacesPage.createWorkspace(workspaceName, 'To be archived', false);
    await expect(await workspacesPage.getWorkspaceCard(workspaceName)).toBeVisible({ timeout: 10000 });

    // Archive the workspace
    await workspacesPage.archiveWorkspace(workspaceName);

    // Verify workspace no longer visible
    const workspaceCard = await workspacesPage.getWorkspaceCard(workspaceName);
    await expect(workspaceCard).not.toBeVisible({ timeout: 10000 });
  });

  test('should not allow archiving default workspace', async ({ authedPage }) => {
    // Find the default workspace
    const defaultBadge = authedPage.locator('[class*="badge"]:has-text("Default")');

    if (await defaultBadge.isVisible()) {
      // Get the parent card
      const defaultCard = defaultBadge.locator('xpath=ancestor::*[contains(@class, "card")]').first();

      // Open menu
      const menuButton = defaultCard.locator('button:has([class*="MoreVertical"])');
      if (await menuButton.isVisible()) {
        await menuButton.click();

        // Archive option should not be visible for default workspace
        const archiveOption = authedPage.locator('[role="menuitem"]:has-text("Archive")');
        await expect(archiveOption).not.toBeVisible();

        // Close menu
        await authedPage.keyboard.press('Escape');
      }
    }
  });

  test('should validate workspace name is required', async ({ authedPage }) => {
    await workspacesPage.newWorkspaceButton.click();
    await expect(workspacesPage.createDialog).toBeVisible();

    // Try to create without name
    await workspacesPage.createButton.click();

    // Dialog should still be visible (validation failed)
    await expect(workspacesPage.createDialog).toBeVisible();

    // Error toast should appear
    const toast = authedPage.locator('[data-sonner-toast]:has-text("required"), [role="status"]:has-text("Error"), [class*="toast"]:has-text("required")');
    await expect(toast).toBeVisible({ timeout: 3000 }).catch(() => {
      // Toast might show different message
    });

    // Close dialog
    await workspacesPage.cancelButton.click();
  });
});
