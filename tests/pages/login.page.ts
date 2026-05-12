import { Page, expect } from '@playwright/test';
import { loginLocators } from '../../utilities/locators/login.locator';
import testData from '../../Assets/test-data/data.json';

export class LoginPage {
  constructor(private page: Page) {}

  async navigateToLoginPage() {
    console.log('Opening URL:', testData.validUser.url);
    await this.page.goto(testData.validUser.url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await this.page.waitForTimeout(1500);
    console.log('Website Opened');
  }

  async enterUsername() {
    await this.page.fill(
      loginLocators.usernameInput,
      testData.validUser.username
    );
    await this.page.waitForTimeout(1000);
  }

  async enterPassword() {
    await this.page.fill(
      loginLocators.passwordInput,
      testData.validUser.password
    );
    await this.page.waitForTimeout(1000);
  }

  async clickLogin() {
    await this.page.click(loginLocators.loginButton);
    await this.page.waitForTimeout(1000);
  }

  async verifySuccessfulLogin() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.page.locator(loginLocators.successMessage)).toHaveText('Products');
    await this.page.waitForTimeout(1500);
  }
}