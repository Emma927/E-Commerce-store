import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/store/cartSlice';
import authReducer from '@/store/authSlice';
import Cart from '@/pages/Cart';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// 🔹 Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// 🔹 Helper do renderowania z Redux i Router
const renderWithProviders = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: { cart: cartReducer, user: authReducer },
    preloadedState,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>,
    ),
  };
};

describe('Cart component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  // 🔹 Test: pusty koszyk
  it('renders empty cart message', () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { cartProducts: [] },
        user: { isAuthenticated: false, username: '', token: null },
      },
    });

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  // 🔹 Test: wyświetlanie produktów i podsumowania
  it('renders cart products and summary', () => {
    const preloadedState = {
      cart: {
        cartProducts: [
          {
            id: 1,
            title: 'Product 1',
            price: 10,
            quantity: 2,
            image: '/img/product1.jpg',
          },
          {
            id: 2,
            title: 'Product 2',
            price: 20,
            quantity: 1,
            image: '/img/product2.jpg',
          },
        ],
      },
      user: { isAuthenticated: true, username: 'John', token: '123' },
    };

    renderWithProviders(<Cart />, { preloadedState });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText(/Products price: \$40.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome, John/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery and payment/i)).toBeInTheDocument();
  });

  // 🔹 Test: inkrementacja i dekrementacja ilości produktu
  it('increments and decrements product quantity', async () => {
    const preloadedState = {
      cart: {
        cartProducts: [
          {
            id: 1,
            title: 'Product 1',
            price: 10,
            quantity: 2,
            image: '/img/product1.jpg',
          },
        ],
      },
      user: { isAuthenticated: false, username: '', token: null },
    };

    renderWithProviders(<Cart />, { preloadedState });

    const incrementBtn = screen.getByTestId('increment-button-1');
    const decrementBtn = screen.getByTestId('decrement-button-1');

    // 🔹 Poprawny sposób na input z MUI
    const quantityInput = () =>
      within(screen.getByTestId('quantity-input-1')).getByRole('spinbutton');

    // 🔹 Increment
    fireEvent.click(incrementBtn);
    await waitFor(() => {
      expect(quantityInput().value).toBe('3');
    });

    // 🔹 Decrement (min 1)
    fireEvent.click(decrementBtn);
    fireEvent.click(decrementBtn);
    await waitFor(() => {
      expect(quantityInput().value).toBe('1');
    });
  });

  // 🔹 Test: usuwanie produktu z koszyka
  it('removes product from cart', () => {
    const preloadedState = {
      cart: {
        cartProducts: [
          {
            id: 1,
            title: 'Product 1',
            price: 10,
            quantity: 2,
            image: '/img/product1.jpg',
          },
        ],
      },
      user: { isAuthenticated: false, username: '', token: null },
    };

    const { store } = renderWithProviders(<Cart />, { preloadedState });

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    expect(store.getState().cart.cartProducts).toHaveLength(0);
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  // 🔹 Test: przejście do checkout
  it('navigates to checkout when clicking Checkout button', () => {
    const preloadedState = {
      cart: {
        cartProducts: [
          {
            id: 1,
            title: 'Product 1',
            price: 10,
            quantity: 1,
            image: '/img/product1.jpg',
          },
        ],
      },
      user: { isAuthenticated: false, username: '', token: null },
    };

    renderWithProviders(<Cart />, { preloadedState });

    const checkoutButton = screen.getByText(/Delivery and payment/i);
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
