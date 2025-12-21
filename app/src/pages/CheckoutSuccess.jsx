import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import {
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Spinner } from '@/components/common/Spinner';
import { CAPITALIZE_WORDS } from '@/constants';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  // undefined = ładowanie, null = brak orderu, object = OK
  // const [lastOrder, setLastOrder] = useState(undefined); // undefined → Jeszcze nie sprawdzono /jeszcze nie załadowano danych

  /**
Cecha	sessionStorage	localStorage
Czas przechowywania	Tylko w trakcie sesji (zamykanie karty = usunięcie)	Trwałe, zostaje nawet po zamknięciu i ponownym otwarciu przeglądarki
Odświeżenie strony	Dane zostają	Dane zostają
Nawigacja między stronami	Dane zostają	Dane zostają
Usuwanie po kluczu (removeItem)	Tak, tylko ten klucz	Tak, tylko ten klucz */
  //   useEffect(() => {
  //     const order = JSON.parse(sessionStorage.getItem('lastOrder'));
  //
  //     if (order) {
  //       setLastOrder(order);
  //     } else {
  //       setLastOrder(null); // jawny brak
  //     }
  //   }, []);

  // const lastOrder = (() => {
  //   const raw = sessionStorage.getItem('lastOrder');
  //   return raw ? JSON.parse(raw) : null;
  // })();
  // const raw = sessionStorage.getItem('lastOrder');
  // const lastOrder = raw ? JSON.parse(raw) : null;
  const [lastOrder] = useState(() => {
    const raw = sessionStorage.getItem('lastOrder');
    return raw ? JSON.parse(raw) : null;
  });

  // ŁADOWANIE → tylko raz, bez migania
  // if (lastOrder === undefined) {
  //   return <Spinner />;
  // }

  // BRAK ORDERU - Dane sprawdzone → brak wartości
  if (lastOrder === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 6.875rem - 8.125rem)',
          p: 3,
        }}
      >
        <Typography variant="h6" mb={2} align="center">
          No order found.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(user ? '/dashboard/orders' : '/')}
        >
          {user ? 'Go to Orders' : 'Back to Home'}
        </Button>
      </Box>
    );
  }

  // MAMY ORDER → normalny widok
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 6.875rem - 8.125rem)',
        boxSizing: 'border-box',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h4" mb={2} align="center">
          Thank you for your order!
        </Typography>

        <Typography variant="body1" mb={1} align="center">
          Your order has been placed successfully.
        </Typography>

        <Typography variant="body2" mb={2} align="center">
          <strong>Transaction ID:</strong> {lastOrder.transactionId}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" mb={1}>
          Order Summary:
        </Typography>

        <List>
          {lastOrder.products.map((item) => (
            <ListItem key={item.id} disablePadding>
              {item.image && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                      width: { xs: 50, md: 80 },
                      height: { xs: 50, md: 80 },
                      mr: 1,
                      objectFit: 'contain',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  />
                </Box>
              )}
              <ListItemText
                primary={`${item.title} x ${item.quantity || 1}`}
                secondary={`$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle1" mt={2}>
          <strong>Total:</strong> ${lastOrder.total.toFixed(2)}
        </Typography>
        <Typography variant="body2" mt={1}>
          <strong>Delivery Method:</strong>{' '}
          {CAPITALIZE_WORDS(lastOrder.deliveryMethod)}
        </Typography>
        <Typography variant="body2">
          <strong>Payment Method:</strong>{' '}
          {CAPITALIZE_WORDS(lastOrder.paymentMethod)}
        </Typography>
        <Typography variant="body2" mt={1}>
          <strong>Shipping Address:</strong> {lastOrder.deliveryAddress.address}
          , {lastOrder.deliveryAddress.city},{' '}
          {lastOrder.deliveryAddress.postalCode},{' '}
          {lastOrder.deliveryAddress.country}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => {
            sessionStorage.removeItem('lastOrder'); // USUWAMY TUTAJ — dopiero po kliknięciu!
            navigate(user ? '/dashboard/orders' : '/');
          }}
        >
          {user ? 'Go to Orders' : 'Back to Home'}
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutSuccess;
