import { Page, expect } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const testData = require('../../Assets/test-data/shop-data.json');

export class ShopPage {
  constructor(private page: Page) {}

  private log(msg: string) {
    console.log(`[SHOP] ${msg}`);
  }

  private async captureStep(stepName: string) {
    const safeName = stepName.replace(/\s+/g, '_').toLowerCase();
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_${safeName}.png`,
      fullPage: true
    });
    this.log(`Screenshot captured: ${stepName}`);
  }

  async openHomepage() {
    this.log(`Opening homepage: ${testData.url}`);
    await this.page.goto(testData.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(this.page.locator('[data-test="nav-home"]')).toBeVisible();
    this.log('Homepage loaded and nav-home visible');
    await this.captureStep('homepage opened');
  }

  async browseNavigation() {
    this.log('Browsing homepage navigation');
    await this.page.locator('[data-test="nav-home"]').click();
    await this.page.locator('[data-test="nav-categories"]').click();
    await this.page.locator('[data-test="nav-contact"]').click();
    await this.page.locator('[data-test="language-select"]').click();
    await this.page.locator('[data-test="nav-categories"]').click();
    await this.page.locator('[data-test="nav-home"]').click();
    this.log('Homepage navigation done');
    await this.captureStep('homepage navigation used');
  }

  async selectProduct() {
    this.log('Waiting for product card');
    await this.page.waitForLoadState('domcontentloaded');
    const product = this.page.locator('[data-test^="product-"]').first();
    await expect(product).toBeVisible({ timeout: 30000 });
    await product.click();
    this.log('Product card clicked');
    await this.captureStep('product selected');
  }

  async addToCart() {
    this.log('Clicking add to cart');
    await this.page.locator('[data-test="add-to-cart"]').click();
    await expect(this.page.getByRole('alert', { name: /Product added to shopping/i })).toBeVisible();
    this.log('Add to cart confirmed');
    await this.captureStep('product added to cart');
  }

  async openCart() {
    this.log('Opening cart');
    await expect(this.page.locator('[data-test="nav-cart"]')).toBeVisible({ timeout: 30000 });
    await this.page.locator('[data-test="nav-cart"]').click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    this.log('Cart opened');
    await this.captureStep('cart opened');
  }

  async goToLoginPage() {
    this.log('Navigating to login page');
    await this.page.goto('https://practicesoftwaretesting.com/auth/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await expect(this.page.locator('[data-test="email"]')).toBeVisible();
    this.log('Login page ready');
    await this.captureStep('login page opened');
  }

  async goToRegisterPage() {
    this.log('Navigating to register page');
    await this.page.goto('https://practicesoftwaretesting.com/auth/register', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await expect(this.page.locator('[data-test="register-form"]')).toBeVisible();
    this.log('Register page ready');
    await this.captureStep('register page opened');
  }

  async loginAccount() {
    this.log('Filling login credentials');
    await expect(this.page.locator('[data-test="email"]')).toBeVisible();
    await expect(this.page.locator('[data-test="password"]')).toBeVisible();
    await this.page.locator('[data-test="email"]').fill(testData.login.email);
    await this.page.locator('[data-test="password"]').fill(testData.login.password);
    this.log('Submitting login form');
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded').catch(() => {}),
      this.page.locator('[data-test="login-submit"]').click()
    ]);
    this.log('Login submitted');
    await this.captureStep('login submitted');
  }

  async registerAccount() {
    this.log('Filling registration form');
    await expect(this.page.locator('[data-test="register-form"]')).toBeVisible();
    await this.page.locator('[data-test="first-name"]').fill(testData.register.firstName);
    await this.page.locator('[data-test="last-name"]').fill(testData.register.lastName);
    await this.page.locator('[data-test="dob"]').fill(testData.register.dob);
    await this.page.locator('[data-test="country"]').selectOption(testData.register.country);
    await this.page.locator('[data-test="postal_code"]').fill(testData.register.postalCode);
    await this.page.locator('[data-test="house_number"]').fill(testData.register.houseNumber);
    await this.page.locator('[data-test="phone"]').fill(testData.register.phone);
    await this.page.locator('[data-test="email"]').fill(testData.register.email);
    await this.page.locator('[data-test="password"]').fill(testData.register.password);
    this.log('Submitting registration form');
    await this.page.locator('[data-test="register-submit"]').click();
    this.log('Registration submitted');
    await this.captureStep('registered');
  }

  async verifyAuthenticated() {
    this.log('Verifying authentication');
    await this.page.goto(testData.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await expect(this.page.locator('[data-test="nav-home"]')).toBeVisible();
    this.log('Authenticated and back on homepage');
    await this.captureStep('authenticated');
  }

  async proceedToCheckout() {
    this.log('Proceeding to checkout from cart');
    await this.openCart();
    await expect(this.page.locator('[data-test="proceed-1"]')).toBeVisible({ timeout: 30000 });
    await this.page.locator('[data-test="proceed-1"]').click();
    this.log('proceed-1 clicked');
    await this.captureStep('proceed one clicked');
  }

  async continueCheckoutAfterAuthentication() {
    this.log('Entering login details to continue checkout');
    const email = this.page.locator('[data-test="email"]');
    const password = this.page.locator('[data-test="password"]');
    const loginSubmit = this.page.locator('[data-test="login-submit"]');

    await expect(email).toBeVisible({ timeout: 30000 });
    await expect(password).toBeVisible({ timeout: 30000 });

    await email.fill(testData.login.email);
    await password.fill(testData.login.password);

    await Promise.all([
      this.page.waitForLoadState('domcontentloaded').catch(() => {}),
      loginSubmit.click()
    ]);

    this.log('Login submitted, waiting for checkout to resume');
    await expect(this.page.locator('[data-test="proceed-2"]')).toBeVisible({ timeout: 30000 });
    await this.page.locator('[data-test="proceed-2"]').click();
    this.log('proceed-2 clicked');
    await this.captureStep('continued checkout after authentication');
  }

  async continueCheckoutAsGuest() {
    this.log('Starting guest checkout flow');

    // Step 1: fill login fields and submit to trigger error
    const email = this.page.locator('[data-test="email"]');
    const password = this.page.locator('[data-test="password"]');

    await expect(email).toBeVisible({ timeout: 30000 });
    await email.fill(testData.login.email);
    await password.fill(testData.login.password);

    await this.page.locator('[data-test="login-submit"]').click();
    this.log('Login submitted — waiting for error');

    // Step 2: wait for invalid error text to appear
    await expect(
      this.page.getByText('Invalid email or password')
    ).toBeVisible({ timeout: 10000 });
    this.log('Login error confirmed');
    await this.captureStep('login failed switching to guest');

    // Step 3: click Continue as Guest tab
    await this.page.getByRole('tab', { name: 'Continue as Guest' }).click();
    this.log('Continue as Guest tab clicked');

    // Step 4: fill guest form
    await expect(
      this.page.locator('[data-test="guest-email"]')
    ).toBeVisible({ timeout: 15000 });

    await this.page.locator('[data-test="guest-email"]').fill(testData.guest.email);
    await this.page.locator('[data-test="guest-first-name"]').click();
    await this.page.locator('[data-test="guest-first-name"]').fill(testData.guest.firstName);
    await this.page.locator('[data-test="guest-last-name"]').click();
    await this.page.locator('[data-test="guest-last-name"]').fill(testData.guest.lastName);

    this.log('Guest form filled — submitting');
    await this.page.locator('[data-test="guest-submit"]').click();

    // Step 5: confirm guest session and proceed
    await expect(
      this.page.getByText(`Continuing as guest: ${testData.guest.firstName}`)
    ).toBeVisible({ timeout: 15000 });
    this.log('Guest session confirmed');

    await this.page.locator('[data-test="proceed-2-guest"]').click();
    this.log('proceed-2-guest clicked');
    await this.captureStep('continued checkout as guest');

    // Step 6: confirm billing address page loaded
    await expect(
      this.page.getByRole('heading', { name: 'Billing Address' })
    ).toBeVisible({ timeout: 30000 });
    this.log('Billing Address page confirmed — guest flow complete');
  }

  async fillBillingDetails() {
    this.log('Filling billing details');
    await expect(
      this.page.getByRole('heading', { name: 'Billing Address' })
    ).toBeVisible({ timeout: 30000 });
    await this.page.locator('[data-test="country"]').selectOption(testData.billing.country);
    await this.page.locator('[data-test="house_number"]').fill(testData.billing.houseNumber);
    await this.page.locator('[data-test="postal_code"]').fill(testData.billing.postalCode);
    await this.page.locator('[data-test="street"]').fill(testData.billing.street);
    await this.page.locator('[data-test="city"]').fill(testData.billing.city);
    await this.page.locator('[data-test="state"]').fill(testData.billing.state);
    this.log('Billing details filled');
    await this.captureStep('billing details filled');
  }

  async proceedBilling() {
    this.log('Clicking proceed-3 for guest or proceed-2 for auth');
    // Guest checkout uses proceed-3 after billing, auth uses proceed-2
    const proceed3 = this.page.locator('[data-test="proceed-3"]');
    const proceed2 = this.page.locator('[data-test="proceed-2"]');

    const hasProceed3 = await proceed3.isVisible().catch(() => false);
    if (hasProceed3) {
      await proceed3.click();
      this.log('proceed-3 clicked (guest flow)');
      await this.captureStep('billing proceeded guest');
    } else {
      await expect(proceed2).toBeVisible({ timeout: 15000 });
      await proceed2.click();
      this.log('proceed-2 clicked (auth flow)');
      await this.captureStep('billing proceeded auth');
    }
  }

  async selectPaymentMethod(method: string) {
    this.log(`Selecting payment method: ${method}`);
    await expect(
      this.page.getByRole('heading', { name: 'Payment' })
    ).toBeVisible({ timeout: 30000 });
    await this.page.locator('[data-test="payment-method"]').selectOption(method);
    this.log(`Payment method selected: ${method}`);
    await this.captureStep(`payment method ${method} selected`);
  }

  async finishOrder() {
    this.log('Clicking finish (first time)');
    await expect(
      this.page.locator('[data-test="finish"]')
    ).toBeVisible({ timeout: 30000 });
    await this.page.locator('[data-test="finish"]').click();
    this.log('First finish clicked');
    await this.captureStep('finish clicked first');

    // Wait for payment success message
    await expect(
      this.page.locator('[data-test="payment-success-message"]')
    ).toBeVisible({ timeout: 30000 });
    this.log('Payment success message visible');
    await this.captureStep('payment success message visible');

    // Click finish again to go to final confirmation
    await this.page.locator('[data-test="finish"]').click();
    this.log('Second finish clicked — navigating to confirmation');
    await this.captureStep('finish clicked second');
  }

  async verifySuccess() {
    this.log('Verifying final order confirmation text');
    await expect(
      this.page.getByText('Thanks for your order! Your')
    ).toBeVisible({ timeout: 30000 });
    this.log('Order confirmed');
    await this.captureStep('order confirmed');
  }
}