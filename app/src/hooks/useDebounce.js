import { useState, useEffect } from 'react';

/**
 * useDebounce służy do tego, aby nie wykonywać akcji przy każdej zmianie wpisywanych liter,
 * tylko wykonać ją dopiero po tym, jak użytkownik przestanie pisać.
 * Domyślnie opóźnienie wynosi 300 ms, co jest typowe np. dla wyszukiwania.
 * Jeśli użytkownik przestanie pisać na co najmniej 300 ms, to debouncedValue zostanie zaktualizowane.
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(() =>
    value === '' ? '' : value,
  );

  // Jeżeli pole wyszukiwania jest puste, czyli użytkownik usunął tekst, to nie czekamy 300ms, tylko od razu zwracamy pusty sring, ponieważ wyczyścił pole to chcemy natychmiast zsresetować listę.
  /**
   JavaScript używa pętli zdarzeń (event loop):
Wykonuje bieżący stos wywołań (cały aktualny kod JS i efekty React).
Gdy stos jest pusty, pobiera zadania z kolejki zadań (macro task queue).
Funkcja z setTimeout(..., 0) trafia do tej kolejki → jest więc wykonana „po wszystkim innym”.
   */
  useEffect(() => {
    /**
     * Jeśli value jest puste, resetujemy debouncedValue natychmiast,
     * ale asynchronicznie w kolejce zdarzeń JS (macro task), żeby:
     * 1️⃣ uniknąć ostrzeżeń ESLint o synchronicznym setState w useEffect,
     * 2️⃣ nie powodować niepotrzebnych rerenderów.
     *
     * 0 w setTimeout(..., 0) oznacza „wykonaj po zakończeniu bieżącego stosu wywołań”.
     */
    if (value === '') {
      // Tak, dokładnie – 0 w setTimeout(..., 0) nie oznacza „nie rób nic”, tylko „wykonaj po zakończeniu bieżącego stosu wywołań, czyli w kolejnym cyklu pętli zdarzeń JavaScript”.
      const id = setTimeout(() => setDebouncedValue(''), 0); // setTimeout(..., 0) przekłada wywołanie na koniec kolejki zdarzeń JS (tzw. macro task).
      return () => clearTimeout(id);
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
