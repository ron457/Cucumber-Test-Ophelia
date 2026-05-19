import { Page, expect } from '@playwright/test';
import { hotelLocators } from '..//..//utilities/locators/hotel.locator.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const testData = require('../../Assets/test-data/hotel-data.json');

export class HotelPage {
  constructor(private page: Page) {}

  private async captureStep(stepName: string) {
    const safeName = stepName.replace(/\s+/g, '_').toLowerCase();
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_${safeName}.png`,
      fullPage: true
    });
  }

  async openHomepage() {
    await this.page.goto(testData.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.col-2').first().screenshot({
      path: `reports/screenshots/${Date.now()}_availability_section.png`
    });
    await this.captureStep('homepage opened');
    await this.page.waitForTimeout(2000);
  }

  async selectStayDates() {
    const inputs = this.page.getByRole('textbox');
    await expect(inputs.first()).toBeVisible();
    await inputs.first().click();
    await this.page.getByRole('gridcell', { name: 'Choose Monday, 25 May' }).click();

    await expect(inputs.nth(1)).toBeVisible();
    await inputs.nth(1).click();
    await this.page.getByRole('gridcell', { name: 'Choose Wednesday, 27 May' }).click();

    await this.captureStep('selected stay dates');
    await this.page.waitForTimeout(2000);
  }

  async checkAvailability() {
    await this.page.getByRole('button', { name: 'Check Availability' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_availability_results.png`,
      fullPage: true
    });
    await this.captureStep('checked availability');
    await this.page.waitForTimeout(2000);
  }

  async chooseRoomAndOpenBooking() {
    const roomBookNow = this.page.getByRole('link', { name: 'Book now' }).nth(1);
    await roomBookNow.waitFor({ state: 'visible' });
    await roomBookNow.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_booking_page_opened.png`,
      fullPage: true
    });
    await this.captureStep('opened booking page');
    await this.page.waitForTimeout(2000);
  }

  async reserveNow1() {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
    await expect(this.page.getByRole('heading', { name: 'Book This Room' })).toBeVisible();
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_booking_confirmed.png`,
      fullPage: true
    });
    await this.captureStep('Book This Room');
    await this.page.waitForTimeout(2000);
  }

  async fillBookingDetails() {
    await this.page.getByRole('textbox', { name: 'Firstname' }).fill(testData.booking.firstname);
    await this.page.getByRole('textbox', { name: 'Lastname' }).fill(testData.booking.lastname);
    await this.page.getByRole('textbox', { name: 'Email' }).fill(testData.booking.email);
    await this.page.getByRole('textbox', { name: 'Phone' }).fill(testData.booking.phone);

    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_booking_form_filled.png`,
      fullPage: true
    });
    await this.captureStep('filled booking details');
    await this.page.waitForTimeout(3000);
  }

  async reserveNow() {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
    await expect(this.page.getByRole('heading', { name: 'Booking Confirmed' })).toBeVisible();
    await this.page.screenshot({
      path: `reports/screenshots/${Date.now()}_booking_confirmed.png`,
      fullPage: true
    });
    await this.captureStep('booking confirmed');

}
}
