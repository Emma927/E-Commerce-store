import { useQuery } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';

const fetchProduct = async (id) => {
  const response = await fetch(`${FAKE_API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Cannot GET the product');
  const data = await response.json();
  return data; // pojedynczy obiekt
};

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id], // queryKey pełni rolę tablicy zależności, unikalny klucz zapytania: identyfikuje dane w cache. Zależny od ID produktu
    queryFn: () => fetchProduct(id), // Funkcja, która pobiera dane produktu z API
    staleTime: 1000 * 60 * 5, // Czas (ms), przez który dane są traktowane jako "świeże" i nie są ponownie pobierane (5 minut)
    cacheTime: 1000 * 60 * 10, // Czas (ms), przez który dane pozostają w cache po tym, jak stają się nieświeże (10 minut)
    retry: 1, // Liczba ponownych prób w przypadku błędu fetchowania (1 = próba raz)
    enabled: !!id, // Fetch zostanie wykonany tylko jeśli ID istnieje (zapobiega fetchowaniu przy null/undefined)
    // Tutaj initialData nie jest potrzebne, bo komponent może poczekać aż data zostanie pobrana,
    // a React Query automatycznie ustawia data = undefined do momentu fetcha.
  });
