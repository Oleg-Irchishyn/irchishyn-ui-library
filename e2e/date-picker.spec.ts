import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-datepicker--${id}&viewMode=story`;

test.describe('DatePicker', () => {
  test('SingleDate renders date input with label "Notice Date" and pre-filled date @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('single-date'));
    await expect(page.getByText('Notice Date').first()).toBeVisible();
    // The MUI date input is pre-filled with 04/06/2026
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('04/06/2026');
  });

  test('QuickSelect renders dropdown for quick date range selection with label "Date Range" @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('quick-select'));
    // Label appears multiple times (floating + legend) - use first()
    await expect(page.getByText('Date Range').first()).toBeVisible();
    // Quick select has a button/combobox trigger
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  test('ErrorState - Submit button visible, clicking with no date shows "Date is required"', async ({
    page,
  }) => {
    await page.goto(BASE('error-state'));
    const submitButton = page.getByRole('button', { name: /Submit/i });
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    await expect(page.getByText('Date is required')).toBeVisible();
  });

  test('Placeholders - both date picker inputs show placeholder text', async ({ page }) => {
    await page.goto(BASE('placeholders'));
    await expect(page.getByPlaceholder('Select Notice Date')).toBeVisible();
    await expect(page.getByPlaceholder('Select Date Range')).toBeVisible();
  });

  test('CustomFormat - date input shows date in dd/MM/yyyy format', async ({ page }) => {
    await page.goto(BASE('custom-format'));
    // MUI date input does not use role="textbox", use locator('input')
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
    // Value should be in dd/MM/yyyy format (06/04/2026)
    await expect(input).toHaveValue('06/04/2026');
  });
});
