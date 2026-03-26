import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-badge--${id}&viewMode=story`;

test.describe('Badge', () => {
  test('Default renders "Capital Call" badge @smoke', async ({ page }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText('Capital Call')).toBeVisible();
  });

  test('StatusExamples shows multiple badges including "Capital Call", "Preparation", "System" @smoke', async ({
    page,
  }) => {
    await page.goto(BASE('status-examples'));
    await expect(page.getByText('Capital Call').first()).toBeVisible();
    await expect(page.getByText('Preparation').first()).toBeVisible();
    await expect(page.getByText('System').first()).toBeVisible();
  });

  test('Outlined story renders "In-Preparation" badge', async ({ page }) => {
    await page.goto(BASE('outlined'));
    await expect(page.getByText('In-Preparation')).toBeVisible();
  });

  test('Sizes shows "Small Badge" and "Medium Badge"', async ({ page }) => {
    await page.goto(BASE('sizes'));
    await expect(page.getByText('Small Badge')).toBeVisible();
    await expect(page.getByText('Medium Badge')).toBeVisible();
  });

  test('SemanticColors shows badges including "Editable" and "Preparation"', async ({ page }) => {
    await page.goto(BASE('semantic-colors'));
    await expect(page.getByText('Editable')).toBeVisible();
    // "Preparation" may appear multiple times - use first()
    await expect(page.getByText('Preparation').first()).toBeVisible();
  });
});
