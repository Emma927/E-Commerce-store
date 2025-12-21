import { createSlice } from '@reduxjs/toolkit';

const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];

const initialState = {
  orders: savedOrders,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload); // W Redux Toolkit (createSlice) nie ma potrzeby tworzenia nowej tablicy w tym przypadku, bo RTK używa Immer, który pozwala na bezpośrednią mutację stanu. Immer tworzy niemutowalną kopię stanu za nas.
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    deleteOrder: (state, action) => {
      // action.payload = id zamówienia do usunięcia
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    clearOrders: (state) => {
      state.orders = [];
      localStorage.removeItem('orders');
    },
  },
});

export const selectOrders = (state) => state.orders.orders;

export const { addOrder, deleteOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
