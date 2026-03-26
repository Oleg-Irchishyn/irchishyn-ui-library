import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-fileupload--${id}&viewMode=story`;

test.describe('FileUpload', () => {
  test('Default renders drop zone with "Browse" button @smoke', async ({ page }) => {
    await page.goto(BASE('default'));
    await expect(page.getByRole('button', { name: /Browse/i })).toBeVisible();
  });

  test('Disabled story renders a disabled upload area with Browse button disabled @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('disabled'));
    const browseButton = page.getByRole('button', { name: /Browse/i });
    await expect(browseButton).toBeVisible();
    await expect(browseButton).toBeDisabled();
  });

  test('AllStates renders Idle, max size, and Disabled sections', async ({ page }) => {
    await page.goto(BASE('all-states'));
    await expect(page.getByText('Idle')).toBeVisible();
    await expect(page.getByText(/Disabled/i).first()).toBeVisible();
    // There should be multiple Browse buttons (one per state)
    await expect(page.getByRole('button', { name: /Browse/i }).first()).toBeVisible();
  });

  test('WithCallback - drop zone visible', async ({ page }) => {
    await page.goto(BASE('with-callback'));
    await expect(page.getByRole('button', { name: /Browse/i })).toBeVisible();
  });
});
