import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { FavouritesList } from '@/components/common/FavouritesList';
import { Box, Fab } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Favourites = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Przekierowanie zalogowanego użytkownika do dashboard/user-favourites
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/user-favourites');
    }
  }, [isAuthenticated, navigate]);

  // Obsługa scroll-to-top
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0.5, mx: 'auto', maxWidth: isAuthenticated ? 800 : '100%' }}>
      {/* Lista dla niezalogowanych użytkowników */}
      {!isAuthenticated && <FavouritesList />}

      {showScrollTop && (
        <Fab
          color="primary"
          onClick={scrollToTop}
          size="small"
          sx={{
            position: 'fixed',
            zIndex: 50,
            right: { xs: 40, md: 30, lg: 40 },
            bottom: { xs: 215, md: 110 },
          }}
        >
          <ArrowUpwardIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Favourites;