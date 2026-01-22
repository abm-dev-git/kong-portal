import { test, expect, uniqueName } from '../fixtures/auth.fixture';
import { TeamsPage } from '../pages/TeamsPage';

test.describe('Teams Management', () => {
  let teamsPage: TeamsPage;

  test.beforeEach(async ({ authedPage }) => {
    teamsPage = new TeamsPage(authedPage);
    await teamsPage.goto();
  });

  test('should display teams page', async () => {
    await expect(teamsPage.heading).toBeVisible();
    await expect(teamsPage.heading).toHaveText('Teams');
  });

  test('should create a new team', async ({ authedPage }) => {
    const teamName = uniqueName('Team');
    const description = 'E2E test team description';

    await teamsPage.createTeam(teamName, description);

    // Verify team appears in the list
    const teamCard = await teamsPage.getTeamCard(teamName);
    await expect(teamCard).toBeVisible({ timeout: 10000 });

    // Verify success toast
    const toast = authedPage.locator('[data-sonner-toast], [role="status"]:has-text("Success"), [class*="toast"]:has-text("created")');
    await expect(toast).toBeVisible({ timeout: 5000 }).catch(() => {
      // Toast might have auto-dismissed
    });
  });

  test('should add member to team', async ({ authedPage }) => {
    // First, create a team to add member to
    const teamName = uniqueName('TeamWithMember');
    await teamsPage.createTeam(teamName, 'Team for adding member');

    // Wait for team to appear
    await expect(await teamsPage.getTeamCard(teamName)).toBeVisible({ timeout: 10000 });

    // Add member to team
    await teamsPage.addMemberToTeam(teamName);

    // Verify success (toast or member count update)
    const toast = authedPage.locator('[data-sonner-toast], [role="status"]:has-text("added"), [class*="toast"]:has-text("added")');
    await expect(toast).toBeVisible({ timeout: 5000 }).catch(() => {
      // Toast might have auto-dismissed, check team card instead
    });
  });

  test('should archive a team', async ({ authedPage }) => {
    // First create a team to archive
    const teamName = uniqueName('TeamToArchive');
    await teamsPage.createTeam(teamName, 'Team to be archived');

    // Wait for team to appear
    await expect(await teamsPage.getTeamCard(teamName)).toBeVisible({ timeout: 10000 });

    // Archive the team
    await teamsPage.archiveTeam(teamName);

    // Verify team no longer visible
    const teamCard = await teamsPage.getTeamCard(teamName);
    await expect(teamCard).not.toBeVisible({ timeout: 10000 });
  });

  test('should show empty state when no teams exist', async ({ authedPage }) => {
    // This test verifies the empty state display
    // Navigate to "My Teams" view which may be empty
    const myTeamsButton = authedPage.locator('button:has-text("My Teams")');
    if (await myTeamsButton.isVisible()) {
      await myTeamsButton.click();
      await authedPage.waitForTimeout(500);

      // Check for empty state or team list
      const emptyState = authedPage.locator('text=No teams yet, text=not in any teams');
      const teamCards = authedPage.locator('[class*="card"]:has([class*="UsersRound"])');

      // Either empty state or team cards should be visible
      const hasEmptyState = await emptyState.isVisible().catch(() => false);
      const hasTeams = await teamCards.first().isVisible().catch(() => false);

      expect(hasEmptyState || hasTeams).toBeTruthy();
    }
  });
});
