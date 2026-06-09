import { Page, Locator } from '@playwright/test';

export class GfgLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordText: Locator;
  readonly rememberMeText: Locator;
  readonly signInButton: Locator;
  readonly createAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordInput = page.locator('input[type="password"]');
    this.forgotPasswordText = page.getByText('Forgot Password');
    this.rememberMeText = page.getByText('Remember me');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.createAccountLink = page.getByRole('link', { name: 'Why Create an Account?' });
  }

  async goto() {
    await this.page.goto('https://auth.geeksforgeeks.org/');
  }
}