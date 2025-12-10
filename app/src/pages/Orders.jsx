import { useState, useMemo, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrders, deleteOrder, clearOrders } from '@/store/ordersSlice';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { OrderItem } from '@/components/common/OrderItem';

/**
 * Optymalizacja Orders:
 *
 * 1. OrderItem jest memoizowany (React.memo), aby pojedyncze zamówienia
 *    nie rerenderowały się przy zmianie stanu w Orders (np. otwarcie ConfirmModal).
 *
 * 2. Funkcje callback przekazywane do OrderItem (onDelete) i confirmClearOrders
 *    są stabilne dzięki useCallback, co umożliwia prawidłowe działanie memoizacji.
 *
 * 3. Lista zamówień jest sortowana przy użyciu useMemo, aby sortowanie
 *    nie wykonywało się przy każdym rerenderze komponentu.
 *
 * Dzięki tym zmianom:
 * - rerendery są ograniczone tylko do elementów, które faktycznie się zmieniły,
 * - interakcje (otwieranie modala, kasowanie zamówień) są płynne,
 * - wydajność pozostaje dobra nawet dla długich list zamówień.
 */
const Orders = () => {
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // handleClearOrders inicjuje proces usuwania wszystkich zamówień, ale nie usuwa ich od razu.
  const handleClearOrders = useCallback(() => {
    setOrderToDelete(null); // brak wskazania pojedynczego zamówienia
    setOpenConfirm(true); // otwiera modal/okno potwierdzenia
  }, []);

  // confirmClearOrders wykonuje faktyczne usuwanie zamówień po potwierdzeniu przez użytkownika.
  // Zmienna w if w confirmClearOrders: bierze się bezpośrednio ze stanu komponentu, czyli z hooka useState, nie jest „przekazywana” z zewnątrz, ani jako argument funkcji.
  const confirmClearOrders = useCallback(() => {
    if (orderToDelete) {
      // usuwamy pojedyncze
      dispatch(deleteOrder(orderToDelete));
    } else {
      // usuwamy wszystkie
      dispatch(clearOrders());
    }
    setOpenConfirm(false);
  }, [dispatch, orderToDelete]);

  // Kliknięcie przycisku Delete przy pojedynczym zamówieniu
  const handleDeleteOrder = useCallback((id) => {
    setOrderToDelete(id);
    setOpenConfirm(true);
  }, []);

  /* Sortowanie od najnowszego do najstarszego zamówienia
   * Tutaj || [] jest „na wszelki wypadek”, gdyby orders był undefined lub null. Czyli w sytuacjach, gdy:
    1) Dane jeszcze nie zostały załadowane, to orders może być undefined
    2) Błąd podczas pobierania danych - Jeśli fetch lub query zwróci błąd lub nie zainicjalizuje stanu, orders może być null albo undefined.
    3) Stan początkowy - Jeśli w reducerze Redux albo w hooku useState wartość początkowa nie jest tablicą, tylko np. null lub undefined.
  */
  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => new Date(b.serverDate) - new Date(a.serverDate));
  }, [orders]);

  if (!orders.length) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          You have no orders yet.
        </Typography>
      </Box>
    );
  }

  console.log(sortedOrders);
  console.log(sortedOrders.map((o) => o.products));

  const modalTitle = orderToDelete
    ? 'Delete Order?' // modal wyświetli jeśli jest do usunięcia pojedyncze order
    : 'Clear Order History?'; // modal wyświetli jeśli są do usunięcia wszystkie orders

  const modalDescription = orderToDelete
    ? `Are you sure you want to delete order #${orderToDelete}? This action cannot be undone.`
    : 'This action cannot be undone. Are you sure you want to delete all orders?';

  return (
    <Box sx={{ mt: 0.5, mx: 'auto', maxWidth: 800 }}>
      <Typography variant="h5" mb={2}>
        Orders History
      </Typography>
      <Button
        variant="outlined"
        color="error"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, ml: 'auto' }}
        onClick={handleClearOrders}
      >
        Clear Orders
      </Button>
      <Box>
        {sortedOrders.map((order) => (
          <OrderItem key={order.id} order={order} onDelete={handleDeleteOrder} />
        ))}
      </Box>

      <ConfirmModal
        open={openConfirm}
        title={modalTitle}
        description={modalDescription}
        cancelText="Cancel"
        confirmText="Delete"
        confirmColor="error"
        icon={<WarningAmberIcon color="error" />}
        onCancel={() => setOpenConfirm(false)} // pozwala przekazać referencję do funkcji, która zostanie wywołana dopiero w odpowiednim momencie (kliknięcie przycisku), a nie natychmiast jak to jest w przypadku onCancel={setOpenConfirm(false)}.
        onConfirm={confirmClearOrders}
      />
      <ScrollToTopButton />
    </Box>
  );
};

export default Orders;