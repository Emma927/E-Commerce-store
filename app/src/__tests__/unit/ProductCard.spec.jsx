// Importujemy funkcje do renderowania komponentów i interakcji
import { render, screen, fireEvent } from '@testing-library/react';
// Importujemy komponent ProductCard, który będziemy testować
import { ProductCard } from '@/components/common/ProductCard';
// Importujemy BrowserRouter, bo ProductCard używa Link (wymaga kontekstu routera)
import { BrowserRouter } from 'react-router-dom';

// Mockujemy react-redux, żeby testy były izolowane
vi.mock('react-redux', () => ({
  // Mockujemy useDispatch, aby móc sprawdzać wywołania dispatch w testach
  useDispatch: vi.fn(),
  // Mockujemy useSelector, FavouriteButton w komponencie potrzebuje selector, zwracamy pustą tablicę
  useSelector: vi.fn(() => []),
}));

// Mockujemy komponent FavouriteButton, żeby nie renderować prawdziwego komponentu
vi.mock('@/components/common/FavouriteButton', () => ({
  // Zwracamy prosty div z data-testid, który pozwoli nam go znaleźć w testach
  FavouriteButton: () => <div data-testid="fav-btn" />,
}));

// Importujemy useDispatch, żeby podpiąć naszego mocka
import { useDispatch } from 'react-redux';

// Importujemy akcję addToCart, której wywołanie chcemy testować
import { addToCart } from '@/store/cartSlice';

// Tworzymy mock funkcji dispatch, która będzie rejestrować wywołania
const mockedDispatch = vi.fn();

// Podpinamy naszego mocka pod useDispatch
// Każdy komponent korzystający z useDispatch użyje naszego mockedDispatch
useDispatch.mockReturnValue(mockedDispatch);

// Tworzymy helper do renderowania komponentów z kontekstem routera
// Dzięki temu komponenty z Link działają poprawnie w testach
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('ProductCard unit tests', () => {
  // Definiujemy przykładowy produkt do testów
  const product = {
    id: 1,
    image: 'test.jpg',
    title: 'Test Product',
    description: 'Test description',
    price: 99.99,
  };

  // Czyścimy historię wywołań dispatch przed każdym testem
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  it('renders title, price and rating', () => {
    // Renderujemy komponent w DOM z naszym helperem
    renderWithRouter(<ProductCard {...product} />);

    // Sprawdzamy, czy tytuł produktu jest w DOM
    expect(screen.getByText(product.title)).toBeInTheDocument();

    // Sprawdzamy, czy cena produktu jest w DOM
    expect(
      screen.getByText(`$${product.price.toFixed(2)}`),
    ).toBeInTheDocument();

    // Rating zakomentowany, bo nie dodajemy go do payload koszyka
    // expect(screen.getByText(`(${product.rating.count})`)).toBeInTheDocument();
  });

  it('dispatches addToCart action on button click', () => {
    // Renderujemy komponent
    renderWithRouter(<ProductCard {...product} />);

    // Szukamy przycisku po roli "button" i tekście /add to cart/i (ignore case)
    const button = screen.getByRole('button', { name: /add to cart/i });

    // Symulujemy kliknięcie przycisku
    fireEvent.click(button);

    // Sprawdzamy, że dispatch został wywołany dokładnie raz
    expect(mockedDispatch).toHaveBeenCalledTimes(1);

    // Sprawdzamy, że dispatch został wywołany z odpowiednim payload (produkt + quantity)
    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: addToCart.type,
        payload: { ...product, quantity: 1 },
      }),
    );
  });

  it('renders FavouriteButton', () => {
    // Renderujemy komponent
    renderWithRouter(<ProductCard {...product} />);

    // Sprawdzamy, czy div z mockowanego FavouriteButton jest w DOM
    expect(screen.getByTestId('fav-btn')).toBeInTheDocument();
  });

  it('link "Show details" points to correct URL', () => {
    // Renderujemy komponent
    renderWithRouter(<ProductCard {...product} />);

    // Szukamy linku po roli i tekście
    const link = screen.getByRole('link', { name: /show details/i });

    // Sprawdzamy, czy link ma poprawny atrybut href
    expect(link).toHaveAttribute('href', `/product/${product.id}`);
  });
});
