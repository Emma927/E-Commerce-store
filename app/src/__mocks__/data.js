import { http, HttpResponse } from 'msw';
import { FAKE_API_URL } from '@/constants';

export const dataHandlers = [
  // POST /auth/login – logowanie użytkownika
  http.post(`${FAKE_API_URL}/auth/login`, async (req) => {
    const { username, password } = await req.json();

    if (username === 'testuser' && password === 'password123') {
      return HttpResponse.json(
        {
          token: 'fake-jwt-token-1234567890',
        },
        { status: 200, delay: 200 },
      );
    }

    // Błędne dane logowania → status 401
    return HttpResponse.json(
      { message: 'Invalid username or password' },
      { status: 401, delay: 200 },
    );
  }),

  // GET /products – lista wszystkich produktów
  http.get(`${FAKE_API_URL}/products`, () => {
    return HttpResponse.json([
      {
        id: 1,
        title: 'Product 1',
        price: 199.99,
        description: 'Lorem ipsum dolor sit amet',
        category: 'electronics',
        image: '/img/product1.jpg',
        rating: { rate: 4.5, count: 120 },
      },
      {
        id: 2,
        title: 'Product 2',
        price: 79.99,
        description: 'Lorem ipsum dolor sit amet',
        category: 'jewelery',
        image: '/img/product2.jpg',
        rating: { rate: 4.8, count: 80 },
      },
      {
        id: 3,
        title: 'Product 3',
        price: 49.99,
        description: 'Lorem ipsum dolor sit amet',
        category: 'men clothing',
        image: '/img/product3.jpg',
        rating: { rate: 4.2, count: 200 },
      },
    ]);
  }),

  // GET /products/1 – szczegóły pojedynczego produktu
  http.get(`${FAKE_API_URL}/products/1`, () => {
    return HttpResponse.json({
      id: 1,
      title: 'Product 1',
      category: 'electronics',
      price: 199.99,
      description: 'Lorem ipsum',
      image: '/img/product1.jpg',
      rating: { rate: 4.5, count: 120 },
    });
  }),

  // POST /carts – tworzenie koszyka
  http.post(`${FAKE_API_URL}/carts`, (req) => {
    const { userId, date, products } = req.body;

    return HttpResponse.json({
      id: Math.floor(Math.random() * 1000), // losowe ID koszyka
      userId: userId || 1, // domyślny userId
      date: date || new Date().toISOString(), // aktualna data jeśli brak
      products: products || [], // lista produktów w koszyku
    });
  }),

  // GET /products/categories – lista kategorii produktów
  http.get(`${FAKE_API_URL}/products/categories`, () =>
    HttpResponse.json([
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing",
    ]),
  ),

  // GET /products/category/:category – produkty filtrowane po kategorii
  http.get(`${FAKE_API_URL}/products/category/:category`, ({ params }) => {
    const { category } = params;

    return HttpResponse.json([
      {
        id: 1,
        title: `Product 1 ${category}`,
        price: 99.99,
        description: 'Product from category',
        category,
        image: '/img/product1.jpg',
        rating: { rate: 4.8, count: 120 },
      },
      {
        id: 2,
        title: `Product 2 ${category}`,
        price: 59.99,
        description: 'Product from category',
        category,
        image: '/img/product2.jpg',
        rating: { rate: 4.5, count: 80 },
      },
      {
        id: 3,
        title: `Product 3 ${category}`,
        price: 39.99,
        description: 'Product from category',
        category,
        image: '/img/product3.jpg',
        rating: { rate: 4.2, count: 60 },
      },
    ]);
  }),
];
