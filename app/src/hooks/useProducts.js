import { useQuery } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';
// Tu fetchujesz produkty tylko z jednej kategorii.
// Jeśli spróbujesz zrobić categories.map(c => useProducts({ category: c })) → błąd hooków, bo hooki nie mogą być wywoływane w pętli.
// useProducts jest zaprojektowany do jednej kategorii na raz — jego queryKey i queryFn odnoszą się do konkretnej kategorii. Nie możesz go użyć w pętli dla wielu kategorii, bo hooki nie mogą być wywoływane dynamicznie w mapie (to złamanie zasad hooków Reacta).
export const fetchProducts = async ({ category } = {}) => {
  // Adres url jest tylko do zapytania do API. To nie jest adres w pasku przeglądarki, nie ma on nic wspólnego z tym, co widzisz w window.location czy React Routerze.
  // URL zmienia się w zależności od tego, czy podana jest kategoria.
  // A FakeStoreAPI nie przyjmie "men's clothing" bez kodowania.
  let url = category
    ? `${FAKE_API_URL}/products/category/${encodeURIComponent(category)}`
    : `${FAKE_API_URL}/products`;

  /**
   * URLSearchParams jest klasą, więc trzeba najpierw utworzyć jej instancję, żeby używać append().
URLSearchParams().toString() to po prostu wygodny sposób na zamianę danych z obiektu JavaScript na poprawny, sformatowany ciąg znaków, który przeglądarki i serwery potrafią odczytać jako listę parametrów URL.
   */
  // const params = new URLSearchParams();
  // if (limit) params.append('limit', limit);
  // if (sort) params.append('sort', sort);

  // limit=3&sort=desc
  // ✅ Znak & dodaje JS sam, nie trzeba tego robić ręcznie.
  // if ([...params].length) {
  //   url += `?${params.toString()}`;
  // }
  console.log(url); // Sprawdź w konsoli, czy limit faktycznie jest w URL

  const response = await fetch(url);
  if (!response.ok) throw new Error('Cannot get products');
  const data = await response.json();
  return data;
};

/** Domyślnie przekazany pusty obiekt = {} chroni przed błędem, gdy ktoś wywoła useProducts() bez żadnych parametrów / argumentów.
Wtedy category, limit i sort będą undefined, a funkcja nadal zadziała. bez tego ={} byłby błąd typu „Cannot destructure property of undefined” */
export const useProducts = ({ category } = {}) =>
  useQuery({
    queryKey: ['products', { category }], // queryKey pełni rolę tablicy zależności
    queryFn: () => fetchProducts({ category }),
    staleTime: 1000 * 60 * 5, // np. 5 minut cache, staleTime – dane są świeże przez 5 minut, nie trzeba ponownie fetchować.
    cacheTime: 1000 * 60 * 10, // np. 10 minut w cache, po nieużywaniu danych przez 10 minut zostaną usunięte z cache.
    retry: 1, // ile razy próbować w razie błędu, po nieużywaniu danych przez 10 minut zostaną usunięte z cache.
  });
