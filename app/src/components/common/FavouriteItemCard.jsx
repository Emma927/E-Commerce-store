import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FavouriteButton } from './FavouriteButton';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';

// Opcjonalnie: Optymalizacja będzie potrzebna, jeśli w przyszłości będzie renderować się setki kart w liście, wtedy można użyć React.memo()
export const FavouriteItemCard = ({ id, image, title, description, price }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id, image, title, description, price, quantity: 1 }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: (theme) => `1px solid ${theme.palette.primary.light}`,
        borderRadius: 1,
        p: 2,
        position: 'relative',
      }}
    >
      {/* Gwiazdka toggle */}
      <FavouriteButton
        product={{ id, image, title, description, price }}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      />

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'space-between',
          gap: 2,
        }}
      >
        {/* Obrazek */}
        <Box
          alignSelf="flex-start"
          component="img"
          src={image}
          alt={title}
          sx={{
            width: { xs: 80, sm: 100, md: 120 },
            height: 'auto',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />

        {/* Tekst i przyciski */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 1,
            mr: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="subtitle1" marginRight={6}>
              {title}
            </Typography>
            <Typography variant="body2">${Number(price).toFixed(2)}</Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              alignItems: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{ minWidth: '155px' }}
            >
              Add to cart
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to={`/product/${id}`}
              sx={{ minWidth: '155px' }}
            >
              Show details
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
