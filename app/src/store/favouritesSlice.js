import { createSlice, createSelector } from '@reduxjs/toolkit';

// Wczytanie ulubionych produktów z localStorage przy starcie
const savedFavourites = JSON.parse(localStorage.getItem('favourites')) || [];

const initialState = {
  favouritesProducts: savedFavourites,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      const exists = state.favouritesProducts.find((p) => p.id === action.payload.id);
      if (!exists) {
        state.favouritesProducts.push(action.payload);
        localStorage.setItem('favourites', JSON.stringify(state.favouritesProducts));
      }
    },
    removeFromFavourites: (state, action) => {
      state.favouritesProducts = state.favouritesProducts.filter((p) => p.id !== action.payload);
      localStorage.setItem('favourites', JSON.stringify(state.favouritesProducts));
    },
    clearFavourites: (state) => {
      state.favouritesProducts = [];
      localStorage.removeItem('favourites');
    },
  },
});

// 🔹 Podstawowy selector
// export const selectFavouritesProducts = (state) => state.favourites.favouritesProducts;
// 🔹 Selektor zwracający ulubione produkty w odwrotnej kolejności (od najnowszego)
/**
 createSelector memoizuje wynik:

jeśli wejściowa tablica (favouritesProducts) nie zmieniła się, zwraca tę samą referencję,

więc React-Redux nie wywołuje rerenderu i nie ma ostrzeżeń.
 /*
W aplikacji wejściowa tablica nie zmienia się referencyjnie przy każdym renderze/redux update.

createSelector widzi tę samą referencję → memoizacja działa → .reverse() zwraca nową tablicę tylko wtedy, gdy faktycznie zmieniła się zawartość.

Stąd brak ostrzeżeń.
*/
export const selectFavouritesProducts = createSelector(
  [(state) => state.favourites.favouritesProducts], 
  (products) => [...products].reverse()
);

// 🔹 Memoizowany selector do liczenia produktów w favourites
export const selectFavouritesCount = createSelector([selectFavouritesProducts], (products) => products.length);

// 🔹 Eksport akcji
export const { addToFavourites, removeFromFavourites, clearFavourites } = favouritesSlice.actions;

// 🔹 Eksport reducer
export default favouritesSlice.reducer;
