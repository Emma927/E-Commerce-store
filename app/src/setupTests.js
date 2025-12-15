import '@testing-library/jest-dom/vitest'; // dodanie matecherów z jest-dom, bez tej linii, trzeba wszędzie importować matechery ręcznie na przykład toBeInTheDocument from "@testing-library/jest-dom/matchers"
import { server } from '@/__mocks__/server';

// JS DOM nie implementuje metody scrollTo, a niektóre komponenty jej używają
// Mockujemy ją, żeby testy nie wyrzucały błędów
window.scrollTo = () => {};

// JS DOM nie implementuje IntersectionObserver, a biblioteki np. Mantine używają go do lazy loadingu
// Tworzymy prosty mock, żeby testy nie wywalały błędów
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback; // callback, który normalnie reaguje na zmiany widoczności elementów
  }
  observe() {} // metoda, która w realnym przeglądarce obserwuje elementy
  unobserve() {} // metoda przestająca obserwować element
  disconnect() {} // metoda kończąca obserwację wszystkich elementów
};
// MSW setup
// Uruchamiamy serwer MSW przed wszystkimi testami
beforeAll(() => {
  // Przed wykonaniem wyszskich testów w naszym projekcie
  server.listen(); // To polecenie przechwytuje wszystkie nasze żądania
  // server.listen({ onUnhandledRequest: "baypass" }); - wtedy znikają ostrzeżenia
});

// Resetujemy handlery po każdym teście
afterEach(() => {
  // Po każdym teście restuemy handlery
  server.resetHandlers();
});

// Zamykamy serwer po wszystkich testach
afterAll(() => {
  // Na koniec, po wszystkich testach, zamykamy serwer, czyli wyłączamy przechwytywanie żądań oraz sprzątamy po srwerze
  server.close();
});
