import { http, HttpResponse } from 'msw';
import { FAKE_API_URL } from '@/constants';

export const dataHandlers = [
  // POST /auth/login – najpierw auth
  http.post(`${FAKE_API_URL}/auth/login`, async (req) => {
    const { username, password } = await req.json();

    if (username === 'testuser' && password === 'password123') {
      return HttpResponse.json({
        token: 'fake-jwt-token-1234567890',
      });
    }

    return HttpResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 },
    );
  }),

  // GET /products
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

  // GET /products/1
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

  // POST /carts
  http.post(`${FAKE_API_URL}/carts`, (req) => {
    const { userId, date, products } = req.body;

    return HttpResponse.json({
      id: Math.floor(Math.random() * 1000), // generujemy losowe ID koszyka
      userId: userId || 1, // jeśli nie podano, dajemy 1
      date: date || new Date().toISOString(), // jeśli nie podano, aktualna data
      products: products || [], // lista produktów {productId, quantity}
    });
  }),

  http.get(`${FAKE_API_URL}/products/categories`, () =>
    HttpResponse.json([
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing",
    ]),
  ),
];
