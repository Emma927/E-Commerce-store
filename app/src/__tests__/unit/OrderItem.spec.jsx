// Importujemy narzędzia do renderowania komponentów i symulowania akcji
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderItem } from '@/components/common/OrderItem';

// Import BrowserRouter, bo OrderItem używa Linków (wymaga kontekstu routera)
import { BrowserRouter } from 'react-router-dom';

// Tworzymy przykładowe dane zamówienia do testów
const order = {
  id: 1, // ID zamówienia
  serverDate: new Date().toISOString(), // data zamówienia w formacie ISO
  total: 150, // całkowita kwota zamówienia
  products: [
    // lista produktów w zamówieniu
    { id: 1, title: 'Product 1', price: 50, quantity: 1, image: 'img1.jpg' },
    { id: 2, title: 'Product 2', price: 100, quantity: 1, image: 'img2.jpg' },
  ],
};

// Funkcja pomocnicza, która renderuje komponent w kontekście routera
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

// Grupa testów dla komponentu OrderItem
describe('OrderItem', () => {
  // Testuje poprawne wyświetlanie szczegółów zamówienia
  it('renders order details correctly', () => {
    // Renderujemy komponent z przykładowym zamówieniem
    renderWithRouter(<OrderItem order={order} onDelete={() => {}} />);

    // Sprawdzamy, czy wyświetlany jest numer zamówienia
    expect(screen.getByText(`Order ID: ${order.id}`)).toBeInTheDocument();

    // Sprawdzamy, czy wyświetlana jest całkowita kwota zamówienia
    expect(
      screen.getByText(`Total: $${order.total.toFixed(2)}`),
    ).toBeInTheDocument();

    // Sprawdzamy, czy wyświetlane są produkty i ich ilości
    expect(screen.getByText(/Product 1 x 1/)).toBeInTheDocument();
    expect(screen.getByText(/Product 2 x 1/)).toBeInTheDocument();
  });

  // Testuje funkcjonalność przycisku "Delete"
  it('calls onDelete when delete button is clicked', () => {
    // Tworzymy mock funkcji onDelete
    const handleDelete = vi.fn();

    // Renderujemy komponent z mockiem onDelete
    renderWithRouter(<OrderItem order={order} onDelete={handleDelete} />);

    // Szukamy przycisku "Delete"
    const deleteButton = screen.getByText(/delete/i);

    // Symulujemy kliknięcie przycisku
    fireEvent.click(deleteButton);

    // Sprawdzamy, czy funkcja onDelete została wywołana dokładnie raz
    expect(handleDelete).toHaveBeenCalledTimes(1);

    // Sprawdzamy, czy funkcja onDelete została wywołana z poprawnym ID zamówienia
    expect(handleDelete).toHaveBeenCalledWith(order.id);
  });

  // Testuje poprawność linku przycisku "Details"
  it('Details button has correct href', () => {
    // Renderujemy komponent
    renderWithRouter(<OrderItem order={order} onDelete={() => {}} />);

    // Szukamy przycisku "Details" i pobieramy jego najbliższy element <a>
    const detailsButton = screen.getByText(/details/i).closest('a');

    // Sprawdzamy, czy link prowadzi do poprawnego URL
    expect(detailsButton).toHaveAttribute(
      'href',
      `/dashboard/orders/${order.id}`,
    ); // "to" staje się atrybutem "href" w DOM
  });
});
