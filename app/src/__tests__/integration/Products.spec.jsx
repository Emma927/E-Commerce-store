// Importujemy funkcje do renderowania komponentów i symulowania interakcji z UI
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// Importujemy komponent, który będziemy testować
import Products from '@/pages/Products';
// Importujemy narzędzia do mockowania API
import { http, HttpResponse } from 'msw';
// Importujemy QueryClient i provider z React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Importujemy MemoryRouter, żeby móc testować komponenty z routingiem bez prawdziwego przeglądarkowego routera
import { MemoryRouter } from 'react-router-dom';
// Import stałej z URL API
import { FAKE_API_URL } from '@/constants';
// Importujemy Redux provider i funkcję do tworzenia store
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// Importujemy reducery dla store
import filtersReducer from '@/store/filtersSlice';
import favouritesReducer from '@/store/favouritesSlice';
// Import funkcji do definiowania testów w Vitest
import { describe, it, expect } from 'vitest';
// Importujemy mockowy serwer API
import { server } from '@/__mocks__/server';
// Import funkcji do bardziej precyzyjnych zapytań w obrębie elementu
import { within } from '@testing-library/react';

// --- Helper: funkcja do tworzenia QueryClient dla React Query ---
// Wyłączamy retry w testach, żeby nie czekało przy błędzie API
const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

// --- Helper: funkcja renderująca komponent z wszystkimi potrzebnymi providerami ---
// Zapewnia QueryClient, Redux Store i MemoryRouter
const renderWithProviders = (ui) => {
  const queryClient = createQueryClient();

  // Tworzymy store z naszymi reducerami i preloaded state
  const store = configureStore({
    reducer: {
      filters: filtersReducer,
      favourites: favouritesReducer,
    },
    preloadedState: {
      favourites: { favouritesProducts: [] }, // startujemy bez ulubionych produktów
    },
  });

  // Renderujemy UI w providerach Redux, React Query i Routerze
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  );
};

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
  it('shows message when API returns empty products', async () => {
    // Zmieniamy mockowane API tak, żeby zwracało pustą tablicę
    server.use(
      http.get(`${FAKE_API_URL}/products`, () => HttpResponse.json([])),
    );

    renderWithProviders(<Products />);
    const message = await screen.findByText(/No products to view/i); // sprawdzamy komunikat
    expect(message).toBeInTheDocument();
  });

  // Test: sprawdzamy filtrowanie po kategorii
  it('filters products by category', async () => {
    renderWithProviders(<Products />);
    await screen.findByText('Product 1');

    // Otwieramy dropdown z kategoriami (MUI Select)
    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.mouseDown(categorySelect);

    // Czekamy na pojawienie się listy opcji
    const listbox = await screen.findByRole('listbox');

    // Wybieramy opcję "Electronics"
    const electronicsOption = within(listbox).getByText(/Electronics/i);
    fireEvent.click(electronicsOption);

    // Sprawdzamy, czy produkty zostały przefiltrowane
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