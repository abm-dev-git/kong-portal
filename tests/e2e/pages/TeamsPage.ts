import { Page, Locator, expect } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/auth.fixture';

export class TeamsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newTeamButton: Locator;
  readonly createDialog: Locator;
  readonly teamGrid: Locator;

  // Create dialog elements
  readonly workspaceSelect: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly colorPickers: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  // Add member dialog elements
  readonly addMemberDialog: Locator;
  readonly memberSelect: Locator;
  readonly roleSelect: Locator;
  readonly addMemberButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1:has-text("Teams")');
    this.newTeamButton = page.locator('button:has-text("New Team")');
    this.createDialog = page.locator('[role="dialog"]:has-text("Create Team")');
    this.teamGrid = page.locator('.grid');

    // Create dialog elements
    this.workspaceSelect = page.locator('[role="dialog"]:has-text("Create Team") button:has-text("Select a workspace")').first();
    this.nameInput = page.locator('[role="dialog"]:has-text("Create Team") input#name');
    this.descriptionInput = page.locator('[role="dialog"]:has-text("Create Team") textarea#description');
    this.colorPickers = page.locator('[role="dialog"]:has-text("Create Team") button[class*="rounded-lg"]');
    this.createButton = page.locator('[role="dialog"]:has-text("Create Team") button:has-text("Create Team")');
    this.cancelButton = page.locator('[role="dialog"]:has-text("Create Team") button:has-text("Cancel")');

    // Add member dialog elements
    this.addMemberDialog = page.locator('[role="dialog"]:has-text("Add Member to")');
    this.memberSelect = page.locator('[role="dialog"]:has-text("Add Member") button:has-text("Select a member")');
    this.roleSelect = page.locator('[role="dialog"]:has-text("Add Member") [role="combobox"]').last();
    this.addMemberButton = page.locator('[role="dialog"]:has-text("Add Member") button:has-text("Add Member")');
  }

  async goto() {
    await this.page.goto('/settings/teams');
    await waitForPageLoad(this.page);
    await expect(this.heading).toBeVisible({ timeout: 15000 });
  }

  async createTeam(name: string, description?: string, colorIndex?: number) {
    // Click new team button
    await this.newTeamButton.click();
    await expect(this.createDialog).toBeVisible();

    // Select workspace if dropdown visible
    const workspaceDropdown = this.page.locator('[role="dialog"]:has-text("Create Team") [role="combobox"]').first();
    if (await workspaceDropdown.isVisible()) {
      await workspaceDropdown.click();
      // Select first available workspace
      await this.page.locator('[role="option"]').first().click();
    }

    // Fill name
    await this.nameInput.fill(name);

    // Fill description if provided
    if (description) {
      await this.descriptionInput.fill(description);
    }

    // Select color if provided
    if (colorIndex !== undefined) {
      const colorButton = this.colorPickers.nth(colorIndex);
      if (await colorButton.isVisible()) {
        await colorButton.click();
      }
    }

    // Click create
    await this.createButton.click();

    // Wait for dialog to close
    await expect(this.createDialog).not.toBeVisible({ timeout: 10000 });
  }

  async getTeamCard(teamName: string): Promise<Locator> {
    return this.page.locator(`[class*="card"]:has-text("${teamName}")`);
  }

  async teamExists(teamName: string): Promise<boolean> {
    const card = await this.getTeamCard(teamName);
    return await card.isVisible();
  }

  async openTeamMenu(teamName: string) {
    const card = await this.getTeamCard(teamName);
    const menuButton = card.locator('button:has([class*="MoreVertical"])');
    await menuButton.click();
  }

  async addMemberToTeam(teamName: string, memberIndex: number = 0, role: string = 'Member') {
    // Open team menu
    await this.openTeamMenu(teamName);

    // Click Add Member
    await this.page.locator('[role="menuitem"]:has-text("Add Member")').click();

    // Wait for dialog
    await expect(this.addMemberDialog).toBeVisible();

    // Select member
    const memberDropdown = this.page.locator('[role="dialog"]:has-text("Add Member") [role="combobox"]').first();
    await memberDropdown.click();
    await this.page.locator('[role="option"]').nth(memberIndex).click();

    // Click add member button
    await this.addMemberButton.click();

    // Wait for dialog to close
    await expect(this.addMemberDialog).not.toBeVisible({ timeout: 10000 });
  }

  async archiveTeam(teamName: string) {
    // Open team menu
    await this.openTeamMenu(teamName);

    // Click Archive
    await this.page.locator('[role="menuitem"]:has-text("Archive")').click();

    // Confirm in dialog
    const archiveDialog = this.page.locator('[role="dialog"]:has-text("Archive Team")');
    await expect(archiveDialog).toBeVisible();
    await this.page.locator('[role="dialog"]:has-text("Archive Team") button:has-text("Archive Team")').click();

    // Wait for dialog to close
    await expect(archiveDialog).not.toBeVisible({ timeout: 10000 });
  }
}
