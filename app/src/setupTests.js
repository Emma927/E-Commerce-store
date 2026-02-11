import '@testing-library/jest-dom/vitest'; // dodanie matecherów z jest-dom, bez tej linii, trzeba wszędzie importować matechery ręcznie na przykład toBeInTheDocument from "@testing-library/jest-dom/matchers"
import { server } from '@/__mocks__/server'; // Podpięcie serwera MSW, aby testy mogły z niego korzystać

/////////////////////////////
// Tego fragmentu kodu nie było w oryginalnym setupTests.js z kursu //

// JS DOM nie implementuje metody scrollTo, która tworzy pustą funkcję zamiast prawdziwego scrollTo,
// a niektóre komponenty jej używają
// Mockujemy ją, żeby testy nie wyrzucały błędów,
// nie wykonuje prawdziwej obserwacji, tylko zapobiega błędom
window.scrollTo = () => {}; // Bez tego mocka wyrzuca błąd: "Not implemented: Window's scrollTo() method"

// JS DOM nie implementuje IntersectionObserver, a biblioteki np. Mantine używają go do lazy loadingu
// Tworzymy prosty mock, żeby testy nie wywalały błędów
global.IntersectionObserver = class {
  // Bez tego mocka wyrzuca błąd: "ReferenceError: IntersectionObserver is not defined"
  constructor(callback) {
    this.callback = callback; // callback, który normalnie reaguje na zmiany widoczności elementów
  }
  observe() {} // metoda, która w realnej przeglądarce obserwuje elementy
  unobserve() {} // metoda przestająca obserwować element
  disconnect() {} // metoda kończąca obserwację wszystkich elementów
};
//////////////////
// 1 Krok
// MSW setup
// Uruchamiamy serwer MSW przed wszystkimi testami
beforeAll(() => {
  // Przed wykonaniem wyszskich testów w naszym projekcie
  server.listen(); // To polecenie przechwytuje wszystkie nasze żądania
  // server.listen({ onUnhandledRequest: "baypass" }); - wtedy znikają ostrzeżenia, nie będziemy ostrzegani, że korzystamy z jakiegoś endpointu, dp którego nie mamy napisanego handlera.
});

// 2 Krok
// Resetujemy handlery po każdym teście
afterEach(() => {
  // Po każdym teście restuemy handlery
  server.resetHandlers();
});

// 3 Krok
// Zamykamy serwer po wszystkich testach
afterAll(() => {
  // Na koniec, po wszystkich testach, zamykamy serwer, czyli wyłączamy przechwytywanie żądań oraz sprzątamy po srwerze
  server.close();
});
