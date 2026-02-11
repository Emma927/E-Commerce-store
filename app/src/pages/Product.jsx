import { Spinner } from '@/components/common/Spinner';
import { Box, Typography, Button, Rating } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FavouriteButton } from '@/components/common/FavouriteButton';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { FORMAT_COMMAS } from '@/constants';
import { useHandleApiError } from '@/hooks/useHandleApiError';
import { useEffect } from 'react';

const Product = () => {
  const { id } = useParams();
  console.log('Product ID from URL:', id, typeof id);
  const { data: product, isPending, isError, error } = useProduct(id);

  console.log('Product ID from URL:', id);
  console.log('useProduct data:', product);
  console.log('isPending:', isPending, 'isError:', isError);
  console.log('Product ID from URL:', id, typeof id);

  const dispatch = useDispatch();
  const theme = useTheme();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        image: product.image,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: 1,
      }),
    );
  };

  // Tworzymy handler błędów API z użyciem custom hooka.
  // Przekazujemy queryKey (['product, id']), który hook wykorzysta tylko w przypadku błędu serwera (status ≥ 500), aby opcjonalnie wywołać refetch danych (queryClient.invalidateQueries) dla tego zapytania.
  const handleApiError = useHandleApiError(['product', id]); // klucz query zależny od produktu

  useEffect(() => {
    if (isError) handleApiError(error);
  }, [isError, error, handleApiError]);

  // Sprawdza, czy dane są w trakcie pobierania.
  if (isPending) return <Spinner />;

  // Sprawdza, czy dane pojedynczego produktu zostały pobrane.
  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography color="error">No products to view.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 2 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            position: 'relative',
            maxWidth: { sm: '300px' },
            width: '100%',
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              maxHeight: { xs: '400px', md: '500px' },
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
          <FavouriteButton
            product={{
              id: product.id,
              image: product.image,
              title: product.title,
              description: product.description,
              price: product.price,
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: '18px', md: '23px' },
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {product.title}
          </Typography>
          {/* Rating produktu */}
          {product.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating
                value={product.rating.rate}
                precision={0.1}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                ({product.rating.count})
              </Typography>
            </Box>
          )}
          <Typography variant="body1" paragraph>
            {FORMAT_COMMAS(product.description)}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            ${Number(product.price).toFixed(2)}
          </Typography>
          <Button variant="contained" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Product;
