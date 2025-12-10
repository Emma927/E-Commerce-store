import { Box, Button, Container, Typography } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from 'react-router-dom';

/**
 * Komponent strony 404 (Not Found).
 * - Wyświetla animację Lottie informującą użytkownika, że strona nie istnieje.
 * - Zawiera link do powrotu na stronę główną.
 * - Używa flexbox do wyśrodkowania treści zarówno w pionie, jak i poziomie.
 */
function NotFound() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        <DotLottieReact
          src="https://lottie.host/89a1435f-e29a-46bf-a5d6-e9c544b45f9b/HYwm5IxjnD.lottie"
          loading="lazy"
          // loop
          // autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
        Page not found
      </Typography>

      <Button component={Link} to="/" variant="contained" color="primary">
        Come back to us!
      </Button>
    </Container>
  );
}

export default NotFound;
