import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCart,
  selectCartProducts,
  selectCartTotalPrice,
} from '@/store/cartSlice';
import { addOrder } from '@/store/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { TextFieldComponent } from '@/components/common/TextFieldComponent';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DELIVERY_OPTIONS } from '@/constants';
import { Spinner } from '@/components/common/Spinner';
import { CAPITALIZE } from '@/constants';
import { CAPITALIZE_WORDS } from '@/constants';
import { usePostOrder } from '@/hooks/usePostOrder';

/**
 * trim() usuwa spacje na początku i końcu
 * .split(/\s+/) dzieli tekst na wyrazy, traktując dowolną liczbę spacji lub tabulatorów jako jeden separator.
 * .length >= 2 wymaga co najmniej dwóch wyrazów
 * .refine() to metoda, która pozwala dodać dowolną własną walidację, której nie da się łatwo wyrazić w standardowych metodach typu .min(), .max(), .regex() itp.
 */
const checkoutSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: 'Both first and last name is required',
    }),
  address: z.string().min(3, { message: 'Address is required' }),
  city: z.string().min(3, { message: 'City is required' }),
  postalCode: z
    .string()
    .trim() // usuwa spacje na początku i końcu
    .regex(/^\d{2,}-\d{2,}$/, {
      message:
        'Postal code must have at least 2 digits before and after the hyphen',
    }),
  country: z.string().min(3, { message: 'Country is required' }),
  paymentMethod: z.string().nonempty({ message: 'Select a payment method' }),
  deliveryMethod: z.string().nonempty({ message: 'Select a delivery method' }),
});

const defaultCheckoutValues = {
  name: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'United States',
  paymentMethod: 'cash', // domyślnie gotówka
  deliveryMethod: 'standard', // domyślnie standard
};

