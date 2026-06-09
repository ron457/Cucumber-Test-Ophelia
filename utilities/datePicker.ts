import { test, expect } from '@playwright/test';

test('select two dates on automationintesting.online', async ({ page }) => {
  await page.goto('https://automationintesting.online/');

  const dateInputs = page.getByRole('textbox');
  await expect(dateInputs.first()).toBeVisible();
  await expect(dateInputs.nth(1)).toBeVisible();

  await dateInputs.first().click();
  await page.getByRole('gridcell', { name: 'Choose Wednesday, 20 May' }).click();

  await dateInputs.nth(1).click();
  await page.getByRole('gridcell', { name: 'Choose Friday, 22 May' }).click();
});