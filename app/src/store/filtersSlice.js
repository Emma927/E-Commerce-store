import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'all', // domyślna kategoria "all"
  sortOrder: 'asc', // domyślny porządek sortowania rosnący
  searchQuery: '', // domyślny pusty search
  ratingQuery: 0, // "All" = 0 w constants
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
    resetFilters: () => initialState,
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
