import { test, expect } from '@playwright/test';
import { login } from './helpers/login';

test.describe('Purchase flow (login → cart → checkout → orders)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('logged user purchase', async ({ page }) => {
    await login(page);

    // Produkty
    await page.getByRole('link', { name: /products/i }).click();

    const addBtns = page.getByRole('button', { name: 'Add to cart' });
    await addBtns.nth(0).click();
    await addBtns.nth(1).click();

    // Cart
    await page.getByRole('link', { name: /cart/i }).click();

    const incrementBtns = page.locator('[data-testid^="increment-button-"]');
    await incrementBtns.first().click();

    const qtyInputs = page.locator('input[type="number"]');
    await expect(qtyInputs.first()).toHaveValue('2');

    // Checkout
    await page.getByRole('button', { name: 'Delivery and payment' }).click();

    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByLabel('Address').fill('New Road 7682');
    await page.getByLabel('City').fill('Kilcoole');
    await page.getByLabel('Postal Code').fill('12926-3874');
    await page.getByLabel('Country').fill('United States');

    await page.getByLabel('Cash on Delivery').check();
    await page.getByLabel('Standard').check();

    await page.getByRole('button', { name: 'Place Order' }).click();

    // Success
    await expect(page).toHaveURL('/checkout/success');
    await expect(page.getByText(/thank you/i)).toBeVisible();

    const orderItems = page.locator('[data-testid^="order-item-"]');
    await expect(orderItems).toHaveCount(2);
  });

  test('guest purchase', async ({ page }) => {
    await page.getByRole('link', { name: /products/i }).click();

    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    await page.getByRole('link', { name: /cart/i }).click();

    await page.locator('[data-testid^="increment-button-"]').first().click();

    await page.getByRole('button', { name: 'Delivery and payment' }).click();

    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Address').fill('123 Main St');
    await page.getByLabel('City').fill('New York');
    await page.getByLabel('Postal Code').fill('12-345');
    await page.getByLabel('Country').fill('United States');

    await page.getByLabel('Bank Transfer').check();
    await page.getByLabel('Express').check();

    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page).toHaveURL('/checkout/success');
  });
});