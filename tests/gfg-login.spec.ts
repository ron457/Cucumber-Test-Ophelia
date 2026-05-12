import { test, expect } from '@playwright/test';
import { GfgLoginPage } from '../utilities/gfg-locators';

test.describe('GeeksforGeeks login page', () => {
  test.beforeEach(async ({ page }) => {
    const gfgLoginPage = new GfgLoginPage(page);
    await gfgLoginPage.goto();
  });

  test('login page opens', async ({ page }) => {
    await expect(page).toHaveURL(/login/);
  });

  test('username and password fields are visible', async ({ page }) => {
    const gfgLoginPage = new GfgLoginPage(page);
    await expect(gfgLoginPage.usernameInput).toBeVisible();
    await expect(gfgLoginPage.passwordInput).toBeVisible();
  });

  test('important login elements are visible', async ({ page }) => {
    const gfgLoginPage = new GfgLoginPage(page);
    await expect(gfgLoginPage.rememberMeText).toBeVisible();
    await expect(gfgLoginPage.forgotPasswordText).toBeVisible();
    await expect(gfgLoginPage.signInButton).toBeVisible();
    await expect(gfgLoginPage.createAccountLink).toBeVisible();
  });
});