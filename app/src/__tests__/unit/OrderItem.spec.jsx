// Narzędzia z React Testing Library:
// render → renderuje komponent do wirtualnego DOM (JSDOM)
// screen → globalne query do wyszukiwania elementów (zalecane przez RTL)
import { render, screen } from '@testing-library/react';

// userEvent → symuluje prawdziwe interakcje użytkownika (kliknięcia, pisanie, focus)
import userEvent from '@testing-library/user-event';

// BrowserRouter → potrzebny, bo komponent używa <Link />, który wymaga kontekstu routera
import { BrowserRouter } from 'react-router-dom';

// Testowany komponent
import { OrderItem } from '@/components/common/OrderItem';

// Helper: renderuje komponent wewnątrz Routera,
// żeby <Link /> nie rzucał błędu "useLocation/useNavigate must be used within Router"
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

// Przykładowe dane testowe (fixture)
// Stałe dane ułatwiają testowanie i powtarzalność
const order = {
  id: 1,
  serverDate: new Date().toISOString(),
  total: 150,
  products: [
    { id: 1, title: 'Product 1', price: 50, quantity: 1, image: 'img1.jpg' },
    { id: 2, title: 'Product 2', price: 100, quantity: 1, image: 'img2.jpg' },
  ],
};

// Grupujemy testy jednego komponentu w describe
describe('OrderItem', () => {
  // Test 1: sprawdzamy czy dane są poprawnie WYŚWIETLANE (render)
  it('renders order data and product list correctly', () => {
    // vi.fn() → przekazujemy pusty mock, bo nie testujemy tu onDelete
    renderWithRouter(<OrderItem order={order} onDelete={vi.fn()} />);

    // Szukamy tekstu z ID zamówienia i sprawdzamy czy jest w DOM
    expect(screen.getByText(`Order ID: ${order.id}`)).toBeInTheDocument();

    // Sprawdzamy czy suma została poprawnie sformatowana
    expect(
      screen.getByText(`Total: $${order.total.toFixed(2)}`),
    ).toBeInTheDocument();

    // ListItemText renderuje: "Product 1 x 1"
    // używamy regex /.../ żeby test był bardziej elastyczny
    expect(screen.getByText(/Product 1 x 1/)).toBeInTheDocument();
    expect(screen.getByText(/Product 2 x 1/)).toBeInTheDocument();
  });

  // Test 2: sprawdzamy ZACHOWANIE (kliknięcie)
  it('calls onDelete when user clicks Delete button', async () => {
    // userEvent.setup() → tworzy "użytkownika" do symulacji interakcji
    const user = userEvent.setup();

    // Tworzymy mock funkcji, żeby móc sprawdzić ile razy została wywołana
    const handleDelete = vi.fn();

    // Renderujemy komponent z naszym mockiem
    renderWithRouter(<OrderItem order={order} onDelete={handleDelete} />);

    // Szukamy przycisku po roli (bardziej semantyczne niż getByText)
    // role=button + name=Delete → dokładnie tak jak widzi to użytkownik/screen reader
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    // Symulujemy prawdziwe kliknięcie użytkownika (lepsze niż fireEvent)
    await user.click(deleteButton);

    // Sprawdzamy czy callback wywołał się dokładnie 1 raz
    expect(handleDelete).toHaveBeenCalledTimes(1);

    // Sprawdzamy czy dostał poprawny argument (order.id)
    expect(handleDelete).toHaveBeenCalledWith(order.id);
  });

  // Test 3: sprawdzamy poprawność linku (routing)
  it('renders Details link with correct href', () => {
    // znów tylko render → mock wystarczy
    renderWithRouter(<OrderItem order={order} onDelete={vi.fn()} />);

    // Szukamy linku po roli
    const detailsLink = screen.getByRole('link', { name: /details/i });

    // Link z react-router-dom w DOM staje się <a href="...">
    // więc możemy normalnie sprawdzić atrybut href
    expect(detailsLink).toHaveAttribute(
      'href',
      `/dashboard/orders/${order.id}`,
    );
  });
});
