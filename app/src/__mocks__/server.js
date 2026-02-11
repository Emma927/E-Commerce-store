import { setupServer } from 'msw/node';
import { dataHandlers } from './data';
// server przechwytuje (interceptuje) requesty i obsługuje je handlerami z data.js
const handlers = [...dataHandlers]; // Handlery do obsługi endpointów / żądań MSW

export const server = setupServer(...handlers); // Rozbijamy wszystkie elementy tablicy
