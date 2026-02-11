import js from '@eslint/js';
import globals from 'globals';
// Pluginy React / Hooks / Vite HMR
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
// API Flat Config (ESLint 9)
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // 1. IGNOROWANIE PLIKÓW
  globalIgnores(['dist', 'node_modules', 'test-results', 'playwright-report']),
  // 2. KONFIGURACJA DLA APLIKACJI (React)
  {
    files: ['**/*.{js,jsx}'], // wszystkie pliki JS/JSX
    // 2a. PRESETY
    extends: [
      js.configs.recommended, // podstawowe reguły JS
      react.configs.flat.recommended, // reguły React
      reactHooks.configs.flat.recommended, // reguły React Hooks
      reactRefresh.configs.vite, // integracja z Vite + HMR
    ],
    // 2b. USTAWIENIA REACTA
    settings: {
      react: {
        version: 'detect', // automatyczne wykrywanie wersji React
      },
    },
    // 2c. OPCJE JĘZYKOWE
    languageOptions: {
      ecmaVersion: 'latest', // używa najnowszego standardu JS, np. optional chaining, nullish coalescing itd.
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: { jsx: true },
      },

      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    // 2d. WŁASNE REGUŁY (NADPISUJĄ PRESETY)
    rules: {
      // React 17+ nie wymaga: import React
      'react/react-in-jsx-scope': 'off',

      // nie używasz prop-types
      'react/prop-types': 'off',

      // debugger = błąd (blokuje build/CI)
      'no-debugger': 'error',

      // Husky/CI nie blokuje commitów przez unused vars
      'no-unused-vars': [
        'warn',
        {
          // varsIgnorePattern: '^[A-Z]', // ignoruj komponenty JSX (np. Icon w mapowaniu (icon: Icon)) dzięki temu ESLint nie będzie ich oznaczać jako unused vars
          argsIgnorePattern: '^_', // ignoruj _unused args
        },
      ],

      // wyciszenie ostrzeżeń o efektach
      'react-hooks/set-state-in-effect': 'warn',

      // ostrzeżenie przy eksporcie rzeczy innych niż komponenty (Vite HMR)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // 3. KONFIGURACJA DLA TESTÓW (Vitest/Jest)
  {
    files: [
      '**/*.test.js',
      '**/*.spec.js',
      '**/*.test.jsx',
      '**/*.spec.jsx',
      '**/setupTests.js', // Tutaj definiowane są globalne funkcje testowe (Jest/Vitest), ESLint przestaje je podkreślać jako nieznane
      // Bez dodania setupTests.js do listy plików ESLint nadal będzie podkreślać globalne testowe, bo Flat Config działa per files, nie globalnie po całym projekcie.
    ],

    languageOptions: {
      globals: {
        // Ręczne zdefiniowanie globali Vitest jako 'readonly'
        ...globals.jest, // Vitest często używa tych samych globali

        // dodatkowe Vitest
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
