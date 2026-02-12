import { createSlice } from '@reduxjs/toolkit';

/**
 * Slice do zarządzania zamówieniami użytkownika.
 *
 * UWAGA: Bezpośrednia synchronizacja z localStorage jest tutaj użyta ze względów
 * praktycznych w prostym E-commerce. W dużych aplikacjach side effects-efekty uboczne takie jak localStorage powinny być
 * obsługiwane w Middleware (np. RTK Listener Middleware), aby zachować czystość funkcji
 * i łatwość testowania.
 */

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
      /**
       * Dodaje nowe zamówienie na początek listy (najnowsze zamówienia wyświetlane jako pierwsze).
       *
       * Immer: Redux Toolkit używa Immer, który tworzy „draft” (Proxy) stanu.
       * Dzięki temu można pisać kod w stylu mutującym (np. używając unshift),
       * ale pod spodem Immer tworzy nową, niemutowalną kopię stanu.
       *
       * Dzięki temu:
       * - referencja stanu w store się zmienia,
       * - React Redux wykrywa zmianę i komponenty rerenderują się poprawnie,
       * - DevTools i middleware widzą nowy, poprawny stan.
       *
       * Mutowany jest draft, czyli specjalna kopia stanu (Proxy od Immer) → Immer tworzy nowy stan → Redux widzi inną referencję → zastępuje stary stan → rerender komponentów.
       *
       * 💡 Zasada praktyczna:
       * Jeśli kolejność w logice aplikacji ma znaczenie → unshift w reducerze.
       * Jeśli kolejność ma znaczenie tylko dla wyświetlania → reverse() w selektorze.
       */

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

// Zwraca bezpośrednio tablicę zamówień ze store (ta sama referencja, bez kopiowania),
// dzięki czemu jest to najszybszy możliwy odczyt stanu
export const selectOrders = (state) => state.orders.orders; // selectOrders służy tylko do odczytu aktualnej listy zamówień z Redux store.

export const { addOrder, deleteOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
