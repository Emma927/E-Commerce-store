import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';
import filtersReducer from './filtersSlice';
import favouritesReducer from './favouritesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: authReducer,
    orders: ordersReducer,
    filters: filtersReducer,
    favourites: favouritesReducer,
  },
});
