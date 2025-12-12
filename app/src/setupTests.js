import '@testing-library/jest-dom/vitest'; // dodanie matecherów z jest-dom, bez tej linii, trzeba wszędzie importować matechery ręcznie na przykład toBeInTheDocument from "@testing-library/jest-dom/matchers"
import { server } from '@/__mocks__/server';

beforeAll(() => { // Przed wykonaniem wyszskich testów w naszym projekcie
  server.listen(); // To polecenie przechwytuje wszystkie nasze żądania
  // server.listen({ onUnhandledRequest: "baypass" }); - wtedy znikają ostrzeżenia
});

afterEach(() => { // Po każdym teście restuemy handlery
    server.resetHandlers();
});

afterAll(() => { // Na koniec, po wszystkich testach, zamykamy serwer, czyli wyłączamy przechwytywanie żądań oraz sprzątamy po srwerze
    server.close();
});
