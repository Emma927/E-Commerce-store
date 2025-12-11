export const LIGHT_MODE = 'light';
export const DARK_MODE = 'dark';

// Funkcja zwracająca początkowy tryb - służy jedynie do pobrania wartości z localStorage i ustawienia domyślnej
export function getInitialMode() {
  const stored = localStorage.getItem('colorMode');
  return stored ? stored : LIGHT_MODE;
}
