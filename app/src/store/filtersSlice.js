import { createSlice } from '@reduxjs/toolkit';

// initialState czyta URL, ponieważ przy starcie aplikacji Redux musi ustawić stan filtrów zgodnie z parametrami w URL, żeby po odświeżeniu lub wejściu z linka zachować te same ustawienia.
// 1. Pobieramy parametry z URL bezpośrednio przy inicjalizacji pliku
const params = new URLSearchParams(window.location.search);

// Redux przyjmuje wartości domyślne (all, asc, '', 0).
// URL pozostaje czysty, bo setSearchParams() nie jest jeszcze wywołane.
const initialState = {
  category: params.get('category') || 'all', // domyślna kategoria "all"
  sortOrder: params.get('sort') || 'asc', // domyślny porządek sortowania rosnący
  searchQuery: params.get('search') || '', // domyślny pusty search
  // Konwersja na Number, bo URL zawsze zwraca string
  ratingQuery: Number(params.get('rating')) || 0, // "All" = 0 w constants
};

const filtersSlice = createSlice({
  name: 'filters', // nazwa slice używanaw store
  initialState,
  reducers: {
    // Ustawienie wybranej kategorii
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    // Ustawienie sortowania po cenie
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    // Ustawienie filtru wyszukiwania po wpisanym słowie
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Ustawienie filtru po ratingu
    setRatingQuery: (state, action) => {
      state.ratingQuery = action.payload;
    },
    // Przywrócenie wszystkich filtrów do wartości początkowych
    resetFilters: (state) => {
      state.category = 'all';
      state.sortOrder = 'asc';
      state.searchQuery = '';
      state.ratingQuery = 0;
    },
  },
});

// Eksport akcji do użycia w komponentach
export const {
  setCategory,
  setSortOrder,
  setSearchQuery,
  setRatingQuery,
  resetFilters,
} = filtersSlice.actions;

// Selectory – służą do pobierania filtrów ze stanu Redux
export const selectCategory = (state) => state.filters.category;
export const selectSortOrder = (state) => state.filters.sortOrder;
export const selectSearchQuery = (state) => state.filters.searchQuery;
export const selectRatingQuery = (state) => state.filters.ratingQuery;

export default filtersSlice.reducer;
