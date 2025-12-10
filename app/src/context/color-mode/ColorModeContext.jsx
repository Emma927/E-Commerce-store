// contexts/color-mode/color-mode-context.jsx
// color-mode-context przed rozwiązaniem był cały pusty
import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getInitialMode, LIGHT_MODE, DARK_MODE } from './color-mode-utils'; // importujemy helpery
import { Spinner } from '@/components/common/Spinner';

// 1. Utworzenie kontekstu
export const ColorModeContext = createContext();
// 2. Provider
export const ColorModeProvider = ({ children }) => {
  // Sprawdzenie preferencji systemowej
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Stan koloru: uwzględnia localStorage lub system
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
  /*Dlaczego warto tutaj zostawić useCallback?
toggleColorMode to funkcja, która idzie do kontekstu.

Kontekst będzie przekazywał tę samą referencję funkcji do wszystkich dzieci, zamiast nowej na każdym renderze.

Dzięki temu, jeśli w przyszłości któreś z dzieci będzie opakowane w memo albo będzie używało useEffect zależnego od tej funkcji → nie będzie zbędnych rerenderów / efektów.

Koszt useCallback jest minimalny w porównaniu do potencjalnych zysków w stabilności referencji.

To taka prewencyjna optymalizacja, która nie szkodzi, a może pomóc.

Usunięcie useCallback teraz raczej nie zepsuje działania aplikacji, ale utrudni przyszłe optymalizacje komponentów potomnych.*/

  //✅ Twoja implementacja toggleColorMode pasuje pod zasadę „useCallback w komponentach, które przekazują funkcje jako props”, bo funkcja jest przekazywana przez kontekst do dzieci.
  //Nie chodzi o to, że funkcja sama ma propsy.
  // Chodzi o to, że funkcja jest przekazywana dalej (jako prop lub przez kontekst).
  // useCallback stabilizuje referencję tej funkcji, aby dzieci nie rerenderowały się bez potrzeby.
  // Funkcja zmiany motywu
  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const newMode = prev === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
      localStorage.setItem('colorMode', newMode);
      return newMode;
    });
  }, []);
  /**
   * Dokładnie – w Twoim konkretnym przypadku useCallback obecnie nie daje Ci dużych, zauważalnych korzyści 💡
   * Dlaczego:
   * - Funkcja toggleColorMode trafia do dzieci przez kontekst, ale:
   * - Jeśli dzieci nie są opakowane w React.memo i nie zależą od referencji funkcji (np. w useEffect), to i tak będą rerenderowane przy każdym renderze providera.
   *
   * Czyli sama stabilizacja referencji funkcji nic nie zmienia w zachowaniu komponentów potomnych.
   * Gdybyś miał:
   * - dzieci z React.memo, które konsumują toggleColorMode
   * - lub efekt (useEffect) zależny od tej funkcji
   * → wtedy useCallback realnie zapobiegłby zbędnym rerenderom lub wywołaniom efektów.
   * */

  //Theme Material-UI zależny od trybu
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
    [mode]
  );

  /** ColorModeContext.Provider:
      W ColorModeContext stan mode nie jest kolorem ani stylem, tylko opisowo mówi, który tryb jest aktywny.
      mode → aktualny tryb (light albo dark)
      toggleColorMode → funkcję do zmiany trybu
  */

  /** ThemeProvider (z MUI):
      Przyjmuje obiekt theme (w tym przypadku z createTheme({ palette: { mode } }))
      Wszystkie komponenty MUI (Button, AppBar, Typography, itp.) renderują się zgodnie z tym tematem
      Automatycznie zmienia kolory, tło, kontrast w całej aplikacji po zmianie mode. 
   */


      if (mode === null) return <Spinner />; 

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children} {/* <- to jest kluczowe, inaczej dzieci nie będą miały dostępu */}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

/**
 * Albo bardziej rozbudowana wersja
 *
 * // 3. Własny hook
 * export const useColorMode = () => {
 *   const context = useContext(ColorModeContext);
 *
 *   if (!context) {
 *     throw new Error('useColorMode must be used within a ColorModeProvider');
 *   }
 *   return context;
 * };
 * */
