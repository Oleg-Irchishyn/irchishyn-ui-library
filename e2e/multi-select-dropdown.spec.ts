import { test, expect } from '@playwright/test';

const BASE = (id: string) =>
  `/iframe.html?id=components-multiselectdropdown--${id}&viewMode=story`;

test.describe('MultiSelectDropdown', () => {
  test('Default renders dropdown with "All Sponsors" placeholder @smoke', async ({ page }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText('All Sponsors')).toBeVisible();
  });

  test('PartialSelection - shows selected labels "Acme Corp" and "Omega Fund" @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('partial-selection'));
    await expect(page.getByText('Acme Corp').first()).toBeVisible();
    await expect(page.getByText('Omega Fund').first()).toBeVisible();
  });

  test('AllSelected - shows all selected state', async ({ page }) => {
    await page.goto(BASE('all-selected'));
    // When all selected, it should display all sponsors or a count label
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  test('Disabled - dropdown button is disabled', async ({ page }) => {
    await page.goto(BASE('disabled'));
    // The trigger button should be disabled
    await expect(page.getByRole('button').first()).toBeDisabled();
  });

  test('Clicking Default dropdown opens list with sponsor options', async ({ page }) => {
    await page.goto(BASE('default'));
    // Open the dropdown
    await page.getByText('All Sponsors').click();
    await expect(page.getByText('Acme Corp')).toBeVisible();
    await expect(page.getByText('Nebula Ventures')).toBeVisible();
  });

  test('NoSelectAll - no "Select All" option visible when opened', async ({ page }) => {
    await page.goto(BASE('no-select-all'));
    // Open the dropdown
    await page.getByRole('button').first().click();
    await expect(page.getByText(/Select All/i)).not.toBeVisible();
  });
});
