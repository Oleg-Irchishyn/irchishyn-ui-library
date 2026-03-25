import { test, expect } from '@playwright/test';

test.describe('Gen2Verse.UI.Library Storybook smoke', () => {
  test('Storybook loads successfully @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Storybook/i);
  });

  test('Storybook sidebar is visible @smoke', async ({ page }) => {
    await page.goto('/');
    // Storybook renders a sidebar nav
    const sidebar = page.locator('#storybook-explorer-tree, [data-nodeid], .sidebar-container');
    await expect(sidebar.first()).toBeVisible({ timeout: 15000 });
  });
});
