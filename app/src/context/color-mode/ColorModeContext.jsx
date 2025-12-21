import { createContext } from 'react';

/**
 * ColorModeContext jest tworzony osobno, bez logiki czy Providerów,
 * aby Fast Refresh ignorował obiekt kontekstu i nie powodował ostrzeżeń.
 *
 * Fast Refresh działa tylko na komponenty React, więc osobny plik
 * zapewnia stabilne hot reloady w aplikacji.
 */
export const ColorModeContext = createContext();
