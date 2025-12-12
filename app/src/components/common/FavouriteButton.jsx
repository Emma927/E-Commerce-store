import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { IconButton, styled } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourites, removeFromFavourites, selectFavouritesProducts } from '@/store/favouritesSlice';
import { useMemo, memo } from 'react';

const FavoriteIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active', //shouldForwardProp filtruje propsy, które są używane tylko do stylowania,
// aby nie trafiały do DOM i nie generowały ostrzeżeń Reacta.
})(({ theme, active }) => ({
  position: 'absolute',
  margin: theme.spacing(0.5),
  top: 5,
  right: 5,
  color: active ? theme.palette.primary.main : '#fff',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(108, 107, 107, 0.30)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
}));

const FavouriteButtonComponent = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector(selectFavouritesProducts);

  // Bezpieczne sprawdzenie, czy product istnieje w ulubionych
  /**
   favourites.some((p) => p.id === product.id) sprawdza, czy w tablicy ulubionych produktów (favourites) istnieje przynajmniej jeden element, którego id jest równe id wybranego produktu (product.id).
    - Jeśli taki element istnieje → wynik .some() jest true.
    - Jeśli nie istnieje → wynik .some() jest false.
   */
  const isFavourite = useMemo(() => {
    // To .some() decyduje, czy wynik faktycznie będzie true.
    return product ? favourites.some((p) => p.id === product.id) : false;
  }, [favourites, product]);

  const toggleFavourite = () => {
    
    if (!product) return;

    if (isFavourite) {
      dispatch(removeFromFavourites(product.id));
    } else {
      dispatch(addToFavourites(product));
    }
  };

  return (
    <FavoriteIconButton size="medium" onClick={toggleFavourite} active={isFavourite}>
      {isFavourite ? <StarIcon /> : <StarBorderIcon />}
    </FavoriteIconButton>
  );
};

// React.memo – rerenderuje tylko gdy zmienią się propsy (product)
export const FavouriteButton = memo(FavouriteButtonComponent);