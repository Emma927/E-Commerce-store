// src/contexts/color-mode/color-mode-utils.js
export const LIGHT_MODE = 'light';
export const DARK_MODE = 'dark';

// funkcja zwracająca początkowy tryb
export function getInitialMode() {
  const stored = localStorage.getItem('colorMode');
  return stored ? stored : LIGHT_MODE;
}
