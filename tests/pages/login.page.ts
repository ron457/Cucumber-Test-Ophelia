import { Page, expect } from '@playwright/test';
import { loginLocators } from '../../utilities/locators/login.locator';
import testData from '../../Assets/test-data/data.json';

export class LoginPage {
  constructor(private page: Page) {}

  private async captureStep(stepName: string) {
    const safeName = stepName.replace(/\s+/g, '_').toLowerCase();
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_${safeName}.png`,
      fullPage: true
    });
    console.log(`Screenshot captured: ${stepName}`);
  }

  async navigateToLoginPage() {
    console.log('Opening URL:', testData.validUser.url);
    await this.page.goto(testData.validUser.url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await this.page.waitForTimeout(2000);
    console.log('Website Opened');
    await this.captureStep('login page opened');
  }

  async enterUsername() {
    console.log('Before entering username');
    await this.captureStep('before entering username');

    await this.page.fill(
      loginLocators.usernameInput,
      testData.validUser.username
    );

    console.log('After entering username');
    await this.captureStep('after entering username');
    await this.page.waitForTimeout(1000);
  }

  async enterPassword() {
    console.log('Before entering password');
    await this.captureStep('before entering password');

    await this.page.fill(
      loginLocators.passwordInput,
      testData.validUser.password
    );

    console.log('After entering password');
    await this.captureStep('after entering password');
    await this.page.waitForTimeout(1000);
  }

  async clickLogin() {
    console.log('Before clicking login');
    await this.captureStep('before clicking login');

    await this.page.click(loginLocators.loginButton);

    console.log('After clicking login');
    await this.captureStep('after clicking login');
    await this.page.waitForTimeout(1500);
  }

  async verifySuccessfulLogin() {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
    await expect(this.page.locator(loginLocators.successMessage)).toHaveText('Products');

    console.log('Inventory page opened successfully');
    await this.captureStep('inventory page opened');
  }
}