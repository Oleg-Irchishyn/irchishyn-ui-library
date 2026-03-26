import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-actionbutton--${id}&viewMode=story`;

test.describe('ActionButton', () => {
  test('PrimaryWithIcon renders "New Capital Event" button @smoke', async ({ page }) => {
    await page.goto(BASE('primary-with-icon'));
    await expect(page.getByRole('button', { name: /New Capital Event/ })).toBeVisible();
  });

  test('Disabled story shows a disabled button @smoke', async ({ page }) => {
    await page.goto(BASE('disabled'));
    const btn = page.getByRole('button', { name: /New Capital Event/ });
    await expect(btn).toBeVisible();
    await expect(btn).toBeDisabled();
  });

  test('Secondary renders "Cancel" button', async ({ page }) => {
    await page.goto(BASE('secondary'));
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('AllSizes renders Small, Medium, Large buttons', async ({ page }) => {
    await page.goto(BASE('all-sizes'));
    await expect(page.getByRole('button', { name: /Small/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Medium/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Large/ })).toBeVisible();
  });

  test('Icon story renders a button (icon only)', async ({ page }) => {
    await page.goto(BASE('icon'));
    // icon-only button - check a button is present (tooltip: Delete)
    await expect(page.getByRole('button').first()).toBeVisible();
  });
});
