import { Box, Container, Typography, IconButton } from '@mui/material';
import { SOCIAL_MEDIA_SITES } from '@/constants';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard'); // startsWith to metoda w JavaScript dla stringów. Sprawdza, czy dany string zaczyna się od określonego ciągu znaków i zwraca true lub false.
  const isCart = location.pathname.startsWith('/cart');

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.default',
        width: '100%',
        height: '90px',
        mb: {
          xs: isDashboard ? '110px' : isCart ? '185px' : 0,
          md: 0,
        }, // warunkowy padding tylko dla Dashboard i Cart
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          width: '100%',
          height: '100%'
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} E-Commerce store, Inc
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {SOCIAL_MEDIA_SITES.map(({ icon: Icon, address, label, width, height }) => (
            <IconButton
              key={address}
              component="a"
              href={address}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              color="inherit"
            >
              <Icon sx={{ width, height }} />
            </IconButton>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
