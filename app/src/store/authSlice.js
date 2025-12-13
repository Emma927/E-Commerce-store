import { createSlice } from '@reduxjs/toolkit';

// Wczytanie koszyka z localStorage przy starcie
const savedUser = JSON.parse(localStorage.getItem('user'));

const initialState =
  savedUser && savedUser.token
    ? {
        username: savedUser.username,
        token: savedUser.token,
        isAuthenticated: true,
      }
    : {
        username: '',
        token: null,
        isAuthenticated: false,
      };
// Reducer = zmienia stan → logowanie/wylogowanie użytkownika.
const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = '';
      state.token = null; // Wyczyść token przy wylogowaniu
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

// Selektor = odczytuje stan → komponenty wiedzą, czy użytkownik jest zalogowany i jakie są jego dane.
// 🔹 Selektory
export const selectUsername = (state) => state.user.username;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;