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
import { CAPITALIZE_WORDS } from '@/constants';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  /**
   * Destrukturyzacja pierwszego elementu tablicy zwracanej przez useState.
   * lastOrder jest tylko do odczytu w tym komponencie, więc setLastOrder nie jest potrzebne.
   * Dane pobierane są od razu z sessionStorage podczas inicjalizacji, bez użycia useEffect.
   */
  const [lastOrder] = useState(() => {
    const raw = sessionStorage.getItem('lastOrder');
    return raw ? JSON.parse(raw) : null;
  });

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
            <ListItem
              key={item.id}
              disablePadding
              data-testid={`order-item-${item.id}`}
            >
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

        <Box>
          <Typography variant="subtitle1" mt={1}>
            <strong>Total:</strong> ${lastOrder.total.toFixed(2)}
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Delivery Method: </strong>
            {CAPITALIZE_WORDS(lastOrder.deliveryMethod)}
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Payment Method: </strong>
            {CAPITALIZE_WORDS(lastOrder.paymentMethod)}
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Shipping Address:</strong>
          </Typography>
          <Typography variant="body2">
            {lastOrder.deliveryAddress.name}
          </Typography>
          <Typography variant="body2">
            {lastOrder.deliveryAddress.address}
          </Typography>
          <Typography variant="body2">
            {`${lastOrder.deliveryAddress.postalCode} ${lastOrder.deliveryAddress.city}`}
          </Typography>
          <Typography variant="body2">
            {lastOrder.deliveryAddress.country}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => {
            // Funkcja strzałkowa jest po to, żeby akcja nie wykonała się natychmiast po renderze, tylko dopiero po kliknięciu.
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
