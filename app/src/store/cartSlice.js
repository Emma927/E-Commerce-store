import { createSlice, createSelector } from '@reduxjs/toolkit';

// Wczytanie koszyka z localStorage przy starcie
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

const initialState = {
  cartProducts: savedCart,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // W koszyku możesz mieć wiele sztuk tego samego produktu, np. 3 razy ten sam kubek → wtedy liczy się quantity, a nie blokujesz dodawania.
    addToCart: (state, action) => {
      const existingProduct = state.cartProducts.find((p) => p.id === action.payload.id);
      // if (existingProduct) – produkt jest już w koszyku → zwiększamy jego quantity o 1.
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity || 1;
      // else – produkt nie ma w koszyku → tworzymy nowy wpis z quantity = 1 i dodajemy do tablicy.
      } else {
        state.cartProducts.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }

      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    },
    removeFromCart: (state, action) => {
      state.cartProducts = state.cartProducts.filter((p) => p.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    },
    // Szukasz w tablicy cartProducts produktu o tym samym id.0
    // Zmieniasz jego quantity zamiast dodawać nowy obiekt do tablicy.
    // localStorage działa tak, że zapisujesz ciąg znaków (string) jako wartość pod kluczem. Nie ma tam możliwości „podmiany jednego pola w obiekcie w tablicy” w pamięci — musisz zserializować cały obiekt lub tablicę, czyli w Twoim przypadku całą tablicę state.cartProducts.
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload; // dostajesz id i nową ilość
      const product = state.cartProducts.find((p) => p.id === id); // znajdujesz produkt
      if (product) product.quantity = quantity; // aktualizujesz tylko pole quantity
      // Do localStorage trafia cała tablica produktów, wraz z wszystkimi ich właściwościami, w tym zaktualizowanym quantity.
      localStorage.setItem('cart', JSON.stringify(state.cartProducts)); // zapisujesz całą tablicę produktów
    },
    clearCart: (state) => {
      state.cartProducts = [];
      localStorage.removeItem('cart');
    },
  },
});

/**
Memoizowane selektory — dzięki memoizacji (createSelector) nie będą się przeliczać przy każdym renderowaniu, czy każdej nawigacji, tylko tylko wtedy, gdy cartProducts faktycznie się zmieni.
 */
/**
[...state.cart.cartProducts] → tworzy kopię tablicy, żeby nie zmieniać oryginalnego stanu w Reduxie.
.reverse() → odwraca kolejność, więc najnowszy produkt będzie pierwszy w mapowaniu w komponencie.
Dzięki temu wszędzie w aplikacji, gdzie używasz selectCartProducts, produkty będą automatycznie w kolejności “od najnowszego do najstarszego”.
 */
// Selektor jest do odczytu stanu cart w kolejności od najnowszego do najstarszego, z memoizacją dla wydajności.
export const selectCartProducts = createSelector(
  [(state) => state.cart.cartProducts], // ← tablica funkcji wejściowych
  (products) => [...products].reverse() // ← funkcja obliczająca wynik
);

export const selectCartTotalPrice = createSelector([selectCartProducts], // ← tablica funkcji wejściowych
  (products) =>  products.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0) // ← funkcja obliczająca wynik. Jeśli quantity nie istnieje, traktujemy produkt jakby miał 1 sztukę (dla sumowania ilości).
);

export const selectCartTotalItems = createSelector([selectCartProducts], (products) =>
  products.reduce((acc, p) => acc + (p.quantity || 1), 0) // p.quantity || 1 gwarantuje, że nawet jeśli quantity nie istnieje, produkt zostanie policzony jako 1 sztuka.
);

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

/**
 Sytuacja	Co się dzieje bez memoizacji	Co się dzieje z memoizacją
Zmiana innego slice’a (np. favourites)	Cart się nie renderuje	Cart się nie renderuje
Render komponentu Cart (np. wejście na stronę)	reduce się liczy od nowa	reduce może zwrócić wynik z pamięci, jeśli cartProducts nie zmieniło się
Zmiana cartProducts	reduce przeliczany	reduce przeliczany (memoizacja tylko zapobiega powtórnemu liczeniu, jeśli dane się nie zmieniły)
 */