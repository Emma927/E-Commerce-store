import { useInfiniteQuery } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';

/**
 * fetchProductsInfinite - pobiera produkty z FakeStoreAPI
 *
 * - Jeśli podano kategorię, pobiera tylko produkty z tej kategorii.
 * - API FakeStore nie obsługuje paginacji po stronie serwera, więc fetch pobiera wszystkie produkty naraz.
 * - Sortowanie po cenie odbywa się już tutaj (po pobraniu wszystkich produktów), aby
 *   kolejne strony w infinite scroll były poprawnie posortowane.
 * - Hook useProductsInfinite zajmuje się tylko paginacją po stronie klienta,
 *   cache'owaniem i react-query logic.
 */
export const fetchProductsInfinite = async ({
  category,
  sort = 'asc',
} = {}) => {
  // = {} na końcu ma inną rolę: gwarantuje, że jeśli funkcja zostanie wywołana bez argumentu w ogóle, np. fetchProductsInfinite(), to destrukturyzacja nie wyrzuci błędu.
  // Wartość domyślna sort = 'asc' działa tylko jeśli argument sort w ogóle nie istnieje w przekazanym obiekcie.
  const url = category
    ? `${FAKE_API_URL}/products/category/${encodeURIComponent(category)}`
    : `${FAKE_API_URL}/products`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Cannot get products');

  const data = await response.json();

  // 🔹 Sortujemy już tutaj po stronie „backendu” (API zwraca wszystkie produkty)
  return data.sort((a, b) =>
    sort === 'asc' ? a.price - b.price : b.price - a.price,
  );
};

/**
 * useProductsInfinite - hook dla infinite scroll
 *
 * - fetchuje wszystkie produkty z API (z opcjonalnym filtrowaniem po kategorii)
 * - sortowanie odbywa się w fetchProductsInfinite (po cenie)
 * - hook zajmuje się tylko: paginacją po stronie klienta i zarządzaniem query cache
 * - dzięki temu komponent Products nie musi znać logiki sortowania ani pobierać wszystkich danych
 */
export const useProductsInfinite = ({
  category,
  pageSize = 6,
  sort,
  search = '',
  rating = 0,
} = {}) =>
  useInfiniteQuery({
    queryKey: ['products-infinite', { category, sort, search, rating }],
    // pageParam = 0 w hooku to startowy indeks w tablicy produktów, od którego zaczyna się wycinek (slice) dla pierwszej „strony” infinite scroll.
    queryFn: async ({ pageParam = 0 }) => {
      // Jeśli category === 'all', traktujemy jak pusty string
      // Nie ma kategorii "all". Jeśli w URL wpiszesz /products/category/all, API zwróci 404 albo pustą tablicę. Dlatego w hooku, gdy użytkownik wybiera All, trzeba przekazać pusty string, żeby triggerować GET /products zamiast /products/category/all.
      // '' (pusty string) oznacza fetch wszystkich produktów: /products zamiast /products/category/all.
      const cat = category === 'all' ? '' : category; // W skrócie: "all" w UI to → '' w kodzie, czyli → /products w API bez kategorii
      let data = await fetchProductsInfinite({ category: cat, sort });

      // Paginacja po stronie klienta
      return data.slice(pageParam, pageParam + pageSize);
    },
    // React Query używa getNextPageParam, żeby wiedzieć, od którego indeksu pobrać kolejną stronę:
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) return undefined;
      return allPages.flat().length; // allPages.flat().length → daje liczbę produktów pobranych do tej pory, czyli indeks startowy dla następnej strony.
    },
    staleTime: 1000 * 60 * 5, // 5 minut (ms) → przez ten czas React Query uważa dane za "świeże" i **nie będzie ponownie fetchować** przy remount lub ponownym użyciu queryKey
    cacheTime: 1000 * 60 * 10, // 10 minut (ms) → ile czasu dane pozostają w pamięci cache **po tym jak query przestanie być używane**.
    // Po tym czasie React Query usunie je z cache.
    retry: 1, // Liczba prób ponowienia zapytania w przypadku błędu fetcha.
    // Tutaj: jeśli fetch się nie powiedzie, React Query spróbuje jeszcze 1 raz przed ustawieniem isError = true
  });
