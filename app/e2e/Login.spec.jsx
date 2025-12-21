import { test, expect } from '@playwright/test';

test.describe('Login E2E tests', () => {
  // Pobranie BASE_URL z konfiguracji Playwright / środowiska
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    // Otwieramy stronę login
    await page.goto(`${baseURL}/login`);
  });

  test('should log in successfully with correct credentials', async ({
    page,
  }) => {
    const username = 'johnd';
    const password = 'm38rmF$';

    // Wypełniamy formularz
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);

    // Klikamy login
    await page.click('button[type="submit"]');

    // Czekamy aż nastąpi przekierowanie na stronę główną "/"
    await page.waitForURL(`${baseURL}/`, { timeout: 10000 });

    // Sprawdzenie tokena w localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).not.toBeNull();
  });

  test('should show error message for invalid credentials', async ({
    page,
  }) => {
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');

    await page.click('button[type="submit"]');

    const errorLocator = page.locator('[data-testid="login-error"]');
    await expect(errorLocator).toBeVisible();

    // Dopasowujemy tekst do faktycznego komunikatu
    await expect(errorLocator).toHaveText('Invalid username or password');

    await expect(page).toHaveURL(`${baseURL}/login`);
  });
});
