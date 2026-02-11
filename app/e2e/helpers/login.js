export async function login(page, username = 'johnd', password = 'm38rmF$') {
  // const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'; --baseURL jest już ustawione w playwright.config.js, więc nie musimy go tu ponownie deklarować oraz używać w testach.
  // Możemy po prostu używać względnych URLi, np. page.goto('/login') zamiast page.goto(`${baseURL}/login`) lub .toHaveURL(`/`) zamiast .toHaveURL(`${baseURL}/`).

  await page.goto('/login');
  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByTestId('login-button').click();
}
