import { createSlice } from '@reduxjs/toolkit';

// Wczytanie koszyka z localStorage przy starcie
/** const savedUser = JSON.parse(localStorage.getItem('user')) || { username: '', loggedIn: false }; - 🔥 DLACZEGO FALLBACK NIE MOŻE TU BYĆ?

Bo || {} sprawia, że:

nawet jeśli localStorage jest pusty → dostajesz { username:'', loggedIn:false }

czyli savedUser NIE jest null

czyli initialState NIE używa sekcji "wylogowany"

czyli Redux myśli, że user jest zalogowany, choć nie jest

i aplikacja się wywala, bo np. oczekiwany jest token, którego nie ma
const savedUser = JSON.parse(localStorage.getItem('user')) || { username: '', loggedIn: false };*/

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

// const initialState = {
//   username: '',
//   loggedIn: false,
// };

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      // state.loggedIn = true;
      // WAŻNE: Musisz zapisać token do stanu globalnego RTK, jeśli go tu trzymasz
      state.token = action.payload.token; // Jeśli przekazujesz token w payloadzie akcji login
      state.isAuthenticated = true; // <-- ZAMIENIAMY loggedIn na isAuthenticated
    },
    logout: (state) => {
      state.username = '';
      // state.loggedIn = false;
      state.token = null; // Wyczyść token przy wylogowaniu
      state.isAuthenticated = false; // <-- też tutaj
      localStorage.removeItem('user');
    },
  },
});

// Selektory służą tylko do odczytu stanu, a w momencie logowania stan użytkownika jest albo pusty, albo niezalogowany.
// 🔹 Selektory
export const selectUsername = (state) => state.user.username;
export const selectToken = (state) => state.user.token;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
