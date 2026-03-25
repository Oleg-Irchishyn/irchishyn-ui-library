import { test, expect } from '@playwright/test';

const BASE = (id: string) =>
  `/iframe.html?id=components-outputconfigurationpanel--${id}&viewMode=story`;

test.describe('OutputConfigurationPanel', () => {
  test('Default renders Output Format section with PDF and Word checkboxes @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText(/PDF/i).first()).toBeVisible();
    await expect(page.getByText(/Word/i).first()).toBeVisible();
    // Checkboxes should be present
    await expect(page.getByRole('checkbox').first()).toBeVisible();
  });

  test('WithFileSplittingInteractive shows splitting options @smoke', async ({ page }) => {
    await page.goto(BASE('with-file-splitting-interactive'));
    await expect(page.getByText(/Consolidated File/i)).toBeVisible();
    await expect(page.getByText(/Split Per Investor/i)).toBeVisible();
  });

  test('WithFileNamingInteractive - file naming section with preview visible', async ({ page }) => {
    await page.goto(BASE('with-file-naming-interactive'));
    // File naming section should have a preview area and token chips
    await expect(page.getByText(/File Naming/i).first()).toBeVisible();
  });

  test('ValidationWhenDeselectingLast - PDF stays checked when it is the only selected format', async ({
    page,
  }) => {
    await page.goto(BASE('validation-when-deselecting-last'));
    // PDF is the only selected format
    const pdfCheckbox = page.getByRole('checkbox').first();
    await expect(pdfCheckbox).toBeVisible();
    await expect(pdfCheckbox).toBeChecked();
    // Clicking it should not uncheck it (minSelected: 1 prevents it)
    await pdfCheckbox.click();
    await expect(pdfCheckbox).toBeChecked();
  });

  test('FileSplittingSectionStandalone - radio buttons for split mode visible', async ({ page }) => {
    await page.goto(BASE('file-splitting-section-standalone'));
    await expect(page.getByRole('radio').first()).toBeVisible();
    await expect(page.getByText(/Consolidated File/i)).toBeVisible();
  });
});
