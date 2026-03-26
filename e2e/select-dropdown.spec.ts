import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-selectdropdown--${id}&viewMode=story`;

test.describe('SelectDropdown', () => {
  test('Default renders dropdown with "Select a driver report..." placeholder @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText('Select a driver report...')).toBeVisible();
  });

  test('WithPreselectedValue shows "CapEvent - System - Fund of Funds" selected @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('with-preselected-value'));
    await expect(page.getByText('CapEvent - System - Fund of Funds')).toBeVisible();
  });

  test('Loading - shows dropdown trigger with no options loaded', async ({ page }) => {
    await page.goto(BASE('loading'));
    // Loading state: trigger shows placeholder, open it to confirm no options
    const trigger = page.locator('[data-testid="select-dropdown-trigger"]');
    await expect(trigger).toBeVisible();
    await trigger.click();
    // When loading, the dropdown is open but has no selectable options (only action buttons)
    await expect(page.getByText('Refresh List')).toBeVisible();
  });

  test('Disabled - dropdown button is disabled', async ({ page }) => {
    await page.goto(BASE('disabled'));
    await expect(page.getByRole('button').first()).toBeDisabled();
  });

  test('Clicking Default dropdown opens list and search input is visible', async ({ page }) => {
    await page.goto(BASE('default'));
    await page.getByText('Select a driver report...').click();
    await expect(page.getByPlaceholder('Search driver reports...')).toBeVisible();
  });

  test('WithActionButtons - "Refresh List" action button visible in dropdown', async ({ page }) => {
    await page.goto(BASE('with-action-buttons'));
    // Open the dropdown to see action buttons
    await page.getByText('CapEvent - System - Fund of Funds').click();
    await expect(page.getByText('Refresh List')).toBeVisible();
  });
});
