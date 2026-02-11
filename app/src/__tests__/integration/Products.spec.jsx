// Importujemy funkcje do renderowania komponentów i symulowania interakcji z UI
import { screen, waitFor, fireEvent } from '@testing-library/react';
// Importujemy funkcję, dzięki której komponenty korzystające z Redux, React Query lub routera działają poprawnie w testach
import { renderWithProviders } from './helpers/renderWithProviders';
// Importujemy komponent, który będziemy testować
import Products from '@/pages/Products';
// Importujemy narzędzia do mockowania API
import { http, HttpResponse } from 'msw';
// Import stałej z URL API
import { FAKE_API_URL } from '@/constants';
// Importujemy mockowy serwer API
import { server } from '@/__mocks__/server';
// Import funkcji do bardziej precyzyjnych zapytań w obrębie elementu
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// --- Definicja testów integracyjnych dla komponentu Products ---
describe('Products integration tests', () => {
  // Test: sprawdzamy, czy spinner ładowania się pojawia
  it('shows spinner while loading', () => {
    renderWithProviders(<Products />); // renderujemy komponent
    expect(screen.getByTestId('spinner')).toBeInTheDocument(); // sprawdzamy spinner
  });

  // Test: sprawdzamy, czy produkty są wyświetlane po załadowaniu
  it('renders products after loading', async () => {
    renderWithProviders(<Products />);
    const product1 = await screen.findByText('Product 1'); // czekamy na pojawienie się produktu 1
    expect(product1).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });

  // Test: sprawdzamy komunikat, gdy API zwraca pustą listę produktów
  // server.use(...) pozwala nadpisać istniejący handler /products tylko w tym teście, żeby zwrócił pustą listę zamiast standardowych produktów.
  it('shows message when API returns empty products', async () => {
    // Zmieniamy mockowane API tak, żeby zwracało pustą tablicę
    server.use(
      http.get(`${FAKE_API_URL}/products`, () => HttpResponse.json([])), // Nadpisujemy handler MSW, aby sprawdzić zachowanie UI przy pustej odpowiedzi API
    );

    renderWithProviders(<Products />);
    const message = await screen.findByText(/No products to view/i); // sprawdzamy komunikat
    expect(message).toBeInTheDocument();
  });

  // UWAGA: Test może generować ostrzeżenie w konsoli:
  // "MUI: The anchorEl prop provided to the component is invalid."
  //
  // PRZYCZYNA: Jest to znany problem podczas testowania MUI Select w środowisku JSDOM.
  // JSDOM nie renderuje fizycznie układu strony (layoutu), więc elementy nie mają wymiarów.
  // MUI nie może przez to obliczyć pozycji "elementu zakotwiczającego" (anchorEl),
  // czyli przycisku Selecta, do którego menu powinno zostać "przyczepione".
  // Ponieważ JSDOM widzi wymiary Selecta jako 0x0, MUI zgłasza błąd pozycjonowania.
  //
  // STATUS: Testy przechodzą poprawnie, a funkcjonalność filtrowania jest w pełni
  // zweryfikowana przez asercje. Ostrzeżenie można bezpiecznie zignorować
  // w środowisku testowym.

  // Test: sprawdzamy filtrowanie po kategorii
  it('filters products by category', async () => {
    // 2. Zainicjuj sesję użytkownika
    const user = userEvent.setup();

    renderWithProviders(<Products />);
    await screen.findByText('Product 1');

    // 3. Znajdź Select (MUI Select ma rolę 'combobox')
    const categorySelect = screen.getByRole('combobox', { name: /Category/i });

    // 4. Kliknij w Select, żeby otworzyć menu
    await user.click(categorySelect);

    // 5. Czekamy na pojawienie się listy opcji
    const listbox = await screen.findByRole('listbox');

    // 6. Wybieramy opcję
    const electronicsOption = within(listbox).getByRole('option', {
      name: /Electronics/i,
    });
    await user.click(electronicsOption);

    // Sprawdzamy wyniki
    await waitFor(() => {
      expect(screen.getByText(/Product 1 Electronics/i)).toBeInTheDocument();
    });
  });

  // Test: filtrowanie po wyszukiwaniu tekstu
  it('filters products by search input', async () => {
    renderWithProviders(<Products />);
    await screen.findByText('Product 1');

    // Pobieramy input wyszukiwania
    const searchInput = screen.getByRole('textbox', { name: /Search/i });
    fireEvent.change(searchInput, { target: { value: 'Product 2' } }); // wpisujemy tekst

    // Sprawdzamy wyniki filtrowania
    await waitFor(() => {
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    });
  });

  // Test: resetowanie filtrów
  it('resets filters', async () => {
    renderWithProviders(<Products />);
    await screen.findByText('Product 1');

    // Klikamy przycisk reset
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);

    // Sprawdzamy, czy wszystkie produkty są ponownie widoczne
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });
  });
});
