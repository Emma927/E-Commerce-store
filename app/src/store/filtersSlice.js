import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'all',
  sortOrder: 'asc',
  searchQuery: '',
  ratingQuery: 0, // "All" = 0 w constants
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
     setRatingQuery: (state, action) => {
      state.ratingQuery = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const { setCategory, setSortOrder, setSearchQuery, setRatingQuery, resetFilters } = filtersSlice.actions;

export const selectCategory = (state) => state.filters.category;
export const selectSortOrder = (state) => state.filters.sortOrder;
export const selectSearchQuery = (state) => state.filters.searchQuery;
export const selectRatingQuery = (state) => state.filters.ratingQuery;

export default filtersSlice.reducer;
