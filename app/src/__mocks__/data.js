import { http, HttpResponse, delay } from 'msw';
import { FAKE_API_URL } from '@/constants';

export const dataHandlers = [
  // 🔹 Login użytkownika
  http.post(`${FAKE_API_URL}/auth/login`, async ({ request }) => {
    await delay(200);

    // Typ żądania POST, więc dane logowania trafiają w body.
    // Odczytujemy je, aby sprawdzić poprawność loginu i hasła.
    const body = await request.json();
    const { username, password } = body;

    // fake dane jak w Twoim komentarzu w Login.jsx
    if (username === 'johnd' && password === 'm38rmF$') {
      return HttpResponse.json({
        token: 'fake-jwt-token-123',
      });
    }

    // jeśli dane są niepoprawne, zwracamy 401 z komunikatem błędu
    return HttpResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 },
    );
  }),

  // 🔹 Wszystkie produkty
  http.get(`${FAKE_API_URL}/products`, async () => {
    await delay(50);
    return HttpResponse.json([
      {
        id: 1,
        title: 'Product 1',
        price: 10,
        category: 'Electronics',
        image: '/img/product1.jpg',
        rating: { rate: 4.5, count: 10 },
      },
      {
        id: 2,
        title: 'Product 2',
        price: 20,
        category: 'Jewelery',
        image: '/img/product2.jpg',
        rating: { rate: 4.8, count: 5 },
      },
      {
        id: 3,
        title: 'Product 3',
        price: 30,
        category: "Men's Clothing",
        image: '/img/product3.jpg',
        rating: { rate: 4.2, count: 8 },
      },
    ]);
  }),

  // 🔹 Kategorie produktów
  http.get(`${FAKE_API_URL}/products/categories`, async () => {
    await delay(10);
    return HttpResponse.json([
      'Electronics',
      'Jewelery',
      "Men's Clothing",
      "Women's Clothing",
    ]);
  }),

  // 🔹 Produkty po kategorii
  http.get(
    `${FAKE_API_URL}/products/category/:category`,
    async ({ params }) => {
      const { category } = params;
      await delay(50);

      return HttpResponse.json([
        {
          id: 1,
          title: `Product 1 ${category}`,
          price: 10,
          category,
          image: '/img/product1.jpg',
          rating: { rate: 4.5, count: 10 },
        },
        {
          id: 2,
          title: `Product 2 ${category}`,
          price: 20,
          category,
          image: '/img/product2.jpg',
          rating: { rate: 4.8, count: 5 },
        },
        {
          id: 3,
          title: `Product 3 ${category}`,
          price: 30,
          category,
          image: '/img/product3.jpg',
          rating: { rate: 4.2, count: 8 },
        },
      ]);
    },
  ),
];
