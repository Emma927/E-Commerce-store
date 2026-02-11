import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './helpers/renderWithProviders';
import Cart from '@/pages/Cart';

// 🔹 mock useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Cart integration tests', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  // EMPTY CART
  it('renders empty cart message', () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cart: { cartProducts: [] },
        user: { isAuthenticated: false, username: '', token: null },
      },
    });

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  // PRODUCTS + SUMMARY
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

  // QUANTITY CHANGE (🔥 uproszczone)
  it('increments and decrements product quantity', async () => {
    const user = userEvent.setup();

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

    // 🔥 łapiemy PRAWDZIWY <input />, nie wrapper
    const quantityInput = screen.getByLabelText('Quantity for product #1');

    await user.click(incrementBtn);

    await waitFor(() => {
      expect(quantityInput).toHaveValue(3);
    });

    await user.click(decrementBtn);
    await user.click(decrementBtn);

    await waitFor(() => {
      expect(quantityInput).toHaveValue(1);
    });
  });

  // REMOVE PRODUCT
  it('removes product from cart', async () => {
    const user = userEvent.setup();

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

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(store.getState().cart.cartProducts).toHaveLength(0);
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  // NAVIGATION
  it('navigates to checkout when clicking Checkout button', async () => {
    const user = userEvent.setup();

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

    await user.click(screen.getByText(/Delivery and payment/i));

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
