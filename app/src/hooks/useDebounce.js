import { useState, useEffect } from 'react';

/**
 * useDebounce służy do tego, aby nie wykonywać akcji przy każdej zmianie wpisywanych liter,
 * tylko wykonać ją dopiero po tym, jak użytkownik przestanie pisać.
 * Domyślnie opóźnienie wynosi 300 ms, co jest typowe np. dla wyszukiwania.
 * Jeśli użytkownik przestanie pisać na co najmniej 300 ms, to debouncedValue zostanie zaktualizowane.
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Jeżeli pole wyszukiwania jest puste, czyli użytkownik usunął tekst, to nie czekamy 300ms, tylko od razu zwracamy pusty sring, ponieważ wyczyścił pole to chcemy natychmiast zsresetować listę.
  useEffect(() => {
    if (value === '') {
      setDebouncedValue('');
      return;
    }

    // debounceValue się zmieni na value dopiero jak minie delay-opóźnienie
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup → clearTimeout() usuwa poprzedni timeout. Czyści funkcję zanim efekt uruchomii się ponownie.
    return () => clearTimeout(handler);
  }, [value, delay]);

  // Może zwrócić teraz zarówno debouncedValue, jak i setter
  // Potrzebna jest tylko wartość
  return debouncedValue;
};
