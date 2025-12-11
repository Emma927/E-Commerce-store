import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getInitialMode, LIGHT_MODE, DARK_MODE } from './color-mode-utils';
import { Spinner } from '@/components/common/Spinner';

// Utworzenie kontekstu
export const ColorModeContext = createContext();
// Provider
export const ColorModeProvider = ({ children }) => {
  // Sprawdzenie preferencji systemowej
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Stan koloru: uwzględnia localStorage lub system. Tutaj useState przyjmuje funkcję inicjalizującą (lazy initializer).
  const [mode, setMode] = useState(() => {
    // od razu sprawdzamy localStorage
    const stored = getInitialMode();
    if (stored) return stored;
    // jeśli nie ma nic w localStorage, zwracamy null i ustawimy prawidłowy tryb w useEffect
    return null;
  });

  useEffect(() => {
    if (mode === null) {
      setMode(prefersDarkMode ? DARK_MODE : LIGHT_MODE);
    }
  }, [mode, prefersDarkMode]);

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
