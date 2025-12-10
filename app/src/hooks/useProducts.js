import { useQuery } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';
// Tu fetchujesz produkty tylko z jednej kategorii.
// Jeśli spróbujesz zrobić categories.map(c => useProducts({ category: c })) → błąd hooków, bo hooki nie mogą być wywoływane w pętli.
// useProducts jest zaprojektowany do jednej kategorii na raz — jego queryKey i queryFn odnoszą się do konkretnej kategorii. Nie możesz go użyć w pętli dla wielu kategorii, bo hooki nie mogą być wywoływane dynamicznie w mapie (to złamanie zasad hooków Reacta).
export const fetchProducts = async ({ category, limit, sort } = {}) => {
  /**
   Jeśli category jest podane, URL zmienia się na /products/category/:category.

Ten endpoint zwraca tylko produkty w tej kategorii.

Przykład: /products/category/electronics → wszystkie produkty elektroniczne.

Jeśli category nie jest podane (undefined), URL pozostaje /products -> zwraca wszystkie produkty, niezależnie od kategorii.
   */

  /**
   * Pobiera produkty z Fake Store API.
   *
   * Jeśli podana jest kategoria, używa endpointu `/products/category/:category`.
   *
   * Parametry `limit` i `sort` działają zarówno na endpoint globalny (`/products`),
   * jak i na endpoint kategorii (`/products/category/:category`),
   * mimo że dokumentacja API nie wspomina o `limit` dla kategorii. W dokumentacji nie ma limitu dla produktów z wybranej kategorii, prawdopodobie jest nieaktualna.
   *
   Endpointy obsługują parametry limit i sortowania w obu wariantach (np. /products?limit=5 oraz /products/category/electronics?limit=3).
   mimo, że w dokumentacji nie ma limitu dla produktów z wybranej kategorii, prawdopodobie jest nieaktualna.
   */

  // URL zmienia się w zależności od tego, czy podana jest kategoria.
  // A FakeStoreAPI nie przyjmie "men's clothing" bez kodowania.
  let url = category ? `${FAKE_API_URL}/products/category/${encodeURIComponent(category)}` : `${FAKE_API_URL}/products`;

  /**
   * URLSearchParams jest klasą, więc musisz najpierw utworzyć jej instancję, żeby używać append().
URLSearchParams().toString() to po prostu wygodny sposób na zamianę danych z obiektu JavaScript na poprawny, sformatowany ciąg znaków, który przeglądarki i serwery potrafią odczytać jako listę parametrów URL.
   */
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit);
  if (sort) params.append('sort', sort);

  // limit=5&sort=desc
  // ✅ Znak & dodaje JS sam, nie musisz tego robić ręcznie.
  if ([...params].length) {
    url += `?${params.toString()}`;
  }
  console.log(url); // Sprawdź w konsoli, czy limit faktycznie jest w URL

  const response = await fetch(url);
  if (!response.ok) throw new Error('Cannot get products');
  const data = await response.json();
  return data;
};

/**Chroni przed błędem, gdy ktoś wywoła useProducts() bez żadnych parametrów.

Wtedy category, limit i sort będą undefined, a funkcja nadal zadziała. */
// Funkcja strzałkowa bez klamer i return:
export const useProducts = ({ category, limit, sort } = {}) =>
  useQuery({
    queryKey: ['products', { category, limit, sort }], // queryKey pełni rolę tablicy zależności
    queryFn: () => fetchProducts({ category, limit, sort }),
    staleTime: 1000 * 60 * 5, // np. 5 minut cache, staleTime – dane są świeże przez 5 minut, nie trzeba ponownie fetchować.
    cacheTime: 1000 * 60 * 10, // np. 10 minut w cache, po nieużywaniu danych przez 10 minut zostaną usunięte z cache.
    retry: 1, // ile razy próbować w razie błędu, po nieużywaniu danych przez 10 minut zostaną usunięte z cache.
  });