import { createSlice, createSelector } from '@reduxjs/toolkit';

// Wczytanie ulubionych produktów z localStorage przy starcie
const savedFavourites = JSON.parse(localStorage.getItem('favourites')) || []; // Pusta tablica = bezpieczny stan początkowy, który pozwala operować na ulubionych produktach bez dodatkowych warunków.

const initialState = {
  favouritesProducts: savedFavourites,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      const exists = state.favouritesProducts.find(
        (p) => p.id === action.payload.id,
      ); // Jeśli id produktu z tablicy ulubionych produktów jest równe wybranemu przez użytkownika, to znaczy, że produkt w ulubionych już istnieje
      if (!exists) {
        // Jeśli produktu w tablicy ulubionych jeszcze nie ma, to dodajemy go tam i zapisujemy w localStorage
        state.favouritesProducts.push(action.payload);
        localStorage.setItem(
          'favourites',
          JSON.stringify(state.favouritesProducts),
        );
      }
    },
    removeFromFavourites: (state, action) => {
      state.favouritesProducts = state.favouritesProducts.filter(
        (p) => p.id !== action.payload,
      );
      localStorage.setItem(
        'favourites',
        JSON.stringify(state.favouritesProducts),
      );
    },
    clearFavourites: (state) => {
      state.favouritesProducts = [];
      localStorage.removeItem('favourites');
    },
  },
});

// Selektor jest do odczytu stanu favourites w kolejności od najnowszego do najstarszego, z memoizacją dla wydajności.
export const selectFavouritesProducts = createSelector(
  [(state) => state.favourites.favouritesProducts], // ← tablica funkcji wejściowych
  (products) => [...products].reverse(),
);

// Memoizowany selector do liczenia produktów w favourites
export const selectFavouritesCount = createSelector(
  [selectFavouritesProducts], // ← tablica funkcji wejściowych
  (products) => products.length,
); // ← funkcja obliczająca wynik

// Eksport akcji
export const { addToFavourites, removeFromFavourites, clearFavourites } =
  favouritesSlice.actions;

// Eksport reducer
export default favouritesSlice.reducer;
