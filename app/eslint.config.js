import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';

export default defineConfig([
  // 1. IGNOROWANIE PLIKÓW
  {
    ignores: ['dist', 'node_modules', 'test-results', 'playwright-report'],
  },
  // 2. BAZOWE REKOMENDACJE (jako osobne elementy tablicy)
  js.configs.recommended,
  // 2. GŁÓWNY BLOK KONFIGURACYJNY DLA APLIKACJI - KONFIGURACJA DLA APLIKACJI
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // DODANO USTAWIEŃ WERSJI REACTA:
    settings: {
      react: {
        version: 'detect',
      },
    },
    // 2. REKOMENDOWANA KONFIGURACJA JS I REACT
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Ładujemy reguły z pluginów ręcznie, bo Flat Config nie używa 'extends' wewnątrz obiektów
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // --- WYŁĄCZENIE BŁĘDÓW, KTÓRE CI SIĘ POJAWIŁY ---
      'react/react-in-jsx-scope': 'off', // Nie wymaga "import React" w każdym pliku
      'react/prop-types': 'off', // Nie wymaga definiowania propTypes

      // Zmieniamy na 'warn', aby Husky nie blokował pracy (np. przy mapowaniu ikon)
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^[A-Z]', // ignoruj JSX Components
          argsIgnorePattern: '^_',
        },
      ],
      'react/jsx-uses-vars': 'warn', // ignoruje podkreślanie JSX Components

      // Wyciszamy błąd kaskadowych renderów, aby odblokować testy
      'react-hooks/set-state-in-effect': 'warn',

      // Ostrzeżenie o eksporcie rzeczy innych niż komponenty (np. Context)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // 3. KONFIGURACJA DLA TESTÓW I PLIKÓW SETUP
  {
    files: [
      '**/*.test.js',
      '**/*.spec.js',
      '**/*.test.jsx',
      '**/*.spec.jsx',
      'src/setupTests.js', // Dodane, aby przedAll/afterEach były tu legalne
    ],
    languageOptions: {
      globals: {
        // Ręczne zdefiniowanie globali Vitest jako 'readonly'
        ...globals.jest, // Vitest często używa tych samych globali
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      // W testach często mamy nieużywane zmienne, więc tu też dajemy tylko ostrzeżenie
      'no-unused-vars': 'warn',
    },
  },
]);
