import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-historyaudittrail--${id}&viewMode=story`;

test.describe('HistoryAuditTrail', () => {
  test('Default renders "Activity History" title and at least one event @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText('Activity History')).toBeVisible();
    // The grid shows events - verify the event count label is present
    await expect(page.getByText(/events/i).first()).toBeVisible();
  });

  test('Empty renders empty state message @smoke', async ({ page }) => {
    await page.goto(BASE('empty'));
    // Empty state - no events, so Alice Smith should not be visible
    await expect(page.getByText('Alice Smith')).not.toBeVisible();
    // Component still renders the title
    await expect(page.getByText('Activity History')).toBeVisible();
  });

  test('Loading renders loading indicator', async ({ page }) => {
    await page.goto(BASE('loading'));
    // Loading spinner or progress indicator present
    await expect(
      page.locator('[role="progressbar"], .MuiCircularProgress-root').first(),
    ).toBeVisible();
  });

  test('Error renders "Audit Trail request failed (401)" message', async ({ page }) => {
    await page.goto(BASE('error'));
    await expect(page.getByText(/Audit Trail request failed \(401\)/)).toBeVisible();
  });

  test('ExportEnabled - export button is visible', async ({ page }) => {
    await page.goto(BASE('export-enabled'));
    // Export button - look for download/export icon button
    await expect(
      page
        .getByRole('button')
        .filter({ hasText: /export/i })
        .or(page.locator('button[aria-label*="export" i], button[aria-label*="download" i]'))
        .first(),
    ).toBeVisible();
  });

  test('InlineMode - renders in inline mode showing events', async ({ page }) => {
    await page.goto(BASE('inline-mode'));
    // Inline mode renders the grid without the title panel - check for event data
    // The ag-grid shows events (virtual scroll may hide some rows but the grid container is visible)
    await expect(page.locator('.ag-root, [class*="ag-"]').first()).toBeVisible();
    // The event count label or activity column header should be visible
    await expect(page.getByText(/Activity|events/i).first()).toBeVisible();
  });

  test('ToggleModes - Panel and Inline buttons are visible', async ({ page }) => {
    await page.goto(BASE('toggle-modes'));
    await expect(page.getByRole('button', { name: 'Panel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Inline' })).toBeVisible();
  });
});
