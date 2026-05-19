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
import { LoginPage } from '../pages/login.page.js';
import fs from 'fs';
import path from 'path';

setDefaultTimeout(60 * 1000);

let browser: Browser;
let page: Page;
let loginPage: LoginPage;

Before({ tags: '@login' }, async function () {
  browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);

  if (!fs.existsSync('reports/screenshots')) {
    fs.mkdirSync('reports/screenshots', { recursive: true });
  }
});

AfterStep({ tags: '@login' }, async function ({ pickleStep }) {
  const fileName = `${Date.now()}_${pickleStep.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  const screenshotPath = path.join('reports/screenshots', fileName);

  const image = await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  await this.attach(image, 'image/png');
  console.log(`Step completed: ${pickleStep.text}`);
});

After({ tags: '@login' }, async function () {
  await browser.close();
});

Given('user navigates to login page', async function () {
  await loginPage.navigateToLoginPage();
});

When('user enters valid username', async function () {
  await loginPage.enterUsername();
});

When('user enters valid password', async function () {
  await loginPage.enterPassword();
});

When('user clicks on login button', async function () {
  await loginPage.clickLogin();
});

Then('user should be redirected to dashboard page', async function () {
  await loginPage.verifySuccessfulLogin();
});