import { useEffect, useState } from 'react';
import { Fab } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useLocation } from 'react-router-dom';

export const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard'); // startsWith to metoda w JavaScript dla stringów. Sprawdza, czy dany string zaczyna się od określonego ciągu znaków i zwraca true lub false.
  const isCart = location.pathname.startsWith('/cart'); // startsWith to metoda w JavaScript dla stringów. Sprawdza, czy dany string zaczyna się od określonego ciągu znaków i zwraca true lub false.

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScrollTop) return null;

  return (
    <Fab
      color="primary"
      onClick={scrollToTop}
      size="small"
      sx={{
        position: 'fixed',
        zIndex: 50,
        right: { xs: 40, md: 30, lg: 40 },
        bottom: {
          xs: isDashboard ? '215px' : isCart ? '295px' : 110,
          md: '110px',
        },
      }}
    >
      <ArrowUpwardIcon />
    </Fab>
  );
};
