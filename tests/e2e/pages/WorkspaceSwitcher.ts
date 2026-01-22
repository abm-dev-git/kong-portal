import { Page, Locator, expect } from '@playwright/test';

export class WorkspaceSwitcher {
  readonly page: Page;
  readonly trigger: Locator;
  readonly popover: Locator;
  readonly workspaceList: Locator;
  readonly manageLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // The trigger button has "Select workspace" aria-label
    this.trigger = page.locator('button[aria-label="Select workspace"], button[role="combobox"]:has-text("Workspace")');
    this.popover = page.locator('[data-radix-popper-content-wrapper], [role="dialog"]:has-text("Workspace")');
    this.workspaceList = page.locator('[data-radix-popper-content-wrapper] button, [role="option"]');
    this.manageLink = page.locator('a:has-text("Manage Workspaces")');
  }

  async open() {
    // Find the workspace switcher button (has Building2 icon and "Workspace" text)
    const switcher = this.page.locator('button:has-text("Workspace")').first();
    await switcher.click();
    // Wait for popover to appear
    await this.page.waitForTimeout(300);
  }

  async getCurrentWorkspace(): Promise<string> {
    // The current workspace name is displayed in the trigger button
    const trigger = this.page.locator('button:has-text("Workspace")').first();
    const text = await trigger.innerText();
    // Extract workspace name (after "Workspace" label)
    const lines = text.split('\n');
    // Usually format is "Workspace\nWorkspaceName"
    return lines.length > 1 ? lines[lines.length - 1].trim() : lines[0].trim();
  }

  async selectWorkspace(workspaceName: string) {
    await this.open();

    // Find and click the workspace option
    const option = this.page.locator(`button:has-text("${workspaceName}"), [role="option"]:has-text("${workspaceName}")`).first();
    await option.click();

    // Wait for selection to complete
    await this.page.waitForTimeout(500);
  }

  async getAvailableWorkspaces(): Promise<string[]> {
    await this.open();

    // Get all workspace buttons in the popover
    const buttons = this.page.locator('[data-radix-popper-content-wrapper] button:not(:has-text("Manage"))');
    const count = await buttons.count();
    const workspaces: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).innerText();
      const name = text.split('\n')[0].trim();
      if (name && name !== 'Manage Workspaces') {
        workspaces.push(name);
      }
    }

    // Close popover by clicking elsewhere
    await this.page.keyboard.press('Escape');

    return workspaces;
  }

  async goToManageWorkspaces() {
    await this.open();
    // The manage link might be outside viewport due to popover positioning
    // First try to scroll it into view within the popover, then click
    const popover = this.page.locator('[data-radix-popper-content-wrapper]');
    if (await popover.isVisible()) {
      await popover.evaluate(el => el.scrollTop = el.scrollHeight);
    }
    // Use JavaScript click as fallback to force: true since element may still be outside viewport
    await this.manageLink.evaluate(el => (el as HTMLElement).click());
    await this.page.waitForURL('**/settings/workspaces', { timeout: 15000 });
  }
}
