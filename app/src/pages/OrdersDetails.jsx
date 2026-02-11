import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectOrders } from '@/store/ordersSlice';
import { Box, Typography } from '@mui/material';
import { DELIVERY_OPTIONS, CAPITALIZE_WORDS } from '@/constants';

const OrdersDetails = () => {
  const { id } = useParams(); // pobranie ID zamówienia z URL
  const orders = useSelector(selectOrders);
  const order = orders.find((o) => o.id.toString() === id);

  const selectedDelivery = DELIVERY_OPTIONS.find(
    (opt) => opt.value === order.deliveryMethod,
  );

  const { name, address, city, postalCode, country } = order.deliveryAddress;

  if (!order) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h6">Order not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h5" mb={2}>
        Order Details - ID: {order.id}
      </Typography>
      <Typography variant="subtitle1">
        Date: {new Date(order.serverDate).toLocaleString()}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', my: 2 }}>
        Products:
      </Typography>
      {order.products.map((p, index) => (
        <Box
          key={`${order.id}-${p.id}-${index}`}
          sx={{ display: 'flex', mb: 1, alignItems: 'center' }}
        >
          <Box
            component="img"
            src={p.image}
            alt={p.title}
            sx={{
              width: { xs: 50, sm: 80, md: 110 },
              height: 'auto', // wysokość dopasowuje się proporcjonalnie
              objectFit: 'contain', // zachowanie proporcji
              flexShrink: 0, // nie kurczy się w flex
              mr: 3,
              mb: 1,
            }}
          />
          <Box>
            <Typography>
              {p.title} x {p.quantity || 1}
            </Typography>
            <Typography>${(p.price * (p.quantity || 1)).toFixed(2)}</Typography>
          </Box>
        </Box>
      ))}
      <Typography sx={{ fontWeight: 'bold', mt: 2 }}>
        Total: ${order.total.toFixed(2)}
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Delivery Address:{' '}
        {`${CAPITALIZE_WORDS(name)}, ${CAPITALIZE_WORDS(address)}, ${CAPITALIZE_WORDS(city)}, ${postalCode}, ${country}`}
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Delivery Method:{' '}
        {selectedDelivery
          ? `${selectedDelivery.label} ($${selectedDelivery.price})`
          : 'Unknown'}
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Payment Method:{' '}
        {order.paymentMethod === 'cash'
          ? 'Cash on Delivery'
          : order.paymentMethod === 'transfer'
            ? 'Bank Transfer'
            : order.paymentMethod === 'Card'
              ? 'Credit/Debit Card'
              : 'Unknown'}
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Transaction ID: {order.transactionId}
      </Typography>
    </Box>
  );
};

export default OrdersDetails;
