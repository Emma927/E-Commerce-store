import { createSlice } from '@reduxjs/toolkit';

// Bezpośrednia synchronizacja z localStorage wewnątrz reducera ze względu na
// pragmatyzm i czytelność przy obecnej skali projektu (prosty E-commerce).
// Jestem świadoma, że w dużych systemach "Side Effects" (efekty uboczne) takie jak
// localStorage powinny być wyniesione do Middleware (np. RTK Listener Middleware),
// aby zachować czystość funkcji (Pure Functions) i ułatwić testy jednostkowe.

// Inicjalizacja stanu z localStorage.
// Zastosowanie operatora || [] zapobiega błędom, gdy użytkownik nie ma jeszcze żadnych zamówień.
const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];

const initialState = {
  orders: savedOrders,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      // INŻYNIERIA (Unshift): Dodajemy nowe zamówienie na POCZĄTEK tablicy.
      // Dzięki temu w historii zamówień najnowsze zakupy są od razu na górze listy.
      // Nie musimy tracić wydajności na odwracanie tablicy (.reverse()) przy każdym renderowaniu.

      // IMMER: RTK używa pod spodem biblioteki Immer. Pozwala ona na bezpieczne
      // użycie metody .unshift() (która normalnie mutuje tablicę),
      // bo Immer automatycznie tworzy nową, niemutowalną kopię stanu za nas.
      state.orders.unshift(action.payload); // W Redux Toolkit (createSlice) nie ma potrzeby tworzenia nowej tablicy w tym przypadku, bo RTK używa Immer, który pozwala na bezpośrednią mutację stanu. Immer tworzy niemutowalną kopię stanu za nas.

      // Synchronizacja z bazą danych przeglądarki (localStorage)
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    deleteOrder: (state, action) => {
      // Filtrowanie tworzy nową referencję tablicy bez usuniętego elementu.
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    clearOrders: (state) => {
      // Czyścimy stan i usuwamy dane z localStorage
      state.orders = [];
      localStorage.removeItem('orders');
    },
  },
});

// Selektor dostępowy - zwraca surową referencję, co jest najszybszą metodą odczytu.
export const selectOrders = (state) => state.orders.orders;

export const { addOrder, deleteOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
