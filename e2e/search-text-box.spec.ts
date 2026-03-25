import { test, expect } from '@playwright/test';

const BASE = (id: string) =>
  `/iframe.html?id=components-searchtextbox--${id}&viewMode=story`;

test.describe('SearchTextBox', () => {
  test('Default renders input with placeholder "Search reports..." @smoke', async ({ page }) => {
    await page.goto(BASE('default'));
    await expect(page.getByPlaceholder('Search reports...')).toBeVisible();
  });

  test('WithClear shows input with existing text and clear button @smoke', async ({ page }) => {
    await page.goto(BASE('with-clear'));
    const input = page.getByRole('textbox');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('some search text');
    // clear (X) button is rendered when onClear is provided and value is non-empty
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  test('LiveFiltering - typing filters the visible list items', async ({ page }) => {
    await page.goto(BASE('live-filtering'));
    const input = page.getByPlaceholder('Search reports...');
    await expect(input).toBeVisible();
    await input.fill('Capital');
    await expect(page.getByText('Q2 2025 Capital Call Notice')).toBeVisible();
  });

  test('DebouncedCallback - input visible with correct placeholder', async ({ page }) => {
    await page.goto(BASE('debounced-callback'));
    await expect(page.getByPlaceholder('Type to see debounced value...')).toBeVisible();
  });
});
