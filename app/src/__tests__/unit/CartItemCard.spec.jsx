import { render, screen } from '@testing-library/react'; 
import { CartItemCard } from '@/components/common/CartItemCard';

// Grupa testów dla komponentu CartItemCard
describe('CartItemCard', () => {

  // Definiujemy przykładowe propsy, które zostaną przekazane do komponentu w testach
  const props = {
    image: 'test-image.jpg', // ścieżka do obrazka produktu
    title: 'Test Product',   // nazwa produktu
    price: 25.5,             // cena produktu
  };

  // Test sprawdzający czy tytuł i cena produktu są poprawnie renderowane
  it('renders title and price correctly', () => {

    // Renderujemy komponent CartItemCard w DOM z przekazanymi propsami
    render(<CartItemCard {...props} />);

    // Sprawdzamy, czy tytuł produktu pojawia się w dokumencie
    expect(screen.getByText(props.title)).toBeInTheDocument();

    // Sprawdzamy, czy cena produktu pojawia się w dokumencie w formacie $xx.xx
    expect(screen.getByText(`$${props.price.toFixed(2)}`)).toBeInTheDocument();
  });

  // Test sprawdzający poprawne renderowanie obrazka produktu
  it('renders image with correct src and alt', () => {

    // Renderujemy komponent z tymi samymi propsami
    render(<CartItemCard {...props} />);

    // Pobieramy element obrazka po roli 'img'
    const img = screen.getByRole('img');

    // Sprawdzamy, czy atrybut src obrazka jest zgodny z props.image
    expect(img).toHaveAttribute('src', props.image);

    // Sprawdzamy, czy atrybut alt obrazka jest zgodny z props.title
    expect(img).toHaveAttribute('alt', props.title);
  });
});
