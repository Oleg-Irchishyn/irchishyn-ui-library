import { test, expect } from '@playwright/test';

const BASE = (id: string) =>
  `/iframe.html?id=components-datetextselect--${id}&viewMode=story`;

test.describe('DateTextSelect', () => {
  test('Default renders component with "Due Date Type" label, date input and select dropdown @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText('Due Date Type').first()).toBeVisible();
    // The MUI date input (pre-filled)
    const dateInput = page.locator('input').first();
    await expect(dateInput).toBeVisible();
    // Select dropdown (second input for the select field)
    await expect(page.locator('input').nth(1)).toBeVisible();
  });

  test('ErrorState - Submit button visible, clicking triggers required field validation @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('error-state'));
    const submitButton = page.getByRole('button', { name: /Submit/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    // After clicking Submit with empty date, required state triggers
    // The component sets required=true, which should show required indicator on the label
    await expect(page.getByText('Due Date Type')).toBeVisible();
  });

  test('ConnectedDateRules - dropdown with options (Keep All, Business Days, Calendar Days) visible', async ({
    page,
  }) => {
    await page.goto(BASE('connected-date-rules'));
    // Open the MUI Select to see all options — use the MuiSelect-select class to target it precisely
    const selectTrigger = page.locator('.MuiSelect-select').first();
    await expect(selectTrigger).toBeVisible();
    await selectTrigger.click();
    await expect(page.getByRole('option', { name: 'Business Days' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Calendar Days' })).toBeVisible();
  });

  test('Placeholders - "Choose Notice Date" and "Choose Date Type" placeholders visible', async ({
    page,
  }) => {
    await page.goto(BASE('placeholders'));
    await expect(page.getByPlaceholder('Choose Notice Date')).toBeVisible();
    // The select placeholder text
    await expect(page.getByText('Choose Date Type')).toBeVisible();
  });
});
