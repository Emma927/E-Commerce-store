import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Rating,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FavouriteButton } from './FavouriteButton';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice'; // zakładam, że masz taką akcję
import { useTheme } from '@mui/material/styles';
import { memo } from 'react';

// ❌ Jeśli nie masz memo → React i tak rerenderuje komponenty dzieci, bo rerender rodzica = rerender dzieci (standard React).
/**
 W moim przypadku:

Mam listę produktów, często 20 elementów.
Propsy ProductCard są stałe dla każdego produktu (id, title, price, image).
Rodzic rerenderuje się przy otwieraniu drawer’a lub zmianie filtrów.

✅ Dlatego memo jest tutaj uzasadnione, bo zapobiega rerenderom wszystkich kart przy otwieraniu drawer’a, zmianach filtrów, które nie wpływają na te propsy.
Propsy są stałe → React DOM i tak się nie zmieni.
Bez memo funkcja komponentu wykona się na nowo, ale to jest koszt CPU, nie DOM.
Z memo funkcja w ogóle się nie wykona → oszczędzasz zasoby.
 */

/** 
 React.memo opakowuje komponent, aby: 
 1️. Zapobiec rerenderowaniu ProductCard, jeśli propsy (id, title, price, image) się nie zmieniły.
 2️. Wydajniej obsługiwać listy produktów – dzięki temu, gdy rodzic rerenderuje się, z powodu np. otwarcia drawer’a, zmiany filtra czy motywu, funkcja dziecka nie jest wywoływana ponownie.
 3️. Zmniejszyć obciążenie CPU (Central Processing Unit, czyli procesor w komputerze lub urządzeniu) przy renderowaniu wielu kart, mimo że DOM i tak się nie zmieni.
 */
const ProductCardComponent = ({ id, image, title, description, price, rating }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleAddToCart = () => {
    dispatch(addToCart({ id, image, title, description, price, quantity: 1 }));
  };

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        border: `3px solid ${theme.palette.primary.light}`,
        minHeight: { xs: '400px', xsm: '430px', md: '490px', lg: '530px' },
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          maxHeight: { xs: '340px', sm: '380px', md: '470px' },
          '&:hover .card-media-hover': {
            transform: 'scale(1.03)',
          },
          cursor: 'default',
        }}
      >
        <Box sx={{ m: 3, maxHeight: { xs: '240px', md: '300px' } }}>
          <CardMedia
            component="img"
            image={image}
            alt={title}
            loading="lazy"
            className="card-media-hover"
            sx={{
              maxHeight: { xs: '140px', xsm: '180px' },
              width: 'auto',
              objectFit: 'contain',
              flex: 1,
              transition: 'transform 0.2s ease-out', // dodanie przejścia
            }}
          />
        </Box>
        <CardContent sx={{ minHeight: { xs: '110px', md: '160px' }, objectFit: 'contain', width: '100%', mt: 1 }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontSize: { xs: '16px', sm: '18px', md: '20px' },
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            {title}
          </Typography>
          {/* Rating produktu */}
          {rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Atrybut readOnly w komponencie MUI <Rating> oznacza, że użytkownik nie może zmieniać wartości gwiazdek — komponent jest wyłącznie do wyświetlania. */}
              <Rating value={rating.rate} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({rating.count})
              </Typography>
            </Box>
          )}
          <Typography variant="subtitle1" sx={{ fontSize: { xs: '18px', sm: '20px', md: '22px' }, fontWeight: 'bold' }}>
            ${Number(price).toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ flexGrow: 1 }} />
      <CardActions disableSpacing sx={{ justifyContent: 'space-between', p: 2, pb: 3, mt: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%'}}>
          <FavouriteButton product={{ id, image, title, description, price }} />
          <Button
            size="small"
            variant="contained"
            sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' } }}
            onClick={handleAddToCart}
          >
            Add to cart
          </Button>
          <Button
            size="small"
            variant="outlined"
            sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' } }}
            component={Link}
            to={`/product/${id}`}
          >
            Show details
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export const ProductCard = memo(ProductCardComponent);
