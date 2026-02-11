import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import cartReducer from '@/store/cartSlice';
import authReducer from '@/store/authSlice';
import filtersReducer from '@/store/filtersSlice';
import favouritesReducer from '@/store/favouritesSlice';

/**
   * 1️⃣ Dlaczego favouritesReducer jest potrzebny w renderWithProviders

* W Twoim teście nie sprawdzane są wprost FavouriteButton ani favourites, ale komponent Products renderuje dzieci ProductCard, a te z kolei renderują FavouriteButton, który czyta stan Redux:

* const favourites = useSelector(selectFavouritesProducts);
* const isFavourite = favourites.some((p) => p.id === product.id);

* useSelector oczekuje, że slice istnieje w store.
* Jeśli w teście go nie ma, Redux rzuci błąd, bo nie znajdzie klucza favourites.
* Nawet jeśli w samym teście nie klikniesz przycisku „favourite”, komponent i tak wywołuje useSelector przy renderze.
   */

export function renderWithProviders(
  ui,
  // route pozwala zasymulować startową ścieżkę routera w testach
  // (np. /checkout, /products/1, '/products?category=electronics'). Obecne testy używają domyślnego "/",
  // ale zostawiamy to dla przyszłych przypadków z useParams/navigate.
  { preloadedState = {}, route = '/' } = {},
) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      user: authReducer,
      filters: filtersReducer,
      favourites: favouritesReducer,
    },
    preloadedState,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  // ✅ Wrapper zamiast ręcznego zagnieżdżania JSX
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );

  render(ui, { wrapper: Wrapper }); // wrappper - sprecjalna opcja w testing library, który pozwala na opakowanie renderowanego komponentu w dodatkowe konteksty (Redux, Router, QueryClient)

  return { store };
}
