import {
  Before,
  After,
  AfterStep,
  Given,
  When,
  Then,
  setDefaultTimeout
} from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';
import { ShopPage } from '../pages/shop.page.js';
import fs from 'fs';
import path from 'path';

setDefaultTimeout(60 * 1000);

let browser: Browser;
let page: Page;
let shopPage: ShopPage;

Before({ tags: '@smoke or @login or @register or @cart or @checkout or @checkout-guest or @regression or @auth' }, async function () {
  browser = await chromium.launch({
    headless: false,
    slowMo: 250
  });
  const context = await browser.newContext();
  page = await context.newPage();
  shopPage = new ShopPage(page);
  if (!fs.existsSync('reports/screenshots')) {
    fs.mkdirSync('reports/screenshots', { recursive: true });
  }
});

AfterStep({ tags: '@smoke or @login or @register or @cart or @checkout or @checkout-guest or @regression or @auth' }, async function ({ pickleStep }) {
  const fileName = `${Date.now()}_${pickleStep.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  const screenshotPath = path.join('reports/screenshots', fileName);
  const image = await page.screenshot({ path: screenshotPath, fullPage: true });
  await this.attach(image, 'image/png');
});

After({ tags: '@smoke or @login or @register or @cart or @checkout or @checkout-guest or @regression or @auth' }, async function () {
  await browser.close();
});

Given('the user opens the practice software testing homepage', async function () {
  await shopPage.openHomepage();
});

When('the user browses homepage navigation', async function () {
  await shopPage.browseNavigation();
});

When('the user selects a hardware product', async function () {
  await shopPage.selectProduct();
});

When('the user adds the product to cart', async function () {
  await shopPage.addToCart();
});

Then('the cart should show the selected product', async function () {
  await shopPage.openCart();
});

When('the user navigates to login page', async function () {
  await shopPage.goToLoginPage();
});

When('the user logs in', async function () {
  await shopPage.loginAccount();
});

When('the user navigates to register page', async function () {
  await shopPage.goToRegisterPage();
});

When('the user registers', async function () {
  await shopPage.registerAccount();
});

Then('the user should be authenticated', async function () {
  await shopPage.verifyAuthenticated();
});

When('the user proceeds to checkout', async function () {
  await shopPage.proceedToCheckout();
});

When('the user processes identity verification at checkout', async function () {
  await shopPage.continueCheckoutFailsafe();
});

When('the user fills billing details', async function () {
  await shopPage.fillBillingDetails();
  await shopPage.proceedBilling();
});

When('the user selects payment method', async function () {
  await shopPage.selectPaymentMethod('cash-on-delivery');
});

When('the user confirms the order', async function () {
  await shopPage.finishOrder();
});

Then('the order confirmation message should appear', async function () {
  await shopPage.verifySuccess();
});