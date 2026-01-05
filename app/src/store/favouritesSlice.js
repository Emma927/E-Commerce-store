import { createSlice, createSelector } from '@reduxjs/toolkit';

// Bezpośrednia synchronizacja z localStorage wewnątrz reducera ze względu na
// pragmatyzm i czytelność przy obecnej skali projektu (prosty E-commerce).
// Jestem świadoma, że w dużych systemach "Side Effects" (efekty uboczne) takie jak
// localStorage powinny być wyniesione do Middleware (np. RTK Listener Middleware),
// aby zachować czystość funkcji (Pure Functions) i ułatwić testy jednostkowe.

// Pobieramy dane z localStorage przy starcie modułu.
// Pusta tablica [] jako fallback to tzw. "bezpieczny stan początkowy" (zapobiega błędom .map() na undefined).
const savedFavourites = JSON.parse(localStorage.getItem('favourites')) || [];

const initialState = {
  favouritesProducts: savedFavourites,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      // Sprawdzamy czy produkt już istnieje, aby uniknąć duplikatów w stanie i localStorage.
      const exists = state.favouritesProducts.find(
        (p) => p.id === action.payload.id,
      );

      if (!exists) {
        // INŻYNIERIA (Unshift): Dodajemy na początek tablicy, aby najnowsze produkty były pierwsze.
        // Dzięki temu unikamy kosztownego procesowania danych (.reverse()) w selektorach.
        // IMMER: Dzięki bibliotece Immer (wbudowanej w Toolkit) możemy mutować stan bezpośrednio (.unshift),
        // a pod spodem Redux i tak stworzy nową, bezpieczną kopię stanu.
        state.favouritesProducts.unshift(action.payload);

        localStorage.setItem(
          'favourites',
          JSON.stringify(state.favouritesProducts),
        );
      }
    },
    removeFromFavourites: (state, action) => {
      // Tworzymy nową tablicę bez usuwanego ID.
      state.favouritesProducts = state.favouritesProducts.filter(
        (p) => p.id !== action.payload,
      );
      localStorage.setItem(
        'favourites',
        JSON.stringify(state.favouritesProducts),
      );
    },
    clearFavourites: (state) => {
      // Resetujemy stan i czyścimy pamięć przeglądarki.
      state.favouritesProducts = [];
      localStorage.removeItem('favourites');
    },
  },
});

/**
 * SELEKTORY (Data Derivation)
 */

// Selektor dostępowy (Basic Selector).
// Zwraca surową referencję. Nie wymaga createSelector (memoizacji), ponieważ pobranie
// wartości z obiektu po kluczu jest szybsze niż narzut (overhead) samej biblioteki memoizującej.
export const selectFavouritesProducts = (state) =>
  state.favourites.favouritesProducts;

// Selektor obliczeniowy (Memoized Selector).
// Używamy createSelector, ponieważ .length jest "obliczeniem".
// Dzięki memoizacji, wynik zostanie przeliczony tylko wtedy, gdy tablica favouritesProducts faktycznie się zmieni.
export const selectFavouritesCount = createSelector(
  [selectFavouritesProducts],
  (products) => products.length,
);

// Eksport akcji do komponentów
export const { addToFavourites, removeFromFavourites, clearFavourites } =
  favouritesSlice.actions;

// Eksport reducera do store.js
export default favouritesSlice.reducer;
