import { test, expect } from '@playwright/test';

const BASE = (id: string) =>
  `/iframe.html?id=components-languageeditor-languageeditor--${id}&viewMode=story`;

test.describe('LanguageEditor', () => {
  test('Default renders editor with toolbar buttons @smoke', async ({ page }) => {
    await page.goto(BASE('default'));
    await expect(page.getByRole('button', { name: /Insert Field/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Conditional Language Builder/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Validate/i })).toBeVisible();
  });

  test('WithContent - editor area contains investor name token @smoke', async ({ page }) => {
    await page.goto(BASE('with-content'));
    // The content contains «INVESTOR_NAME» which is rendered as a token chip or text
    await expect(page.getByText(/INVESTOR_NAME/).first()).toBeVisible();
  });

  test('ReadOnly - toolbar buttons are disabled', async ({ page }) => {
    await page.goto(BASE('read-only'));
    const insertFieldBtn = page.getByRole('button', { name: /Insert Field/i });
    await expect(insertFieldBtn).toBeVisible();
    await expect(insertFieldBtn).toBeDisabled();
  });

  test('Empty - editor renders with placeholder attribute set', async ({ page }) => {
    await page.goto(BASE('empty'));
    // The placeholder is a data-placeholder attribute on the contenteditable div
    const editorArea = page.locator('[data-placeholder="Start typing your content here..."]');
    await expect(editorArea).toBeVisible();
  });

  test('ValidationErrors - Validate button visible and clicking shows validation errors', async ({
    page,
  }) => {
    await page.goto(BASE('validation-errors'));
    const validateBtn = page.getByRole('button', { name: /Validate/i });
    await expect(validateBtn).toBeVisible();
    await validateBtn.click();
    // After clicking validate, some error feedback should appear
    await expect(page.getByText(/error|invalid|unknown/i).first()).toBeVisible({ timeout: 5000 });
  });
});
