import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { memo, useCallback } from 'react';

// React.memo zapobiega rerenderowaniu OrderItem, jeśli propsy (order, onDelete) pozostają niezmienione.
// Dzięki temu pojedyncze zamówienia nie renderują się ponownie przy zmianach stanu rodzica, które nie dotyczą ich propsów, np. otwarcie sidebaru na mobile, zmiana filtra czy motywu.
export const OrderItemComponent = ({ order, onDelete }) => {
  // Stabilna referencja callback do usuwania zamówienia
  const handleDelete = useCallback(
    () => onDelete(order.id),
    [onDelete, order.id],
  );

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="subtitle1">Order ID: {order.id} </Typography>
          <Typography variant="subtitle2">
            Date: {new Date(order.serverDate).toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            component={Link}
            key={order.id}
            to={`/dashboard/orders/${order.id}`}
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Details
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <List dense>
        {order.products.map((p, index) => (
          <ListItem key={`${order.id}-${p.id}-${index}`}>
            <ListItemAvatar>
              <Avatar
                src={p.image}
                alt={p.title}
                variant="square"
                sx={{
                  width: { xs: 50, sm: 60, md: 70 }, // responsywna szerokość
                  height: 'auto', // wysokość dopasowuje się proporcjonalnie
                  objectFit: 'contain', // zachowanie proporcji
                  flexShrink: 0, // nie kurczy się w flex
                  mb: 0.5,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${p.title} x ${p.quantity || 1}`}
              secondary={`$${(p.price * (p.quantity || 1)).toFixed(2)}`}
              sx={{ ml: 1 }} // mały margines między avatar a tekstem
            />
          </ListItem>
        ))}
      </List>
      <Typography sx={{ fontWeight: 'bold' }}>
        Total: ${order.total.toFixed(2)}
      </Typography>
    </Box>
  );
};

// Eksportowany memoizowany komponent z nazwą
// - Dzięki osobnej nazwie komponentu (OrderItemComponent) Fast Refresh nie narzeka na anonimowy komponent.
// - Memoizowany OrderItem działa poprawnie z onDelete przekazywanym z useCallback.
export const OrderItem = memo(OrderItemComponent);
/**
/**
 * Fast Refresh aktualizuje komponenty automatycznie w przeglądarce, gdy zmienisz ich kod w edytorze, bez potrzeby ręcznego odświeżania strony.
 * Fast Refresh to mechanizm w React, który pozwala na natychmiastowe
 * odświeżenie komponentów w trakcie developmentu, zachowując stan komponentów tam, gdzie to możliwe.
 * Dzięki temu nie trzeba ręcznie odświeżać całej strony ani tracić wprowadzonych danych w formularzach
 * czy stanie komponentów.
 *
 * Dodatkowo, nadanie nazw komponentom (zamiast anonimowych funkcji) pomaga Fast Refresh poprawnie
 * rozpoznać i odświeżyć konkretny komponent, unikając ostrzeżeń i utraty stanu.
 */
