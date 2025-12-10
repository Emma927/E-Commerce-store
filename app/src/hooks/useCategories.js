import { useQuery } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';

// useCategories w zwraca tablicę stringów, czyli same nazwy kategorii z fakeApiStore:["electronics", "jewelery", "men's clothing", "women's clothing"]
const fetchCategories = async () => {
  const url = new URL(`${FAKE_API_URL}/products/categories`);

  const response = await fetch(url);
  const data = await response.json(); // zwróci ["electronics", "jewelery", ...]

  return data; // data to tablica obiektów kategorii.
};

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'], // queryKey pełni rolę tablicy zależności
    queryFn: fetchCategories, // Funkcja fetchująca, pobiera dane z API
    staleTime: 1000 * 60 * 5, // staleTime – dane są świeże przez 5 minut, TSQ nie będzie fetchować ich ponownie w tym czasie. Domyślnie 0. Dane kategorii praktycznie nigdy się nie zmieniają
    cacheTime: 1000 * 60 * 10, // Dane pozostają w pamięci 10 minut, nawet jeśli użytkownik opuści podstronę. Domyślnie 5 minut
    retry: 1, // ile razy próbować w razie błędu, liczba prób w przypadku błędu fetch. Domyślnie ustawione 3 próby fetchowania.Jak API padnie → React Query spróbuje tylko raz
  });