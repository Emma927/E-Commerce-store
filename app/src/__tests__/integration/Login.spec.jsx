import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './helpers/renderWithProviders';
import Login from '@/pages/Login';
import { server } from '@/__mocks__/server';
import { http, HttpResponse } from 'msw';
import { FAKE_API_URL } from '@/constants';

describe('Login integration via MSW', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('logs in successfully using MSW handler', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole('button', { name: /login/i });

    // Używamy dokładnie danych, które MSW zna
    await user.type(usernameInput, 'johnd');
    await user.type(passwordInput, 'm38rmF$');
    await user.click(button);

    // Sprawdź loading
    expect(screen.getByTestId('login-button-loading')).toBeInTheDocument();

    // Sprawdź Redux po mutacji
    await waitFor(() =>
      expect(store.getState().user.token).toBe('fake-jwt-token-123'),
    );

    // Sprawdź localStorage
    const userData = localStorage.getItem('user');
    expect(userData).not.toBeNull();
    expect(JSON.parse(userData)).toEqual({
      username: 'johnd',
      token: 'fake-jwt-token-123',
    });

    // Po zalogowaniu komponent Login znika (redirect)
    await waitFor(() => {
      expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
    });
  });

  it('shows error when login fails via MSW override', async () => {
    // Nadpisujemy handler MSW tylko na ten test
    server.use(
      http.post(`${FAKE_API_URL}/auth/login`, () =>
        HttpResponse.json(
          { message: 'Invalid username or password' },
          { status: 401 },
        ),
      ),
    );

    const user = userEvent.setup();
    const { store } = renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'wrong');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Sprawdź komunikat błędu w UI
    expect(await screen.findByTestId('login-error')).toBeInTheDocument();

    // Redux nie został zaktualizowany
    expect(store.getState().user.token).toBeNull();

    // localStorage pozostaje puste
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
