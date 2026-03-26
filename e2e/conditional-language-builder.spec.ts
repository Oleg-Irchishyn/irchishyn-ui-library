import { test, expect } from '@playwright/test';

const BASE = (id: string) =>
  `/iframe.html?id=components-languageeditor-conditionallanguagebuilder--${id}&viewMode=story`;

test.describe('ConditionalLanguageBuilder', () => {
  test('Default story renders the dialog open with IF condition builder @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('default'));
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Conditional Language Builder')).toBeVisible();
    // The IF keyword is rendered inside the dialog
    await expect(dialog.getByText('IF', { exact: true }).first()).toBeVisible();
  });

  test('AllDataTypes - dialog open with condition builder visible @smoke', async ({ page }) => {
    await page.goto(BASE('all-data-types'));
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Conditional Language Builder')).toBeVisible();
    // Field selector is shown as "Select field..."
    await expect(page.getByText('Select field...').first()).toBeVisible();
  });

  test('WithTrigger - "Open Conditional Language Builder" button visible, clicking opens dialog', async ({
    page,
  }) => {
    await page.goto(BASE('with-trigger'));
    const triggerBtn = page.getByRole('button', { name: /Open Conditional Language Builder/i });
    await expect(triggerBtn).toBeVisible();
    await triggerBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Conditional Language Builder' })).toBeVisible();
  });

  test('EmptyFieldConfig - dialog open but no field options', async ({ page }) => {
    await page.goto(BASE('empty-field-config'));
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Conditional Language Builder')).toBeVisible();
    // "Investor Name" should not exist with empty config
    await expect(page.getByText('Investor Name')).not.toBeVisible();
  });
});
