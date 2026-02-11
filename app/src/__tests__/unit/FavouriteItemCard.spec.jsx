import { render, screen, fireEvent } from '@testing-library/react';
import { FavouriteItemCard } from '@/components/common/FavouriteItemCard';
import { BrowserRouter } from 'react-router-dom';

// W przypadku unit testu z mockowanym useSelector i useDispatch sprawdzasz tylko, czy komponent renderuje się poprawnie i reaguje na interakcje, a nie działanie całego Redux store.
vi.mock('react-redux', () => ({
  // Mockujemy useDispatch, żeby komponenty mogły wywoływać akcje Redux
  // w testach bez prawdziwego store. Umożliwia sprawdzenie, czy dispatch
  // został wywołany z odpowiednim payload.
  useDispatch: vi.fn(),
  // Mockujemy useSelector, żeby komponenty korzystające z Redux (np. FavouriteButton)
  // działały w testach bez prawdziwego store. Zwracamy pustą tablicę, bo w tym unit teście
  // nie zależy nam na danych z Redux, tylko na samym renderowaniu i interakcjach komponentu.
  useSelector: vi.fn(() => []),
}));
// Nie testujemy komponentu FavouriteButton w tym teście, więc go mockujemy.
// W mocku dodajemy data-testid, żeby można było sprawdzić, że komponent został wyrenderowany.
vi.mock('@/components/common/FavouriteButton', () => ({
  FavouriteButton: () => <div data-testid="fav-btn" />,
}));

// Impotyujemy useDispatch, żeby podpiąć naszego mocka
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
// ui - komponent do renderowania
// renderWithRouter - funkcja renderująca komponent wewnątrz BrowserRouter, ze wzdlędu na adres URL używany w Linkach
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('FavouriteItemCard unit tests', () => {
  // Definiujemy przykładowy produkt do testów
  const product = {
    id: 1,
    image: 'test-image.jpg',
    title: 'Test Favourite Product',
    description: 'This is a test favourite product',
    price: 49.99,
  };

  // Czyścimy historię wywołań dispatch przed każdym testem
  beforeEach(() => {
    mockedDispatch.mockClear();
  });

  it('renders title, price and image', () => {
    // Renderujemy komponent w DOM z naszym helperem
    renderWithRouter(<FavouriteItemCard {...product} />);

    // Sprawdzamy, czy tytuł produktu jest w DOM
    expect(screen.getByText(product.title)).toBeInTheDocument();

    // Sprawdzamy czy cena produktu jest w DOM
    expect(
      screen.getByText(`$${product.price.toFixed(2)}`),
    ).toBeInTheDocument();

    // Sprawdzamy, czy obraz produktu jest w DOM i ma poprawny src
    const img = screen.getByRole('img', { name: product.title });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', product.image);
  });

  // Test sprawdza, czy kliknięcie przycisku „Add to Cart” wywołuje akcję Redux `addToCart` z odpowiednim produktem i domyślną ilością 1.
  it('dispatches addToCart action on button click', () => {
    // Renderujemy komponent
    renderWithRouter(<FavouriteItemCard {...product} />);

    // Znajdujemy przycisk "Add to Cart"
    const addToCartButton = screen.getByRole('button', {
      name: /add to cart/i,
    });
    // Symulujemy kliknięcie przycisku
    fireEvent.click(addToCartButton);

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

  // Sprawdzamy, czy komponent FavouriteButton jest renderowany w FavouriteItemCard
  it('renders FavouriteButton', () => {
    // Renderujemy komponent
    renderWithRouter(<FavouriteItemCard {...product} />);

    // Sprawdzamy, czy komponent FavouriteButton jest w DOM
    expect(screen.getByTestId('fav-btn')).toBeInTheDocument();
  });

  // Sprawdzamy, czy link „Show details” prowadzi do poprawnego URL
  it('link "Show details" points to correct URL', () => {
    // Renderujemy komponent
    renderWithRouter(<FavouriteItemCard {...product} />);

    // Szukamy linku po roli i tekście
    const link = screen.getByRole('link', { name: /show details/i });

    // Sprawdzamy, czy link ma poprawny atrybut href
    expect(link).toHaveAttribute('href', `/product/${product.id}`);
  });
});
