import GlobalStyles from '@mui/material/GlobalStyles';

const GlobalAppStyles = () => (
  <GlobalStyles
    styles={{
      html: {
        WebkitFontSmoothing: 'antialiased', // Poprawia wygląd czcionek w przeglądarkach WebKit (Chrome, Safari), wygładzając krawędzie liter → tekst jest wyraźniejszy i bardziej ostry.
        MozOsxFontSmoothing: 'grayscale', //  Poprawia renderowanie fontów w Firefox na macOS, zastępując subpixel smoothing skalą szarości → litery wyglądają bardziej estetycznie.
        scrollBehavior: 'smooth', // Włącza płynne (animowane) przewijanie dla całej strony np. przy używaniu odnośników do sekcji (#anchor) lub scrollTo
      },
      body: {
        fontFamily: "'Roboto', sans-serif",
      },
      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }
    }}
  />
);

export default GlobalAppStyles;