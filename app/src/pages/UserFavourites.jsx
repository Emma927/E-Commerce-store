import { useState, useEffect } from 'react';
import { FavouritesList } from '@/components/common/FavouritesList';
import { Box, Fab } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const UserFavourites = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  return (
    <Box sx={{ mt: 0.5, mb: 4, mx: 'auto', maxWidth: 800 }}>
      <FavouritesList />

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

export default UserFavourites;
