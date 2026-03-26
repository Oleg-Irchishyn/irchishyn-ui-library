import { test, expect } from '@playwright/test';

const BASE = (id: string) => `/iframe.html?id=components-alert--${id}&viewMode=story`;

test.describe('Alert', () => {
  test('renders default info alert with title "Heads up" @smoke', async ({ page }) => {
    await page.goto(BASE('default'));
    await expect(page.getByText('Heads up')).toBeVisible();
    await expect(page.getByText('This is an informational message.')).toBeVisible();
  });

  test('SeverityVariants renders all 4 severity alerts @smoke', async ({ page }) => {
    await page.goto(BASE('severity-variants'));
    await expect(page.getByText('Info')).toBeVisible();
    await expect(page.getByText('Success')).toBeVisible();
    await expect(page.getByText('Warning')).toBeVisible();
    await expect(page.getByText('Error')).toBeVisible();
  });

  test('Variants renders standard, filled and outlined alerts', async ({ page }) => {
    await page.goto(BASE('variants'));
    await expect(page.getByText('Standard')).toBeVisible();
    await expect(page.getByText('Filled')).toBeVisible();
    // Scroll the third alert into view before asserting
    const outlinedAlert = page.getByRole('alert').nth(2);
    await outlinedAlert.scrollIntoViewIfNeeded();
    await expect(outlinedAlert).toBeVisible();
  });

  test('DismissibleAndAction shows alert with Retry action button', async ({ page }) => {
    await page.goto(BASE('dismissible-and-action'));
    await expect(page.getByText('Action required')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
  });

  test('ControlledVisibility - Hide/Show Alert button is visible and clicking Hide hides the alert', async ({
    page,
  }) => {
    await page.goto(BASE('controlled-visibility'));
    const toggleButton = page.getByRole('button', { name: 'Hide Alert' });
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();
    await expect(page.getByText('Controlled alert')).not.toBeVisible();
  });

  test('AnimatedOptions - two animated alerts are visible on page', async ({ page }) => {
    await page.goto(BASE('animated-options'));
    await expect(page.getByText('Slide from right side')).toBeVisible();
    await expect(page.getByText('Custom placement and direction')).toBeVisible();
  });

  test('CallbackToastApi - "Simulate Success" and "Simulate Error" buttons are visible', async ({
    page,
  }) => {
    await page.goto(BASE('callback-toast-api'));
    await expect(page.getByRole('button', { name: 'Simulate Success' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Simulate Error' })).toBeVisible();
  });
});
