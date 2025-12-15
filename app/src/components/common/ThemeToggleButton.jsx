import { Button, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '@/context/color-mode/use-color-mode';
import { memo } from 'react';
import { useTheme } from '@mui/material/styles';

/**
 * ThemeToggleButton
 *
 * Komponent przycisku zmiany trybu kolorów (light/dark) korzystający z kontekstu ColorModeContext.
 *
 * Optymalizacje:
 * - Opakowany w React.memo, aby zapobiec zbędnym rerenderom.
 * - Rerenderuje się tylko wtedy, gdy faktycznie zmieni się `mode` lub referencja `toggleColorMode`.
 *
 * Dlaczego to ważne:
 * - Rodzic komponentu (np. Header lub Navigation) może renderować się często z powodu zmian innych stanów lub propsów, np.:
 *   - aktualnie wybrana kategoria produktów (selectedCategory)
 *   - sortowanie produktów (sortOrder)
 *   - wpisana fraza w wyszukiwarce (searchQuery)
 *   - stan otwarcia/zamknięcia drawer-a lub menu mobilnego (drawerOpen)
 *   - liczba elementów w koszyku, powiadomienia itp.
 *   - inne stany lokalne w Header/Navigation
 * - Dzięki React.memo, ThemeToggleButton nie rerenderuje się przy tych zmianach, co poprawia wydajność.
 */

const ThemeToggleButtonComponent = () => {
  const { mode, toggleColorMode } = useColorMode();
  const theme = useTheme();

  return (
    <IconButton
      color="inherit"
      onClick={toggleColorMode}
      sx={{
        borderRadius: 0,
        textDecoration: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: theme.palette.text.secondary,
        '&:hover': {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.action.hover,
        },
        '&.active': { color: theme.palette.primary.main, fontWeight: 'bold' },
      }}
    >
      {mode === 'dark' ? (
        <Brightness7Icon sx={{ fontSize: { md: '25px' } }} />
      ) : (
        <Brightness4Icon sx={{ fontSize: { md: '25px' } }} />
      )}
    </IconButton>
  );
};

export const ThemeToggleButton = memo(ThemeToggleButtonComponent);
