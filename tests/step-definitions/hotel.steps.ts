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
import { HotelPage } from '../pages/hotel.page.js';
import fs from 'fs';
import path from 'path';

setDefaultTimeout(60 * 1000);

let browser: Browser;
let page: Page;
let hotelPage: HotelPage;

Before({ tags: '@hotel' }, async function () {
  browser = await chromium.launch({
    headless: false,
    slowMo: 150
  });

  const context = await browser.newContext();
  page = await context.newPage();
  hotelPage = new HotelPage(page);

  if (!fs.existsSync('reports/screenshots')) {
    fs.mkdirSync('reports/screenshots', { recursive: true });
  }
});

AfterStep({ tags: '@hotel' }, async function ({ pickleStep }) {
  const fileName = `${Date.now()}_${pickleStep.text.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  const screenshotPath = path.join('reports/screenshots', fileName);
  const image = await page.screenshot({ path: screenshotPath, fullPage: true });
  await this.attach(image, 'image/png');
  console.log(`Step completed: ${pickleStep.text}`);
});

After({ tags: '@hotel' }, async function () {
  await browser.close();
});

Given('the guest opens the hotel homepage', async function () {
  await hotelPage.openHomepage();
});

When('the guest selects stay dates', async function () {
  await hotelPage.selectStayDates();
});

When('the guest checks availability', async function () {
  await hotelPage.checkAvailability();
});

When('the guest chooses a room from the available options', async function () {
  await hotelPage.chooseRoomAndOpenBooking();
});

Then('the guest tries the reserve now feature', async function () {
    await hotelPage.reserveNow1();
});

Then('the guest completes the booking details', async function () {
  await hotelPage.fillBookingDetails();
  await hotelPage.reserveNow();
});

Then('the booking is confirmed', async function () {
  await page.getByRole('heading', { name: 'Booking Confirmed' }).isVisible();
});
