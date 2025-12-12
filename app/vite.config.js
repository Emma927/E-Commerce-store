import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
    open: false,
    allowedHosts: [
      'localhost', // dla lokalnego dev
      'e-commerce-store', // dla kontenera e2e-tests
    ],
  },
  test: {
    coverage: {
      reporter: ['html'],
    },
    environment: 'jsdom', // <- potrzebne dla RTL, to React Testing Library:

    // -nie renderuje komponentu w prawdziwej przeglądarce, tylko tworzy symulowany DOM (za pomocą jsdom) — w pamięci, w środowisku testowym.
    globals: true, // <- dodajemy globalne expect, test, describe - umożliwia to pomijanie importów:describe, expect, czy test z bibloteki vitest
    include: ['**/*.{spec,test}.{js,jsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    //setupFiles w konfiguracji Vitest (vitest.config.js) służy do inicjalizacji środowiska testowego przed każdym testem. Dzięki temu nie musisz powtarzać importu w każdym pliku testowym.
    setupFiles: ['./src/setupTests.js'], // inicjalizacja jest-dom
    //Jeśli chcesz uruchomić więcej niż jeden plik setup:
    // setupFiles: ["./vitest.setup.js", "./anotherSetup.js"]
    passWithNoTests: true, // pozwala zakończyć testy sukcesem jeśli brak plików
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias @ w resolve.alias pozwala używać skróconej ścieżki do katalogu src, co upraszcza importy.
    },
  },
  optimizeDeps: {
    exclude: ['@playwright/test', 'playwright-core'], // Wykluczenie niektórych zależności z optymalizacji Vite
  },
});