const Checkout = () => {
  const { data: user, isPending: isPendingUser } = useUser();
  const { mutate, isPending: isPendingOrder, isError, error } = usePostOrder();
  const cartProducts = useSelector(selectCartProducts);
  const productsTotal = useSelector(selectCartTotalPrice); // suma produktów z slice
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // W komponencie:
  const [deliveryPrice, setDeliveryPrice] = useState(10);

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: defaultCheckoutValues,
  });

  const total = productsTotal + deliveryPrice;

  /**
   *useDebounce używa się głównie w wyszukiwarkach lub inputach, gdzie każda zmiana wywołuje kosztowną akcję, np. fetch do API lub filtrowanie dużej listy.
   * W Twoim checkoutie inputy są zwykłymi formularzami, których wartości trafiają dopiero przy onSubmit.
   * Nie wysyłasz API przy każdej literze wpisywanej w TextFieldComponent, więc debounce niczego tu nie przyspiesza ani nie optymalizuje.
   */

  // Prefill dla zalogowanego użytkownika - czyli nadpisanie domyślnych wartości danymi z API
  useEffect(() => {
    if (!isPendingUser && user) {
      methods.reset({
        ...defaultCheckoutValues,
        name: `${CAPITALIZE(user.name.firstname)} ${CAPITALIZE(user.name.lastname)}`,
        address: `${CAPITALIZE_WORDS(user.address.street)} ${user.address.number}`,
        city: CAPITALIZE_WORDS(user.address.city),
        postalCode: user.address.zipcode,
      });
    }
  }, [user, isPendingUser, methods]);

  const onSubmit = (data) => {
    if (!cartProducts.length) return;

    // 1) API wymaga:
    // userId, date, products:[{ productId, quantity }]
    const apiProducts = cartProducts.map((p) => ({
      productId: p.id,
      quantity: p.quantity || 1,
    }));

    // 2) dane dla POST order w API, format danych z repozytorium Fake Store API
    const apiOrder = {
      userId: user?.id || 1, // gość => userId = 1
      date: new Date().toISOString(), // data w apiOrder powinna iść w formacie ISO string. Jest standardowym sposobem serializacji dat w JSON.
      products: apiProducts,
    };

    // 2) pełne order tylko lokalnie (Redux + Session)
    const fullOrder = {
      userId: user?.id || 1, // z API albo gość, czyli u mnie zawsze 1, ponieważ John Doe ma rówznież w API id=1
      products: cartProducts,
      deliveryAddress: data,
      deliveryMethod: data.deliveryMethod,
      paymentMethod: data.paymentMethod,
      total,
    };

    // POST na API przy checkout jest tylko testowy – pozwala sprawdzić, że request działa, ale nie jest źródłem prawdziwych danych.
    //Czyli ilość i identyfikatory produktów są identyczne w obu miejscach, reszta to dane lokalne potrzebne do wyświetlania historii zamówień. ✅
    mutate(apiOrder, {
      onSuccess: (apiResponse) => {
        console.log('DEBUG CHECKOUT: Response from API:', apiResponse); // logowanie API

        const transactionIdFromServer = `TX-${apiResponse.id}-${new Date(apiResponse.date).getTime()}`;
        const fullOrderWithId = {
          ...fullOrder,
          id: `${apiResponse.id}-${new Date(apiResponse.date).getTime()}`,
          serverDate: apiResponse.date,
          apiId: apiResponse.id, // ID z API
          transactionId: transactionIdFromServer,
        };
        dispatch(addOrder(fullOrderWithId));
        dispatch(clearCart());
        sessionStorage.setItem('lastOrder', JSON.stringify(fullOrderWithId));
        navigate('/checkout/success');
      },
      onError: (err) => {
        console.error('Checkout failed:', err); // err z useOrders fetch POST
      },
    });

    // --- LOGI TUTAJ ---
    console.log('DEBUG CHECKOUT: Saving order to sessionStorage:', fullOrder);
    // sessionStorage.setItem('lastOrder', JSON.stringify(order)); // dla CheckoutSuccess
    console.log(
      'DEBUG CHECKOUT: Checking sessionStorage right after save:',
      sessionStorage.getItem('lastOrder'),
    );
    // ----------------------------
  };

  console.log('User:', user);
  console.log('isPending:', isPendingUser);

  if (isPendingUser) return <Spinner />;

  // true, jeśli brak usera i fetch użytkownika nie trwa (użytkownik jest gościem)
  const isGuest = !user && !isPendingUser;

  return (
    <FormProvider {...methods}>
      <Typography variant="h5" mb={2}>
        Checkout
      </Typography>

      {user && (
        <Typography sx={{ mb: 1, color: 'primary.main' }}>
          Welcome, {CAPITALIZE_WORDS(user.name.firstname)}
          {CAPITALIZE_WORDS(user.name.lastname)}
        </Typography>
      )}

      {isGuest && (
        <Typography sx={{ mb: 1, color: 'secondary.main' }}>
          Ordering as a guest
        </Typography>
      )}

      {isPendingOrder && (
        <Box sx={{ mt: 2 }}>
          <Spinner />
          <Typography>Placing your order...</Typography>
        </Box>
      )}

      {isError && (
        <Typography sx={{ color: 'error.main', mt: 2 }}>
          Failed to place order: {error?.message || 'Unknown error'}
        </Typography>
      )}

      <Grid container spacing={4}>
        {/* Left column: form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <TextFieldComponent name="name" label="Full Name" />
            <TextFieldComponent name="address" label="Address" />
            <TextFieldComponent name="city" label="City" />
            <TextFieldComponent name="postalCode" label="Postal Code" />
            <TextFieldComponent name="country" label="Country" />

            {/* Metoda płatności */}
            <Box display="flex">
              <FormControl component="fieldset" sx={{ mt: 2, width: '50%' }}>
                <FormLabel component="legend">Payment Method</FormLabel>
                <Controller
                  name="paymentMethod"
                  control={methods.control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <FormControlLabel
                        value="cash"
                        control={<Radio />}
                        label="Cash on Delivery"
                      />
                      <FormControlLabel
                        value="transfer"
                        control={<Radio />}
                        label="Bank Transfer"
                      />
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label="Credit/Debit Card"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              <FormControl component="fieldset" sx={{ mt: 2, width: '50%' }}>
                <FormLabel component="legend">Delivery Method</FormLabel>
                <Controller
                  name="deliveryMethod"
                  control={methods.control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // aktualizuje RHF
                        // Nadpisanie domyślnie wybranej opcji dostawy i ceny dostawy
                        const selected = DELIVERY_OPTIONS.find(
                          (opt) => opt.value === e.target.value,
                        );
                        setDeliveryPrice(selected?.price || 0);
                      }}
                    >
                      {DELIVERY_OPTIONS.map((opt) => (
                        <FormControlLabel
                          key={opt.value}
                          value={opt.value}
                          control={<Radio />}
                          label={`${opt.label} ($${opt.price})`}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Box>
          </form>
        </Grid>

        {/* Right column: summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 3 }}>
            <Typography variant="h6" mb={2}>
              Order Summary
            </Typography>
            {cartProducts.map((p) => (
              <Box
                key={p.id}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
              >
                {/* Miniaturka produktu */}
                <Box>
                  <Box
                    component="img"
                    src={p.image}
                    alt={p.title}
                    sx={{
                      width: { xs: 70, md: 80 },
                      height: { xs: 70, md: 80 },
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                <Typography key={p.id}>
                  {p.title} x {p.quantity || 1}: $
                  {/* Jeśli z jakiegoś powodu p.price jest undefined lub null, wtedy p.price || 0 daje 0, żeby uniknąć błędu mnożenia. */}
                  {((p.price || 0) * (p.quantity || 1)).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography>Products total: ${productsTotal.toFixed(2)}</Typography>
            <Typography>Delivery: ${deliveryPrice.toFixed(2)}</Typography>
            <Typography variant="h6" mt={1}>
              Total: ${total.toFixed(2)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={methods.handleSubmit(onSubmit)}
              disabled={!cartProducts.length} // blokada, żeby przycisk był nieklikalny, przy pustym koszyku
            >
              Place Order
            </Button>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default Checkout;
