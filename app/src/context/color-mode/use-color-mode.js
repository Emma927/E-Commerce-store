import { useContext } from 'react';
import { ColorModeContext } from './ColorModeContext';

/**
 * Custom hook do korzystania z ColorModeContext.
 *
 * Zwraca obiekt { mode, toggleColorMode } z najbliższego ColorModeProvider.
 * Jeśli hook zostanie użyty poza providerem, rzuca błąd.
 *
 * Dzięki temu komponenty nie muszą bezpośrednio używać useContext
 * ani sprawdzać, czy provider istnieje.
 */
export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  // Hook sprawdza, czy został użyty w komponencie znajdującym się wewnątrz <ColorModeProvider>.
  if (!context)
    throw new Error('useColorMode must be used within ColorModeProvider'); // Zapobiega sytuacji, gdy ktoś użyje hooka poza providerem.
  return context;
};
