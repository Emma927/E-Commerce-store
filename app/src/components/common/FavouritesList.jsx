import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectFavouritesProducts } from '@/store/favouritesSlice';
import { FavouriteItemCard } from '@/components/common/FavouriteItemCard';

export const FavouritesList = () => {
  const favourites = useSelector(selectFavouritesProducts);

  if (!favourites || favourites.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error" variant="h6">
          Your favourites list is empty
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {favourites.map((p, index) => (
        <Box key={`${p.id}-${index}`} sx={{ width: '100%' }}>
          <FavouriteItemCard {...p} />
        </Box>
      ))}
    </Box>
  );
};
