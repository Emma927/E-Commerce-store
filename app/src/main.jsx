import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ColorModeProvider } from '@/context/color-mode/ColorModeProvider';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalAppStyles from './GlobalAppStyles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* Tworzymy globalny QueryClient dla całej aplikacji
* Jest odpowiedzialny za cache zapytań, refetchowanie i zarządzanie danymi asynchronicznymi

* Cache zapytań to miejsce w pamięci przeglądarki, w którym przechowywane są dane pobrane z serwera.
* React Query automatycznie zapisuje odpowiedzi na zapytania HTTP (np. lista produktów, dane użytkownika) w tym cache.
* Dzięki temu, jeśli ten sam komponent lub inny komponent potrzebuje tych samych danych, nie trzeba wysyłać ponownego żądania – React Query po prostu odczytuje dane z cache.
*/
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ColorModeProvider>
          <GlobalAppStyles />
          <App />
          <ToastContainer
            position="top-right"
            autoClose={3000} // toast zamyka się automatycznie po 3 sekundach
            hideProgressBar={false}
            newestOnTop // nowe toasty pojawiają się nad starszymi
            closeOnClick // kliknięcie w toast zamyka go
            pauseOnHover // zatrzymanie licznika autoClose po najechaniu myszką
            draggable // możliwość przeciągania toasta
            pauseOnFocusLoss // zatrzymanie licznika po utracie focusu okna, czyli toast nie znika, gdy użytkownik przełączy się na inną kartę
          />
        </ColorModeProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
