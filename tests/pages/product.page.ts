import { Page, expect } from '@playwright/test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const searchData = require('../../Assets/test-data/search-data.json');

export class ProductPage {

    constructor(private page: Page) {}

    // ---------- Search Locators ----------
    searchBox = '#search-query';
    productName = '[data-test="product-name"]';

    // ---------- Sort Locator ----------
    sortDropdown = '[data-test="sort"]';

    // ---------- Comparison Locators ----------
    compareNowButton = this.page.getByRole('link', {
        name: 'Compare Now'
    });

    clearAllButton = this.page.getByRole('button', {
        name: 'Clear All'
    });

    browseProductsButton = this.page.getByRole('link', {
        name: 'Browse Products'
    });

    emptyComparisonMessage = this.page.getByText(
        'No products selected for comparison'
    );

    // -------------------------------------------------

    async openHomepage() {

        await this.page.goto(
            'https://practicesoftwaretesting.com/',
            {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            }
        );

    }

    // -------------------------------------------------

    async searchProduct(productName: string) {

        const searchBox = this.page.locator(this.searchBox);

        await searchBox.click();

        await searchBox.clear();

        await searchBox.pressSequentially(productName, {
            delay: 150
        });

        await searchBox.press('Enter');

        await this.page.waitForTimeout(2000);

    }

    // -------------------------------------------------

    async verifyProductDisplayed(productName: string) {

        const product = this.page
            .locator(this.productName)
            .filter({ hasText: productName });

        await expect(product.first()).toBeVisible();

        console.log(`${productName} found successfully`);

    }

    // -------------------------------------------------

    async selectSortOption(option: string) {

        const sortDropdown = this.page.locator(this.sortDropdown);

        await sortDropdown.selectOption({
            label: option
        });

        console.log(`${option} applied successfully`);

        await this.page.waitForTimeout(2000);

    }

    // -------------------------------------------------
    // PRODUCT COMPARISON
    // -------------------------------------------------

    async selectProductForComparison(productName: string) {

        const productCard = this.page
            .locator('[data-test^="product-"]')
            .filter({
                has: this.page.locator(
                    '[data-test="product-name"]',
                    { hasText: productName }
                )
            });

        console.log(
            "Matching cards:",
            await productCard.count()
        );

        const compareButton = productCard
            .locator('[data-test="compare-btn"]')
            .first();

        await compareButton.scrollIntoViewIfNeeded();

        await compareButton.hover();

        await this.page.waitForTimeout(1000);

        await compareButton.click();

        await this.page.waitForTimeout(2000);

        console.log(`${productName} added for comparison`);

    }

    // -------------------------------------------------

    async clickCompareNow() {

        await this.compareNowButton.scrollIntoViewIfNeeded();

        await this.compareNowButton.hover();

        await this.page.waitForTimeout(1000);

        await this.compareNowButton.click();

        await this.page.waitForTimeout(3000);

    }

    // -------------------------------------------------

    async verifyComparisonPage() {

        await expect(
            this.page.getByRole('heading', {
                name: 'Product Comparison'
            })
        ).toBeVisible();

    }

    // -------------------------------------------------

    async verifyComparedProduct(productName: string) {

        await expect(
            this.page
                .locator('[data-test="product-name"]')
                .filter({ hasText: productName })
                .first()
        ).toBeVisible();

        console.log(`${productName} is present on comparison page`);

        await this.page.waitForTimeout(1500);

    }

    // -------------------------------------------------

    async clearComparedProducts() {

        await this.clearAllButton.hover();

        await this.page.waitForTimeout(1000);

        await this.clearAllButton.click();

        await this.page.waitForTimeout(3000);

    }

    // -------------------------------------------------

    async verifyNoProductsMessage() {

        await expect(
            this.emptyComparisonMessage
        ).toBeVisible();

    }

    // -------------------------------------------------

    async clickBrowseProducts() {

        await this.browseProductsButton.hover();

        await this.page.waitForTimeout(1000);

        await this.browseProductsButton.click();

        await this.page.waitForTimeout(3000);

    }

    // -------------------------------------------------

    async verifyHomePage() {

        await expect(this.page).toHaveURL(
            'https://practicesoftwaretesting.com/'
        );

    }

}