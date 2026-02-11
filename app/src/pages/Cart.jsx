import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import { CartItemCard } from '@/components/common/CartItemCard';
import { useSelector, useDispatch } from 'react-redux';
import { selectUsername, selectIsAuthenticated } from '@/store/authSlice';
import {
  removeFromCart,
  updateQuantity,
  selectCartProducts,
  selectCartTotalPrice,
} from '@/store/cartSlice';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';

// Cart – optymalizacja obecnie nie jest potrzebna. W przyszłości można rozważyć dodanie useDebounce:
// - Nie jest konieczna teraz, bo zmiana ilości produktów w koszyku jest szybka i natychmiastowa.
// - Można ją rozważyć, jeśli koszyk będzie zawierał bardzo dużo produktów lub inputy będą powodować zauważalne opóźnienia w renderowaniu.
const Cart = () => {
  const cartProducts = useSelector(selectCartProducts);
  const totalPrice = useSelector(selectCartTotalPrice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector(selectUsername);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // useCallback: Główna rola: zapamiętanie funkcji między renderami, aby nie tworzyć ich od nowa i nie powodować niepotrzebnych renderów dzieci. useCallback nie jest tuaj potrzbeny , ponieważ funckja nie jest przekazywana do memoizowanego komponentu, więc nie ma potrzeby używania useCallback.
  const handleChangeQty = (id, qty) => {
    if (qty < 1) return; // minimalna ilość = 1
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  if (!cartProducts.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography color="error" variant="h6">
          Your cart is empty
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, color: 'error' }}>
        Your cart
      </Typography>
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{
            mb: {
              xs: '185px',
              md: 0,
              height: 'fit-content' /* ważne dla sticky*/,
            },
          }}
        >
          {cartProducts.map((p, index) => (
            <Box
              key={`${p.id}-${index}`}
              sx={{
                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                p: 2,
                borderRadius: 1,
                mb: 2,
              }}
            >
              <CartItemCard {...p} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 1,
                  gap: 1,
                }}
              >
                <IconButton
                  data-testid={`decrement-button-${p.id}`}
                  size="small"
                  // Jeśli jest null, undefined albo 0, używa 1 jako domyślnej wartości.
                  onClick={() => handleChangeQty(p.id, (p.quantity || 1) - 1)}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  // slotProps.htmlInput = atrybuty przekazywane bezpośrednio do natywnego <input> wewnątrz TextField MUI
                  slotProps={{
                    htmlInput: {
                      'aria-label': `Quantity for product #${p.id}`, // ważne dla testów, pozwala łatwo znaleźć ten input
                      min: 1,
                      style: { textAlign: 'center' },
                    },
                  }}
                  value={p.quantity || 1}
                  onChange={(e) => {
                    // Zamienia wartość inputa na liczbę całkowitą (ale nie zaokrągla) w systemie dziesiętnym (10 = baza dziesiętna).
                    // Jeśli użytkownik wpisze coś niepoprawnego (np. pusty string), wynik będzie NaN → dzięki `|| 1` ustawiamy minimalną domyślną wartość 1.
                    const qty = parseInt(e.target.value, 10) || 1;
                    handleChangeQty(p.id, qty);
                  }}
                  sx={{
                    width: 60,
                    // usuwa strzałki góra/dół w oknie inputa w Chrome/Safari/Edge
                    '& input::-webkit-outer-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '& input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    // usuwa strzałki w Firefox
                    '& input[type=number]': { MozAppearance: 'textfield' },
                  }}
                />
                <IconButton
                  data-testid={`increment-button-${p.id}`}
                  size="small"
                  onClick={() => handleChangeQty(p.id, (p.quantity || 1) + 1)}
                >
                  <AddIcon />
                </IconButton>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => dispatch(removeFromCart(p.id))}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              display: { xs: 'flex', md: 'block' },
              flexDirection: 'column',

              alignItems: 'center',
              p: 2,
              border: { xs: 'none', md: '1px solid #ccc' },
              borderTop: { xs: '1px solid #ccc' },
              borderRadius: { md: 2 },
              position: { xs: 'fixed', md: 'sticky' },
              top: { xs: 'auto', md: '110px' },
              bottom: { xs: 0, md: 'auto' },
              width: { xs: '100%', md: 'auto' },
              minHeight: { xs: '185px', md: 0 },
              left: { xs: 0, md: 'auto' },
              zIndex: 10,
              backgroundColor: 'background.default', // nieprzezroczyste tło
            }}
          >
            <Box>
              <Typography variant="h6" mb={1}>
                Summary
              </Typography>

              {/* Wyświetlenie username jeśli zalogowany */}
              {isAuthenticated && (
                <Typography sx={{ mb: 1, color: 'primary.main' }}>
                  Welcome, {username}
                </Typography>
              )}
              <Typography>Products price: ${totalPrice.toFixed(2)}</Typography>
              {cartProducts.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, alignSelf: 'flex-end' }}
                  onClick={handleCheckout}
                >
                  Delivery and payment
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ScrollToTopButton />
    </Box>
  );
};

export default Cart;
