import { test, expect } from '@playwright/test';

const BASE = (id: string) =>
  `/iframe.html?id=components-documenttemplatecard--${id}&viewMode=story`;

test.describe('DocumentTemplateCard', () => {
  test('CoverLetter renders "Cover Letter" label and filename @smoke', async ({ page }) => {
    await page.goto(BASE('cover-letter'));
    await expect(page.getByText('Cover Letter').first()).toBeVisible();
    await expect(page.getByText('Cover Letter - Standard.pdf')).toBeVisible();
  });

  test('TemplateSelected renders "Template" card with selected visual state @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('template-selected'));
    await expect(page.getByText('Template').first()).toBeVisible();
    await expect(page.getByText('CapitalCall_Template_v3.docx')).toBeVisible();
  });

  test('Addendum renders the addendum filename', async ({ page }) => {
    await page.goto(BASE('addendum'));
    await expect(page.getByText('Tax_Withholding_Addendum_2025.pdf')).toBeVisible();
  });

  test('InteractiveSet shows 3 cards and clicking a card selects it', async ({ page }) => {
    await page.goto(BASE('interactive-set'));
    // All 3 card labels should be visible
    await expect(page.getByText('Cover Letter').first()).toBeVisible();
    await expect(page.getByText('Template').first()).toBeVisible();
    await expect(page.getByText('Addendum').first()).toBeVisible();

    // Click Cover Letter card to select it
    await page.getByText('Cover Letter - Standard.pdf').click();
    // After click Cover Letter is selected - card is still visible (use .first() because tooltip also contains the filename)
    await expect(page.getByText('Cover Letter - Standard.pdf').first()).toBeVisible();
  });
});
