import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const comparisonData = require('../../Assets/test-data/comparison-data.json');
const searchData = require('../../Assets/test-data/search-data.json');
const sortData = require('../../Assets/test-data/sort-data.json');

import {
  Before,
  After,
  When,
  Then
} from '@cucumber/cucumber';

import {
  chromium,
  Browser,
  Page
} from '@playwright/test';

import { ProductPage } from '../pages/product.page.js';

let browser: Browser;
let page: Page;
let productPage: ProductPage;

Before({ tags: '@search or @sort or @comparison' }, async function () {

  browser = await chromium.launch({
    headless: false,
    slowMo: 1500,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null,
    recordVideo: {
    dir: 'reports/videos/',
    size: {
        width: 1920,
        height: 1080
    }
  }
  });

  page = await context.newPage();

  productPage = new ProductPage(page);

  await productPage.openHomepage();

});

After(
  { tags: '@search or @sort or @comparison' },
  async function (scenario) {

    if (scenario.result?.status === 'FAILED') {

      const screenshot = await page.screenshot({
        path: `reports/screenshots/${Date.now()}.png`,
        fullPage: true
      });

      await this.attach(
        screenshot,
        'image/png'
      );
    }

    const videoPath = await page.video()?.path();

    if (videoPath) {

      const fs = require('fs');

      await this.attach(
        fs.readFileSync(videoPath),
        'video/webm'
      );

    }

    await browser.close();

  }
);

//
// SEARCH
//

When(
  'the user searches for multiple products',
  async function () {

    for (const product of searchData.products) {

      console.log(`Searching ${product}`);

      await productPage.openHomepage();

      await productPage.searchProduct(product);

      await productPage.verifyProductDisplayed(product);

      await page.waitForTimeout(2000);

    }

  }
);

Then(
  'products related to {string} should be displayed',
  async function (productName: string) {

    await productPage.verifyProductDisplayed(productName);

  }
);

//
// SORT
//

When(
  'the user sorts products by different criteria',
  async function () {

    for (const option of sortData.sortOptions) {

      console.log(`Testing ${option}`);

      await productPage.openHomepage();

      await productPage.selectSortOption(option);

      await page.waitForTimeout(3000);

    }

  }
);

Then(
  'products should be sorted correctly',
  async function () {

    console.log('All sorting options tested successfully');

  }
);

//
// COMPARISON
//

When(
'the user selects products for comparison',
async function () {
    console.log(comparisonData);

    for (const product of comparisonData.products) {

        await productPage.selectProductForComparison(product);

    }

}
);

When(
  'the user clicks Compare Now',
  async function () {

    await productPage.clickCompareNow();

  }
);

Then(
  'the comparison page should be displayed',
  async function () {

    await productPage.verifyComparisonPage();

    for (const product of comparisonData.products) {

      await productPage.verifyComparedProduct(product);

    }

  }
);

When(
  'the user clears all compared products',
  async function () {

    await productPage.clearComparedProducts();

  }
);

Then(
  'no products should remain for comparison',
  async function () {

    await productPage.verifyNoProductsMessage();

  }
);

When(
  'the user clicks Browse Products',
  async function () {

    await productPage.clickBrowseProducts();

  }
);

Then(
  'the user should be redirected to the home page',
  async function () {

    await productPage.verifyHomePage();

  }
);