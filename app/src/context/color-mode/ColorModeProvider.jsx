import { useState, useMemo, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ColorModeContext } from './ColorModeContext';
import { getInitialMode, LIGHT_MODE, DARK_MODE } from './color-mode-utils';
import { Spinner } from '@/components/common/Spinner';

/**
 * ColorModeContext i ColorModeProvider zostały rozdzielone na osobne pliki celowo:
 *
 * - Teoretycznie można by je połączyć w jednym pliku – React i hooki działałyby poprawnie,
 *   a Provider byłby dostępny. ✅
 * - Jednak połączenie obiektu kontekstu i komponentu w jednym pliku powoduje problemy:
 *   1️⃣ Fast Refresh / hot reload zgłasza ostrzeżenia ESLint:
 *      "Fast refresh only works when a file only exports components"
 *   2️⃣ Podczas edycji pliku komponent nie zawsze odświeża się poprawnie,
 *      co może prowadzić do resetowania stanu useState i migania UI.
 * Efekt dla użytkownika:
 *  - Na ułamek sekundy widzisz ciemny tryb
 *  - Następnie kolor wraca do jasnego, bo stan useState się zresetował
 *
 * Dlatego:
 * - ColorModeContext jest osobno – Fast Refresh ignoruje obiekt i nie powoduje ostrzeżeń.
 * - ColorModeProvider jest osobno – Fast Refresh odświeża tylko komponent, zachowując stan.
 * - Kod jest czytelny, łatwy do testowania i hooki mogą poprawnie sprawdzać Provider.
 */

export const ColorModeProvider = ({ children }) => {
  // Sprawdzenie preferencji systemowej
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // Ta zmienna prefersDarkMode nie ustawia żadnego trybu sama w sobie, tylko sprawdza systemową preferencję użytkownika w momencie renderu

  // Stan koloru: uwzględnia localStorage lub system. Tutaj useState przyjmuje funkcję inicjalizującą (lazy initializer).
  const [mode, setMode] = useState(() => {
    // od razu sprawdzamy localStorage
    const stored = getInitialMode();
    return stored ?? (prefersDarkMode ? DARK_MODE : LIGHT_MODE); // Jeśli w localStorage nic nie ma (nie jest null, ani undefined) → użyje systemowego trybu ciemnego/jasnego
  });

  // useCallback stabilizuje referencję funkcji toggleColorMode, dzięki czemu
  // komponenty korzystające z niej (np. ThemeToggleButton opakowany w React.memo)
  // nie renderują się ponownie przy każdym renderze providera.
  // Bez useCallback memo byłoby nieskuteczne, bo funkcja zmieniałaby referencję
  // przy każdym renderze kontekstu.
  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const newMode = prev === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
      localStorage.setItem('colorMode', newMode);
      return newMode;
    });
  }, []);

  //Theme Material-UI zależny od trybu - MUI tworzy bardzo duży obiekt theme, więc robienie tego przy każdym renderze byłoby drogie.
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        breakpoints: {
          values: {
            xs: 0, // na małych ekranach (mobilnych) karta zajmuje całą szerokość (12 kolumn).
            xsm: 394, // własny breakpoint
            sm: 600,
            smd: 721,
            md: 900, // na średnich ekranach (tablet, laptop) karta zajmuje połowę szerokości (6 z 12 kolumn).
            lg: 1200, // na dużych ekranach (desktop) karta zajmuje 1/3 szerokości (4 z 12 kolumn), więc w rzędzie mieści się 3 karty.
            xl: 1536,
          },
        },
      }),
    [mode],
  );

  if (mode === null) return <Spinner />;

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
